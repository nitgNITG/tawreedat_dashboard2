# 🐛 Bug Report — Categories Module
**Project:** Tawreedat Admin Dashboard  
**Module:** Categories  
**Date:** 2026-04-20  
**Total Bugs:** 20  
**Critical:** 5 | High: 7 | Medium: 5 | Low: 3

---

## 🔴 CRITICAL BUGS

---

### BUG-001 — Categories Table Always Renders Empty
**Severity:** Critical  
**Type:** Integration / API Mapping  
**Status:** Open  

**Summary:** The categories list page never shows any data despite 9+ categories existing in the database.

**Root Cause:**  
API returns `{ totalCount, totalPages, categories: [] }` but frontend adapter expects `{ data: [], meta: {} }`.  
In `categoriesApi.getAll()`:
```typescript
// The raw response is returned as-is:
return data; // data = { totalCount: 9, totalPages: 5, categories: [...] }

// Component then reads:
data?.data ?? []  // data.data = undefined → renders []
```

**Steps to Reproduce:**  
1. Navigate to http://localhost:3000/categories  
2. Observe: "No categories yet" shown despite 9 categories in API  

**Expected:** All categories listed in the table  
**Actual:** Empty state always shown  

**Fix Required:** Update `categoriesApi.getAll()` to map `categories` → `data` and build `meta` from `totalCount`/`totalPages`

---

### BUG-002 — Edit Form Loads Incorrect Data Object
**Severity:** Critical  
**Type:** Integration / API Mapping  
**Status:** Open  

**Summary:** The single category GET endpoint returns `{ category: {} }` but the frontend tries to use it as a `Category` object directly, resulting in all form fields being undefined.

**Root Cause:**  
```typescript
// API returns: { category: { id: 4, name: "Electronics", ... } }
// Frontend adapter:
return (data as ApiResponse<Category>).data  // data.data = undefined
  ?? (data as unknown as Category)           // returns the wrapper object { category: {} }
// Form then gets: { category: {} } treated as Category — all fields undefined
```

**Steps to Reproduce:**  
1. Navigate to /categories/4/edit  
2. All form fields are empty  

**Expected:** Form pre-filled with existing category data  
**Actual:** All fields empty — any save overwrites data with undefined values  

**Fix Required:** Map `response.category` → returned value in `getById()`

---

### BUG-003 — DELETE Endpoint Returns 400 for Valid Category ID
**Severity:** Critical  
**Type:** API  
**Status:** Open  

**Summary:** `DELETE /categories/:id` returns HTTP 400 "Validation error: Invalid value type" for valid existing category IDs.

**Steps to Reproduce (API):**  
```bash
curl -X DELETE https://adminapis-dev.nitg-eg.com/api/v1/categories/14 \
  -H "Authorization: Bearer <token>"
# Response: 400 { "message": "Validation error", "errors": [{ "path": [], "message": "Invalid value type" }] }
```

**Expected:** 200 or 204 — category deleted  
**Actual:** 400 Validation Error  

**Impact:** No category can be deleted from the dashboard  
**Note:** The frontend DELETE call sends no request body. If the API requires a body, that is an API design issue (REST standard: DELETE should only require the ID in the URL).

---

### BUG-004 — Search Returns 500 Internal Server Error
**Severity:** Critical  
**Type:** API  
**Status:** Open  

**Steps to Reproduce:**  
```bash
curl "https://adminapis-dev.nitg-eg.com/api/v1/categories?search=Electronics" \
  -H "Authorization: Bearer <token>"
# Response: 500 Internal Server Error
```

**Expected:** Array of matching categories  
**Actual:** 500 — server crashes on `search` query param  
**Impact:** Search feature completely non-functional

---

### BUG-005 — XSS: Script Tags Stored Unsanitized
**Severity:** Critical  
**Type:** Security  
**Status:** Open  

**Summary:** The API accepts and persists raw `<script>` tags in the category name field without sanitization.

**Steps to Reproduce:**  
```bash
curl -X POST https://adminapis-dev.nitg-eg.com/api/v1/categories \
  -H "Content-Type: application/json" -H "Authorization: Bearer <token>" \
  -d '{"name": "<script>alert(\"xss\")</script>", "is_active": true}'
# Response: 201 — stored successfully
```

**Actual stored value:** `<script>alert("xss")</script>`  
**Impact:** If rendered unescaped in the UI, executes JavaScript in admin context  
**Fix:** Server-side input sanitization (strip HTML tags, encode special characters)

---

## 🟠 HIGH BUGS

---

### BUG-006 — Field Name Mismatch: Frontend ↔ API (8 fields)
**Severity:** High  
**Type:** Integration  
**Status:** Open  

| API Field | Frontend Field | Effect |
|---|---|---|
| `name_ar` | `nameAr` | Arabic name never sent/received correctly |
| `is_active` (boolean) | `status: "active"\|"inactive"` | Status always wrong — API gets undefined |
| `image_url` | `image` | Image never saved |
| `parent_id` | `parentId` | Parent relationship broken |
| `created_at` | `createdAt` | Date column shows Invalid Date |
| `updated_at` | `updatedAt` | Updated date broken |
| `id` (number) | `id` (string) | TypeScript type mismatch — may cause routing issues |

---

### BUG-007 — Sort Returns 500 Internal Server Error
**Severity:** High  
**Type:** API  
**Status:** Open  

```bash
curl "https://adminapis-dev.nitg-eg.com/api/v1/categories?sortBy=name&sortOrder=asc"
# Response: 500 Internal Server Error
```
**Impact:** Sorting feature completely non-functional

---

### BUG-008 — Duplicate Category Names Allowed
**Severity:** High  
**Type:** API / Data Integrity  
**Status:** Open  

API allows creating two categories with the same `name` — returns 201 for both.  
**Impact:** Data integrity — confused products, confused admins, broken slug generation (same slug for both)

---

### BUG-009 — Long Name (300 chars) Causes 500
**Severity:** High  
**Type:** API  
**Status:** Open  

No server-side max length validation on `name`. Sending 300-char string returns 500.  
**Impact:** Potential DoS attack vector / server stability risk  
**Fix:** Add max length validation (e.g. 255 chars) with proper 400 error response

---

### BUG-010 — Missing Fields in Form: description_ar, icon, synonyms
**Severity:** High  
**Type:** Feature Gap  
**Status:** Open  

API supports these fields but form has no inputs for them:
- `description_ar` — Arabic description
- `icon_url` — Category icon
- `image_url` — Category image/thumbnail  
- `synonyms` — Search synonyms
- `product_attributes` — Dynamic attributes schema

**Impact:** Admins cannot manage these fields through the UI

---

### BUG-011 — CREATE Response Shape Not Mapped
**Severity:** High  
**Type:** Integration  
**Status:** Open  

API returns `{ message: "...", category: {} }` for POST, but frontend adapter tries to read `.data`. React Query cache gets the wrapper object stored, not the actual category.

---

### BUG-012 — DELETE Non-existing Returns 400 Not 404
**Severity:** High  
**Type:** API  
**Status:** Open  

`DELETE /categories/99999` returns 400 instead of 404.  
REST standard requires 404 for non-existing resources.  
Frontend `ErrorState` component never distinguishes between "bad request" and "not found".

---

## 🟡 MEDIUM BUGS

---

### BUG-013 — Wrong Validation Message for Min-Length
**Severity:** Medium  
**Type:** UI / Validation  
**Status:** Open  

**Steps:** Enter "A" (1 char) in Category Name field and submit  
**Expected:** "Name must be at least 2 characters"  
**Actual:** "Name is required"  

**Root Cause:** Zod schema: `z.string().min(2, "Name is required")` — message is wrong  
**Fix:** Change to `z.string().min(2, "Name must be at least 2 characters")`

---

### BUG-014 — No View Detail Page for Categories
**Severity:** Medium  
**Type:** Feature Gap  
**Status:** Open  

Suppliers module has `/suppliers/[id]` detail view. Categories only has edit.  
The ⋮ menu shows only Edit + Delete — no View option.  
**Impact:** Cannot view full category data (especially `product_attributes`, `synonyms`) without editing

---

### BUG-015 — Whitespace-Only Name Accepted by Frontend
**Severity:** Medium  
**Type:** Validation  
**Status:** Open  

Entering "   " (spaces) passes the `min(2)` check and submits to API.  
**Fix:** Add `.trim()` or `.min(2).refine(v => v.trim().length >= 2)` in Zod schema

---

### BUG-016 — Parent Dropdown Silently Missing When Table Is Empty
**Severity:** Medium  
**Type:** UI  
**Status:** Open  

The `CategoryForm` only renders the Parent Category dropdown when `parentOptions.length > 0`. Because the table data is broken (BUG-001), parentOptions is always `[]`, so the dropdown never appears. This hides the parent assignment feature entirely.

---

### BUG-017 — No Image/Icon Upload UI
**Severity:** Medium  
**Type:** Feature Gap  
**Status:** Open  

The API supports `image_url` and `icon_url` (with file upload to `/uploads/categories/`). The create/edit form has no file upload or URL input for these fields.

---

## 🟢 LOW BUGS

---

### BUG-018 — No Status Filter in Categories Table
**Severity:** Low  
**Type:** UX  
**Status:** Open  

No way to filter categories by active/inactive status in the table.  
Suppliers module also lacks this — systemic UX gap.

---

### BUG-019 — Pagination Shows "0 / 1" Despite Data Existing
**Severity:** Low  
**Type:** UI  
**Status:** Open  

Pagination footer always shows `0–0 of 0` because `data?.meta` is undefined (BUG-001). Secondary effect of the core mapping bug.

---

### BUG-020 — Slug Not Exposed in UI
**Severity:** Low  
**Type:** Feature Gap  
**Status:** Open  

API auto-generates a `slug` field (e.g. "electronics-gadgets") which is important for SEO/routing. The slug is not shown anywhere in the dashboard. Admins cannot edit or view it.
