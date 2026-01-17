'use client'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/dates'
import { formatCurrency } from '@/lib/utils/currency'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const RecentExpenses = ({ expenses, currency = 'DOP' }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay gastos registrados aún
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{expense.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {expense.category?.name || 'Sin categoría'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(expense.amount, currency)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(expense.expense_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RecentExpenses
