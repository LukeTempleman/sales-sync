# Sales-sync – Product Specification (Frontend Only)

## 1. Tech Stack & Design

- **Frontend Framework**: React
- **Styling/UI Library**: shadcn/ui
- **UI Components**: 
  - Radix UI (@radix-ui/react-tabs, @radix-ui/react-select, etc.)
  - class-variance-authority (for component variants)
  - clsx & tailwind-merge (for class name management)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Design Guidelines**:
  - Primary colours: White (backgrounds), Blue (primary actions), Rose (secondary/accents)
  - Professional, clean, modern aesthetic
  - Grid-based layouts, card components, clear spacing
  - Minimalist typography with strong hierarchy
  - Dark mode support for improved accessibility and user preference

## 2. Platform Overview

Sales-sync is a multi-tenant platform for managing field sales operations and brand surveys.

- Agents perform field visits (consumers and shops) and capture structured data
- Managers/Admins configure brands, surveys, users, goals, and call cycles while reviewing analytics
- Role-based dashboards ensure access is tailored to user responsibilities

## 3. Roles & Permissions

### 3.1 Agent
- Conduct consumer and shop visits
- Upload photos (ID/passport, shelves, advertising, shop exterior)
- Access personal visit history
- Complete goals assigned (daily → quarterly)
- View personal analytics dashboard

### 3.2 Team Leader
- Manage Agents
- Assign goals to Agents
- Define call cycles (recurring visit schedules)
- Access team-level analytics & visit history

### 3.3 Area Manager
- Manage Team Leaders + their Agents
- Assign cross-team goals
- Define area call cycles
- Access area-level analytics & visit history

### 3.4 Regional Manager
- Manage Area Managers + their teams
- Assign strategic goals across a region
- Define regional call cycles
- Access regional analytics & visit history

### 3.5 National Sales Manager
- Manage Regional Managers + all teams
- Assign national strategy goals
- Define national call cycle templates
- Access national analytics & visit history

### 3.6 Admin
- Manage brands (logos, infographics, training)
- Manage surveys (create/edit templates)
- Manage all users (multi-tenant support)
- Access system-wide analytics and visit history

## 4. Goals Management
- Roles above Agent can create and assign goals
- Goal types: daily, weekly, monthly, quarterly
- Metrics for goals:
  - Number of visits
  - Conversions
  - Shelf share improvement
  - Shops trained/boarded
- Progress tracking shown in dashboards

## 5. Call Cycles
- Definition: A recurring schedule of locations/visits assigned to Agents to ensure coverage
- Functionality:
  - Locations defined by Managers (shops, areas, geocodes)
  - Assigned to Agents or Teams
  - Repeat frequencies: daily, weekly, monthly
  - Compliance tracked (did visits occur as planned?)
- Analytics:
  - Adherence rates
  - Heatmaps of coverage
  - Visit frequency by location

## 6. Surveys

### 6.1 Individual Visit Survey
- Geocode
- Consumer details: Name, Surname, ID/passport (photo), Cell number
- Brand questions:
  - Brand info shared (Yes/No)
  - Converted consumer (Yes/No, voucher purchased)
  - Other betting platforms used
  - Goldrush comparison to competitors
  - Feedback on Goldrush

### 6.2 Shop Visit Survey
- Geocode + Shop details
- Awareness questions: Do you know about Brand X? Do you stock product?
- Stock & sales: Current sales, source (wholesaler/manufacturer)
- Competitor info: Products stocked, prices, brands
- Shelf Analysis:
  - Upload shelf photo
  - Overlay grid → mark quadrants
  - Auto % calculation of shelf share
- Advertising:
  - Photos of shop exterior & boards
  - Record competitor adverts
  - Place new board & capture photo
- Training:
  - Record if cashier trained (Yes/No)
  - Display brand infographic for support

## 7. Analytics by Role

| Role | Analytics Access |
|------|-----------------|
| Agent | Personal visits, conversions, goals, shelf share contribution |
| Team Leader | Team visits, conversion rates, call cycle adherence, goal tracking |
| Area Manager | Multi-team comparisons, area trends, shelf share reports |
| Regional Manager | Regional comparisons, call cycle adherence, sales funnels, coverage heatmaps |
| National Manager | National growth trends, regional rankings, shelf share national summary |
| Admin | System usage, survey completion, tenant-wide reporting |

## 8. Dashboards & Pages per Role

### 8.1 Agent Dashboard
- Home: KPIs (visits, conversions, goals)
- New Visit: Individual / Shop surveys
- Visit History: Personal log, searchable
- Goals: Progress tracker
- Profile: Personal info + training materials

### 8.2 Team Leader Dashboard
- Home: Team overview (visits, conversions, goals)
- Team Management: Add/remove/update Agents
- Call Cycles: Create/manage schedules
- Analytics: Team performance, visit heatmaps
- Visit History: Team logs

### 8.3 Area Manager Dashboard
- Home: Area summary KPIs
- User Management: Manage Team Leaders + Agents
- Call Cycles: Area-level management
- Analytics: Team comparisons, consumer/shop trends
- Visit History: Area logs

### 8.4 Regional Manager Dashboard
- Home: Regional KPIs
- User Management: Manage Area Managers + teams
- Call Cycles: Region-level schedules
- Analytics: Regional comparisons, coverage heatmaps
- Visit History: Regional logs

### 8.5 National Sales Manager Dashboard
- Home: National KPIs
- User Management: Manage Regional Managers + teams
- Call Cycles: National templates
- Analytics: National trends, regional comparisons
- Visit History: National logs

### 8.6 Admin Dashboard
- Home: System health overview
- Brand Management: Manage brands + infographics
- Survey Management: Create/edit templates
- User Management: Add/edit users across tenants
- Visit History: All logs for auditing
- Analytics: Platform usage + survey performance

## 9. Shared Pages Across All Roles
- Login / Tenant Selection
- Profile & Settings (personal info, password, language)
- Notifications (goals, call cycles, reminders)
- Help/Support (docs, FAQs, contact)

---

## Implementation Details

This project implements the Sales-sync platform as specified above, with a focus on creating a robust, scalable frontend application that supports all the required functionality.

### Tech Stack

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing between different pages
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: Component library built on top of Tailwind CSS
- **Recharts**: For data visualization and analytics
- **React Hook Form**: For form handling and validation
- **TanStack Table**: For data tables with sorting, filtering, and pagination

### Project Structure

```
sales-sync/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── layout/      # Layout components
│   │   ├── tables/      # Table components
│   │   └── ui/          # Base UI components
│   ├── context/         # React context providers
│   ├── data/            # Mock data for development
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── agent/       # Agent-specific pages
│   │   ├── auth/        # Authentication pages
│   │   ├── shared/      # Shared pages across roles
│   │   └── ...          # Other role-specific pages
│   ├── routes/          # Route configuration
│   ├── App.js           # Main application component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

### Features Implemented

- **Multi-tenant Support**: Users can select their organization before logging in
- **Role-based Access Control**: Different dashboards and features based on user roles
- **Authentication**: Login/logout functionality with role-based redirection
- **Responsive Design**: Mobile-friendly interface that works on all device sizes
- **Dark Mode**: Toggle between light and dark themes for better accessibility and user preference
- **Dashboard Analytics**: Data visualization for KPIs and performance metrics
- **Visit Management**: Create, view, and manage field visits
- **Goal Tracking**: Monitor progress on assigned goals
- **Call Cycle Management**: View and manage recurring visit schedules
- **Profile Management**: View and edit user profile information
- **Notifications**: System notifications for goals, call cycles, etc.
- **Help Center**: Documentation, FAQs, and support resources
- **Quick Login**: Demo functionality to easily switch between different user roles

### Recent Additions

- **Agent Call Cycle Page**: Agents can now view their assigned call cycles, filter by frequency and status, and see detailed location information for each cycle.
- **Admin Goal Management Page**: Admins can now create, edit, and manage goals for all users across the platform, with filtering by goal type, status, and assignee.
- **Enhanced Location Data**: Call cycles now include realistic South African locations with proper geocoding, addresses, and location types.
- **Improved Data Visualization**: Added more detailed charts and graphs for analytics dashboards.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Select a tenant and log in with one of the demo accounts
   - Agent: agent@example.com
   - Team Leader: teamleader@example.com
   - Area Manager: areamanager@example.com
   - Regional Manager: regionalmanager@example.com
   - National Manager: nationalmanager@example.com
   - Admin: admin@example.com
   - Password: password (for all accounts)
