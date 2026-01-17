'use client'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getMonthName } from '@/lib/utils/dates'
import { formatCurrency } from '@/lib/utils/currency'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'

const BudgetCard = ({ budget, currency = 'DOP', onEdit, onDelete }) => {
  const progressColor = budget.progress > 100 ? 'bg-destructive' : budget.progress > 80 ? 'bg-yellow-500' : 'bg-primary'
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{budget.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getMonthName(budget.month)} {budget.year}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(budget)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(budget.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Presupuesto</p>
            <p className="font-semibold">{formatCurrency(budget.amount, currency)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gastado</p>
            <p className="font-semibold text-destructive">{formatCurrency(budget.spent, currency)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Restante</p>
            <p className={`font-semibold ${
              budget.remaining < 0 ? 'text-destructive' : 'text-green-600'
            }`}>
              {formatCurrency(Math.abs(budget.remaining), currency)}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className={`font-semibold ${
              budget.progress > 100 ? 'text-destructive' : 'text-foreground'
            }`}>
              {budget.progress.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(budget.progress, 100)} className={progressColor} />
          {budget.progress > 100 && (
            <p className="text-xs text-destructive">
              ¡Has excedido tu presupuesto!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default BudgetCard
