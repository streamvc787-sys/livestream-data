# Livestream Analytics Dashboard

A production-ready web application that provides real-time analytics and leaderboard for livestreams powered by the Pulstream API. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Livestream+Analytics+Dashboard)

## 🚀 Live Demo

[View Live Demo](https://your-vercel-url.vercel.app) <!-- Replace with your actual deployment URL -->

## ✨ Features

- **Real-time Data**: Live polling every 15 seconds with toggleable auto-refresh
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Dark Theme**: Sleek dark UI with glassy card effects
- **Interactive Controls**: Search, sort, and filter streams with URL state persistence
- **Leaderboard Table**: Sortable table with participant counts, uptime, and engagement metrics
- **Trending Streams**: Compact stream cards in the sidebar
- **KPI Dashboard**: Key metrics including total streams, viewers, and peak counts
- **Error Handling**: Graceful error states and loading skeletons
- **Type Safety**: Full TypeScript support with Zod validation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📊 Data Sources

- **API**: [Pulstream API](https://api.pulstream.so)
- **Data Points**: Stream participants, chat members, replies, market cap, and more
- **Real-time Updates**: Live polling with configurable intervals

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/livestream-data.git
   cd livestream-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/streams/          # API routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── Controls.tsx          # Search and filter controls
│   ├── HeaderBar.tsx         # Top navigation bar
│   ├── StreamCard.tsx        # Stream card component
│   ├── StreamTable.tsx       # Main data table
│   └── ...                   # Other components
└── lib/
    ├── api.ts                # API client and data fetching
    ├── format.ts             # Utility functions for formatting
    ├── providers.tsx         # React Query provider
    ├── types.ts              # TypeScript types and Zod schemas
    └── utils.ts              # shadcn/ui utilities
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.pulstream.so
```

### API Integration

The app integrates with the Pulstream API to fetch real-time stream data:

- **Endpoint**: `/streamstats`
- **Parameters**: `limit`, `offset`, `sort_by`, `sort_order`
- **Data**: Stream participants, chat members, replies, market metrics

## 📱 Responsive Design

- **Mobile**: Table collapses to card layout
- **Tablet**: Optimized layout for medium screens  
- **Desktop**: Full leaderboard + sidebar layout

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize component styles in individual component files

### Data Display
- Update column headers in `src/components/StreamTable.tsx`
- Modify KPI calculations in `src/lib/api.ts`
- Adjust formatting functions in `src/lib/format.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms

- **Netlify**: Connect GitHub repository
- **Railway**: Auto-detects Next.js
- **Docker**: Use the included Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Pulstream](https://pulstream.so) for the API
- [shadcn/ui](https://ui.shadcn.com) for the UI components
- [Next.js](https://nextjs.org) for the framework
- [Tailwind CSS](https://tailwindcss.com) for styling

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/livestream-data/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

**Made with ❤️ for the livestream community**