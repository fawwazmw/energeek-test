# 🎨 Icon & Logo Usage Guide

## 📁 Available Icons

Your project now has custom icons in `energeek-fe/public/`:

### 1. **logo.svg** (200x200)
- **Use for:** Main logo, splash screens, app headers
- **Colors:** Blue, purple, green gradients with white background
- **Format:** Scalable vector (looks perfect at any size)

### 2. **favicon.svg** (32x32)
- **Use for:** Browser tab icon, bookmarks
- **Colors:** Gradient background with white kanban columns
- **Format:** Optimized for small sizes

### 3. **logo-text.svg** (240x60)
- **Use for:** Full branding with "TaskFlow" text
- **Colors:** Icon + dark gray text
- **Format:** Horizontal layout for headers/navigation

---

## 💡 How to Use

### In Vue Components

```vue
<template>
  <!-- Full Logo -->
  <img src="/logo.svg" alt="TaskFlow Logo" class="h-16 w-16" />
  
  <!-- Logo with Text -->
  <img src="/logo-text.svg" alt="TaskFlow" class="h-12" />
</template>
```

### In AppLayout.vue (Sidebar)

```vue
<!-- Replace existing branding -->
<div class="flex items-center gap-x-3 px-6 py-4">
  <img src="/logo.svg" alt="TaskFlow" class="h-10 w-10" />
  <span class="text-xl font-semibold text-white">TaskFlow</span>
</div>
```

### In Login Page

```vue
<div class="text-center mb-8">
  <img src="/logo.svg" alt="TaskFlow Logo" class="mx-auto h-24 w-24 mb-4" />
  <h1 class="text-3xl font-bold">Task & Project Tracker</h1>
</div>
```

---

## 🌐 Favicon Setup (Already Done!)

Your `index.html` is already configured:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" href="/favicon.ico" />
<meta name="theme-color" content="#4F46E5" />
```

### Optional: Generate .ico file

For older browsers, convert favicon.svg to .ico:

**Option 1: Online Tool**
1. Go to https://realfavicongenerator.net
2. Upload `energeek-fe/public/favicon.svg`
3. Download generated `favicon.ico`
4. Place in `energeek-fe/public/`

**Option 2: Command Line**
```bash
# Using ImageMagick
convert favicon.svg -resize 32x32 favicon.ico
```

---

## 🎨 Color Palette (from icons)

Use these colors in your UI for consistent branding:

```css
/* Primary Colors */
--blue-gradient-start: #4F46E5;    /* Indigo */
--blue-gradient-end: #06b6d4;      /* Cyan */

--purple-gradient-start: #8B5CF6;  /* Violet */
--purple-gradient-end: #EC4899;    /* Pink */

--green-gradient-start: #10B981;   /* Emerald */
--green-gradient-end: #34D399;     /* Light Emerald */

--theme-primary: #4F46E5;          /* Main brand color */
```

---

## 📱 PWA / Mobile App Icon

If you want to make this a Progressive Web App, add to `index.html`:

```html
<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />

<!-- Android Chrome -->
<link rel="manifest" href="/manifest.json" />
```

Create `energeek-fe/public/manifest.json`:
```json
{
  "name": "Task & Project Tracker",
  "short_name": "TaskFlow",
  "icons": [
    {
      "src": "/logo.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ],
  "theme_color": "#4F46E5",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

---

## 🎯 Customization

All icons are SVG - easy to customize!

### Change Colors

Edit the gradient stops in the SVG files:

```svg
<linearGradient id="blueGradient">
  <stop offset="0%" style="stop-color:#YOUR_COLOR_1" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR_2" />
</linearGradient>
```

### Change Text in logo-text.svg

Find and edit:
```svg
<text x="55" y="37" ...>TaskFlow</text>
```

---

## 📸 Export to PNG/JPG

If you need raster formats:

**Using Browser:**
1. Open logo.svg in browser
2. Right-click → Inspect
3. Take screenshot
4. Or use browser developer tools to export

**Using Inkscape (Free):**
```bash
inkscape logo.svg --export-filename=logo.png --export-width=512
```

**Using ImageMagick:**
```bash
convert -background none logo.svg -resize 512x512 logo.png
```

---

## ✨ Tips

- **Always use SVG when possible** - they scale perfectly
- **favicon.svg works in all modern browsers** (Chrome, Firefox, Safari, Edge)
- **Keep .ico as fallback** for IE11 and older browsers
- **Use logo.svg in loading screens** for consistent branding
- **Match UI colors** to icon gradients for cohesive design

---

Enjoy your new professional icons! 🎨
