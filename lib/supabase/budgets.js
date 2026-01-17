import { supabase } from './client'
import { getExpenses } from './expenses'

export const getBudgets = async () => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })
  
  if (error) throw error
  
  // Calcular gastos por presupuesto
  const budgetsWithExpenses = await Promise.all(
    data.map(async (budget) => {
      const expenses = await getExpenses({ month: budget.month, year: budget.year })
      const spent = expenses
        .filter(exp => !budget.id || exp.budget_id === budget.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      
      return {
        ...budget,
        spent,
        remaining: parseFloat(budget.amount) - spent,
        progress: (spent / parseFloat(budget.amount)) * 100
      }
    })
  )
  
  return budgetsWithExpenses
}

export const createBudget = async (budget) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: user.id,
      ...budget
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateBudget = async (id, budget) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(budget)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteBudget = async (id) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
