# StkAufnahme — Landing

Статичний лендинг для застосунку StkAufnahme. Живе на GitHub Pages:
**https://piuspavliuk-wq.github.io/stkaufnahme/**

## Як це працює

- Платформа визначається ще до першого рендеру (inline-скрипт у `<head>`):
  iPhone/iPad → кнопка App Store, Android → Google Play, десктоп → обидва бейджі + QR.
- Перевірити без телефона: `?platform=ios`, `?platform=android`, `?platform=desktop`.
- Дизайн-токени, шрифт Poppins і 3D-кнопка взяті з застосунку (`src/theme`, `AppButton.tsx`).

## Коли Android вийде в продакшн

У `index.html`, блок `window.STK`:

```js
PLAY_LIVE: true,
```

Поки `false`, Android-відвідувачі бачать «Android-Version kommt bald»,
а на десктопі бейдж Google Play сірий з позначкою «bald».

## Структура

```
index.html            розмітка + конфіг магазинів
assets/css/styles.css стилі та анімації
assets/js/main.js     reveal, лічильники, sticky-телефон, паралакс
assets/screens/       скріншоти застосунку (webp)
assets/fonts/         Poppins, subset woff2
```
