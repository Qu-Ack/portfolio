---
title: Modern CSS Techniques in 2026
slug: modern-css-2026
excerpt: Explore the latest CSS features that are changing how we build for the web. From container queries to the new color functions.
publishedAt: 2026-02-05
updatedAt: 2026-02-05
readTime: 5
tags:
  - CSS
  - Web Development
  - Frontend
featured: false
---

# Modern CSS Techniques in 2026

CSS has evolved dramatically. Let's explore the game-changing features available today.

## Container Queries

Finally! Style elements based on their container size, not just viewport.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

## CSS Nesting

Native CSS nesting is here. No preprocessors needed.

```css
.card {
  padding: 1rem;
  
  & .title {
    font-size: 1.5rem;
    
    &:hover {
      color: blue;
    }
  }
}
```

## Color Functions

Modern color manipulation:

- `oklch()` - Perceptually uniform colors
- `color-mix()` - Blend colors easily
- Relative color syntax

### Example

```css
:root {
  --brand: oklch(70% 0.25 250);
  --brand-light: oklch(from var(--brand) 90% c h);
  --brand-dark: oklch(from var(--brand) 50% c h);
}
```

## The :has() Selector

The "parent selector" we've been waiting for:

```css
.card:has(img) {
  display: flex;
}

form:has(:invalid) {
  border-color: red;
}
```

## View Transitions

Smooth page transitions with minimal code:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

## Conclusion

CSS is more powerful than ever. Embrace these features to build better, more maintainable interfaces.
