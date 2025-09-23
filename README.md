# TutorApp - On-Demand Tutoring Platform

TutorApp is a comprehensive tutoring platform that connects students with qualified local tutors, similar to how Uber connects riders with drivers. Students can find, book, and pay for tutoring sessions while tutors can register, set their rates, and manage their availability.

## 🚀 Features

### For Students
- **Browse & Search Tutors**: Find tutors by subject, university, rating, and price
- **Instant Booking**: Book sessions immediately or schedule for later
- **Secure Payments**: Integrated payment processing with Stripe
- **Reviews & Ratings**: Leave reviews and see tutor ratings
- **Real-time Messaging**: Chat with tutors before and during sessions
- **Session Dashboard**: Track upcoming and past sessions

### For Tutors
- **Profile Management**: Create detailed profiles with subjects, rates, and availability
- **Verification System**: Get verified to build trust with students
- **Earnings Tracking**: Monitor earnings and session history
- **Flexible Scheduling**: Set availability and accept/decline bookings
- **Student Communication**: Message students and manage session details

### Platform Features
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live notifications and status updates
- **Advanced Search**: Filter by subject, price, rating, and availability
- **Secure Authentication**: User registration and login system
- **Payment Processing**: Secure payment handling with refund support

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Real-time**: Socket.io
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
tutorapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── become-tutor/      # Tutor registration page
│   │   ├── dashboard/         # User dashboard
│   │   ├── find-tutors/       # Tutor search page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation header
│   │   └── TutorCard.tsx      # Tutor display card
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── .github/
    └── copilot-instructions.md # Development guidelines
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tutorapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/tutorapp"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The app uses a comprehensive database schema with the following main entities:

- **Users**: Core user information for both students and tutors
- **StudentProfile**: Extended student information
- **TutorProfile**: Tutor-specific data including subjects, rates, and verification status
- **Bookings**: Session bookings with status tracking
- **Reviews**: Rating and review system
- **Messages**: Real-time messaging between users
- **Payments**: Payment processing and history

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Development Commands

```bash
# Database operations
npx prisma migrate dev          # Create and apply migrations
npx prisma generate            # Generate Prisma client
npx prisma studio             # Open database browser
npx prisma db seed            # Seed database with sample data

# Development
npm run dev                   # Start dev server with hot reload
npm run build                 # Build for production
npm run type-check            # Check TypeScript types
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Set up database**
   - Use Vercel Postgres or external PostgreSQL provider
   - Run migrations in production

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic user registration and authentication
- [x] Tutor profile creation and search
- [x] Simple booking system
- [x] Review and rating system

### Phase 2 (Next)
- [ ] Real-time messaging system
- [ ] Payment integration with Stripe
- [ ] Advanced search and filtering
- [ ] Mobile app development

### Phase 3 (Future)
- [ ] Video calling integration
- [ ] AI-powered tutor matching
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@tutorapp.com or join our Discord server.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [Stripe](https://stripe.com/) for payment processing
