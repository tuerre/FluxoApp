'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import AppLayout from '@/components/layout/AppLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { exportToExcel } from '@/lib/utils/excel'
import { formatCurrency } from '@/lib/utils/currency'
import { getUserSettings } from '@/lib/supabase/settings'
import { getExpenses, getExpenseStats } from '@/lib/supabase/expenses'
import { Wallet, TrendingUp, TrendingDown, Target, Download } from 'lucide-react'
import { getCurrentMonth, getCurrentYear, getMonthName, getLastSixMonths } from '@/lib/utils/dates'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'

const COLORS = ['#006239', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth().toString())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString())
  const [stats, setStats] = useState(null)
  const [previousMonthStats, setPreviousMonthStats] = useState(null)
  const [trendData, setTrendData] = useState([])
  const [currency, setCurrency] = useState('DOP')
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    loadReportData()
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    document.title = 'Fluxo App | Reportes'
  }, [])

  const loadReportData = async () => {
    try {
      setLoading(true)

      const settings = await getUserSettings()
      setCurrency(settings.currency)

      const month = parseInt(selectedMonth)
      const year = parseInt(selectedYear)

      // Estadísticas del mes actual
      const currentStats = await getExpenseStats(month, year)
      setStats(currentStats)

      // Cargar gastos del mes
      const monthExpenses = await getExpenses({ month, year })
      setExpenses(monthExpenses)

      // Estadísticas del mes anterior
      let prevMonth = month - 1
      let prevYear = year
      if (prevMonth === 0) {
        prevMonth = 12
        prevYear = year - 1
      }
      const prevStats = await getExpenseStats(prevMonth, prevYear)
      setPreviousMonthStats(prevStats)

      // Tendencia de los últimos 6 meses
      const lastSixMonths = getLastSixMonths()
      const trendPromises = lastSixMonths.map(async ({ month, year, label }) => {
        const monthStats = await getExpenseStats(month, year)
        return {
          name: label,
          total: monthStats.total
        }
      })
      const trend = await Promise.all(trendPromises)
      setTrendData(trend)

    } catch (error) {
      console.error('Error al cargar reportes:', error)
      toast.error('Error al cargar los reportes')
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = () => {
    try {
      exportToExcel(
        expenses,
        stats.categoryStats,
        parseInt(selectedMonth),
        parseInt(selectedYear),
        stats.total,
        previousMonthStats.total
      )
      toast.success('Reporte exportado exitosamente')
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar el reporte')
    }
  }

  const variation = previousMonthStats && previousMonthStats.total > 0
    ? ((stats?.total - previousMonthStats.total) / previousMonthStats.total) * 100
    : 0

  const pieData = stats?.categoryStats.map(cat => ({
    name: cat.name,
    value: cat.total
  })) || []

  const topCategories = stats?.categoryStats.slice(0, 4) || []

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando reportes...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportes Financieros</h1>
            <p className="text-muted-foreground">Análisis detallado de tus gastos</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => getCurrentYear() - 2 + i).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Gasto Mensual"
            value={formatCurrency(stats?.total || 0, currency)}
            subtitle={`${expenses.length} transacciones`}
            icon={Wallet}
          />
          <StatsCard
            title="Promedio Diario"
            value={formatCurrency(stats?.avgPerDay || 0, currency)}
            subtitle="Gasto promedio por día"
            icon={TrendingUp}
          />
          <StatsCard
            title="Categoría Principal"
            value={stats?.topCategory?.name || 'N/A'}
            subtitle={stats?.topCategory ? formatCurrency(stats.topCategory.total, currency) : ''}
            icon={Target}
          />
          <StatsCard
            title="Variación vs Mes Anterior"
            value={`${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`}
            subtitle={variation > 0 ? 'Incremento' : 'Reducción'}
            icon={variation > 0 ? TrendingUp : TrendingDown}
            className={variation > 0 ? 'border-destructive/20' : 'border-green-500/20'}
          />
        </div>

        {/* Export Button */}
        <Button onClick={handleExportExcel} className="w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Exportar a Excel
        </Button>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
              <CardDescription>Porcentaje de gasto por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 4 Categorías</CardTitle>
              <CardDescription>Categorías con mayor gasto</CardDescription>
            </CardHeader>
            <CardContent>
              {topCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                    <Bar dataKey="total" fill="#006239" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Temporal</CardTitle>
            <CardDescription>Gastos de los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                  <Line type="monotone" dataKey="total" stroke="#006239" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
