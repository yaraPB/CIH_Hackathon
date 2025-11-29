# Synergos - Quick Start Guide

## Installation (2 minutes)

1. **Install dependencies**
```bash
cd synergos-app
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open browser**
Navigate to: http://localhost:3000

## First Steps

### 1. Login
- Use demo account: `212700446631`
- Or click any suggested account on the login page

### 2. Explore Dashboard
- View your groups
- Check balances
- See recent activity

### 3. Try Group Features
- Click on "Weekend Trip Fund" group
- Add contribution via "Make Payment"
- Propose new payment via "Propose Payment"

### 4. View Analytics
- Click "Analytics" in header
- Explore the overview dashboard
- Check "Geographic Map" for user locations
- View "Network Graph" for relationships

## Key Features to Demo

### Collaborative Payments
1. Go to any group
2. Click "Propose Payment"
3. Fill in amount and description
4. Other members approve via "Payments" tab
5. Auto-executes when threshold met

### Analytics
- **KPI Cards**: Total users, groups, transactions, volume
- **Charts**: Group activity, transaction status
- **Map**: Interactive Leaflet map of user locations
- **Graph**: D3.js network visualization

## Demo Accounts

All accounts work without passwords:

| Phone | Name | Groups |
|-------|------|--------|
| 212700446631 | Ahmed Benali | Weekend Trip, Office Lunch |
| 212700446211 | Fatima Zahra | Weekend Trip, Family Fund |
| 212755123456 | Youssef Idrissi | Weekend Trip, Family Fund |
| 212666233333 | Samira Tazi | Office Lunch, Family Fund |
| 212669268097 | Karim Alami | Office Lunch, Family Fund |

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for analytics charts
- **Leaflet** for maps
- **D3.js** for network graphs

## File Structure

```
app/
├── login/              # Login page
├── dashboard/          # Main dashboard
├── groups/[groupId]/   # Group pages
├── analytics/          # Analytics pages
└── api/                # API routes

components/             # Reusable UI components
lib/                   # Mock data & utilities
```

## API Routes

All in `/app/api/`:
- `wallet/*` - Wallet operations
- `transfer/*` - Transfer operations  
- `analytics/*` - Analytics data

## Notes

- All data is mocked for hackathon
- No real backend required
- Ready for production integration
- Mobile responsive
- Fast and lightweight

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Explore all pages
2. Try creating proposals
3. Check analytics visualizations
4. Review code structure
5. Read full README.md for details

## Support

This is a hackathon demo. For production use:
- Replace mock data with real APIs
- Add authentication
- Connect to Neo4j for graphs
- Deploy to Vercel/AWS

Enjoy exploring Synergos! 🚀
