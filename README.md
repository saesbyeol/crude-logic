# Oil Price Dashboard

A visually stunning dashboard for monitoring oil prices with beautiful animations and clean design for presentation purposes.

![Oil Price Dashboard](https://via.placeholder.com/800x400?text=Oil+Price+Dashboard)

## Features

- **Real-time Oil Price Data**: Display current oil prices with change indicators
- **Interactive Charts**: Visualize historical price trends with smooth animations
- **Price Forecasting**: View future price predictions with optimistic and pessimistic scenarios
- **Historical Trends**: Analyze price changes over different time periods
- **Responsive Design**: Optimized for all device sizes
- **Beautiful Animations**: Smooth transitions and animations for an engaging user experience

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For responsive and beautiful UI
- **Chart.js**: For data visualization
- **Framer Motion**: For smooth animations
- **Axios**: For API requests

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/oil-price-dashboard.git
   cd oil-price-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout component
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── OilPriceDashboard.tsx  # Main dashboard component
│   │   ├── OilPriceChart.tsx      # Oil price chart component
│   │   ├── OilPriceStats.tsx      # Oil price statistics component
│   │   ├── OilPriceTrends.tsx     # Historical trends component
│   │   └── OilPriceForecast.tsx   # Price forecast component
```

## Customization

You can customize the dashboard by:

- Modifying the color scheme in the Tailwind configuration
- Adjusting the chart options in the chart components
- Connecting to a real oil price API instead of using mock data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data visualization inspired by modern dashboard designs
- Animation techniques from Framer Motion examples
