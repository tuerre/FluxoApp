'use client'

import { cn } from '@/lib/utils'

const StatsCard = ({ title, value, subtitle, icon: Icon, className }) => {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
