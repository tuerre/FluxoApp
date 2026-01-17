'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { formatCurrency } from '@/lib/utils/currency'
import StatsCard from '@/components/dashboard/StatsCard'
import { getCategories } from '@/lib/supabase/categories'
import { getUserSettings } from '@/lib/supabase/settings'
import RecentExpenses from '@/components/dashboard/RecentExpenses'
import { getCurrentMonth, getCurrentYear } from '@/lib/utils/dates'
import { Wallet, TrendingUp, Tags, Calculator } from 'lucide-react'
import { getExpenses, getExpenseStats } from '@/lib/supabase/expenses'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [currency, setCurrency] = useState('DOP')
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Dashboard'
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar configuración de usuario
      const settings = await getUserSettings()
      setCurrency(settings.currency)

      // Cargar estadísticas del mes actual
      const month = getCurrentMonth()
      const year = getCurrentYear()
      const monthStats = await getExpenseStats(month, year)
      setStats(monthStats)

      // Cargar gastos recientes (limitados a 10)
      const expenses = await getExpenses({})
      setRecentExpenses(expenses.slice(0, 10))

      // Cargar categorías
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tus gastos del mes actual</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Gastado"
            value={formatCurrency(stats?.total || 0, currency)}
            subtitle="Este mes"
            icon={Wallet}
          />
          <StatsCard
            title="Transacciones"
            value={stats?.count || 0}
            subtitle="Total de gastos"
            icon={TrendingUp}
          />
          <StatsCard
            title="Categorías"
            value={categories.length}
            subtitle="Categorías creadas"
            icon={Tags}
          />
          <StatsCard
            title="Promedio Diario"
            value={formatCurrency(stats?.avgPerDay || 0, currency)}
            subtitle="Gasto promedio"
            icon={Calculator}
          />
        </div>

        {/* Recent Expenses */}
        <RecentExpenses expenses={recentExpenses} currency={currency} />
      </div>
    </AppLayout>
  )
}
