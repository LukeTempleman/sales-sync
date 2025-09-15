import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ROLES, agents, teamLeaders, areaManagers, regionalManagers, nationalManagers, admins } from '../../data';

const LoginPage = () => {
  const { login, tenant } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Sales-sync</h2>
      
      {tenant ? (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
            <span className="text-sm text-gray-600 mr-2">Organization:</span>
            <span className="text-sm font-medium">{tenant.name}</span>
          </div>
          <div className="mt-2">
            <Link 
              to="/select-tenant" 
              className="text-xs text-blue-600 hover:underline"
            >
              Change organization
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          <Link 
            to="/select-tenant" 
            className="inline-block bg-blue-50 text-blue-600 rounded-full px-4 py-2 text-sm font-medium"
          >
            Select your organization
          </Link>
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
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Button type="submit" className="w-full" disabled={loading || !tenant}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Quick login section for demo purposes */}
      {tenant && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Demo Quick Login</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.AGENT)}
            >
              Login as Agent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.TEAM_LEADER)}
            >
              Login as Team Leader
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.AREA_MANAGER)}
            >
              Login as Area Manager
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.REGIONAL_MANAGER)}
            >
              Login as Regional Manager
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.NATIONAL_MANAGER)}
            >
              Login as National Manager
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => quickLogin(ROLES.ADMIN)}
            >
              Login as Admin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;