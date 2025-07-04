# Evallo Assessment

A full-stack project with separate `frontend` and `backend` directories, managed using a single root `package.json` for installation and development scripts.

## 📁 Project Structure

```
evallo-assessment/
├── backend/     # Node.js/Express
├── frontend/    # React/Vite
├── package.json # Root scripts and dev dependencies
```

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v19 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 📥 Clone the Repository

```bash
git clone https://github.com/Jayrajrodage/evallo.git
cd evallo
```

## 🚀 Installation

To install all dependencies for both `frontend` and `backend`:

```bash
npm install
```

> This will run:
>
> - `npm install` in the root
> - `npm install` in `./backend`
> - `npm install` in `./frontend`

## ⚙️ Setup Environment Variables (Frontend Only)

After installing dependencies, create a `.env` file in the `frontend` directory and add following value:

```bash
VITE_BACKEND_URL="http://localhost:5000"
```

## 🧪 Development

To start both frontend and backend in development mode:

```bash
npm run dev
```

This command runs:

- `npm run dev` inside `backend`
- `npm run dev` inside `frontend`

All run concurrently using the `concurrently` package.

## 📦 NPM Packages Used & Reasons

| Package                 | Location | Purpose                                                                                            |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `concurrently`          | Root     | To run multiple npm scripts (backend + frontend) in parallel.                                      |
| `node-json-db`          | Backend  | Easier than manually managing `fs` for JSON file reads/writes with deep structure                  |
| `hero-ui`               | Frontend  | Provides all required components for the assessment, including DateRangePicker, Select, and Table. |
| `@tanstack/react-query` | Frontend  | More powerful and scalable than `axios`+`useEffect`                      |

---

## 📬 Troubleshooting

If you run into issues:

- Make sure Node and npm are correctly installed.
- Try running `cd backend && npm install` and `cd frontend && npm install` manually to isolate issues.
- Ensure no processes are blocking default ports (like 5173 or 5000).

---
