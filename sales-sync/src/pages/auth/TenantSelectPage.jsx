import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tenants } from '../../data';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const TenantSelectPage = () => {
  const { selectTenant } = useAuth();
  const navigate = useNavigate();

  const handleSelectTenant = (tenantId) => {
    const result = selectTenant(tenantId);
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Select Your Organization</h2>
      <div className="space-y-4">
        {tenants.map((tenant) => (
          <Card 
            key={tenant.id}
            className="cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => handleSelectTenant(tenant.id)}
          >
            <CardContent className="p-4 flex items-center">
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img 
                  src={tenant.logo} 
                  alt={tenant.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">{tenant.name}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Don't see your organization?</p>
        <Button variant="outline" size="sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default TenantSelectPage;