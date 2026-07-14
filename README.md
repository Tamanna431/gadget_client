
A modern, full-stack e-commerce platform for smart gadgets built with **Next.js**, **TypeScript**, and **MongoDB**. Features secure authentication, real-time data visualization, and a responsive design.

---

## 📸 Live Demo

**Frontend:**   
**Backend API:** 

**Demo Credentials:**
- Email: `demo@gadgetverse.com`
- Password: `demo123`

---

## ✨ Features

###  Authentication & Authorization
- ✅ Email & Password authentication
- ✅ Google OAuth integration
- ✅ Secure session management with BetterAuth
- ✅ Protected routes (Add/Manage items)
- ✅ JWT-based API security

### 🛍️ E-Commerce Functionality
- ✅ Browse gadgets with advanced filtering (Category, Price Range)
- ✅ Search functionality
- ✅ Sorting options (Price, Rating, Date)
- ✅ Pagination support
- ✅ Detailed product pages with specifications
- ✅ Add to cart functionality
- ✅ User-specific gadget management

### 📊 Data Visualization
- ✅ Interactive sales trend charts (Recharts)
- ✅ Category distribution pie charts
- ✅ Real-time statistics dashboard

###  UI/UX
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Modern glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Skeleton loaders for better UX
- ✅ Consistent color scheme (Primary: Blue, Secondary: Green)
- ✅ Professional card-based layout

### 🚀 Performance
- ✅ Server-side rendering (Next.js)
- ✅ Optimized images with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ MongoDB indexing for fast queries

---
 🚀 Future Enhancements
 ✅Shopping cart functionality
 ✅Payment gateway integration
 ✅Order tracking
 ✅User reviews and ratings
 ✅Wishlist feature
 ✅Email notifications
 ✅Admin dashboard
 ✅Product recommendations
 ✅Multi-language support


## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Authentication:** BetterAuth
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **Authentication:** BetterAuth with MongoDB adapter
- **Validation:** Zod (optional)

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Deployment:** Vercel
- **Environment:** dotenv

---

## 📁 Project Structure
gadgetverse/
├── frontend/ # Next.js application
│ ├── src/
│ │ ├── app/ # App router pages
│ │ │ ├── api/ # API routes
│ │ │ ├── gadgets/ # Gadget pages
│ │ │ ├── items/ # Protected routes
│ │ │ ├── login/ # Auth pages
│ │ │ └── page.tsx # Home page
│ │ ├── components/ # Reusable components
│ │ │ ├── GadgetCard.tsx
│ │ │ ├── Navbar.tsx
│ │ │ └── Footer.tsx
│ │ ├── context/ # React context
│ │ │ └── AuthContext.tsx
│ │ ├── lib/ # Utilities
│ │ │ ├── axios.ts
│ │ │ └── auth-client.ts
│ │ └── types/ # TypeScript types
│ ├── public/ # Static assets
│ ├── tailwind.config.ts
│ └── package.json
│
├── backend/ # Express.js application
│ ├── src/
│ │ ├── config/ # Database config
│ │ │ └── db.ts
│ │ ├── controllers/ # Route controllers
│ │ │ ├── authController.ts
│ │ │ └── gadgetController.ts
│ │ ├── middlewares/ # Express middlewares
│ │ │ └── auth.ts
│ │ ├── models/ # Mongoose models
│ │ │ ├── User.ts
│ │ │ └── Gadget.ts
│ │ ├── routes/ # API routes
│ │ │ ├── authRoutes.ts
│ │ │ └── gadgetRoutes.ts
│ │ ├── lib/ # BetterAuth config
│ │ │ ── auth.ts
│ │ ├── utils/ # Utility functions
│ │ │ └── seed.ts
│ │ ── server.ts # Entry point
│ ├── .env # Environment variables
│ └── package.json
│
└── README.md


---

##  Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gadgetverse.git
cd gadgetverse

👨‍💻 Author
Name:Tamanna Akter 
Email:tamannashuchi06@gmail.com

Made with ❤️ using Next.js, TypeScript, and MongoDB