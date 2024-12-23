# QFinWallet - Digital Finance Management System

## Overview
QFinWallet is a comprehensive digital wallet solution for secure money transfers and transaction management, built with React frontend and Node.js backend. The frontend is served directly from the backend after building.

## Core Features
- 🔐 Secure User Authentication with OTP
- 💰 Digital Wallet Management
- 💳 Stripe Payment Integration
- 💸 User-to-User Transfers
- 📊 Transaction History & Analytics
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack
- Frontend: React.js, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB
- Payment: Stripe API
- Auth: JWT + OTP
- Email: NodeMailer

## Prerequisites
```bash
Node.js >= 14.0.0
Yarn
MongoDB
Stripe Account
Email Service Account
```

## Environment Setup

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/harbdhulquadri/qfinwallet.git
cd qfinwallet
```

2. Install backend dependencies:
```bash
yarn install
```

3. Install frontend dependencies:
```bash
cd frontend
yarn install
cd ..
```

4. Build frontend:
```bash
cd frontend
yarn build
cd ..
```

5. Start the server:
```bash
# Development mode
yarn dev

# Production mode
yarn start
```

The app will be available at http://localhost:5000

## Development Workflow

1. For frontend development:
```bash
cd frontend
yarn start
```
This runs the frontend on http://localhost:3000 with hot reloading.

2. For backend development:
```bash
# In root directory
yarn dev
```

3. Before deployment:
```bash
cd frontend
yarn build
cd ..
yarn start
```

## API Endpoints

### Authentication
- POST `/api/wallet/user/register` - Register new user
- POST `/api/wallet/user/verifyOTP` - Verify OTP code
- POST `/api/wallet/user/login` - User login
- GET `/api/wallet/user/profile` - Get user profile

### Transactions
- POST `/api/wallet/transaction/transfer` - Transfer funds
- POST `/api/wallet/transaction/deposit` - Deposit funds
- GET `/api/wallet/transactions` - Transaction history

## Project Structure
```
qfinwallet/
├── frontend/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── src/                    # Backend code
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── package.json
└── server.js
```

## Production Deployment

1. Set environment variables
2. Build frontend:
```bash
cd frontend
yarn build
cd ..
```
3. Start production server:
```bash
yarn start
```

## Common Issues & Solutions

1. Frontend not loading
- Ensure frontend is built: `cd frontend && yarn build`
- Check if backend is serving from correct build path

2. API Connection Issues
- Verify `.env` configurations
- Check if backend is running
- Confirm API URLs are correct

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create Pull Request

## License
MIT License - See [LICENSE](LICENSE.md)

