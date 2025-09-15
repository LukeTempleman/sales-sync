import { Button } from './components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Sales-sync Platform
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A multi-tenant platform for managing field sales operations and brand surveys
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Platform Overview</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Agents perform field visits (consumers and shops) and capture structured data</li>
            <li>Managers/Admins configure brands, surveys, users, goals, and call cycles</li>
            <li>Role-based dashboards ensure access is tailored to user responsibilities</li>
          </ul>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button>Login as Agent</Button>
            <Button variant="secondary">Login as Manager</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sales-sync. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default App;
