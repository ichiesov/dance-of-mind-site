# Auth Events - Supabase Realtime Broadcast

## Обзор изменений

Логика авторизации переписана с polling на event-based архитектуру через Supabase Realtime Broadcast.

## Новая логика авторизации

1. **POST /api/auth/init** - Инициализация авторизации
2. Пользователь переходит в Telegram бота
3. Бот запрашивает номер телефона (если пользователь новый)
4. Пользователь делится номером → отправляется event `phone_shared`
5. Бот показывает кнопки подтверждения
6. При подтверждении → отправляется event `auth_approved`
7. Фронт ловит event и делает **GET /api/auth/tokens/{session_id}**
8. Бэк возвращает JWT токены (Access + Refresh)

## События (Events)

События отправляются через Supabase Realtime Broadcast и **не хранятся в БД**. Фронт подписывается на канал `auth:{session_id}` для получения событий в реальном времени.

### Типы событий:

1. **bot_started** - пользователь запустил бота командой /start (при наличии активной сессии)
   ```json
   {
     "session_id": "uuid",
     "event_type": "bot_started",
     "data": {
       "telegram_id": 123456789
     }
   }
   ```

2. **phone_shared** - пользователь поделился номером телефона
   ```json
   {
     "session_id": "uuid",
     "event_type": "phone_shared",
     "data": {
       "phone_number": "+1234567890"
     }
   }
   ```

3. **auth_approved** - пользователь подтвердил авторизацию
   ```json
   {
     "session_id": "uuid",
     "event_type": "auth_approved",
     "data": {}
   }
   ```

4. **auth_rejected** - пользователь отклонил авторизацию
   ```json
   {
     "session_id": "uuid",
     "event_type": "auth_rejected",
     "data": {}
   }
   ```

## Изменения в API

### Удалено:
- **GET /api/auth/status/{session_id}** - больше не нужен polling

### Добавлено:
- **GET /api/auth/tokens/{session_id}** - получение JWT токенов после подтверждения

## Настройка Supabase

Никаких дополнительных настроек не требуется. Supabase Realtime Broadcast работает "из коробки" без создания таблиц.

## Пример использования на фронте

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const sessionId = '...' // получен из POST /api/auth/init

const channel = supabase
  .channel(`auth:${sessionId}`)
  .on('broadcast', { event: 'bot_started' }, (payload) => {
    console.log('Пользователь открыл бота', payload)
  })
  .on('broadcast', { event: 'phone_shared' }, (payload) => {
    console.log('Пользователь поделился номером', payload)
  })
  .on('broadcast', { event: 'auth_approved' }, async (payload) => {
    const response = await fetch(`/api/auth/tokens/${sessionId}`)
    const tokens = await response.json()
    console.log('Токены получены:', tokens)
  })
  .on('broadcast', { event: 'auth_rejected' }, (payload) => {
    console.log('Авторизация отклонена')
  })
  .subscribe()

// Не забудьте отписаться при размонтировании компонента
// channel.unsubscribe()
```

## Преимущества новой архитектуры

1. **Нет polling** - меньше нагрузка на сервер
2. **Realtime updates** - мгновенная реакция на действия пользователя
3. **Масштабируемость** - Supabase Realtime работает через WebSocket
4. **Отслеживание прогресса** - фронт видит все этапы авторизации
5. **Нет БД** - события не хранятся, экономия места и быстродействие

## Структура файлов

- `src/services/event_service.py` - сервис для отправки broadcast событий через Supabase Realtime API
- `src/services/auth_service.py` - обновлен для отправки событий (async методы)
- `src/bot/telegram_bot.py` - обновлен для запроса телефона и отправки событий
- `src/api/auth.py` - новый endpoint GET /tokens/{session_id}

## Технические детали

### EventService

Использует Supabase Realtime API для отправки broadcast сообщений:
- Endpoint: `{supabase_url}/realtime/v1/api/broadcast`
- Channel: `auth:{session_id}`
- Авторизация через service key
- Не требует создания таблиц в БД

### Формат broadcast сообщения

```json
{
  "channel": "auth:uuid-session-id",
  "payload": {
    "type": "broadcast",
    "event": "auth_approved",
    "payload": {}
  }
}
```
