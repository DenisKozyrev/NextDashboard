# PROJECT_CONTEXT — nextjs-dashboard

> Этот файл нужен для быстрого погружения в проект в новом контексте/чате.
> Проект используется как база для подготовки к senior fullstack собеседованию.

---

## Контекст подготовки — читай это первым

### Кандидат

**Денис Козырев** — Senior Fullstack Developer (JavaScript).

**Опыт:**
- Последние 1.5–2 года: fullstack с уклоном в backend
- Крайний проект: 2.5 года в домене рекламы/advertisment (американская компания — радиостанции, билборды, концерты)
  - Стек: **MongoDB + Node.js + Express**, немного Postgres (схему PostgreSQL вёл менеджер)
  - React + Redux + React Hook Form на фронте (~10% времени)
  - Строили проект с нуля: схема MongoDB, бизнес-логика, вывели в production, поддержка
  - Валидация: **Joi** (схема на бэке → дублировали на фронте)
  - Основные проблемы: несоответствие валидации фронт/бэк, потеря данных при сохранении

**Слабые места (выявлены в мок-собесе):**
- SQL / реляционные БД — мало опыта, нет глубины
- Outbox Pattern — слышал, но не мог объяснить
- MongoDB атомарные операции — концепцию понимает, реализацию подзабыл
- Архитектура распределённых систем — нужно прокачать
- Next.js Server/Client граница — были ошибки в задачах

**Сильные стороны:**
- Продуктовое мышление, умеет задавать уточняющие вопросы
- Практический опыт MongoDB (схема с нуля, агрегации, связи по ID)
- Express API, Joi-валидация, работа с заказчиком
- Понимает race condition и concurrency на концептуальном уровне

---

### Формат предстоящего собеседования

- **Интервьюер:** CEO компании (технически глубокий)
- **Длительность:** ~60 минут
- **Язык:** Русский
- **Рынок:** Беларусь/РФ
- **Структура:**
  1. Знакомство и опыт (~10 мин)
  2. Технические вопросы по стеку (~20 мин)
  3. Архитектурная задача / system design (~15 мин)
  4. Live coding (~15 мин)
- **Без:** вопросов про AI/LLM

---

### Что уже проработано

- Проведён полный мок-собес 60 мин (разбор рекламной платформы, архитектура медиаплана)
- Разобрана архитектура фичи **медиаплан** (MongoDB + Postgres, слоты, резервирование, оплата, гонка условий)
- Изучены паттерны: Retry, Idempotency Key, Idempotent API, Outbox, Atomic, Timeout, Batch, N+1
- Next.js cheatsheet актуализирован под версию 15–16 (breaking changes: async params/searchParams/cookies)
- Написаны и разобраны React задачи: BookingForm + UsersTable с custom hooks
- Написаны backend задачи: holdSlot (атомарный), releaseExpiredSlots, POST /media-plans

---

## Что за проект

**Next.js Dashboard** — финансовый дашборд компании Acme. Учебный проект из официального Next.js Learn курса, адаптированный с реальным production-стеком. Используется для демонстрации навыков на собеседовании.

**Путь:** `/Users/dzianis/Dev/My Projects/nextjs-dashboard`  
**Подготовка к собеседованию:** `/Users/dzianis/Dev/My Projects/interview-prep/`

---

## Стек

| Слой | Технология |
|------|-----------|
| Framework | Next.js 16.x (latest), App Router |
| Language | TypeScript 5.7 |
| Auth | next-auth v5 (beta) |
| ORM | Prisma 7.x + @prisma/adapter-pg |
| DB | PostgreSQL |
| Validation | Zod |
| Styling | Tailwind CSS 3.4 + @tailwindcss/forms |
| Icons | @heroicons/react |
| Package Manager | pnpm |

---

## Структура проекта

```
nextjs-dashboard/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page (/)
│   ├── lib/
│   │   ├── actions.ts          # Server Actions (createInvoice, editInvoice, deleteInvoice)
│   │   ├── data.ts             # Data fetching functions (Prisma queries)
│   │   ├── definitions.ts      # TypeScript типы
│   │   ├── utils.ts            # Утилиты (formatCurrency, generatePagination)
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── placeholder-data.ts # Seed данные
│   ├── ui/
│   │   ├── fonts.ts            # next/font (Inter, Lusitana)
│   │   ├── global.css          # Глобальные стили
│   │   ├── skeletons.tsx       # Loading скелетоны
│   │   ├── search.tsx          # Поиск (Client Component, useSearchParams)
│   │   ├── login-form.tsx      # Форма логина
│   │   ├── button.tsx          # Кнопки
│   │   ├── acme-logo.tsx       # Лого
│   │   ├── dashboard/          # Компоненты дашборда (cards, charts, latest-invoices)
│   │   ├── invoices/           # Компоненты инвойсов (table, form, breadcrumbs, status, pagination)
│   │   └── customers/          # Компоненты клиентов
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout (SideNav)
│   │   ├── (overview)/
│   │   │   ├── page.tsx        # /dashboard — обзор с картами и графиком
│   │   │   └── loading.tsx     # Streaming skeleton для overview
│   │   ├── invoices/
│   │   │   ├── page.tsx        # /dashboard/invoices — список с поиском и пагинацией
│   │   │   ├── error.tsx       # Error boundary для инвойсов
│   │   │   ├── create/page.tsx # Создание инвойса
│   │   │   └── [id]/edit/page.tsx # Редактирование инвойса
│   │   └── customers/
│   │       └── page.tsx        # /dashboard/customers
│   └── query/                  # Дополнительные query компоненты
├── prisma/
│   ├── schema.prisma           # Схема БД
│   ├── seed.ts                 # Сидирование
│   └── migrations/             # Миграции
└── generated/
    └── client/                 # Сгенерированный Prisma client
```

---

## База данных — Prisma Schema

```prisma
model User {
  id       String @id @default(uuid())
  name     String
  email    String @unique
  password String  // bcrypt hash
}

model Customer {
  id        String    @id @default(uuid())
  name      String
  email     String
  image_url String
  invoices  Invoice[]
}

model Invoice {
  id          String   @id @default(uuid())
  customer_id String
  amount      Int      // в центах (умножать/делить на 100)
  status      String   // 'pending' | 'paid'
  date        DateTime @db.Date
  customer    Customer @relation(fields: [customer_id], references: [id])
}

model Revenue {
  month   String @id  // 'Jan', 'Feb', ...
  revenue Int
}
```

**Важно:** `amount` хранится в центах → при чтении делим на 100, при записи умножаем на 100.

---

## Ключевые файлы — что делают

### `app/lib/data.ts` — Data Fetching (Server-only)

Все функции — async, вызываются в Server Components напрямую (не через API).

| Функция | Что делает |
|---------|-----------|
| `fetchRevenue()` | Все записи Revenue. Искусственная задержка 3 сек (для демонстрации Streaming) |
| `fetchLatestInvoices()` | Последние 5 инвойсов с данными клиента |
| `fetchCardData()` | Статистика: кол-во инвойсов, клиентов, суммы. Использует `Promise.all` |
| `fetchFilteredInvoices(query, page)` | Инвойсы с поиском + пагинация (6 на страницу) |
| `fetchInvoicesPages(query)` | Кол-во страниц для пагинации |
| `fetchInvoiceById(id)` | Один инвойс по ID (для формы редактирования) |
| `fetchCustomers()` | Все клиенты (для select в форме) |
| `fetchFilteredCustomers(query)` | Клиенты с поиском + агрегированные данные |

### `app/lib/actions.ts` — Server Actions

`'use server'` — мутации данных через Server Actions.

| Функция | Что делает |
|---------|-----------|
| `createInvoice(prevState, formData)` | Создаёт инвойс. Zod валидация → Prisma → revalidatePath → redirect |
| `editInvoice(prevState, id, formData)` | Обновляет инвойс. Та же схема |
| `deleteInvoice(id)` | Удаляет инвойс. Вызывается через bind в Client Component |

**Паттерн валидации с Zod:**
```ts
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const validatedFields = CreateInvoice.safeParse({ ... });
if (!validatedFields.success) {
  return { errors: validatedFields.error.flatten().fieldErrors };
}
```

**redirect() вне try/catch** — намеренно: redirect() бросает исключение внутри, если в try/catch — будет поймано.

### `app/ui/search.tsx` — Client Component

Единственный Client Component который работает с URL:
```tsx
'use client';
// useSearchParams() — читает ?query=
// usePathname() — текущий путь
// useRouter() — для router.replace()
// Debounce через use-debounce
```

---

## Как работает аутентификация

next-auth v5 (beta), сессионная аутентификация:
- Credentials provider (email + password)
- bcrypt для проверки пароля
- Middleware защищает `/dashboard/*` маршруты

---

## Ключевые Next.js паттерны в проекте

### 1. Streaming с Suspense
```tsx
// dashboard/(overview)/page.tsx
// fetchRevenue() намеренно медленный (3 сек)
// RevenueChart вынесен в Suspense → страница не блокируется
<Suspense fallback={<RevenueChartSkeleton />}>
  <RevenueChart />
</Suspense>
```

### 2. Server Actions + useActionState
```tsx
// Форма использует useActionState для обработки ошибок валидации
const [state, formAction] = useActionState(createInvoice, initialState);
<form action={formAction}>
```

### 3. searchParams для серверной фильтрации
```tsx
// invoices/page.tsx — Server Component
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query = '', page = '1' } = await searchParams;
  const invoices = await fetchFilteredInvoices(query, Number(page));
}
```

### 4. Параллельный fetch с Promise.all
```tsx
// fetchCardData() в data.ts
const [count1, count2, status] = await Promise.all([
  prisma.invoice.count(),
  prisma.customer.count(),
  prisma.invoice.groupBy({ ... }),
]);
```

### 5. Error Boundary
```tsx
// invoices/error.tsx — Client Component
'use client';
export default function Error({ error, reset }) {
  return <button onClick={reset}>Попробовать снова</button>;
}
```

### 6. generateMetadata
```tsx
export const metadata: Metadata = {
  title: { template: '%s | Acme Dashboard', default: 'Acme Dashboard' },
};
```

---

## Скрипты

```bash
pnpm dev          # запуск dev сервера (turbopack)
pnpm build        # production build
pnpm db:seed      # сидирование БД
```

---

## Файлы подготовки к собеседованию

Все материалы в `/Users/dzianis/Dev/My Projects/interview-prep/`:

| Файл | Содержание |
|------|-----------|
| `ceo-interview-research.md` | Плейбук CEO-собеседования, структура 60 мин |
| `post-interview-hints.md` | Разборы вопросов после моков |
| `weak-zones.md` | Пробелы: Outbox, атомарность MongoDB, SQL, Next.js границы, backend depth |
| `backend-patterns.md` | Retry, Idempotency, Outbox, Atomic, Timeout, Batch, N+1 |
| `nextjs-cheatsheet.md` | Next.js 15-16 шпаргалка (актуализирована по docs) |
| `nextjs-live-coding-tasks.md` | 10 задач для live coding по Next.js |
| `coding-tasks.md` | Backend задачи: holdSlot, releaseExpired, POST /media-plans |
| `coding-tasks-react.md` | React задачи: BookingForm, UsersTable |
| `coding-tasks-react-solutions.md` | Эталонные решения React задач |

---

## Вопросы по проекту для собеседования

### «Расскажите про последний проект» — заготовка ответа

**Основной проект (рекламная платформа):**

> «Последние 2.5 года работал в домене рекламы — американская компания с радиостанциями, билбордами, концертами. Строили платформу с нуля: выбрали MongoDB как основную БД (структура данных была неизвестна заранее, поля менялись), Node.js + Express на бэке, React на фронте. Я отвечал за схему MongoDB, бизнес-логику API, интеграцию с платёжной системой через Postgres. Валидировали через Joi — схему держали синхронно на фронте и бэке. Вышли в production, поддерживали. Основная боль — несоответствие валидации между слоями и data consistency при конкурентных запросах.»

**nextjs-dashboard (этот проект):**

> «Параллельно строил dashboard проект на Next.js 16 с App Router — изучаю современный стек: Server Components, Server Actions вместо REST API, streaming с Suspense, Prisma ORM поверх PostgreSQL. Это даёт понимание как Next.js меняет подход к fullstack разработке.»

---

### Архитектурный вопрос — медиаплан (разобрали в мок-собесе)

**Задача:** Клиент выбирает слоты (billboard/radio/concert), оформляет одним заказом. Биллинг в Postgres, данные в Mongo. ~5000 клиентов.

**Ключевые решения которые надо назвать:**
1. **Hold + TTL** — при переходе к оплате ставим `hold: true, holdExpires: Date` атомарно через `findOneAndUpdate` с условием `hold: false`. Если кто-то успел первым — возвращаем 409.
2. **Outbox Pattern** — вместо прямого вызова email-сервиса пишем событие в коллекцию `outbox` в той же MongoDB-транзакции что и обновление слотов. Отдельный worker читает outbox и отправляет. Идемпотентный ключ защищает от двойной отправки.
3. **Postgres для биллинга** — транзакция в Postgres для создания payment record. После успеха → обновить флаг `paid: true` в Mongo.
4. **releaseExpiredSlots** — cron-задача или отложенный вызов (bull/agenda) для снятия hold по истечению таймера.

---

### Этот проект — что можно улучшить (показывает senior мышление)

- `fetchRevenue` — искусственный `setTimeout(3000)`, в реале убрать
- Нет rate limiting на Server Actions
- Нет оптимистичных обновлений при удалении/смене статуса инвойса
- `amount` хранится в центах — стоит обернуть в утилиту или value object, чтобы не держать в голове `* 100 / 100`
- Нет тестов (ни unit, ни e2e)
- `error.tsx` не логирует ошибки (в проде нужен Sentry или аналог)
- next-auth v5 в beta — в проде стоит отслеживать стабильный релиз
