# Firantastoree - Modern Web Store with Midtrans Payment

Website toko online modern dengan integrasi pembayaran Midtrans, menggunakan Firebase untuk hosting & database, dan Vercel untuk backend API (GRATIS).

## ✨ Features

- 🔐 **Firebase Authentication** - Login/Signup dengan email & password
- 💳 **Midtrans Payment Integration** - Pembayaran online dengan berbagai metode
- 🛒 **Product Management** - Dashboard untuk mengelola produk & template
- � **Admin Panel** - Manajemen pesanan, template, analytics & reports
- 👥 **Customer Dashboard** - Dashboard pelanggan untuk order history & rating
- 📱 **Responsive Design** - UI modern dengan Tailwind CSS & shadcn/ui
- 🔥 **Firebase Hosting** - Hosting cepat & gratis
- ☁️ **Firestore Database** - Database NoSQL real-time
- 🚀 **Vercel Backend** - API serverless gratis untuk payment processing

## 📊 Admin Panel Features

- ✅ **Dashboard** - Overview statistik penjualan & revenue
- ✅ **Order Management** - Lihat, filter, update status, hapus pesanan
- ✅ **Template Management** - Edit harga, kategori, delete template
- ✅ **Analytics** - Revenue reports, top products, monthly trends
- ✅ **Settings** - Change password, admin preferences
- 🔐 **Role-based Access** - Admin & SuperAdmin roles

## 🏗️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **React Router** - Client-side routing
- **Firebase Auth** - Authentication

### Backend
- **Vercel Functions** - Serverless API (FREE)
- **Express.js** - Web framework
- **Firebase Admin SDK** - Database & auth
- **Midtrans SDK** - Payment gateway

### Database & Hosting
- **Firestore** - NoSQL database
- **Firebase Hosting** - Static hosting
- **Firebase Auth** - User authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- Firebase CLI
- Vercel CLI

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd firantastoree-main

# Install dependencies
npm install
```

### 2. Setup Firebase
```bash
# Login to Firebase
npx firebase login

# Initialize Firebase (hosting, firestore, auth)
npx firebase init

# Deploy Firebase rules & hosting
npx firebase deploy
```

### 3. Setup Vercel Backend
```bash
# Install Vercel CLI
npm install -g vercel
vercel login

# Deploy backend
cd backend
vercel --prod

# Copy the Vercel URL (e.g., https://firantastoree-backend.vercel.app)
```

### 4. Configure Environment
Edit `.env.local`:
```env
```

### 5. Set Vercel Environment Variables
```bash
# Set environment variables in Vercel dashboard or via CLI
vercel env add MIDTRANS_SERVER_KEY
vercel env add MIDTRANS_CLIENT_KEY
vercel env add FIREBASE_SERVICE_ACCOUNT
```

### 6. Configure Midtrans Webhook
1. Login to [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Go to Settings > Configuration
3. Set Payment Notification URL: `https://your-vercel-url.vercel.app/api/midtrans/webhook`

### 7. Run Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

## 📁 Project Structure

```
firantastoree-main/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities & services
│   ├── context/            # React context providers
│   └── hooks/              # Custom React hooks
├── backend/                # Vercel serverless functions
│   ├── api/
│   │   └── index.ts        # Main API handler
│   └── vercel.json         # Vercel configuration
├── public/                 # Static assets
├── functions/              # Legacy Firebase functions (not used)
└── firebase.json           # Firebase configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Firebase
npx firebase deploy      # Deploy to Firebase
npx firebase serve       # Serve locally

# Vercel
vercel                   # Deploy backend to Vercel
vercel --prod           # Production deployment
```

## 💰 Cost (Completely FREE)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Firebase Hosting** | Spark | $0 |
| **Firestore** | Spark | $0 |
| **Firebase Auth** | Spark | $0 |
| **Vercel Functions** | Hobby | $0 |
| **Midtrans** | Sandbox | $0 |
| **Total** | - | **$0** 🎉 |

## 🔐 Environment Variables

### Frontend (.env.local)
```env
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
VITE_MIDTRANS_SERVER_KEY=your_midtrans_server_key
VITE_MIDTRANS_MERCHANT_ID=your_midtrans_merchant_id
VITE_BACKEND_URL=https://your-vercel-backend-url.vercel.app
```

### Backend (Vercel Environment Variables)
```env
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/midtrans/create-token` | Create payment token |
| POST | `/api/midtrans/webhook` | Handle payment notifications |
| GET | `/api/midtrans/status/:orderId` | Get transaction status |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run E2E tests
npx playwright test

# Run E2E tests with UI
npx playwright test --ui
```

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
npx firebase deploy --only hosting
```

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment guide.

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Backend API](./backend/README.md)
- [Midtrans Setup](./MIDTRANS_SETUP.md)
- [Firebase Setup](./BACKEND_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Midtrans](https://midtrans.com) - Payment gateway
- [Firebase](https://firebase.google.com) - Backend services
- [Vercel](https://vercel.com) - Serverless platform
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
