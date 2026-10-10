# ImageUrlField

`ImageUrlField` — це compound component для роботи з URL зображень. Він інкапсулює всю логіку синхронізації між прев'ю та полем вводу, дозволяючи будувати будь-яку структуру верстки без дублювання логіки.

---

# API Reference

## `<ImageUrlField />`

Головний provider, який керує станом компонента. Є обов'язковою обгорткою для всіх підкомпонентів.

| Prop            | Type                            | Default              | Description                              |
| --------------- | ------------------------------- | -------------------- | ---------------------------------------- |
| `imageUrl`      | `string \| null`                | `null`               | Поточний URL зображення.                 |
| `onImageChange` | `(url: string \| null) => void` | —                    | Викликається при зміні URL.              |
| `defaultImage`  | `string`                        | `DEFAULT_IMAGE_PATH` | Зображення-заглушка, якщо URL відсутній. |
| `variant`       | `"portrait" \| "landscape"`     | `"portrait"`         | Визначає пропорції прев'ю.               |

---

## Basic Usage

```tsx
import { ImageUrlField } from "~/shared/ui/imageUrlField";

export const ImagePicker = ({ url, setUrl }) => {
  return (
    <ImageUrlField imageUrl={url} onImageChange={setUrl}>
      <ImageUrlField.Preview />
      <ImageUrlField.Input />
      <ImageUrlField.Tip />
    </ImageUrlField>
  );
};
```

---

# Custom Layout (Compound Component)

Якщо дизайн вимагає іншого розташування (наприклад, інпут збоку від картинки або глибоко вкладений у структуру), `ImageUrlField` можна використовувати як конструктор, комбінуючи його підкомпоненти у будь-якому порядку.

## Example 1: Side-by-side Layout

Можна просто змінити верстку, а логіка синхронізації між `Input` та `Preview` залишиться незмінною.

```tsx
import { ImageUrlField } from "~/shared/ui/imageUrlField";

export const SideBySideImagePicker = ({ url, setUrl }) => {
  return (
    <ImageUrlField imageUrl={url} onImageChange={setUrl}>
      <div className="flex flex-row items-start gap-8">
        {/* Preview */}
        <div className="w-1/3">
          <ImageUrlField.Preview />
        </div>

        {/* Input + Tip */}
        <div className="w-2/3 flex flex-col gap-2">
          <ImageUrlField.Input />
          <ImageUrlField.Tip />
        </div>
      </div>
    </ImageUrlField>
  );
};
```

---

## Example 2: Deep Nested Layout

Підкомпоненти не обов'язково мають бути прямими нащадками `ImageUrlField`. Вони можуть знаходитися на будь-якій глибині дерева компонентів — контекст автоматично передасть необхідні дані.

```tsx
import { ImageUrlField } from "~/shared/ui/imageUrlField";

export const DeepNestedPicker = ({ url, setUrl }) => {
  return (
    <ImageUrlField imageUrl={url} onImageChange={setUrl}>
      <div className="card-container">
        <header>
          <h3>Upload your avatar</h3>
        </header>

        <main>
          <ImageUrlField.Preview />
        </main>

        <aside className="mt-10 p-4 border rounded">
          <div className="some-deep-wrapper">
            <ImageUrlField.Input />
          </div>
        </aside>
      </div>
    </ImageUrlField>
  );
};
```

---

## Available Subcomponents

### `<ImageUrlField.Preview />`

Відображає поточне зображення або `defaultImage`, якщо URL порожній.

#### Props

| Prop                 | Type               | Default                | Description                                                                                         |
| -------------------- | ------------------ | ---------------------- | --------------------------------------------------------------------------------------------------- |
| `className`          | `string`           | —                      | Додаткові CSS-класи для елемента `<img>`.                                                           |
| `containerClassName` | `string`           | —                      | Додаткові CSS-класи для контейнера прев'ю. Використовуйте для зміни розміру, рамок, відступів тощо. |
| `width`              | `number \| string` | Залежить від `variant` | Явно задає ширину контейнера прев'ю.                                                                |
| `height`             | `number \| string` | Залежить від `variant` | Явно задає висоту контейнера прев'ю.                                                                |

#### Examples

```tsx
<ImageUrlField.Preview />
```

```tsx
<ImageUrlField.Preview width={160} height={224} />
```

```tsx
<ImageUrlField.Preview
  containerClassName="w-40 h-56 rounded-xl shadow-md"
  className="object-contain"
/>
```

> **Note:** `className` застосовується до самого елемента `<img>`, тоді як `containerClassName` застосовується до контейнера прев'ю. Для зміни розмірів рекомендується використовувати `containerClassName` або пропси `width` і `height`.

---

### `<ImageUrlField.Input />`

Текстове поле для введення URL зображення.

#### Props

| Prop        | Type      | Default | Description                                          |
| ----------- | --------- | ------- | ---------------------------------------------------- |
| `className` | `string`  | —       | Додаткові CSS-класи для кастомізації стилів.         |
| `showLabel` | `boolean` | true    | Визначає чи показувати дефолтний _label_ з статусом. |

---

### `<ImageUrlField.Tip />`

Відображає допоміжний текст із рекомендаціями щодо підтримуваних форматів зображень.

#### Props

| Prop        | Type              | Default                                                                   | Description                                                               |
| ----------- | ----------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `children`  | `React.ReactNode` | `"Tip: Use direct links ending in .jpg, .png or .webp for best results."` | Кастомний текст підказки. Якщо не передано, використовується стандартний. |
| `className` | `string`          | —                                                                         | Додаткові CSS-класи для кастомізації стилів.                              |
