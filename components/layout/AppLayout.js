'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  X,
  Tags,
  User,
  Menu,
  Wallet,
  Target,
  LogOut,
  BarChart3,
  CreditCard,
  LayoutDashboard,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Gastos', href: '/expenses' },
  { icon: Tags, label: 'Categorías', href: '/categories' },
  { icon: CreditCard, label: 'Métodos de Pago', href: '/payment-methods' },
  { icon: Target, label: 'Presupuestos', href: '/budgets' },
  { icon: BarChart3, label: 'Reportes', href: '/reports' },
  { icon: User, label: 'Perfil', href: '/profile' },
]

export default function AppLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">GastosApp</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (móvil) */}
        <header className="sticky top-0 z-30 lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold">GastosApp</span>
            </div>
            <div className="w-10" /> {/* Spacer para centrar el título */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
