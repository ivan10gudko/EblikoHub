# 🏗️ Архітектура та формат даних

## 📦 Загальна структура відповіді

Дані надходять у вигляді **загального об'єкта пагінації** `RoomTitlesResponse`, який містить:

- 📚 зріз тайтлів кімнати — `content`;
- 📄 метадані пагінації;
- 👥 словник кешу користувачів — `usersCache`.

```ts
export interface RoomTitlesResponse extends PageResponse<RoomTitleSummary> {
    usersCache: Record<string, UserShort>;
}
```

> 💡 **Ключова особливість цієї структури — нормалізація даних.**

Учасники кімнати **не дублюються всередині кожного тайтла**.

Замість цього кожен елемент списку (`content`) містить лише масив зв'язків `userParticipation`, де зберігається мінімальна інформація про участь користувача:

```ts
export interface RoomTitleSummary {
    roomTitleId: string;
    titleInfo: RoomTitleShort;
    computedAvgRating: number;
    myStatus: Status;
    myTitleInfo: TitleShort;
    userParticipation: RoomTitleUserIdAndTitleStatus[];
}

export interface RoomTitleUserIdAndTitleStatus {
    userId: string;
    status: Status;
}
```

---

# 👤 Де зберігається повна інформація про користувачів?

Повна інформація про користувача, наприклад:

- 🖼️ аватар;
- 🏷️ нікнейм;
- та інші дані з `UserShort`;

зберігається **в одному глобальному словнику** `usersCache` на рівні всього response.

```ts
usersCache: Record<string, UserShort>
```

Тут:

- **ключ** → `userId`;
- **значення** → повний об'єкт `UserShort`.

Візуально структура виглядає приблизно так:

```text
RoomTitlesResponse
│
├── content
│   ├── RoomTitleSummary
│   │   └── userParticipation
│   │       ├── { userId, status }
│   │       └── { userId, status }
│   │
│   └── RoomTitleSummary
│       └── userParticipation
│           └── { userId, status }
│
└── usersCache
    ├── userId_1 → UserShort
    ├── userId_2 → UserShort
    └── userId_3 → UserShort
```

---

# ⚙️ Як користуватися даними?

Оскільки дані розділені між:

- списком тайтлів;
- зв'язками участі користувачів;
- глобальним кешем користувачів;

для відображення інформації про учасників на UI потрібно **зіставити `userParticipation` із `usersCache`**.

---

## 1️⃣ Прямий доступ за ключем — `O(1)`

Оскільки `usersCache` має тип:

```ts
Record<string, UserShort>
```

пошук користувача не потребує використання методів на кшталт:

```ts
.find()
.filter()
```

Достатньо напряму звернутися до словника за `userId`:

```ts
const currentUser = usersCache[userId];
```

### 🚀 Перевага

Такий підхід дозволяє отримати користувача з кешу напряму, без проходу по всьому масиву користувачів.

```text
userId
   │
   ▼
usersCache[userId]
   │
   ▼
UserShort
```

---

# 🎨 Типовий паттерн рендерингу в React

Під час виведення списку тайтлів кімнати та пов'язаних із ними користувачів використовується наступний алгоритм.

## Крок 1. Проходимо по списку тайтлів

```ts
content.map(...)
```

`content` містить список `RoomTitleSummary`.

---

## Крок 2. Усередині кожного тайтла проходимо по `userParticipation`

```ts
roomTitle.userParticipation.map(...)
```

Тут ми отримуємо:

```ts
{
    userId,
    status
}
```

---

## Крок 3. Дістаємо повні дані користувача з `usersCache`

```ts
const user = usersCache[userId];
```

Таким чином:

```text
userParticipation
      │
      │ userId
      ▼
usersCache[userId]
      │
      ▼
   UserShort
```

---

# 💻 Приклад реалізації

```tsx
{roomTitle.userParticipation.map(({ userId, status }) => {
  const user = usersCache[userId];

  if (!user) return null;

  return (
    <div key={userId}>
      <img src={user.avatarUrl} alt={user.nickname} />

      <span>{user.nickname}</span>

      <span>{status}</span>
    </div>
  );
})}
```

---

# 🔗 Що відбувається в цьому коді?

### 1. Отримуємо зв'язок участі користувача

```ts
({ userId, status })
```

З `userParticipation` беремо:

- `userId` — ідентифікатор користувача;
- `status` — його статус для конкретного тайтла.

---

### 2. Знаходимо повну інформацію про користувача

```ts
const user = usersCache[userId];
```

За `userId` отримуємо відповідний об'єкт `UserShort`.

---

### 3. Перевіряємо, чи існує користувач у кеші

```ts
if (!user) return null;
```

Це захищає UI від ситуації, коли `userId` є у `userParticipation`, але відповідного користувача немає у `usersCache`.

---

### 4. Рендеримо інформацію

```tsx
<img src={user.avatarUrl} alt={user.nickname} />
<span>{user.nickname}</span>
<span>{status}</span>
```

На UI відображаються:

| Дані | Джерело |
|---|---|
| 🖼️ Аватар | `usersCache[userId].avatarUrl` |
| 🏷️ Нікнейм | `usersCache[userId].nickname` |
| 📌 Статус | `userParticipation.status` |

---

# 🧠 Коротко про архітектуру

```text
                 RoomTitlesResponse
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
       content                      usersCache
          │                             │
          ▼                             ▼
   RoomTitleSummary               userId → UserShort
          │
          ▼
  userParticipation
          │
          ├── userId ───────────────────┘
          │
          └── status
```

## 🔥 Основна ідея

> **`userParticipation` зберігає зв'язок користувача з конкретним тайтлом, а `usersCache` зберігає повну інформацію про користувачів.**

Тому для відображення користувача потрібно:

```ts
const user = usersCache[userId];
```

---

# ✅ Переваги такого підходу

- **Менше дублювання даних** — інформація про одного користувача не повторюється в кожному тайтлі.
- **Швидкий доступ** — отримання користувача за ключем `userId`.
- **Зручне кешування** — всі користувачі зберігаються централізовано.
- **Проста інтеграція з UI** — легко поєднати `status` зі зв'язку та дані користувача з кешу.
- **Чистіша структура response** — список тайтлів не перевантажується повними об'єктами користувачів.

---

## 📌 Підсумок

Логіка роботи виглядає так:

```text
RoomTitle
   │
   ▼
userParticipation
   │
   │ беремо userId
   ▼
usersCache[userId]
   │
   ▼
UserShort
   │
   ▼
Рендеримо аватар + нікнейм
   │
   └── status беремо з userParticipation
```

**Тобто `userId` є зв'язком між `userParticipation` та `usersCache`.**
