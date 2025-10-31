# SkillShare Platform

A modern marketplace platform where students can showcase their projects, sell their work, and connect with customers for custom projects.

## 🚀 Features

- **Portfolio Showcase**: Students can display their projects and skills
- **Marketplace**: Buy and sell completed software and digital products  
- **Custom Projects**: Customers can request custom work from talented students
- **Secure Payments**: Integrated wallet system with escrow protection
- **Multi-Platform**: Web, mobile, and desktop applications

## 🏗️ Architecture

This is a monorepo containing:

- **`apps/web`**: Next.js 14 web application
- **`apps/mobile`**: React Native mobile app
- **`apps/desktop`**: Tauri desktop application
- **`apps/api`**: Node.js backend with tRPC
- **`packages/database`**: Prisma schema and database utilities
- **`packages/ui`**: Shared UI components
- **`packages/shared`**: Common utilities and types

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Mobile**: React Native with Expo
- **Desktop**: Tauri (Rust + Web)
- **Backend**: Node.js, tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js
- **Payments**: Stripe Connect
- **File Storage**: AWS S3
- **Deployment**: Vercel (frontend), Railway (backend)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run database migrations:
   ```bash
   pnpm db:migrate
   ```
5. Start development servers:
   ```bash
   pnpm dev
   ```

## 🌟 Getting Started

Visit the `docs/` folder for detailed setup instructions and API documentation.

## 📄 License

MIT License - see LICENSE file for details.