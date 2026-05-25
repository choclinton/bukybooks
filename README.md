# BUKYBOOKS ✂️

**BUKYBOOKS** is a modern, full-stack web application designed to seamlessly connect hair stylists with clients. Built with vibrant aesthetics and a focus on user experience, it serves as a dual-sided marketplace. Clients can discover stylists, view their work, and book appointments, while stylists can manage their services, portfolios, and earnings all in one place.

*Note: This application was developed as a class project and includes a simulated (mop-up) payment system for demonstration purposes.*

---

## ✨ Features

### For Clients
* **Discover Stylists:** Browse through available stylists and view their specific expertise (e.g., braids, locs, coloring).
* **View Portfolios:** Look at images of services previously done by stylists.
* **Flexible Booking:** Book appointments for either **Salon** visits or **Home Services** (if the stylist offers it).
* **Appointment Tracking:** Keep track of upcoming and past appointments.
* **Simulated Payments:** Pay for appointments using a simulated Mobile Money/Orange Money gateway, which auto-generates digital receipts.

### For Stylists
* **Dashboard Management:** View incoming appointment requests and manage scheduling.
* **Service Customization:** Add, edit, and price the specific services you offer, and upload portfolio images.
* **Home Service Toggle:** Opt-in or opt-out of offering home services at any time.
* **Earnings Tracking:** View an aggregated ledger of all earnings and review payment receipts from clients.

---

## 🛠️ Technology Stack

* **Frontend Framework:** [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/) for lightning-fast development.
* **Routing:** [React Router](https://reactrouter.com/) for smooth, single-page application navigation.
* **Styling:** Custom, modern, vanilla CSS utilizing glassmorphism, fluid animations, and a rich, dark-mode-inspired aesthetic.
* **Backend & Database:** [Supabase](https://supabase.com/) 
  * PostgreSQL Database (Tables for Profiles, Appointments, Services, Receipts, etc.)
  * Supabase Authentication (Secure Email/Password auth handling user roles)
  * Supabase Storage (Image hosting for user avatars and service portfolios)
* **Deployment:** Pre-configured with a multi-stage `Dockerfile` and `nginx.conf` for easy deployment to platforms like Render, AWS, or DigitalOcean.

---

## 🚀 Getting Started (Local Development)

If you are downloading or cloning this project to run locally, follow these steps:

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* A [Supabase](https://supabase.com/) account (Free tier is perfectly fine)

### 2. Installation
Navigate into the project directory and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory of the project and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Database Setup
To set up the required database schema, roles, and storage buckets:
1. Go to your Supabase dashboard.
2. Navigate to the **SQL Editor**.
3. Open the `supabase_schema.sql` (or `FINAL_SQL_FIX.sql.md` if provided in the documentation artifacts) and run the entire script. This will generate all the necessary tables (`profiles`, `appointments`, `services`, `receipts`, etc.) and bypass Row Level Security for development.

### 5. Run the App
Start the Vite development server:
```bash
npm run dev
```
The application will usually be available at `http://localhost:5173` or `http://localhost:5174`.

---

## 🐳 Docker Deployment (Production)

This repository includes a `Dockerfile` and `nginx.conf` designed for production.

1. **Build the image:**
   ```bash
   docker build -t bukybooks-app .
   ```
2. **Run the container:**
   ```bash
   docker run -p 80:80 bukybooks-app
   ```
*(When deploying to a cloud provider like Render, simply select the Docker environment, connect your repository, and input your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in their dashboard).*

---

## 📄 License
This project was created for educational purposes as a class project. Feel free to fork, modify, and use it as a foundation for your own booking applications!
