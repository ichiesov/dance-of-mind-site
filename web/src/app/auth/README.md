# Auth Page

Страница авторизации через Telegram с использованием Supabase Realtime.

## Архитектура

### Компоненты

- **page.tsx** - Главная страница авторизации
- **components/auth-form.tsx** - Форма ввода номера телефона
- **components/auth-status.tsx** - Отображение статуса авторизации
- **store/auth.store.tsx** - MobX store для управления состоянием

### Библиотеки

- **@supabase/supabase-js** - Клиент Supabase для Realtime событий
- **mobx** & **mobx-react-lite** - Управление состоянием
- **Tailwind CSS** - Стилизация

## Процесс авторизации

1. Пользователь вводит номер телефона
2. Отправляется запрос на `POST /api/auth/init`
3. Получаем `session_id` и подписываемся на канал `auth:{session_id}`
4. Показываем кнопку "Открыть бота"
5. Слушаем события от Supabase Realtime:
   - `bot_started` - пользователь запустил бота
   - `phone_shared` - пользователь поделился номером
   - `auth_approved` - авторизация одобрена
   - `auth_rejected` - авторизация отклонена
6. При `auth_approved` запрашиваем токены через `GET /api/auth/tokens/{session_id}`
7. Сохраняем токены в localStorage

## События Supabase Realtime

### bot_started
```typescript
{
  event: 'bot_started',
  payload: {
    telegram_id: number,
    session_id: string
  }
}
```

### phone_shared
```typescript
{
  event: 'phone_shared',
  payload: {
    phone_number: string,
    session_id: string
  }
}
```

### auth_approved
```typescript
{
  event: 'auth_approved',
  payload: {
    session_id: string
  }
}
```

### auth_rejected
```typescript
{
  event: 'auth_rejected',
  payload: {
    session_id: string
  }
}
```

## Переменные окружения

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Использование

```typescript
import { useAuthStore } from '@auth/store';

const AuthPage = observer(() => {
  const store = useAuthStore();

  const handleSubmit = async (phoneNumber: string) => {
    store.setPhoneNumber(phoneNumber);
    await store.initAuth();
  };

  return <AuthForm onSubmit={handleSubmit} />;
});
```

## API Endpoints

### POST /api/auth/init
Инициализация сессии авторизации

Request:
```json
{
  "phone_number": "+79991234567"
}
```

Response:
```json
{
  "session_id": "uuid",
  "expires_in": 300
}
```

### GET /api/auth/tokens/{session_id}
Получение токенов после одобрения

Response:
```json
{
  "access_token": "jwt-token",
  "refresh_token": "jwt-token",
  "expires_in": 3600
}
```
