import { supabase } from './client'

export const getPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createPaymentMethod = async (paymentMethod) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: user.id,
      ...paymentMethod
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updatePaymentMethod = async (id, paymentMethod) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .update(paymentMethod)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deletePaymentMethod = async (id) => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
