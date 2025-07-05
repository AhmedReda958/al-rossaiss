# Al-Rossais - Interactive Real Estate Map

Al-Rossais is an interactive real estate mapping platform that allows users to explore cities, regions, projects, and landmarks. Built with Next.js and featuring a modern, responsive design.

## Features

- 🗺️ Interactive map visualization
- 🏙️ City and region exploration
- 🏢 Real estate project listings
- 🏛️ Landmark discovery
- 📊 Property details and statistics
- 🔐 Secure admin dashboard
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Konva.js for interactive map rendering
- **Authentication**: JWT-based authentication
- **State Management**: Zustand

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your environment variables by creating a `.env.local` file:

```bash
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret_key"
```

Run the database migrations:

```bash
npx prisma migrate dev
```

Seed the database (optional):

```bash
npm run seed
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets and images
- `/scripts` - Build and deployment scripts

## Admin Dashboard

Access the admin dashboard at `/dashboard` to manage:
- Cities and regions
- Real estate projects
- Landmarks
- Property details

## API Endpoints

- `/api/cities` - City management
- `/api/regions` - Region management
- `/api/projects` - Project management
- `/api/landmarks` - Landmark management
- `/api/auth` - Authentication endpoints

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Setup (Prisma + PostgreSQL)

1. Install dependencies:
   ```bash
   npm install @prisma/client prisma pg
   ```
2. Create a `prisma/schema.prisma` file and configure your PostgreSQL connection string.
3. Run `npx prisma migrate dev --name init` to set up the database.
4. Use the generated Prisma client in your API routes.
