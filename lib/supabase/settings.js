import { supabase } from './client'

export const getUserSettings = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    // Si no existe configuración, crear una por defecto
    if (error.code === 'PGRST116') {
      return await createUserSettings()
    }
    throw error
  }
  
  return data
}

export const createUserSettings = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('user_settings')
    .insert({
      user_id: user.id,
      currency: 'DOP',
      theme: 'dark'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateUserSettings = async (settings) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}
