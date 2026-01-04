# 🚀 CryptoJournal - Premium Crypto Trading Journal

A high-performance, professional-grade full-stack web application for tracking and analyzing cryptocurrency trades. Built with Next.js 14, featuring a stunning dark "Cyberpunk Financial" design with glassmorphism effects and smooth animations.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 Authentication System
- **JWT-based authentication** with secure HTTP-only cookies
- Beautiful login and registration pages with glass-card design
- Client and server-side validation using Zod
- Secure password hashing with bcrypt
- Demo account: `demo@crypto.com` / `demo123`

### 📊 Dashboard
- **Real-time statistics** displaying:
  - Total Trades
  - Win Rate
  - Net Profit
  - Average P/L per trade
- Animated stats cards with smooth fade-in effects
- Professional user profile dropdown
- Responsive design for all screen sizes

### 💼 Trading Log (CRUD Operations)
- **Full CRUD functionality** for trades
- Add, Edit, and Delete trades with validation
- Real-time search and filter by coin symbol
- Beautiful modal-based forms
- Trade information includes:
  - Coin symbol
  - Trade type (Long/Short)
  - Entry and exit prices
  - Quantity and profit/loss
  - Status tracking (Open/Closed/Cancelled)
  - Trade notes

### 🎨 Premium Design System
- **Cyberpunk Financial Theme**
  - Deep slate/zinc backgrounds (`bg-zinc-950`)
  - Electric blue and purple neon accents
  - Glassmorphism effects with blur and transparency
  - Subtle background grid pattern
  - Gradient mesh effects on buttons
- **Smooth Animations**
  - Framer Motion for page transitions
  - Fade-in and slide-up effects
  - Glow effects on interactive elements
  - Smooth hover states
- **Typography**
  - Inter font for crisp, professional text
  - Gradient text effects for headings

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Validation:** Zod

### Backend
- **API Routes:** Next.js API Routes (serverless functions)
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Database:** In-memory mock database (can be easily replaced with MongoDB)

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd company
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and set your JWT secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
company/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # Authentication endpoints
│   │   └── trades/           # Trading CRUD endpoints
│   ├── dashboard/            # Dashboard page (protected)
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── globals.css           # Global styles & design system
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── AuthForm.tsx          # Login/Register form
│   ├── DashboardHeader.tsx   # Dashboard header with user menu
│   ├── StatsCard.tsx         # Animated statistics card
│   ├── TradeModal.tsx        # Add/Edit trade modal
│   └── TradeTable.tsx        # Trading log table
├── lib/                      # Utility functions
│   ├── auth.ts               # Authentication helpers
│   ├── db.ts                 # Database interface (mock)
│   ├── jwt.ts                # JWT token management
│   └── validations.ts        # Zod schemas
├── types/                    # TypeScript type definitions
│   └── index.ts              # Shared types
└── package.json              # Dependencies
```

## 🎯 Key Implementation Details

### Authentication Flow
1. User submits credentials via `AuthForm` component
2. Form data validated using Zod schemas
3. API route handles authentication logic
4. JWT token generated and stored in HTTP-only cookie
5. Protected routes check for valid token via middleware
6. User redirected to dashboard on successful auth

### Data Flow
1. Dashboard fetches initial data via server components
2. Client components manage local state for real-time updates
3. CRUD operations trigger API calls
4. Optimistic UI updates for better UX
5. Data refreshed after mutations

### Design System
- Custom Tailwind utility classes (`.glass-card`, `.glow-button`)
- Consistent color palette using CSS variables
- Responsive breakpoints for mobile-first design
- Smooth transitions and animations throughout

## 📈 Scalability Strategy

### Frontend Scalability

**Current Architecture:**
- Implemented component separation between "smart" container components (`DashboardClient`) and "dumb" presentational components (`StatsCard`, `TradeTable`)
- This architecture isolates business logic and makes components reusable

**Production Scaling:**
- **State Management:** Implement **React Query (TanStack Query)** to handle server state, caching, and optimistic UI updates
  - Reduces server load through intelligent caching
  - Automatic background refetching
  - Optimistic updates for better UX
  - Built-in retry logic and error handling

- **Code Splitting:** Already implemented via Next.js App Router
  - Automatic route-based code splitting
  - Dynamic imports for heavy components
  - Reduced initial bundle size

- **Performance Optimization:**
  - Implement virtual scrolling for large trade lists
  - Image optimization using Next.js Image component
  - Lazy loading for dashboard widgets
  - Web Workers for heavy computations

### Backend Scalability

**Current Implementation:**
- Next.js API Routes (serverless functions)
- In-memory mock database for development

**Migration Path:**

1. **Microservices Architecture:**
   - Extract API routes into standalone services
   - Options: Node.js/Express, Python FastAPI, or Go
   - Benefits: Independent scaling, technology flexibility, better resource utilization

2. **Service Separation:**
   ```
   ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
   │   Frontend  │────▶│ API Gateway  │────▶│   Auth      │
   │  (Next.js)  │     │              │     │  Service    │
   └─────────────┘     └──────────────┘     └─────────────┘
                              │
                              ├───────────▶ ┌─────────────┐
                              │            │   Trades    │
                              │            │  Service    │
                              │            └─────────────┘
                              │
                              └───────────▶ ┌─────────────┐
                                           │  Analytics  │
                                           │  Service    │
                                           └─────────────┘
   ```

3. **API Gateway:**
   - Implement Kong, AWS API Gateway, or custom gateway
   - Handle authentication, rate limiting, and request routing
   - Load balancing across service instances

### Database Scalability

**Current Setup:**
- In-memory storage with Mongoose-style interface
- Easy to swap with real database

**Production Database Options:**

1. **MongoDB (NoSQL):**
   - **Pros:** Flexible schema, horizontal scaling, good for document storage
   - **Use Case:** Ideal for trade journals with varying data structures
   - **Scaling:** Sharding, replica sets, Atlas auto-scaling

2. **PostgreSQL (SQL):**
   - **Pros:** ACID compliance, complex queries, strong consistency
   - **Use Case:** When complex relational data emerges (e.g., social trading features)
   - **Scaling:** Read replicas, connection pooling, partitioning

3. **Hybrid Approach:**
   - PostgreSQL for transactional data (users, trades)
   - Redis for caching and real-time features
   - S3/Object Storage for trade attachments

**Migration Strategy:**
```typescript
// Current abstraction allows easy database swap
export const db = {
  users: { /* CRUD methods */ },
  trades: { /* CRUD methods */ }
}

// Simply replace implementation:
// From: In-memory Map
// To: Mongoose models, Prisma, or any ORM
```

### Caching Strategy

**Implement Multi-Layer Caching:**

1. **CDN Layer (Cloudflare/CloudFront):**
   - Cache static assets
   - Edge caching for API responses

2. **Application Cache (Redis):**
   ```typescript
   // Cache frequently accessed data
   - User sessions
   - Dashboard statistics
   - Trade summaries
   ```

3. **Client Cache (React Query):**
   ```typescript
   // Automatic caching with React Query
   const { data } = useQuery('trades', fetchTrades, {
     staleTime: 5 * 60 * 1000, // 5 minutes
     cacheTime: 10 * 60 * 1000  // 10 minutes
   })
   ```

### Real-Time Features (Future Enhancement)

**For Live Trade Updates:**
- **WebSockets:** Socket.io or native WebSocket API
- **Server-Sent Events (SSE):** For one-way server-to-client updates
- **Pusher/Ably:** Managed real-time infrastructure

### Monitoring & Observability

**Production Requirements:**

1. **Application Performance Monitoring (APM):**
   - Sentry for error tracking
   - DataDog or New Relic for performance monitoring
   - Custom metrics for business KPIs

2. **Logging:**
   - Structured logging (Winston, Pino)
   - Centralized log aggregation (ELK Stack, CloudWatch)

3. **Health Checks:**
   ```typescript
   // API health endpoint
   GET /api/health
   Response: {
     status: 'healthy',
     database: 'connected',
     cache: 'connected',
     version: '1.0.0'
   }
   ```

### Infrastructure Scaling

**Deployment Options:**

1. **Vercel (Recommended for Next.js):**
   - Zero-config deployment
   - Automatic scaling
   - Edge network
   - Serverless functions

2. **Containerized (Docker + Kubernetes):**
   ```yaml
   # Horizontal Pod Autoscaling
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   spec:
     minReplicas: 3
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target: 70%
   ```

3. **AWS Architecture:**
   ```
   ┌──────────┐
   │CloudFront│ (CDN)
   └────┬─────┘
        │
   ┌────▼─────┐
   │   ALB    │ (Load Balancer)
   └────┬─────┘
        │
   ┌────▼─────┐
   │   ECS    │ (Container Service)
   │ Auto-scale│
   └────┬─────┘
        │
   ┌────▼─────┬────────┬──────────┐
   │   RDS    │ Redis  │    S3    │
   │(Database)│(Cache) │(Storage) │
   └──────────┴────────┴──────────┘
   ```

### Security Scaling

**As Application Grows:**

1. **Rate Limiting:**
   ```typescript
   // Implement per-user/IP rate limits
   - API: 100 requests/minute
   - Auth: 5 login attempts/5 minutes
   ```

2. **DDoS Protection:**
   - Cloudflare or AWS Shield
   - Request validation middleware

3. **Data Encryption:**
   - At-rest: Database encryption
   - In-transit: HTTPS/TLS 1.3
   - Sensitive fields: Field-level encryption

## 🎨 Design Highlights

### Glassmorphism Effects
- Frosted glass appearance with `backdrop-blur`
- Semi-transparent backgrounds
- Subtle borders with `border-white/10`

### Gradient System
- Primary: Electric Indigo (#6366f1)
- Accent: Electric Purple (#8b5cf6)
- Neon accents for status indicators

### Animations
- **Page Load:** Fade-in and slide-up animations
- **Hover States:** Glow effects on buttons
- **Transitions:** Smooth color and transform transitions
- **Modal:** Scale and fade animations

## 🔒 Security Features

- **HTTP-only cookies** for JWT tokens (prevents XSS attacks)
- **Password hashing** with bcrypt (salt rounds: 10)
- **Client and server-side validation** with Zod
- **Protected routes** with authentication middleware
- **Secure headers** via Next.js default configuration

## 🧪 Testing (Future Enhancement)

```bash
# Unit tests with Jest
npm run test

# E2E tests with Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📝 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`
Logout current user (clears auth cookie).

### Trading Endpoints

#### GET `/api/trades`
Get all trades for authenticated user.

**Query Parameters:**
- `search` (optional): Filter trades by coin symbol

#### POST `/api/trades`
Create a new trade.

**Request Body:**
```json
{
  "coin": "BTC",
  "type": "Long",
  "entryPrice": 42000,
  "exitPrice": 45000,
  "quantity": 0.5,
  "status": "Closed",
  "notes": "Strong uptrend",
  "entryDate": "2024-01-15",
  "exitDate": "2024-01-20"
}
```

#### PUT `/api/trades/[id]`
Update an existing trade.

#### DELETE `/api/trades/[id]`
Delete a trade.

#### GET `/api/trades/stats`
Get dashboard statistics (total trades, win rate, net profit).

## 🤝 Contributing

This project is designed as a frontend assessment showcase. For production use, consider implementing the scaling strategies mentioned above.

## 📄 License

MIT License - feel free to use this project as a template for your own applications.

## 👨‍💻 Author

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS.

---

**Note:** This application uses an in-memory database for demonstration purposes. For production deployment, replace the mock database with a real database solution like MongoDB or PostgreSQL following the migration patterns outlined in the scalability section.

