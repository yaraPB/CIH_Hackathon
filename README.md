# 🌟 Synergos - Group Wallet Platform

A collaborative payment management platform for communities, built with Next.js 14 and modern web technologies.

Created by:

1. Mariam Bouja
2. Salma El Achquar
3. Yara Kouttane
  
For the CIH hackathon of 2025.

---

## Project installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet, React-Leaflet
- **Graphs**: D3.js, Recharts
- **Icons**: Lucide React
- **i18n**: react-i18next (English, French, Arabic)
- **Database**: Neo4j (graph visualization)
- **QR**: html5-qrcode

---

## 📁 Project Structure

```
synergos-app/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Main dashboard
│   ├── groups/           # Group management
│   ├── analytics/        # Analytics & visualizations
│   └── api/              # API routes
├── components/           # React components
├── lib/                 # Utilities & data
│   ├── mockdb.ts       # Mock database
│   ├── i18n.ts         # Translations
│   └── neo4j.ts        # Graph data
└── public/             # Static assets
```

---

## API Documentation

### Authentication API

**`POST /api/wallet/auth`**

```typescript
// Login with phone number
Request: { phoneNumber: string }
Response: { 
  success: boolean, 
  user: User, 
  token: string 
}
```

---

### Wallet API

**`POST /api/wallet/create`**

```typescript
// Create new wallet
Request: { 
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string
}
Response: { 
  success: boolean, 
  contractId: string,
  balance: number 
}
```

**`GET /api/wallet/balance?userId={id}`**

```typescript
// Get wallet balance
Response: { 
  balance: number,
  currency: string 
}
```

**`POST /api/wallet/cashin`**

```typescript
// Add funds to wallet
Request: { 
  userId: string,
  amount: number 
}
Response: { 
  success: boolean, 
  newBalance: number 
}
```

**`POST /api/wallet/cashout`**

```typescript
// Withdraw funds from wallet
Request: { 
  userId: string,
  amount: number,
  beneficiary: string 
}
Response: { 
  success: boolean, 
  newBalance: number,
  fees: number 
}
```

---

### Transfer API

**`POST /api/transfer/w2w`**

```typescript
// Wallet-to-wallet transfer
Request: { 
  fromUserId: string,
  toUserId: string,
  amount: number 
}
Response: { 
  success: boolean, 
  transactionId: string,
  fees: number 
}
```

**`POST /api/transfer/payment`**

```typescript
// Group payment
Request: { 
  groupId: string,
  amount: number,
  description: string,
  beneficiary: string,
  proposedBy: string,
  rib?: string 
}
Response: { 
  success: boolean, 
  transactionId: string,
  status: 'pending' 
}
```

**`POST /api/transfer/approve`**

```typescript
// Approve payment
Request: { 
  transactionId: string,
  userId: string 
}
Response: { 
  success: boolean, 
  approved: boolean 
}
```

**`POST /api/transfer/reject`**

```typescript
// Reject payment
Request: { 
  transactionId: string,
  userId: string 
}
Response: { 
  success: boolean, 
  rejected: boolean 
}
```

---

### Analytics API

**`GET /api/analytics/spending`**

```typescript
// Get spending analytics
Response: { 
  totalSpent: number,
  categories: Array<{
    name: string,
    amount: number,
    percentage: number
  }>,
  trends: Array<{
    month: string,
    amount: number
  }>
}
```

**`GET /api/analytics/location`**

```typescript
// Get user location data
Response: { 
  locations: Array<{
    userId: string,
    lat: number,
    lng: number,
    city: string
  }>,
  density: Array<{
    city: string,
    count: number,
    percentage: number
  }>
}
```

**`GET /api/analytics/graph`**

```typescript
// Get network graph data
Response: { 
  nodes: Array<GraphNode>,
  relationships: Array<GraphRelationship>,
  clusters: Array<GroupCluster>
}
```

---

## Key Features

### Multi-language Support

- English, French, Arabic
- RTL support for Arabic
- Language switcher in header

### QR Code Scanner

- Camera access for QR scanning
- Manual entry fallback
- Available in Personal Balance & Group cards

### Group Management

- Create group with member selection
- **Pending approval system** (all members must approve)
- Approve/Reject group proposals
- Real-time updates

### Payment Workflows

- Group payments require **unanimous approval**
- Any member can reject
- Automatic balance updates
- Transaction history

### Analytics & Visualization

- **Neo4j Graph**: Network visualization with circular wallet clusters
- **Leaflet Map**: Geographic user distribution with red hotspot areas
- **D3.js Charts**: Spending trends and analytics
- **Recharts**: Interactive dashboards

---

## Mock Users

```typescript
Phone: 212700446631 → Ahmed Benali (5,000 MAD)
Phone: 212700446211 → Fatima Zahra (3,200 MAD)
Phone: 212755123456 → Youssef Idrissi (7,500 MAD)
Phone: 212666233333 → Samira Tazi (4,100 MAD)
Phone: 212669268097 → Karim Alami (6,800 MAD)
```

---

## License

MIT License - Feel free to use for your projects!
