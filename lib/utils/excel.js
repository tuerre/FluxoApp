import * as XLSX from 'xlsx'
import { formatMonthYear } from './dates'

export const exportToExcel = (expenses, categoryStats, month, year, totalSpent, previousMonthTotal) => {
  // Crear un nuevo libro de trabajo
  const wb = XLSX.utils.book_new()
  
  // Crear hoja de resumen
  const summaryData = [
    ['REPORTE MENSUAL DE GASTOS'],
    [`Período: ${formatMonthYear(month, year)}`],
    [],
    ['Métrica', 'Valor'],
    ['Total gastado', totalSpent.toFixed(2)],
    ['Diferencia vs mes anterior', (totalSpent - previousMonthTotal).toFixed(2)],
    ['Variación %', previousMonthTotal > 0 ? (((totalSpent - previousMonthTotal) / previousMonthTotal) * 100).toFixed(2) + '%' : 'N/A'],
    [],
    ['DESGLOSE POR CATEGORÍA'],
    ['Categoría', 'Monto', 'Porcentaje'],
    ...categoryStats.map(cat => [
      cat.name,
      cat.total.toFixed(2),
      ((cat.total / totalSpent) * 100).toFixed(2) + '%'
    ])
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  
  // Aplicar estilos al título (si es compatible)
  summarySheet['!cols'] = [{ width: 30 }, { width: 20 }]
  
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')
  
  // Crear hoja de gastos detallados
  const expensesData = expenses.map(exp => ({
    'Fecha': exp.expense_date,
    'Nombre': exp.name,
    'Monto': parseFloat(exp.amount),
    'Categoría': exp.category?.name || 'Sin categoría',
    'Método de Pago': exp.payment_method?.name || 'Sin método',
    'Descripción': exp.description || ''
  }))
  
  const expensesSheet = XLSX.utils.json_to_sheet(expensesData)
  XLSX.utils.book_append_sheet(wb, expensesSheet, 'Gastos Detallados')
  
  // Descargar el archivo
  const fileName = `reporte-gastos-${month}-${year}.xlsx`
  XLSX.writeFile(wb, fileName)
}
