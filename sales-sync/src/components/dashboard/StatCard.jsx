import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, icon, trend, trendValue, className }) => {
  const isPositiveTrend = trend === 'up';
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-rose-600';
  const trendIcon = isPositiveTrend ? '↑' : '↓';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && trendValue && (
              <p className={`text-xs font-medium mt-1 flex items-center ${trendColor}`}>
                <span>{trendIcon}</span>
                <span className="ml-1">{trendValue}</span>
              </p>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;