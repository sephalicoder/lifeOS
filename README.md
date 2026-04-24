# ◈ LifeOS — React + Vite + Tailwind

> Your personal life OS built around **HRCM** (Health · Relationships · Career · Money)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Icons | Lucide React |
| Storage | localStorage (no backend needed) |
| Deploy | GitHub Pages via GitHub Actions |

---

## Project Structure

```
lifeos/
├── index.html
├── vite.config.js          ← Set base to your repo name
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-deploy on push to main
└── src/
    ├── main.jsx            ← Entry point
    ├── App.jsx             ← Routes
    ├── index.css           ← Tailwind + global styles
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── Modal.jsx
    │   └── ProgressBar.jsx
    ├── hooks/
    │   ├── useStore.js     ← All state + localStorage
    │   └── useToast.jsx    ← Toast + reminder system
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── DailySchedule.jsx
    │   ├── Notes.jsx
    │   ├── HRCMPage.jsx    ← Reused for all 4 pillars
    │   ├── Skills.jsx
    │   └── Mindset.jsx
    └── utils/
        └── data.js         ← Constants, localStorage helpers
```

---

## Run Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Deploy to GitHub Pages

### Step 1 — Update vite.config.js

Open `vite.config.js` and change `base` to your repo name:

```js
base: '/YOUR-REPO-NAME/',
```

If your repo is `lifeos`, it stays `/lifeos/`.

### Step 2 — Create GitHub repo & push

```bash
git init
git add .
git commit -m "Initial commit: LifeOS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages with Actions

1. Go to your repo → **Settings** → **Pages**
2. Under "Source", select **GitHub Actions**
3. Click **Save**

### Step 4 — Trigger deployment

The GitHub Action in `.github/workflows/deploy.yml` runs automatically on every push to `main`.

Check the **Actions** tab to watch it build and deploy.

### Step 5 — Your site is live

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Done. Every `git push` to `main` auto-deploys.

---

## Manual Build (optional)

```bash
npm run build     # outputs to dist/
npm run preview   # preview the built version locally
```

---

## Mantras Built In

- *"Success is about actions, not intentions"*
- *"If you believe it, you can do it"*
- *"Don't solve — Evolve"*
- *"Calm is a superpower"*
- *"Discipline is freedom"*

Reminders appear every 4 hours as toast notifications.

---

## Future Ideas

| Feature | How |
|---|---|
| Cloud sync | Firebase Firestore (free) |
| Auth | Firebase Auth |
| PWA / offline | Add `vite-plugin-pwa` |
| Charts | Add Recharts for HRCM trends |
| Calendar | FullCalendar React |
| Mobile app | Capacitor.js wraps Vite build |
