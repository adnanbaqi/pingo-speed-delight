
# Pingo Speed Test Platform

## Project Overview

Pingo is a modern, user-friendly internet speed testing platform built with React, TypeScript, and TailwindCSS. The application provides accurate measurements of your network's download speed, upload speed, and ping (latency), presented with beautiful visualizations and real-time metrics.

![Pingo Speed Test](https://via.placeholder.com/1200x630/0d1117/3b82f6?text=Pingo+Speed+Test)

### Key Features

- **Real-time Speed Testing**: Measure download speed, upload speed, and ping latency
- **Visual Metrics**: Beautiful graphs and speedometers to visualize performance
- **Performance Grading**: Color-coded A-F grades to quickly assess network quality
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Mode**: Theme support for different viewing preferences
- **Real-time Data Visualization**: See performance fluctuations during tests
- **Delightful UX**: Animations, sounds, and a cute penguin mascot

## Local Setup Instructions

### Prerequisites

- Node.js 16 or higher
- npm 7 or higher (or yarn/pnpm)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pingo-speed-test.git
   cd pingo-speed-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

For the full experience with real speed testing:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Start the WebSocket server:
   ```bash
   npm run start:server
   ```

The backend server will run on port 8080 by default.

### Database Setup (Optional)

To enable result saving and history features:

1. Set up a PostgreSQL database
2. Configure the connection in the `.env` file (see Environment Variables section)
3. Run migrations:
   ```bash
   npm run migrate
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Frontend Variables
VITE_API_URL=http://localhost:8080
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_ENABLE_ANALYTICS=false
VITE_CARBON_ADS_ID=your-carbon-ads-id

# Backend Variables
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/pingo
JWT_SECRET=your-jwt-secret
API_RATE_LIMIT=100
```

## How Speed Test Logic Works

Pingo uses a multi-stage approach to measure network performance accurately:

1. **Ping Test**:
   - Sends small packets to the server and measures round-trip time
   - Records minimum, maximum, and average latency
   - Detects packet loss and jitter

2. **Download Test**:
   - Opens multiple parallel connections to maximize bandwidth utilization
   - Downloads random binary data in chunks
   - Measures throughput over time and calculates average speed
   - Detects fluctuations and stability issues

3. **Upload Test**:
   - Creates and uploads random data chunks to the server
   - Uses multiple simultaneous connections
   - Measures upload throughput and stability

The testing algorithm accounts for connection establishment time, TCP slow start, and other network factors to provide the most accurate results possible.

### Local Testing Mode

In environments where a backend server isn't available, Pingo can operate in browser-only mode:

- Uses WebWorkers to generate random data blobs
- Simulates network conditions using timing controls
- Provides a reasonable approximation of network performance

## Deployment Guide

### Frontend Deployment (Vercel)

1. Fork the repository on GitHub
2. Connect your Vercel account to your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy with default settings
5. Optionally set up a custom domain

### Backend Deployment (Fly.io)

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Initialize: `fly launch`
4. Set secrets: `fly secrets set DATABASE_URL=your-db-connection-string`
5. Deploy: `fly deploy`

### Database Deployment (Supabase)

1. Create a Supabase account
2. Create a new project
3. Run the SQL migrations from the `/migrations` folder
4. Update your environment variables with the new connection string

## API Documentation

### Base URL
`https://api.pingospeedtest.com/v1` (or your local environment)

### Authentication
Most endpoints require API key authentication:

```http
Authorization: Bearer YOUR_API_KEY
```

### Rate Limiting
- Free tier: 100 requests/day
- Basic tier: 1,000 requests/day
- Pro tier: 10,000 requests/day
- Enterprise: Custom limits

### Endpoints

#### Initiate Speed Test
```http
POST /test/start
```

Response:
```json
{
  "test_id": "c7f3be7d-9b4a-4d31-a330-957a9a5d9c6f",
  "server_info": {
    "location": "New York, US",
    "provider": "AWS EC2"
  },
  "websocket_url": "wss://api.pingospeedtest.com/v1/ws/c7f3be7d-9b4a-4d31-a330-957a9a5d9c6f"
}
```

#### Get Test Results
```http
GET /test/results/{test_id}
```

Response:
```json
{
  "test_id": "c7f3be7d-9b4a-4d31-a330-957a9a5d9c6f",
  "timestamp": "2023-09-15T14:30:45Z",
  "client_info": {
    "ip": "192.168.1.1",
    "location": "Chicago, US",
    "isp": "Comcast"
  },
  "results": {
    "download": {
      "speed": 125.4,
      "unit": "Mbps",
      "grade": "A"
    },
    "upload": {
      "speed": 18.7,
      "unit": "Mbps",
      "grade": "B"
    },
    "ping": {
      "latency": 24,
      "unit": "ms",
      "grade": "A"
    },
    "jitter": {
      "value": 3.2,
      "unit": "ms"
    }
  }
}
```

#### WebSocket API

The WebSocket connection provides real-time test data:

```javascript
const ws = new WebSocket(websocketUrl);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  // Data includes current stage, progress, and speed measurements
};
```

## Revenue Model

Pingo is monetized through several complementary strategies:

### 1. White-Label Solutions
- **ISP Edition**: Custom-branded speed test for internet service providers
  - Pricing: $499/month with annual contract
  - Features: Custom domain, branding, analytics dashboard
  
- **Enterprise Edition**: For remote-first companies to monitor employee connections
  - Pricing: $299/month with annual contract
  - Features: Team management, scheduled tests, performance alerts

### 2. API Access
Tiered API access for developers and businesses:

| Tier | Price | Daily Requests | Features |
|------|-------|----------------|----------|
| Free | $0 | 100 | Basic speed metrics |
| Basic | $29/month | 1,000 | + Detailed metrics, location data |
| Pro | $99/month | 10,000 | + Historical data, batch testing |
| Enterprise | Custom | Custom | + Dedicated infrastructure, SLA |

### 3. Affiliate Partnerships
- Performance-based recommendations for:
  - VPN services for users with privacy concerns
  - Router upgrades for users with outdated equipment
  - ISP switches for users with consistently poor performance
  - Revenue share: 15-30% of referred sales

### 4. Carbon Ads Integration
- Non-intrusive, developer-focused advertising
- Placement on results page only
- Estimated revenue: $2-5 CPM

## Troubleshooting

### Common Issues

#### "WebSocket connection failed"
- Check if the backend server is running
- Ensure firewall allows WebSocket connections
- Try using the fallback HTTP-based testing

#### "Test results seem inaccurate"
- Ensure no other bandwidth-intensive activities are running
- Try connecting via ethernet instead of WiFi
- Run multiple tests at different times of day

#### "The application won't load"
- Clear browser cache and cookies
- Try a different browser
- Check browser console for specific errors

### Debugging Tools

- Network monitor in browser DevTools
- Built-in debug mode: add `?debug=true` to the URL
- Server logs: `npm run logs:server`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
- Check our [FAQ](https://pingospeedtest.com/faq) page
- Join our [Discord community](https://discord.gg/pingospeedtest)
- Email support at help@pingospeedtest.com
