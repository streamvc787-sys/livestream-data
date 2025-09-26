# Pulstream Live - Live Stream Analytics Dashboard

A production-ready web application that replicates the style and design of [pulstream.so/live](https://pulstream.so/live), built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Real-time Data**: Live polling every 15 seconds with toggleable auto-refresh
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Dark Theme**: Sleek dark UI with glassy card effects matching pulstream.so
- **Interactive Controls**: Search, sort, and filter streams with URL state persistence
- **Leaderboard Table**: Sortable table with participant counts, uptime, and status
- **Live Cards**: Compact stream cards in the sidebar
- **KPI Dashboard**: Key metrics including total streams, participants, and peak counts
- **Error Handling**: Graceful error states and loading skeletons
- **Type Safety**: Full TypeScript support with Zod validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Validation**: Zod
- **Charts**: Recharts (ready for future enhancements)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livestream-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up shadcn/ui** (if not already done)
   ```bash
   npx shadcn@latest init
   ```

4. **Add required components**
   ```bash
   npx shadcn@latest add button input select card badge skeleton table dialog separator tooltip switch
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### API Configuration

The app uses the Pulstream API by default. To change the API endpoint:

1. **Environment Variables** (recommended):
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
   ```

2. **Direct Code Change**:
   Update the `API_BASE_URL` in `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-api-endpoint.com';
   ```

### Customizing API Schema

If the API returns different field names, update the Zod schema in `src/lib/types.ts`:

```typescript
export const StreamSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  // Add your custom fields here
  custom_field: z.string().optional(),
}).passthrough(); // Allows unknown fields
```

## Project Structure

```
src/
├── app/
│   ├── api/streams/route.ts    # API proxy endpoint
│   ├── globals.css             # Global styles and dark theme
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Controls.tsx            # Search, sort, and filter controls
│   ├── ErrorState.tsx          # Error state component
│   ├── EmptyState.tsx          # Empty state component
│   ├── HeaderBar.tsx           # Sticky header with controls
│   ├── KpiCard.tsx             # KPI metric cards
│   ├── Skeletons.tsx           # Loading skeleton components
│   ├── StreamCard.tsx          # Stream card for sidebar
│   ├── StreamRow.tsx           # Table row component
│   └── StreamTable.tsx         # Main leaderboard table
└── lib/
    ├── api.ts                  # API client and data fetching
    ├── format.ts               # Utility functions for formatting
    ├── providers.tsx           # TanStack Query provider
    ├── types.ts                # TypeScript types and Zod schemas
    └── utils.ts                # shadcn/ui utilities
```

## API Integration

### Endpoint

The app proxies requests to the external API through `/api/streams` to avoid CORS issues.

**Supported Query Parameters:**
- `limit`: Number of results (1-1000, default: 20)
- `offset`: Pagination offset (default: 0)
- `sort_by`: Sort field (`num_participants`, `created_at`, `started_at`, `viewer_count`)
- `sort_order`: Sort direction (`ASC`, `DESC`)

### Data Schema

The app expects the API to return data in this format:

```typescript
{
  data: Array<{
    id: string;
    title?: string;
    name?: string;
    handle?: string;
    num_participants?: number;
    viewer_count?: number;
    thumbnail_url?: string;
    status?: string;
    started_at?: string;
    created_at?: string;
    updated_at?: string;
    // Additional fields are supported via .passthrough()
  }>;
  total?: number;
  limit?: number;
  offset?: number;
}
```

## Features in Detail

### Real-time Updates

- **Polling**: Automatic refresh every 15 seconds when enabled
- **Countdown**: Visual indicator showing time until next refresh
- **Toggle**: Easy on/off switch for live updates
- **Background**: Continues polling when tab is active

### Responsive Design

- **Mobile**: Table collapses to card layout on small screens
- **Tablet**: Optimized layout for medium screens
- **Desktop**: Full leaderboard + sidebar layout

### URL State Management

All filters and sorting options are reflected in the URL:
- `?search=keyword` - Search term
- `?sortBy=num_participants` - Sort field
- `?sortOrder=DESC` - Sort direction
- `?limit=50` - Results per page
- `?offset=20` - Pagination offset

### Error Handling

- **Network Errors**: Graceful fallback with retry options
- **API Errors**: Clear error messages with action buttons
- **Loading States**: Skeleton components during data fetching
- **Empty States**: Helpful messages when no data is found

## Customization

### Styling

The app uses a custom dark theme inspired by pulstream.so. To modify:

1. **Colors**: Update CSS variables in `src/app/globals.css`
2. **Components**: Modify shadcn/ui component styles
3. **Layout**: Adjust grid and spacing in component files

### Adding New Features

1. **New API Fields**: Update the Zod schema in `types.ts`
2. **New Components**: Add to `components/` directory
3. **New Pages**: Add to `app/` directory following Next.js 14 conventions

## Performance

- **Code Splitting**: Automatic with Next.js 14
- **Image Optimization**: Next.js Image component for thumbnails
- **Query Caching**: TanStack Query for efficient data management
- **Skeleton Loading**: Perceived performance improvements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms

1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **API CORS Errors**: The app uses a proxy endpoint to avoid CORS
2. **Type Errors**: Ensure all API fields are properly typed in `types.ts`
3. **Styling Issues**: Check Tailwind CSS configuration and dark mode setup

### Debug Mode

Enable React Query DevTools in development:
- The devtools are included and will show in the bottom-left corner
- Click to inspect queries, cache, and mutations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- **Design Inspiration**: [pulstream.so](https://pulstream.so/live)
- **API**: [Pulstream API](https://api.pulstream.so)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)