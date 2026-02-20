# Daksh Sangal - Portfolio Blog

A modern, static blog built with React + TypeScript + Vite. Posts are stored as individual markdown files with frontmatter.

## ✨ Features

- ⚡ **Instant Loading** - Posts bundled with app, no API calls
- 📝 **Markdown Support** - Write posts in any markdown editor
- 🎨 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark/Light Theme** - Toggle between themes
- 🚀 **Static Site** - No database required
- 📱 **GitHub Pages Ready** - Deploy for free on Vercel/Netlify

## 📂 Project Structure

```
src/
├── posts/              # Blog posts as markdown files
│   ├── building-rich-text-editor.md
│   ├── art-of-clean-code.md
│   └── ...
├── components/         # React components
│   ├── blog/          # Blog-related components
│   └── about/         # About page
├── utils/             # Utilities (posts loader)
├── services/          # Services (posts service)
├── types/             # TypeScript types
└── App.tsx            # Main app component
```

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open http://localhost:5173

## 📝 Writing Posts

Create a new blog post by adding a markdown file to `src/posts/`:

```markdown
---
title: My New Post
slug: my-new-post
excerpt: A brief description
publishedAt: 2024-01-01
readTime: 5
tags:
  - webdev
  - react
featured: false
---

# My New Post

Your content here in markdown...
```

**Frontmatter Fields:**
- `title` (required): Post title
- `slug` (optional): URL-friendly slug (auto-generated if missing)
- `excerpt` (optional): Brief description (auto-generated if missing)
- `publishedAt` (required): Publication date (YYYY-MM-DD)
- `readTime` (optional): Read time in minutes (auto-calculated)
- `tags` (optional): Array of tags
- `featured` (optional): Boolean for featured posts

See `POSTS.md` for detailed guide.

## 🛠️ Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Styling

- Uses CSS modules and CSS variables for theming
- Responsive design with mobile-first approach
- Dark/light theme toggle

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. It will automatically detect the Vite setup
3. On every push, it will build and deploy the site

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `vercel.json` to root for proper routing

### GitHub Pages

1. Build: `npm run build`
2. Deploy `dist/` folder to GitHub Pages

## 📦 Dependencies

### Core
- React 19
- React DOM
- TypeScript
- Vite

### Styling
- CSS Modules
- CSS Variables for theming

### Build Tools
- Vite
- TypeScript compiler
- ESLint

## 🔧 Configuration

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration  
- `eslint.config.js` - ESLint configuration
- `vercel.json` - Vercel deployment config

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ by Daksh Sangal

Connect with me:
- [GitHub](https://github.com/Qu-Ack)
- [X](https://x.com/SangalDaksh)