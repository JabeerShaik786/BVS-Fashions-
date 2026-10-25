# BVS Fashions — Indian Ethnic Wear E-Commerce & WhatsApp Commerce

A mobile-responsive Indian traditional clothing catalogue with WhatsApp click-to-chat order inquiries and a private Admin Dashboard.

## Features

- **Brand Aesthetic**: Warm ivory (`#F7F0E5`), deep maroon (`#702C38`), and antique gold (`#D4B16A`) honoring traditional Indian heritage (Sarees, Women's Wear, Men's Wear, Kids' Wear, and Festive Collections).
- **Mobile-First Responsive Layout**: Tested and optimized for 320px, 360px, 390px, 430px, 768px, 1024px, and 1440px viewports with a 2-column mobile grid, 3-column tablet grid, and 4-column desktop grid.
- **WhatsApp Commerce Engine**: Click-to-chat ordering destination [`https://wa.me/918639778188`](https://wa.me/918639778188) with URL-encoded messages including SKU, product name, price, size, shade, and quantity.
- **Shopping Bag WhatsApp Inquiry**: Multi-item inquiries formatted directly into an actionable WhatsApp payload.
- **Private Admin Dashboard (`/#admin`)**:
  - Secure authentication
  - Overview metrics (Total, Published, Draft, Stock counts)
  - Product CRUD with safe confirmation dialogs
  - One-click publish / unpublish toggle (instantly syncs to public catalogue)
  - Responsive mobile cards on phones & desktop data table
  - Multi-image upload and direct URL preview
  - Live customer view simulator
- **Backend API & Database**:
  - Node.js + Express + TypeScript on port 3001
  - PostgreSQL schema with Row Level Security (RLS) in `supabase/schema.sql`
  - Dual adapter: connects seamlessly to cloud Supabase or falls back to local persistence

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, Multer, CORS
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Messaging**: Official WhatsApp Click-to-Chat (`wa.me`)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your WhatsApp contact number (default: `918639778188`):
```env
VITE_WHATSAPP_PHONE_NUMBER=918639778188
```

For live Supabase deployment, add your credentials in `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Servers
Start the backend server (port 3001):
```bash
npm run server
```

In a second terminal, start Vite frontend (port 5173):
```bash
npm run dev
```

### 4. Admin Access
- Access route: `http://localhost:5173/#admin` (or click "Admin Portal" in header / footer)
- Default Email: `admin@bvsfashions.com`
- Default Password: `admin123`

## Project Structure

```
├── server/                 # Express backend API & DB adapters
│   ├── index.ts            # Server entry point (:3001)
│   ├── db.ts               # Database layer & seed data
│   ├── supabase.ts         # Supabase client initialization
│   ├── middleware/auth.ts  # JWT admin verification middleware
│   └── routes/             # Public & admin routes
├── src/                    # Frontend React application
│   ├── admin/              # Admin dashboard components
│   ├── components/         # Public storefront components
│   ├── context/            # Shop state & catalog context
│   ├── utils/              # WhatsApp ordering engine
│   └── types/              # TypeScript interfaces
├── supabase/
│   └── schema.sql          # PostgreSQL DDL, indexes, and RLS policies
└── dist/                   # Production build output
```

## License

Private & proprietary to BVS Fashions.
