# FY Student Complaint Management System (SCMS)

Starter project scaffolded with Vite + React + Tailwind CSS.

Getting started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

Files of interest:

- [index.html](index.html)
- [src/App.jsx](src/App.jsx)
- [src/main.jsx](src/main.jsx)
- [src/index.css](src/index.css)
- [tailwind.config.cjs](tailwind.config.cjs)

## Before going live

1. **Firebase project.** Copy `.env.example` to `.env` and fill in your Firebase web app config.
2. **Deploy the security rules.** Paste `firestore.rules` and `storage.rules` into Firebase Console → Firestore/Storage → Rules, or deploy via the Firebase CLI.
3. **Log in as the built-in admin.** A default admin account is baked into the app (`DEFAULT_ADMIN_EMAIL`/`DEFAULT_ADMIN_PASSWORD` in `src/services/authService.js`) — just go to the login page and sign in with:
   - Email: `admin@scms.local`
   - Password: `Admin@12345`

   The account is created automatically on that first login attempt — no separate setup script needed. Change the password afterward (Settings → Change password) if this will be reachable by anyone other than you.
4. **Seed Departments and Faculties.** Log in as that admin and add at least one entry under Admin → Departments and Admin → Faculties *before* letting students register or submit complaints — those two lists populate the dropdowns on the registration and complaint forms (the form also ships with a built-in fallback list so registration isn't blocked before you get to this step).
