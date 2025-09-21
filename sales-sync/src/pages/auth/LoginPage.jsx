import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { UserCircle2, ToggleLeft } from 'lucide-react';
import { ROLES, agents, teamLeaders, areaManagers, regionalManagers, nationalManagers, admins, tenants } from '../../data';

const LoginPage = () => {
  const { login, tenant, selectTenant, useRealApi, toggleApiMode, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Auto-select the first tenant if none is selected (for mock mode)
  useEffect(() => {
    if (!useRealApi && !tenant && tenants.length > 0) {
      selectTenant(tenants[0].id);
    }
  }, [tenant, selectTenant, useRealApi]);

  // Update error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Update loading state when auth loading changes
  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!useRealApi && !tenant) {
      setError('Please select a tenant first');
      setLoading(false);
      return;
    }

    try {
      // Login with real API or mock data
      const result = await login(email, password, tenant?.id);

      if (result.success) {
        // Redirect based on user role
        const userRole = result.user.roles?.[0] || result.user.role;
        switch (userRole) {
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
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  // For demo purposes, provide quick login buttons for different roles
  const quickLogin = (role) => {
    // Only available in mock mode
    if (useRealApi) return;
    
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
      setTimeout(async () => {
        const result = await login(user.email, 'password', tenant.id);
        
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Login to Sales-sync</h2>
        
        <div className="flex items-center gap-2">
          {/* API Mode Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8"
            onClick={toggleApiMode}
          >
            <ToggleLeft className="h-3.5 w-3.5 mr-1" />
            {useRealApi ? 'Using Real API' : 'Using Mock Data'}
          </Button>
          
          {/* Demo role selector - only show in mock mode */}
          {!useRealApi && tenant && (
            <div className="relative">
              <details className="text-right">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded-md border border-muted hover:border-primary/30 transition-colors">
                  <UserCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>Demo Login</span>
                </summary>
                <div className="absolute right-0 mt-2 bg-card border rounded-md shadow-md p-3 w-48 z-50">
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
        </div>
      </div>
      
      {/* Only show tenant selector in mock mode */}
      {!useRealApi && tenant && (
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
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || (!useRealApi && !tenant)}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>

      {useRealApi && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-md">
          <p className="font-medium">Using Real API Mode</p>
          <p className="text-xs mt-1">
            Connect to the backend API at {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;