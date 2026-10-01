# Phone Shop

**English** · [فارسی](#فارسی)

A full-stack phone marketplace built with Next.js, TypeScript, Prisma, and PostgreSQL. The application provides a Persian-friendly shopping experience for browsing phones, filtering inventory, submitting purchase requests, and managing listings through an admin panel.

## Screenshots

The storefront screenshots use local sample records for presentation only; they are not live database content.

**Storefront and filters · فروشگاه و فیلترها**

![Phone shop storefront](docs/screenshots/storefront.png)

**Phone catalog · فهرست گوشی‌ها**

![Phone catalog](docs/screenshots/phone-catalog.png)

**Admin sign-in · ورود مدیر**

![Admin sign-in](docs/screenshots/admin-login.png)

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
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id"

# Optional when the deployed URL cannot be inferred automatically
NEXT_PUBLIC_APP_URL="http://localhost:4000"
~~~

Google OAuth variables are only needed when Google login is used. Configure the callback URL in Google Cloud Console to match your environment.

## Getting Started

~~~bash
git clone https://github.com/MatinMuhammadi1381/phone-shop.git
cd phone-shop
npm ci
npm run dev
~~~

Create `.env` with the required values before installing dependencies: the package's postinstall generates the Prisma client. `DATABASE_URL` must point to a PostgreSQL database for the app to run. On Windows, `INSTALL-DEPENDENCIES.bat` runs the same lockfile-based install.

If you are setting up a new, empty development database, review the Prisma schema and then run `npx prisma db push` yourself. Do not run it against a database containing data you need to keep. The development server runs on http://localhost:4000.

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

---

## فارسی

فروشگاه موبایل یک پروژهٔ فول‌استک با Next.js، TypeScript، Prisma و PostgreSQL است. رابط کاربری فارسی‌پسند آن برای مرور و جست‌وجوی گوشی‌ها، مقایسه، ثبت درخواست خرید و مدیریت فهرست کالا طراحی شده است.

### امکانات

- فهرست گوشی‌ها با فیلتر برند، دسته‌بندی، وضعیت، قیمت، حافظه و رنگ
- صفحهٔ جزئیات، گالری تصویر، گوشی‌های مرتبط، علاقه‌مندی‌ها و مقایسه
- حساب کاربری، تاریخچهٔ بازدید، دیدگاه و هشدار قیمت
- فرم درخواست خرید و پنل مدیریت برای افزودن و ویرایش کالاها
- ورود اختیاری با Google و بارگذاری تصویر از طریق Cloudinary

### فناوری‌ها

Next.js 16 (App Router)، React 19، TypeScript، Prisma 7، PostgreSQL، Cloudinary و CSS واکنش‌گرا.

### پیش‌نیاز و راه‌اندازی

- Node.js نسخهٔ 20.9 یا بالاتر و npm
- پایگاه‌دادهٔ PostgreSQL؛ آدرس آن را در `DATABASE_URL` قرار دهید
- برای مدیریت تصویر، متغیرهای Cloudinary؛ برای ورود Google، متغیرهای OAuth مربوط
- متغیرهای مدیریت (`ADMIN_USERNAME`، `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET`) را با مقادیر امن و مخصوص خودتان تنظیم کنید. فایل `.env` را هرگز منتشر نکنید.

پس از ساخت `.env` در ریشهٔ پروژه:

~~~bash
npm ci
npm run dev
~~~

در ویندوز می‌توانید به‌جای دستور نصب، `INSTALL-DEPENDENCIES.bat` را اجرا کنید. برنامه روی `http://localhost:4000` اجرا می‌شود. برای پایگاه‌دادهٔ توسعهٔ تازه و خالی، پس از بازبینی طرحواره می‌توان `npx prisma db push` را دستی اجرا کرد؛ این دستور را روی پایگاه‌داده‌ای که دادهٔ مهم دارد اجرا نکنید.

### اسکریپت‌ها و محدودیت‌ها

- `npm run dev` سرور توسعه را اجرا می‌کند.
- `npm run build` کلاینت Prisma را می‌سازد و نسخهٔ تولید را build می‌کند.
- `npm run start` نسخهٔ buildشده را اجرا می‌کند و `npm run lint` بررسی ESLint را انجام می‌دهد.
- امکانات ورود Google و بارگذاری تصویر به تنظیمات سرویس‌های مربوط نیاز دارند.