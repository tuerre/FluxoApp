'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { User, Lock, Palette, LogOut, Trash2, Settings } from 'lucide-react'
import { getUserSettings, updateUserSettings } from '@/lib/supabase/settings'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [appearanceDialogOpen, setAppearanceDialogOpen] = useState(false)
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const [selectedCurrency, setSelectedCurrency] = useState('DOP')
  const [selectedTheme, setSelectedTheme] = useState('dark')

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Perfil'
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const userSettings = await getUserSettings()
      setSettings(userSettings)
      setSelectedCurrency(userSettings.currency)
      setSelectedTheme(userSettings.theme)
    } catch (error) {
      console.error('Error al cargar configuración:', error)
      toast.error('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      toast.success('Contraseña actualizada exitosamente')
      setPasswordDialogOpen(false)
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      toast.error('Error al cambiar la contraseña')
    }
  }

  const handleUpdateCurrency = async () => {
    try {
      await updateUserSettings({ currency: selectedCurrency })
      toast.success('Moneda actualizada exitosamente')
      await loadSettings()
      setCurrencyDialogOpen(false)
    } catch (error) {
      console.error('Error al actualizar moneda:', error)
      toast.error('Error al actualizar la moneda')
    }
  }

  const handleUpdateTheme = async () => {
    try {
      await updateUserSettings({ theme: selectedTheme })
      setTheme(selectedTheme)
      toast.success('Tema actualizado exitosamente')
      await loadSettings()
      setAppearanceDialogOpen(false)
    } catch (error) {
      console.error('Error al actualizar tema:', error)
      toast.error('Error al actualizar el tema')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Nota: La eliminación completa de la cuenta requiere privilegios de administrador
      // Por ahora solo cerramos sesión y mostramos un mensaje
      toast.info('Por favor contacta al soporte para eliminar tu cuenta')
      setDeleteDialogOpen(false)
      // await signOut()
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      toast.error('Error al eliminar la cuenta')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu cuenta y configuración</p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">{userInitial}</span>
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.email}</CardTitle>
                <CardDescription>Miembro desde {new Date(user?.created_at).toLocaleDateString('es-DO')}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Información de la Cuenta</CardTitle>
                  <CardDescription>Tu información personal</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Correo electrónico</Label>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">ID de usuario</Label>
              <p className="text-sm font-mono">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Gestiona tu contraseña</CardDescription>
                </div>
              </div>
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Cambiar Contraseña</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                      Ingresa tu nueva contraseña
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Actualizar Contraseña
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
                </div>
              </div>
              <Dialog open={appearanceDialogOpen} onOpenChange={setAppearanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Editar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Apariencia</DialogTitle>
                    <DialogDescription>
                      Elige el tema de la aplicación
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAppearanceDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateTheme}>
                      Guardar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Tema actual: <span className="font-semibold">{theme === 'dark' ? 'Oscuro' : 'Claro'}</span></p>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Configuración de Moneda</CardTitle>
                  <CardDescription>Configura tu moneda preferida</CardDescription>
                </div>
              </div>
              <Dialog open={currencyDialogOpen} onOpenChange={setCurrencyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Editar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Moneda</DialogTitle>
                    <DialogDescription>
                      Selecciona tu moneda preferida
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Moneda</Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DOP">RD$ - Peso Dominicano</SelectItem>
                          <SelectItem value="USD">$ - Dólar Estadounidense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCurrencyDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateCurrency}>
                      Guardar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Moneda actual: <span className="font-semibold">{settings?.currency === 'DOP' ? 'RD$ (Peso Dominicano)' : '$ (Dólar)'}</span></p>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Cerrar Sesión</CardTitle>
                  <CardDescription>Sal de tu cuenta de forma segura</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={signOut}>
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Delete Account */}
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                  <CardDescription>Eliminar cuenta permanentemente</CardDescription>
                </div>
              </div>
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Eliminar Cuenta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                      y todos tus datos de nuestros servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Sí, eliminar mi cuenta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      </div>
    </AppLayout>
  )
}
