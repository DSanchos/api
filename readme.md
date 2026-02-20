# api

A lightweight TypeScript fetch wrapper with caching, polling, interceptors, and logging.

Лёгкая TypeScript обёртка над fetch с кэшированием, поллингом, интерсепторами и логированием.

---

## Installation / Установка

```bash
npm i @dsanchos/api
```

---

## Quick Start / Быстрый старт

```typescript
import { ApiCore, defineApi } from "./core.js";
import { api } from "./api.js";

// Configure once / Настройте один раз
ApiCore({
  baseUrl: "https://jsonplaceholder.typicode.com",
  baseKeepUnusedDataFor: 60,
  baseHeader: { "Content-Type": "application/json" },
});

// Make a request / Сделайте запрос
const { data, isLoading, isError, error } = await api({
  method: "GET",
  url: "/posts",
});
```

---

## ApiCore

Global configuration for all requests.

Глобальная конфигурация для всех запросов.

```typescript
ApiCore({
  baseUrl: "https://api.example.com", // Base URL for all requests
  baseKeepUnusedDataFor: 60, // Cache TTL in seconds (default: 60)
  baseHeader: {
    // Default headers for all requests
    "Content-Type": "application/json",
  },
  logging: true, // Enable request logging
  interceptors: {
    request: (props) => ({
      // Modify request before sending
      ...props,
      headers: { Authorization: `Bearer ${getToken()}` },
    }),
  },
});
```

---

## api()

```typescript
const { data, isLoading, isFetching, isError, error } = await api({
  method: "GET", // GET | POST | PUT | PATCH | DELETE
  url: "/posts", // Path (baseUrl is prepended automatically)
  headers: {}, // Override default headers
  body: {}, // Request body (auto JSON.stringify)

  // Cache
  provideCache: "posts", // Save response under this key
  keepUnusedDataFor: 30, // Override TTL for this request (seconds)
  invalidateCache: "posts", // Delete this cache key after request
});
```

### Response / Ответ

| Field        | Type             | Description            |
| ------------ | ---------------- | ---------------------- |
| `data`       | `any`            | Response data          |
| `isLoading`  | `boolean`        | True on first load     |
| `isFetching` | `boolean`        | True on any request    |
| `isError`    | `boolean`        | True if request failed |
| `error`      | `string \| null` | Error message          |

---

## Caching / Кэширование

```typescript
// Save to cache / Сохранить в кэш
await api({
  method: "GET",
  url: "/posts",
  provideCache: "posts", // Cache key
  keepUnusedDataFor: 120, // 2 minutes
});

// Invalidate cache after mutation / Инвалидировать после мутации
await api({
  method: "POST",
  url: "/posts",
  body: { title: "New post" },
  invalidateCache: "posts", // Delete "posts" cache
});
```

---

## Polling

```typescript
import { polling } from "./polling.js";

const stop = polling(
  {
    method: "GET",
    url: "/notifications",
    pollingInterval: 3000, // Every 3 seconds / Каждые 3 секунды
    stopAfter: 30000, // Stop after 30 seconds / Остановить через 30 секунд
  },
  (res, stop) => {
    console.log(res.data);
    if (res.isError) stop(); // Stop on error / Остановить при ошибке
  },
);

// Stop manually / Остановить вручную
stop();
```

---

## defineApi

Group related endpoints without writing types manually.

Группируйте связанные запросы без ручного написания типов.

```typescript
const usersApi = defineApi({
  getUsers: { method: "GET", url: "/users" },
  createUser: { method: "POST", url: "/users" },
  updateUser: { method: "PUT", url: "/users/1" },
  deleteUser: { method: "DELETE", url: "/users/1" },
});

const { data } = await api(usersApi.getUsers);
```

---

## Logging / Логирование

When `logging: true` is set in `ApiCore`, every request is logged:

При `logging: true` в `ApiCore` каждый запрос логируется:

```
✅ [GET]    /posts    → 200 (123ms)
✅ [POST]   /posts    → 201 (89ms)
❌ [GET]    /posts/99 → 404 (45ms)
```

---

## Interceptors

Modify every request automatically (e.g. add auth token).

Изменяйте каждый запрос автоматически (например, добавить токен).

```typescript
ApiCore({
  baseUrl: "https://api.example.com",
  interceptors: {
    request: (props) => ({
      ...props,
      headers: {
        ...props.headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  },
});
```

---

## Project Structure / Структура проекта

```
source/
├── api.ts          # Main fetch wrapper
├── core.ts         # ApiCore config + defineApi
├── polling.ts      # Polling utility
├── logger.ts       # Request logger
└── api.types.ts    # TypeScript types
```

---

## License / Лицензия

MIT
