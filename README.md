# Phone Shop

A full-stack phone marketplace built with Next.js, TypeScript, Prisma, and PostgreSQL. The application provides a Persian-friendly shopping experience for browsing phones, filtering inventory, submitting purchase requests, and managing listings through an admin panel.

## Features

### Storefront

- Phone catalog with brands, sections, condition, price, storage, RAM, color, and availability
- Search and advanced filtering by brand, section, RAM, storage, and price range
- Featured, budget-friendly, and boxed/new product sections
- Phone detail pages with image gallery, descriptions, related phones, and view tracking
- Favorites, compare list, reviews, and price alerts
- Purchase request form

### Accounts and Administration

- Sign up and sign in with phone number and password
- Optional Google OAuth login
- User dashboard with profile editing, favorites, requests, and recently viewed phones
- Admin authentication with a protected management panel
- Add, edit, delete, and mark phones as sold or available
- Image uploads through Cloudinary
- Registration and online-user statistics

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma 7 with PostgreSQL
- Supabase packages for server-side integration
- Cloudinary for image uploads
- CSS and responsive UI

## Requirements

- Node.js 20+
- PostgreSQL database
- Cloudinary account for admin image uploads
- Google OAuth credentials if Google login is enabled

## Environment Variables

Create an environment file in the project root. Never commit real secrets.

~~~env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="use-a-long-random-secret"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:4000/api/auth/google/callback"

# Optional when the deployed URL cannot be inferred automatically
NEXT_PUBLIC_APP_URL="http://localhost:4000"
~~~

Google OAuth variables are only needed when Google login is used. Configure the callback URL in Google Cloud Console to match your environment.

## Getting Started

~~~bash
git clone https://github.com/MatinMuhammadi1381/phone-shop.git
cd phone-shop
npm install
npx prisma generate
npx prisma db push
npm run dev
~~~

The development server runs on http://localhost:4000.

## Available Scripts

~~~bash
npm run dev       # Start Next.js on port 4000
npm run build     # Generate Prisma client and build Next.js
npm run start      # Start the production server
npm run lint       # Run ESLint
~~~

## Main Routes

| Route | Purpose |
| --- | --- |
| / | Browse phones, search, and filter inventory |
| /phones/[id] | View phone details, reviews, and purchase request |
| /auth | Sign up and sign in |
| /dashboard | User profile, favorites, requests, and view history |
| /admin-login | Admin authentication |
| /admin | Protected inventory and analytics panel |
| /compare | Compare selected phones |

## Data Model

The Prisma schema includes phones, users, sessions, favorites, purchase requests, reviews, price alerts, and view history.

## Deployment Notes

Set all required environment variables in the hosting platform, run the Prisma setup against PostgreSQL, and configure the Google OAuth redirect URI and Cloudinary credentials for the deployed domain.