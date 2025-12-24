import logging
from typing import Optional

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from src.config import settings
from src.services import AuthService, UserService, EventService
from src.bot import messages
from src.utils import to_e164

logger = logging.getLogger(__name__)


class TelegramBot:
    def __init__(self):
        self.auth_service = AuthService()
        self.user_service = UserService()
        self.event_service = EventService()
        self.application: Optional[Application] = None

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        user = update.effective_user
        if not user:
            return

        logger.info(f"User {user.id} started the bot")

        existing_user = self.user_service.get_user_by_telegram_id(user.id)
        pending_session = self.auth_service.get_pending_session_by_telegram(user.id)

        # Пользователь зарегистрирован
        if existing_user:
            if pending_session:
                await self.event_service.send_bot_started_event(pending_session.id, user.id)
                await self._show_auth_approval(update, pending_session.id)
            else:
                await update.message.reply_text(messages.MSG_WELCOME_EXISTING_USER)
        #  Новый пользователь
        else:
            keyboard = [[KeyboardButton(messages.BUTTON_SHARE_PHONE, request_contact=True)]]
            reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)

            await update.message.reply_text(
                messages.MSG_WELCOME_NEW_USER,
                reply_markup=reply_markup
            )

            #  По юзеру есть запрос на авторизацию -> отправляем event на запрос телефона
            if pending_session:
                await self.event_service.send_bot_phone_requested_event(pending_session.id, user.id)

    async def handle_contact(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        user = update.effective_user
        contact = update.message.contact

        if not user or not contact:
            return

        if contact.user_id != user.id:
            await update.message.reply_text(
                messages.MSG_WRONG_CONTACT,
                reply_markup=ReplyKeyboardRemove()
            )
            return

        phone_number = to_e164(contact.phone_number)
        logger.info(f"User {user.id} shared phone number: {phone_number}")

        pending_session = self.auth_service.get_pending_session_by_phone(phone_number)

        if pending_session:
            self.user_service.update_user_telegram_info(
                phone_number=phone_number,
                telegram_id=user.id,
                telegram_username=user.username,
            )

            await self.event_service.send_phone_shared_event(pending_session.id, phone_number)

            await update.message.reply_text(
                messages.MSG_PHONE_RECEIVED_WITH_SESSION,
                reply_markup=ReplyKeyboardRemove()
            )

            await self._show_auth_approval(update, pending_session.id)
        else:
            self.user_service.get_or_create_user(phone_number)
            self.user_service.update_user_telegram_info(
                phone_number=phone_number,
                telegram_id=user.id,
                telegram_username=user.username,
            )

            await update.message.reply_text(
                messages.MSG_PHONE_RECEIVED_NO_SESSION,
                reply_markup=ReplyKeyboardRemove()
            )

    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        query = update.callback_query
        if not query or not query.data:
            return

        await query.answer()

        user = update.effective_user
        if not user:
            return

        data_parts = query.data.split(":")
        action = data_parts[0]

        if action == "approve" and len(data_parts) == 2:
            session_id = data_parts[1]
            await self._approve_auth(query, user, session_id)

        elif action == "reject" and len(data_parts) == 2:
            session_id = data_parts[1]
            await self._reject_auth(query, session_id)

    async def _show_auth_approval(self, update: Update, session_id: str) -> None:
        keyboard = [
            [
                InlineKeyboardButton(messages.BUTTON_APPROVE, callback_data=f"approve:{session_id}"),
                InlineKeyboardButton(messages.BUTTON_REJECT, callback_data=f"reject:{session_id}"),
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            messages.MSG_AUTH_REQUEST,
            reply_markup=reply_markup,
        )

    async def _approve_auth(self, query, user, session_id: str) -> None:
        session = await self.auth_service.approve_session(
            session_id=session_id,
            telegram_id=user.id,
            telegram_username=user.username,
        )

        if session:
            await query.edit_message_text(messages.MSG_AUTH_APPROVED)
            logger.info(f"Session {session_id} approved by user {user.id}")
        else:
            await query.edit_message_text(messages.MSG_AUTH_APPROVE_FAILED)
            logger.warning(f"Failed to approve session {session_id} for user {user.id}")

    async def _reject_auth(self, query, session_id: str) -> None:
        session = await self.auth_service.reject_session(session_id)

        if session:
            await query.edit_message_text(messages.MSG_AUTH_REJECTED)
            logger.info(f"Session {session_id} rejected")
        else:
            await query.edit_message_text(messages.MSG_AUTH_REJECT_NOT_FOUND)

    async def notify_new_auth_request(self, telegram_id: int, session_id: str) -> bool:
        if not self.application:
            logger.error("Bot application not initialized")
            return False

        try:
            keyboard = [
                [
                    InlineKeyboardButton(messages.BUTTON_APPROVE, callback_data=f"approve:{session_id}"),
                    InlineKeyboardButton(messages.BUTTON_REJECT, callback_data=f"reject:{session_id}"),
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)

            await self.application.bot.send_message(
                chat_id=telegram_id,
                text=messages.MSG_AUTH_REQUEST,
                reply_markup=reply_markup,
            )
            logger.info(f"Auth notification sent to user {telegram_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to send auth notification to {telegram_id}: {e}")
            return False

    def setup_handlers(self) -> None:
        if not self.application:
            return

        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(MessageHandler(filters.CONTACT, self.handle_contact))
        self.application.add_handler(CallbackQueryHandler(self.handle_callback))

        logger.info("Bot handlers configured")

    async def initialize(self) -> None:
        self.application = (
            Application.builder()
            .token(settings.telegram_bot_token)
            .build()
        )

        self.setup_handlers()

        await self.application.initialize()
        await self.application.start()
        await self.application.updater.start_polling()

        logger.info("Telegram bot initialized and started")

    async def shutdown(self) -> None:
        if self.application:
            await self.application.updater.stop()
            await self.application.stop()
            await self.application.shutdown()

            logger.info("Telegram bot shut down")


bot_instance: Optional[TelegramBot] = None


def get_bot() -> TelegramBot:
    global bot_instance
    if bot_instance is None:
        bot_instance = TelegramBot()
    return bot_instance
