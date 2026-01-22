# Quick Start: Blog & Portfolio Admin Management

## 📱 Accessing the Admin Panel

1. Go to `/admin/blog` or `/admin/portfolio`
2. Must be logged in as **ADMIN** user
3. Non-admin users see **403 Forbidden** page

---

## 📝 Blog Management

### Create Blog Post:
```
Title → Slug (auto-generated from title)
Excerpt → Short summary
Content → Full article
Author → Author name (default: hApItech Team)
Read Time → Estimated time (default: 5 min read)
```

**Appears on:** `/blog` page immediately

### Edit Blog Post:
- Click "Edit" button on any post
- Modify fields
- Click "Update Post"

### Delete Blog Post:
- Click "Delete" (trash icon)
- Confirm deletion
- **Removed from both admin and main website**

---

## 🎨 Portfolio Management

### Create Portfolio Item:
1. **Title** → Name of the work
2. **Media Type** → Choose ONE:
   - 📷 **Photo** (jpg, png, gif, webp)
   - 🎬 **Video** (mp4, webm, mov)
   - 🎵 **Song** (mp3, wav, flac)
3. **Upload Media** → Drag-drop or click to browse
   - ✅ File upload from device
   - ❌ URL pasting NOT allowed
   - ✅ Auto-uploads to Cloudinary

**Appears on:** `/portfolio` page immediately

### Edit Portfolio Item:
- Click "Edit"
- Can change title and/or upload new media file
- Click "Update Item"

### Delete Portfolio Item:
- Click "Delete"
- Confirm deletion
- Item removed from portfolio page

---

## 🔄 Data Sync Flow

```
Admin Panel Edit
    ↓
Database Update (Prisma)
    ↓
Cache Clear (revalidatePath)
    ↓
API Returns New Data
    ↓
Main Website Displays New Data (Instant!)
```

---

## 🚨 Troubleshooting

### Items don't appear on main website:
- Check admin panel - are items showing there?
- Refresh main website page
- Check browser console for errors
- Verify database connection

### Portfolio upload fails:
- Check file type matches selected media type
- File must be under 500MB
- Check internet connection
- Verify Cloudinary is configured

### Can't access admin panel:
- Must be logged in
- User must have `role: "ADMIN"` in database
- Check browser console for errors

---

## 💡 Tips

1. **Blog slug** is generated from title - use descriptive titles
2. **Portfolio category** is auto-generated from media type - no need to enter
3. **All changes are live** - no separate "publish" button needed
4. **Check main website** after creating/editing to verify
5. **Drag-drop is faster** than clicking "browse" for uploads

---

## 📊 What's Visible Where

| Section | Admin Panel | Main Website | Notes |
|---------|-------------|--------------|-------|
| Blog Posts | ✅ All posts visible | ✅ Latest posts shown | Sorted by date |
| Edit Blog | ✅ Edit button | ❌ Users can't edit | Admin only |
| Delete Blog | ✅ Delete button | ❌ Users can't delete | Admin only |
| Portfolio Items | ✅ All items visible | ✅ All items shown | Synced via API |
| Edit Portfolio | ✅ Edit button | ❌ Users can't edit | Admin only |
| Delete Portfolio | ✅ Delete button | ❌ Users can't delete | Admin only |

---

## 🔐 Security

- ✅ Only admins can CRUD
- ✅ File uploads validated by type
- ✅ Database protected by authentication
- ✅ All changes logged/tracked
- ❌ No direct URL access to admin panel without login

