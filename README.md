# QFinWallet - Digital Finance Management System

## Overview
QFinWallet is a comprehensive digital wallet solution that enables secure money transfers, deposits, and transaction management. Built with the MERN stack and integrated with Stripe for payment processing.

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
MongoDB
Stripe Account
Email Service Account
```

## Environment Setup

### Backend (.env)
```env
PORT=5000
mongoDbURl=your_mongodb_url
dbName=your_database_name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Quick Start

1. Clone & Setup
```bash
git clone https://github.com/yourusername/qfinwallet.git
cd qfinwallet
```

2. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

3. Start Development Servers
```bash
# Backend (root directory)
npm run dev

# Frontend (frontend directory)
npm start
```

## API Documentation

### Authentication
- POST `/api/wallet/user/register` - Register
- POST `/api/wallet/user/verifyOTP` - Verify OTP
- POST `/api/wallet/user/login` - Login
- GET `/api/wallet/user/profile` - Get Profile

### Transactions
- POST `/api/wallet/transaction/transfer` - Transfer Money
- POST `/api/wallet/transaction/create-checkout` - Create Deposit
- GET `/api/wallet/transactions` - Get History
- GET `/api/wallet/transaction/:id` - Get Transaction

## Stripe Integration

1. Set up Stripe webhook:
```bash
stripe listen --forward-to localhost:5000/api/wallet/transaction/webhook
```

2. Configure success/failure URLs in frontend:
```javascript
success_url: `${window.location.origin}/payment/success`
cancel_url: `${window.location.origin}/dashboard`
```

## Security Features
- JWT Authentication
- OTP Verification
- Request Rate Limiting
- Input Validation
- XSS Protection
- CORS Configuration

## Folder Structure
```
qfinwallet/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   └── router/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── database/
```

## Production Deployment

1. Build Frontend
```bash
cd frontend
npm run build
```

2. Set Environment Variables
- Configure production URLs
- Set up MongoDB connection
- Configure Stripe webhooks

3. Deploy
- Host backend on service like Heroku
- Deploy frontend build to static hosting
- Set up SSL certificate

## Common Issues

1. Payment Verification
- Ensure webhook is properly configured
- Check transaction logs
- Verify Stripe keys

2. Transaction Failures
- Check MongoDB connection
- Verify user balance
- Review transaction logs

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Support
- GitHub Issues
- Email: support@qfinwallet.com
- Documentation: [Wiki](docs/wiki.md)

## License
MIT License - See [LICENSE](LICENSE.md)

