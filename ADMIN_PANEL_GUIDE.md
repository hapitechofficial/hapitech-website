# Admin Panel Setup Guide

## Overview
A secure, role-based admin panel has been implemented at `/admin` with full CRUD functionality for blog and portfolio content, read-only user viewing, and CSV export capabilities.

## ✅ Completed Implementation

### 1. Database Schema Updates
- ✅ Added `Role` enum with `USER` and `ADMIN` values
- ✅ Added `role` field to User model (defaults to `USER`)
- ✅ Created `BlogPost` model with fields: slug, title, excerpt, content, author, readTime
- ✅ Created `PortfolioItem` model with fields: title, category, type (video/poster), media URL
- ✅ Migration applied: `20250122074344_add_role_and_content_models`

### 2. Authentication & Authorization
- ✅ Extended NextAuth session to include `role` field
- ✅ Updated JWT callback to persist role across sessions
- ✅ Created `lib/adminGuard.ts` with role-based access protection
- ✅ Automatic redirect to `/auth/login` for unauthenticated users
- ✅ Automatic redirect to `/admin/forbidden` for non-admin users

### 3. Admin Panel Structure

#### Routes
- `/admin` - Dashboard with statistics
- `/admin/users` - Read-only user table with CSV export
- `/admin/blog` - Blog CRUD management
- `/admin/portfolio` - Portfolio CRUD management
- `/admin/forbidden` - 403 error page

#### Components
- **Admin Layout** (`/app/admin/layout.tsx`)
  - Responsive sidebar navigation
  - Mobile-friendly hamburger menu
  - Logout button with NextAuth signOut
  
- **Dashboard** (`/app/admin/page.tsx`)
  - Display total users, blog posts, portfolio items
  - Quick start links
  
- **Users** (`/app/admin/users/page.tsx`)
  - Server-rendered user table
  - CSV export via `/api/admin/users/export-csv`
  - Shows: Name, Email, Provider, Role, Joined Date
  - No edit/delete capabilities (read-only)
  
- **Blog Management** (`/app/admin/blog/page.tsx`)
  - Create, read, update, delete blog posts
  - Fields: title, slug, excerpt, content, author, readTime
  - Auto-generates slug from title
  - Real-time updates with API refresh
  
- **Portfolio Management** (`/app/admin/portfolio/page.tsx`)
  - Create, read, update, delete portfolio items
  - Fields: title, category, type (video/poster), media URL
  - Grid display with preview thumbnails
  - Real-time updates with API refresh

### 4. API Endpoints
- `GET /api/admin/users/export-csv` - Download users as CSV
- `GET /api/admin/blog/posts` - Fetch all blog posts
- `GET /api/admin/portfolio/items` - Fetch all portfolio items

## 🔒 Security Features

### Server-Side Protection
- All admin functions use `requireAdmin()` which:
  - Checks if user is logged in
  - Verifies user role is "ADMIN"
  - Redirects to login or forbidden page on failure
  
- All server actions require admin authentication
- No admin data exposed to public APIs

### Database
- Role-based access controlled at server level
- User data cannot be edited by admins (read-only)
- Blog/Portfolio changes trigger ISR cache revalidation

## 📝 Usage

### How to Create an Admin User

1. **Via Database (Recommended)**
   ```sql
   -- Update user role in PostgreSQL
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

2. **Via Prisma Studio**
   ```bash
   npx prisma studio
   ```
   - Find the user record
   - Change `role` field from "USER" to "ADMIN"

### Admin Panel Access
1. Login at `/auth/login` or `/auth/signup`
2. If role is "ADMIN", you can access `/admin`
3. If not admin, you'll be redirected to `/admin/forbidden`

### Managing Blog Posts
1. Go to `/admin/blog`
2. Click "New Post"
3. Fill in: title, slug, excerpt, content, author, read time
4. Click "Create Post"
5. Post automatically appears on `/blog` page

### Managing Portfolio
1. Go to `/admin/portfolio`
2. Click "New Item"
3. Fill in: title, category, type, media URL (must exist in public/assets)
4. Click "Create Item"
5. Item appears in portfolio grid

### Exporting Users
1. Go to `/admin/users`
2. Click "Export CSV"
3. Browser downloads `users-YYYY-MM-DD.csv`
4. CSV includes: ID, Name, Email, Provider, Role, Joined Date

## 🚀 Deployment Notes

### Vercel Deployment
- Migrations run automatically on build
- Role field exists in all deployed databases
- Admin routes protected server-side
- No changes needed to existing public routes

### Database
- Ensure `DATABASE_URL` points to PostgreSQL instance
- Run migration before deployment: `npm run build`
- Existing users get `role: "USER"` by default

## 📋 Checklist

- ✅ Database schema updated with Role enum and models
- ✅ NextAuth extended with role in session/JWT
- ✅ Admin middleware/guard created
- ✅ Admin layout with sidebar navigation
- ✅ Dashboard with statistics
- ✅ Read-only users page with CSV export
- ✅ Blog CRUD management
- ✅ Portfolio CRUD management
- ✅ Server-side security and protection
- ✅ Public site remains unchanged
- ✅ Blog/Portfolio pages use database (with fallback to hardcoded data)

## 🔧 Troubleshooting

### "Access Denied" when accessing `/admin`
- Verify user role is "ADMIN" in database
- Check session is properly established
- Clear browser cookies and re-login

### Blog/Portfolio changes not showing
- Check revalidatePath calls in server actions
- For ISR, changes should appear within seconds
- Manual revalidation: `npm run build && npm run start`

### CSV export not working
- Verify `/api/admin/users/export-csv` is accessible
- Check browser console for errors
- Ensure user has ADMIN role

## 📂 File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard
│   ├── forbidden/
│   │   └── page.tsx            # 403 error page
│   ├── users/
│   │   ├── page.tsx            # Users table
│   │   ├── UsersClient.tsx      # Client component
│   │   └── actions.ts          # Server actions
│   ├── blog/
│   │   ├── page.tsx            # Blog management
│   │   ├── BlogClient.tsx       # Client component
│   │   └── actions.ts          # Server actions
│   └── portfolio/
│       ├── page.tsx            # Portfolio management
│       ├── PortfolioClient.tsx  # Client component
│       └── actions.ts          # Server actions
└── api/
    └── admin/
        ├── users/
        │   └── export-csv/
        │       └── route.ts     # CSV download endpoint
        ├── blog/
        │   └── posts/
        │       └── route.ts     # Blog posts fetch
        └── portfolio/
            └── items/
                └── route.ts     # Portfolio items fetch

lib/
└── adminGuard.ts               # Role-based access control

types/
└── next-auth.d.ts             # NextAuth type extensions (role field)

prisma/
├── schema.prisma              # Updated with Role and models
└── migrations/
    └── 20250122074344_add_role_and_content_models/
```

## 🎯 Next Steps

1. **Promote an Admin User**
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Test Admin Panel**
   - Login with your admin user
   - Verify you can access `/admin`
   - Test blog CRUD
   - Test portfolio CRUD
   - Test CSV export

3. **Production Deployment**
   - Deploy to Vercel (migrations run automatically)
   - Verify admin panel is accessible
   - Test functionality in production

## 📞 Support

For issues:
1. Check that user role is "ADMIN" in database
2. Verify NextAuth is properly configured
3. Check server action responses in browser console
4. Review Prisma logs for database errors
