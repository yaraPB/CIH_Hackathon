# Synergos - Group Wallet Platform

A lightweight, collaborative payment management platform for communities, teams, and small groups.

## Overview

Synergos enables groups to manage shared finances transparently through:
- Collaborative wallet management
- Group payment proposals and approvals
- Real-time transaction tracking
- Advanced analytics with geographic visualization
- Network graph analysis of user relationships

## Features

### Core Functionality
- **Group Wallets**: Create and manage shared wallets with multiple members
- **Payment Proposals**: Propose payments that require group approval
- **Contribution System**: Easy cash-in to group wallets
- **Transaction History**: Complete audit trail of all activities
- **Multi-approval Workflow**: Payments require majority approval

### Analytics Dashboard
- **Geographic Map**: Leaflet-powered interactive map showing user distribution
- **Network Graph**: D3.js visualization of user-group relationships
- **KPI Tracking**: Real-time metrics on users, groups, and transaction volume
- **Activity Analytics**: Charts showing group performance and engagement

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Map**: Leaflet
- **Graph Visualization**: D3.js
- **Database**: Mock in-memory (Neo4j ready for production)

## Project Structure

```
app/
├── login/                    # Authentication
├── dashboard/                # Main dashboard
├── groups/[groupId]/         # Group management
│   ├── page.tsx             # Group detail
│   ├── payments/            # Payment proposals
│   └── pay/                 # Contribution page
├── analytics/               # Analytics features
│   ├── page.tsx            # Overview dashboard
│   ├── map/                # Geographic visualization
│   └── graph/              # Network graph
├── api/                    # Backend API routes
│   ├── wallet/             # Wallet operations
│   ├── transfer/           # Transfer operations
│   └── analytics/          # Analytics endpoints
components/                  # Reusable components
lib/                        # Utilities and mock data
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Extract the project files

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

The app includes pre-configured demo accounts. On the login page, use any of these phone numbers:

- `212700446631` - Ahmed Benali
- `212700446211` - Fatima Zahra  
- `212755123456` - Youssef Idrissi
- `212666233333` - Samira Tazi
- `212669268097` - Karim Alami

## Key Pages

### Dashboard (`/dashboard`)
- Overview of all groups
- Personal and group balances
- Recent activity feed

### Group Detail (`/groups/[groupId]`)
- Group information and members
- Transaction history
- Quick actions (contribute, propose payment)

### Analytics (`/analytics`)
- KPI cards with key metrics
- Group activity charts
- Transaction status breakdown
- Top active users

### Map Visualization (`/analytics/map`)
- Interactive Leaflet map of Morocco
- User location markers with balance info
- City distribution statistics

### Network Graph (`/analytics/graph`)
- D3.js force-directed graph
- User and group nodes
- Relationship connections
- Interactive drag and explore

## API Endpoints

All endpoints return JSON and follow the Wallet Management KIT specification:

### Wallet Management
- `POST /api/wallet/precreate` - Create wallet
- `POST /api/wallet/activate` - Activate wallet
- `POST /api/wallet/clientinfo` - Get user info
- `GET /api/wallet/balance` - Check balance
- `GET /api/wallet/history` - Transaction history

### Cash Operations
- `POST /api/wallet/cashin/simulate` - Simulate cash in
- `POST /api/wallet/cashin/confirm` - Confirm cash in

### Transfers
- `POST /api/transfer/simulate` - Simulate transfer
- `POST /api/transfer/otp` - Generate OTP
- `POST /api/transfer/confirm` - Confirm transfer

### Analytics
- `GET /api/analytics/stats` - Overall statistics
- `GET /api/analytics/location` - Geographic data
- `GET /api/analytics/graph` - Network graph data

## Data Model

### User
```typescript
{
  id: string
  phoneNumber: string
  firstName: string
  lastName: string
  email: string
  contractId: string
  balance: number
  location: { lat, lng, city }
}
```

### Group
```typescript
{
  id: string
  name: string
  description: string
  members: string[]
  balance: number
  contractId: string
  createdAt: string
}
```

### Transaction
```typescript
{
  id: string
  groupId: string
  type: 'cashin' | 'cashout' | 'w2w' | 'payment'
  amount: number
  status: 'pending' | 'approved' | 'completed'
  proposedBy: string
  approvedBy: string[]
  requiredApprovals: number
  description: string
  createdAt: string
}
```

## Workflow Example

1. **Create/Join Group**: Users form a group wallet
2. **Contribute Funds**: Members add money via `/groups/[id]/pay`
3. **Propose Payment**: Any member creates a payment proposal
4. **Group Approval**: Other members approve via `/groups/[id]/payments`
5. **Execute**: Payment processes when threshold reached
6. **Track**: View in transaction history and analytics

## Mock Data

The application uses hardcoded mock data for the hackathon:
- 5 demo users
- 3 pre-configured groups
- Sample transactions
- Moroccan cities for location data

For production, replace `lib/mockdb.ts` with real database calls.

## Analytics Features

### Geographic Analytics
- User distribution across Moroccan cities
- City-wise density calculation
- Interactive map with custom markers

### Network Analytics
- User-group membership graph
- Transaction relationship visualization
- Force-directed layout with D3.js
- Interactive node dragging

### Performance Metrics
- Total transaction volume
- Average transaction size
- Group balances and activity
- User engagement scores

## Development Notes

### For Hackathon Judges
- All API routes are mocked but follow the exact specification provided
- Ready for production by replacing mock functions with real API calls
- Neo4j integration prepared but using mock graph data
- Fully responsive design
- Type-safe with TypeScript

### Future Enhancements
- Real authentication with JWT
- Connect to actual Wallet Management API
- Neo4j database for graph analytics
- Real-time updates with WebSockets
- Mobile app version
- Multi-currency support
- Advanced fraud detection

## Environment Variables

For production deployment, set:

```env
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

## Build for Production

```bash
npm run build
npm start
```

## License

MIT License - Built for Hackathon

## Team

Built with ❤️ for collaborative finance management
