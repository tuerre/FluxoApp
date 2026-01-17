import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es })
}

export const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1)
  return format(date, 'MMMM yyyy', { locale: es })
}

export const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1]
}

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate()
}

export const getCurrentMonth = () => {
  return new Date().getMonth() + 1
}

export const getCurrentYear = () => {
  return new Date().getFullYear()
}

export const getLastSixMonths = () => {
  const months = []
  const today = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i)
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMM yyyy', { locale: es })
    })
  }
  
  return months
}
