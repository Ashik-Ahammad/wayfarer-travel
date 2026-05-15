# ✈️ Wayfarer - Modern Travel & Booking Platform

<a href="https://wayfarer-one.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/🌍_Live_Preview-View_Website-36a3b5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Preview Button" />
</a>

Wayfarer is a premium, full-stack travel booking application curated for the modern explorer. Built with Next.js 16 (App Router), an independent Express.js backend, and MongoDB, it features a highly interactive glass-morphism UI, seamless scroll animations, and a secure decoupled authentication system.

---

## ✨ Key Features

* **⚡ Server-Side Rendering (SSR):** Optimized performance and SEO utilizing Next.js 16 Server Components.
* **🎨 Premium UI/UX:** Stunning "glass-morphism" design system built with HeroUI and Tailwind CSS v4.
* **🎬 Cinematic Animations:** Staggered scroll reveals, 3D carousels, and interactive micro-interactions powered by Framer Motion.
* **🔒 Decoupled JWT Authentication:** Highly secure session management using Better Auth with Remote JWKS verification.
* **🛡️ Role-Based Access Control (RBAC):** Next.js Middleware protects admin routes (e.g., `/add-destination`), ensuring only authorized users can mutate platform data.
* **📊 Dynamic User Dashboard:** Personalized profiles tracking travel statistics, total expenditures, and booking history.
* **📱 Fully Responsive:** Flawless experience across mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js (v16.2) (App Router, Server Components)
* **UI Library:** HeroUI (formerly NextUI)
* **Styling:** Tailwind CSS (v4)
* **Animations:** Framer Motion
* **Icons & Toasts:** react-icons, @gravity-ui/icons, react-hot-toast

### Backend & Database
* **Server:** Express.js
* **Database:** MongoDB (Native Node.js Driver)
* **Deployment Config:** Vercel Serverless Functions (`vercel.json` configured)

### Authentication & Security
* **Auth Provider:** Better Auth (with MongoDB Adapter)
* **JWT Verification:** `jose-cjs` (JSON Object Signing and Encryption)

---

## 🔐 How JWT Authentication Works in Wayfarer

Wayfarer utilizes a modern, decoupled architecture where the Frontend (Next.js) and Backend (Express.js) operate independently. To maintain strict security across origins, we implemented a robust JSON Web Token (JWT) & JWKS flow:

1.  **Token Generation:** When a user logs in via the Next.js frontend, Better Auth generates a secure session and issues a Bearer Token.
2.  **JWKS Endpoint:** The Next.js server exposes a JSON Web Key Set (JWKS) endpoint at `/api/auth/jwks` which contains the public keys used to verify tokens.
3.  **Authorized Requests:** Whenever the frontend makes a request to the Express backend (e.g., booking a trip or adding a destination), it attaches the Bearer token in the `Authorization` header.
4.  **Backend Verification:** * The Express server uses the `jose-cjs` library to create a Remote JWK Set (`createRemoteJWKSet`).
    * A custom `verifyToken` middleware intercepts the incoming request, fetches the public key from the Next.js JWKS endpoint, and dynamically verifies the JWT payload.
    * If valid, the request proceeds; if tampered with or expired, it returns a `403 Forbidden` or `401 Unauthorized`.

This ensures that the Express backend does not need to query the database to validate sessions—it simply cryptographically verifies the token, resulting in lightning-fast API responses.

---

## 🚀 Getting Started

Follow these steps to run the Wayfarer platform locally.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB URI (Local or Atlas)

### Clone the repository
```bash
git clone https://github.com/Ashik-Ahammad/wayfarer-travel/

<img width="1894" height="899" alt="image" src="https://github.com/user-attachments/assets/cc04a034-58e1-478d-811b-6bf2f3c56806" />
