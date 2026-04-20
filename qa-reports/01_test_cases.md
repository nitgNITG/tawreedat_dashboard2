# 📋 Test Cases — Categories Module
**Project:** Tawreedat Admin Dashboard  
**Module:** Categories  
**Prepared by:** QA Engineer (Claude)  
**Date:** 2026-04-20  
**Total Test Cases:** 52

---

## 🗂️ Module Overview (from Code + API Analysis)

| Layer | Finding |
|---|---|
| Frontend route | `/categories`, `/categories/new`, `/categories/[id]/edit` |
| API base | `https://adminapis-dev.nitg-eg.com/api/v1/categories` |
| Form fields (UI) | name (EN), name (AR), description, parent, status |
| API fields | id, name, slug, name_ar, description, description_ar, image_url, icon_url, parent_id, is_active, synonyms, product_attributes, sort_id, created_at, updated_at, deleted_at |
| Auth | Bearer token from localStorage |

---

## ✅ CREATE — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-C-001 | Submit empty form | Negative | 1. Go to /categories/new 2. Click "Create Category" | Error: "Name is required" shown on name field | High |
| TC-C-002 | Name with 1 character | Negative | 1. Enter "A" in name 2. Submit | Error: "Name must be at least 2 characters" | High |
| TC-C-003 | Valid creation — name only | Positive | 1. Enter "Electronics" 2. Submit | 201 response, redirect to list, category appears in table | High |
| TC-C-004 | Valid creation — all fields | Positive | 1. Fill name, name_ar, description, parent, status 2. Submit | All fields saved correctly and reflected in table | High |
| TC-C-005 | Arabic name only (no EN name) | Negative | 1. Leave EN name empty, fill AR name 2. Submit | Error on name (EN) field | High |
| TC-C-006 | Name exactly 2 characters | Edge | 1. Enter "AB" in name 2. Submit | Should succeed — 2 chars is minimum | Medium |
| TC-C-007 | Very long name (300 chars) | Edge | 1. Enter 300-char string 2. Submit | Error: max length exceeded (client or server) | High |
| TC-C-008 | XSS in name field | Security | 1. Enter `<script>alert("xss")</script>` 2. Submit | Input sanitized / rejected. Must NOT store raw HTML | Critical |
| TC-C-009 | SQL injection in name | Security | 1. Enter `'; DROP TABLE categories; --` 2. Submit | Input rejected or safely escaped | Critical |
| TC-C-010 | Duplicate name | Negative | 1. Create "Electronics" 2. Create "Electronics" again | Error: duplicate name not allowed | High |
| TC-C-011 | Create with parent category | Positive | 1. Select existing category as parent 2. Submit | Category saved with correct parent_id | High |
| TC-C-012 | Create with status = Inactive | Positive | 1. Set status to Inactive 2. Submit | Category created with is_active = false | Medium |
| TC-C-013 | Name with special characters | Edge | 1. Enter "Toys & Games!" 2. Submit | Should accept or reject consistently. Slug generated correctly | Medium |
| TC-C-014 | Name with only spaces | Negative | 1. Enter "   " (spaces) 2. Submit | Error: name cannot be whitespace only | Medium |
| TC-C-015 | Name with leading/trailing spaces | Edge | 1. Enter " Electronics " 2. Submit | Name saved trimmed OR error shown | Low |

---

## ✏️ UPDATE — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-U-001 | Update all fields | Positive | 1. Go to edit page 2. Change name, name_ar, description 3. Submit | 200 response, all fields updated, reflected in table | High |
| TC-U-002 | Partial update — name only | Positive | 1. Edit only name 2. Submit | Only name updated, other fields unchanged | High |
| TC-U-003 | Clear required name field | Negative | 1. Open edit 2. Clear name field 3. Submit | Error: "Name is required" | High |
| TC-U-004 | Update with 1-char name | Negative | 1. Open edit 2. Enter "A" in name 3. Submit | Error: min 2 characters | High |
| TC-U-005 | Change parent to another category | Positive | 1. Open edit 2. Select new parent 3. Submit | parent_id updated correctly | Medium |
| TC-U-006 | Remove parent (set to None) | Positive | 1. Open edit 2. Set parent to None 3. Submit | parent_id set to null | Medium |
| TC-U-007 | Set category as its own parent | Negative | 1. Open edit 2. Select itself as parent 3. Submit | Error: circular reference not allowed | High |
| TC-U-008 | Update with long name (300 chars) | Edge | 1. Open edit 2. Enter 300-char name 3. Submit | Error: max length validation | High |
| TC-U-009 | Toggle status active → inactive | Positive | 1. Open edit 2. Change status 3. Submit | is_active toggled, badge updated in list | Medium |
| TC-U-010 | Update non-existing category (direct URL) | Negative | 1. Navigate to /categories/99999/edit | Error state shown: "Category not found" | Medium |

---

## 🗑️ DELETE — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-D-001 | Delete existing category | Positive | 1. Click ⋮ → Delete 2. Confirm in modal | 200/204, category removed from table, success toast | High |
| TC-D-002 | Cancel delete from modal | Positive | 1. Click ⋮ → Delete 2. Click Cancel | Modal closes, category NOT deleted | High |
| TC-D-003 | Delete category with child categories | Negative | 1. Delete a category that has sub-categories | Error or cascade warning shown | High |
| TC-D-004 | Delete category linked to products | Negative | 1. Delete a category assigned to products | Error: "Cannot delete — products are linked" | High |
| TC-D-005 | Delete non-existing ID (API) | Negative | 1. Send DELETE to /categories/99999 | 404 Not Found response | Medium |

---

## 📊 VIEW / TABLE — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-V-001 | Empty state message | UI | 1. Open /categories with no data | "No categories yet. Create your first category." | Medium |
| TC-V-002 | Table columns present | UI | 1. Open /categories with data | Columns: Name (EN), Name (AR), Parent, Description, Status, Created | Medium |
| TC-V-003 | Data rendered correctly | Positive | 1. Open /categories | All fields displayed matching API response | High |
| TC-V-004 | Status badge colors | UI | 1. Check active vs inactive rows | Active = green badge, Inactive = red badge | Low |
| TC-V-005 | Arabic text direction | UI | 1. Check Name (AR) column | Arabic text has `dir="rtl"` applied | Medium |
| TC-V-006 | Actions dropdown available | UI | 1. Click ⋮ for any row | Dropdown shows: Edit, Delete | Medium |
| TC-V-007 | Loading state | UI | 1. Navigate to /categories on slow network | Spinner shown while fetching | Medium |
| TC-V-008 | Error state + retry | UI | 1. Kill API 2. Open /categories | Error message + "Try again" button shown | Medium |
| TC-V-009 | No "View" action present | UI/Bug | 1. Open ⋮ menu | Only Edit + Delete — no View option | Low |

---

## 🔢 PAGINATION — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-P-001 | Rows per page = 10 (default) | Positive | 1. Open /categories with >10 items | Only 10 rows shown, pagination controls visible | High |
| TC-P-002 | Change rows per page to 20 | Positive | 1. Change rows dropdown to 20 | Up to 20 rows shown, page resets to 1 | Medium |
| TC-P-003 | Next page navigation | Positive | 1. Click → next page | Next page data loaded | High |
| TC-P-004 | Previous page navigation | Positive | 1. Go to page 2, click ← | Returns to page 1 | Medium |
| TC-P-005 | First/Last page buttons | Positive | 1. Use ⏮ and ⏭ buttons | Jumps to first/last page | Low |
| TC-P-006 | Page count display | UI | 1. Check "X / Y" display | Correct current / total pages shown | Low |

---

## 🔍 SEARCH — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-S-001 | Search by EN name | Positive | 1. Type "Electronics" in search 2. Click Search | Only matching results shown | High |
| TC-S-002 | Search by AR name | Positive | 1. Type "إلكترونيات" 2. Click Search | Arabic name search works | High |
| TC-S-003 | Partial match search | Positive | 1. Type "Elec" 2. Click Search | Categories containing "Elec" shown | Medium |
| TC-S-004 | Search with no results | Negative | 1. Type "XXXXXXNOTEXIST" 2. Search | Empty state shown, not an error | Medium |
| TC-S-005 | Search via Enter key | UI | 1. Type in search box 2. Press Enter | Search executes (same as clicking Search) | Low |
| TC-S-006 | Clear search resets list | UI | 1. Search something 2. Clear input 3. Search again | Full list restored | Medium |

---

## 🔃 SORTING — Test Cases

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SO-001 | Sort by Name (EN) ascending | Positive | 1. Click "Name (EN)" column header | Results sorted A→Z | High |
| TC-SO-002 | Sort by Name (EN) descending | Positive | 1. Click "Name (EN)" again | Results sorted Z→A, indicator flips | High |
| TC-SO-003 | Sort indicator visible | UI | 1. Click a sortable column | Arrow ↑ or ↓ appears on active column | Low |
| TC-SO-004 | Sort stability | Edge | 1. Sort by name 2. Multiple items with same name | Consistent ordering maintained | Low |

---

## 🔺 EDGE CASES

| ID | Title | Type | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-E-001 | API completely down | Edge | 1. Kill API 2. Open categories | Error state with retry shown — no crash | High |
| TC-E-002 | Network timeout | Edge | 1. Throttle network 2. Load page | Loading spinner, then error after timeout | Medium |
| TC-E-003 | Very long description | Edge | 1. Enter 1000-char description 2. Submit | Accepted or rejected with clear message | Medium |
| TC-E-004 | Emoji in name field | Edge | 1. Enter "📦 Packages" 2. Submit | Accepted and displayed correctly | Low |
| TC-E-005 | Concurrent edits | Edge | 1. Open same category in 2 tabs 2. Edit in both | Last-write-wins OR conflict error shown | Medium |
