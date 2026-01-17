import { supabase } from './client'

export const getExpenses = async (filters = {}) => {
  let query = supabase
    .from('expenses')
    .select(`
      *,
      category:categories(id, name, color),
      payment_method:payment_methods(id, name)
    `)
    .order('expense_date', { ascending: false })
  
  // Aplicar filtros
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters.paymentMethodId) {
    query = query.eq('payment_method_id', filters.paymentMethodId)
  }
  if (filters.exactDate) {
    query = query.eq('expense_date', filters.exactDate)
  }
  if (filters.startDate) {
    query = query.gte('expense_date', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('expense_date', filters.endDate)
  }
  if (filters.month && filters.year) {
    const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const endDate = new Date(filters.year, filters.month, 0)
    const endDateStr = endDate.toISOString().split('T')[0]
    query = query.gte('expense_date', startDate).lte('expense_date', endDateStr)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const createExpense = async (expense) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      ...expense
    })
    .select(`
      *,
      category:categories(id, name, color),
      payment_method:payment_methods(id, name)
    `)
    .single()
  
  if (error) throw error
  return data
}

export const updateExpense = async (id, expense) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name, color),
      payment_method:payment_methods(id, name)
    `)
    .single()
  
  if (error) throw error
  return data
}

export const deleteExpense = async (id) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const getExpenseStats = async (month, year) => {
  const expenses = await getExpenses({ month, year })
  
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const count = expenses.length
  const avgPerDay = count > 0 ? total / new Date(year, month, 0).getDate() : 0
  
  // Agrupar por categoría
  const byCategory = {}
  expenses.forEach(exp => {
    const catName = exp.category?.name || 'Sin categoría'
    if (!byCategory[catName]) {
      byCategory[catName] = {
        name: catName,
        total: 0,
        count: 0,
        color: exp.category?.color || '#006239'
      }
    }
    byCategory[catName].total += parseFloat(exp.amount)
    byCategory[catName].count += 1
  })
  
  const categoryStats = Object.values(byCategory).sort((a, b) => b.total - a.total)
  
  return {
    total,
    count,
    avgPerDay,
    categoryStats,
    topCategory: categoryStats[0] || null
  }
}
