import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ROLES, agents, teamLeaders, areaManagers, regionalManagers, nationalManagers, admins, tenants } from '../../data';

const LoginPage = () => {
  const { login, tenant, selectTenant } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Auto-select the first tenant if none is selected
  useEffect(() => {
    if (!tenant && tenants.length > 0) {
      selectTenant(tenants[0].id);
    }
  }, [tenant, selectTenant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!tenant) {
      setError('Please select a tenant first');
      setLoading(false);
      return;
    }

    // In a real app, this would validate credentials with an API
    // For demo purposes, we'll just check if the email exists in our mock data
    const result = login(email, password, tenant.id);

    if (result.success) {
      // Redirect based on user role
      switch (result.user.role) {
        case ROLES.AGENT:
          navigate('/agent/dashboard');
          break;
        case ROLES.TEAM_LEADER:
          navigate('/team-leader/dashboard');
          break;
        case ROLES.AREA_MANAGER:
          navigate('/area-manager/dashboard');
          break;
        case ROLES.REGIONAL_MANAGER:
          navigate('/regional-manager/dashboard');
          break;
        case ROLES.NATIONAL_MANAGER:
          navigate('/national-manager/dashboard');
          break;
        case ROLES.ADMIN:
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  // For demo purposes, provide quick login buttons for different roles
  const quickLogin = (role) => {
    let user;
    switch (role) {
      case ROLES.AGENT:
        user = agents.find(a => a.tenantId === tenant?.id);
        break;
      case ROLES.TEAM_LEADER:
        user = teamLeaders.find(tl => tl.tenantId === tenant?.id);
        break;
      case ROLES.AREA_MANAGER:
        user = areaManagers.find(am => am.tenantId === tenant?.id);
        break;
      case ROLES.REGIONAL_MANAGER:
        user = regionalManagers.find(rm => rm.tenantId === tenant?.id);
        break;
      case ROLES.NATIONAL_MANAGER:
        user = nationalManagers.find(nm => nm.tenantId === tenant?.id);
        break;
      case ROLES.ADMIN:
        user = admins.find(a => a.tenantId === tenant?.id);
        break;
      default:
        return;
    }

    if (user) {
      setEmail(user.email);
      setPassword('password'); // Dummy password for demo
      
      // Automatically log in with the selected role
      setTimeout(() => {
        const result = login(user.email, 'password', tenant.id);
        
        if (result.success) {
          // Redirect based on user role
          switch (result.user.role) {
            case ROLES.AGENT:
              navigate('/agent/dashboard');
              break;
            case ROLES.TEAM_LEADER:
              navigate('/team-leader/dashboard');
              break;
            case ROLES.AREA_MANAGER:
              navigate('/area-manager/dashboard');
              break;
            case ROLES.REGIONAL_MANAGER:
              navigate('/regional-manager/dashboard');
              break;
            case ROLES.NATIONAL_MANAGER:
              navigate('/national-manager/dashboard');
              break;
            case ROLES.ADMIN:
              navigate('/admin/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }
      }, 100);
    }
  };

  return (
    <div className="relative">
      {/* Demo role selector in the corner */}
      {tenant && (
        <div className="absolute top-0 right-0">
          <details className="text-right">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-primary inline-block p-2">
              Demo: Quick Login
            </summary>
            <div className="bg-card border rounded-md shadow-md p-3 mt-1 w-48">
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Select Role:</h4>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.AGENT)}
                >
                  <span className="text-sm">Agent</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.TEAM_LEADER)}
                >
                  <span className="text-sm">Team Leader</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.AREA_MANAGER)}
                >
                  <span className="text-sm">Area Manager</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.REGIONAL_MANAGER)}
                >
                  <span className="text-sm">Regional Manager</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.NATIONAL_MANAGER)}
                >
                  <span className="text-sm">National Manager</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left h-8"
                  onClick={() => quickLogin(ROLES.ADMIN)}
                >
                  <span className="text-sm">Admin</span>
                </Button>
              </div>
            </div>
          </details>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center">Login to Sales-sync</h2>
      
      {tenant && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center bg-muted rounded-full px-3 py-1">
            <span className="text-sm text-muted-foreground mr-2">Organization:</span>
            <span className="text-sm font-medium">{tenant.name}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex justify-end">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Button type="submit" className="w-full" disabled={loading || !tenant}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;