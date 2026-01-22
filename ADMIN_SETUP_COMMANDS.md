# Admin Panel - Setup Commands

Quick reference for setting up the admin panel in production.

## 1. Database Setup

### Make a User an Admin

Run one of these commands in your PostgreSQL database:

#### Option A: Direct SQL (Recommended for production)
```sql
-- Replace 'admin@example.com' with your actual admin email
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Verify it worked:
SELECT email, role FROM "User" WHERE email = 'admin@example.com';
```

#### Option B: Prisma Studio (Local development)
```bash
npx prisma studio
```
- Open http://localhost:5555
- Find your user in the User table
- Click to edit
- Change `role` from "USER" to "ADMIN"
- Save

#### Option C: SQL Script to Create Admin User
```sql
-- Create a new user directly (if needed)
INSERT INTO "User" (
  id,
  email,
  name,
  role,
  "createdAt",
  "updatedAt"
) VALUES (
  'clxx' || gen_random_uuid()::text,
  'admin@yourdomain.com',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

## 2. Verify Migration Applied

```bash
# Check migration status
npx prisma migrate status

# Expected output:
# Migrations:
#   20250122074344_add_role_and_content_models ... applied
```

## 3. Verify Database Schema

```bash
# Open Prisma Studio to view tables
npx prisma studio

# Or query directly:
```

#### PostgreSQL Query to verify new columns:
```sql
-- Check User table has role column
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'role';

-- Check new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('BlogPost', 'PortfolioItem');
```

## 4. Deployment to Vercel

### Before Pushing:
```bash
# 1. Verify build locally
npm run build

# 2. Test admin panel locally
npm run dev
# Visit http://localhost:3000/admin
```

### Deploy:
```bash
# Push to GitHub (or your git provider)
git add .
git commit -m "feat: add secure admin panel with role-based access"
git push origin main

# Vercel automatically:
# - Runs migrations
# - Builds the project
# - Deploys the site
```

### Post-Deployment:
```bash
# Connect to Vercel's Postgres database
# Run SQL to make a user admin:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 5. Vercel Environment Variables

No new environment variables needed! All existing vars work:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 6. Testing Checklist

### Admin User Created?
```sql
SELECT email, role FROM "User" WHERE role = 'ADMIN';
```

### Can Access Admin Panel?
1. Login at https://your-domain.com/auth/login with admin email
2. Visit https://your-domain.com/admin
3. Should see dashboard (not 403 error)

### Feature Tests:
```
Dashboard:
- [ ] Shows user count
- [ ] Shows blog post count
- [ ] Shows portfolio item count

Users:
- [ ] Table displays all users
- [ ] Can export CSV

Blog:
- [ ] Can create new post
- [ ] Can edit post
- [ ] Can delete post
- [ ] Post appears on /blog

Portfolio:
- [ ] Can create new item
- [ ] Can edit item
- [ ] Can delete item
- [ ] Item appears on /portfolio
```

## 7. Troubleshooting

### "Access Denied" when visiting /admin?
```sql
-- Check if user role is ADMIN
SELECT email, role FROM "User" WHERE email = 'your-email@example.com';

-- If role is USER, update it:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Migration not applied?
```bash
# Check status
npx prisma migrate status

# If pending, apply it:
npx prisma migrate deploy

# Or for dev environment:
npx prisma migrate dev
```

### Blog/Portfolio changes not showing?
```bash
# Clear build cache and rebuild
rm -rf .next
npm run build
npm run start
```

### CSV export not working?
```bash
# Check that user is actually ADMIN:
SELECT email, role FROM "User" WHERE id = 'user-id-here';

# Test the endpoint directly:
curl https://your-domain.com/api/admin/users/export-csv \
  -H "Cookie: <your-session-cookie>"
```

## 8. Quick SQL Reference

### View All Admin Users
```sql
SELECT email, name, role, "createdAt" FROM "User" WHERE role = 'ADMIN';
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count FROM "User" GROUP BY role;
```

### View All Blog Posts
```sql
SELECT id, title, slug, author, "createdAt" FROM "BlogPost" ORDER BY "createdAt" DESC;
```

### View All Portfolio Items
```sql
SELECT id, title, category, type, "createdAt" FROM "PortfolioItem" ORDER BY "createdAt" DESC;
```

### Remove Admin Access
```sql
UPDATE "User" SET role = 'USER' WHERE email = 'admin@example.com';
```

### Delete Test Data
```sql
DELETE FROM "BlogPost" WHERE slug = 'test-post';
DELETE FROM "PortfolioItem" WHERE title = 'Test Item';
```

## 9. Docker/Local Development

### Start PostgreSQL locally:
```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=hapitech \
  -p 5432:5432 \
  -d postgres:15

# Set DATABASE_URL:
export DATABASE_URL="postgresql://postgres:password@localhost:5432/hapitech"
```

### Apply migrations:
```bash
npx prisma migrate dev

# Create admin user:
npx prisma db execute << EOF
UPDATE "User" SET role = 'ADMIN' WHERE email = 'dev@example.com';
EOF
```

## 10. Production Checklist

- [ ] Migration applied to production database
- [ ] At least one user has role = 'ADMIN'
- [ ] Verified admin can access /admin
- [ ] Tested blog CRUD
- [ ] Tested portfolio CRUD
- [ ] Tested CSV export
- [ ] Tested non-admin user gets 403
- [ ] Tested logged-out user redirects to login
- [ ] Public pages unchanged and working
- [ ] Cache revalidation working (changes appear immediately)

---

## Need Help?

1. Check database connection: `npx prisma db push`
2. View database: `npx prisma studio`
3. Check migrations: `npx prisma migrate status`
4. Reset database (dev only): `npx prisma migrate reset`
5. View logs: Check Vercel dashboard or local logs

## Files Reference

- Admin Guide: [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)
- Implementation Summary: [ADMIN_IMPLEMENTATION_COMPLETE.md](./ADMIN_IMPLEMENTATION_COMPLETE.md)
- Database Schema: [prisma/schema.prisma](./prisma/schema.prisma)
- Auth Config: [lib/auth.ts](./lib/auth.ts)
- Admin Guard: [lib/adminGuard.ts](./lib/adminGuard.ts)
