'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { 
  X,
  Zap, 
  Lock,
  Menu,
  Target,
  Wallet,
  Github,
  PieChart, 
  BarChart3,
  DollarSign,
  ArrowRight,
  TrendingUp, 
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Gestiona tus Gastos',
    description: 'Registra y organiza todos tus gastos de forma rápida y eficiente'
  },
  {
    icon: PieChart,
    title: 'Análisis Detallados',
    description: 'Visualiza tus gastos con gráficos y reportes inteligentes'
  },
  {
    icon: Target,
    title: 'Presupuestos',
    description: 'Establece límites y controla tu dinero de forma más inteligente'
  },
  {
    icon: TrendingUp,
    title: 'Seguimiento en Tiempo Real',
    description: 'Monitorea tu salud financiera con actualizaciones instantáneas'
  },
  {
    icon: Lock,
    title: 'Seguridad Garantizada',
    description: 'Tus datos están protegidos con los más altos estándares de seguridad'
  },
  {
    icon: BarChart3,
    title: 'Reportes Personalizados',
    description: 'Genera reportes detallados para tomar mejores decisiones'
  }
]

const benefits = [
  'Dashboard intuitivo y fácil de usar',
  'Múltiples categorías de gastos',
  'Métodos de pago flexible',
  'Exporta tus datos en Excel',
  'Interfaz responsiva',
  'Disponible 24/7'
]

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 font-bold text-xl">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="hidden font-medium sm:inline">Fluxo</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm hover:text-primary transition">
                Características
              </Link>
              <Link href="#benefits" className="text-sm hover:text-primary transition">
                Beneficios
              </Link>
              <Link href="#cta" className="text-sm hover:text-primary transition">
                Contacto
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <a data-size="tiny" type="button" class="relative justify-center cursor-pointer items-center space-x-2 text-center font-regular ease-out duration-200 rounded-lg outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-[#006239] dark:bg-[#006239] hover:bg-[#006239]/80 dark:hover:bg-[#006239]/80 text-foreground border-[#028a51]/75 dark:border-[#028a51]/30 hover:border-[#028a51]/60 dark:hover:border-[#028a51]/60 focus-visible:outline-[#028a51]/60 data-[state=open]:bg-[#006239]/80 dark:data-[state=open]:bg-[#006239]/80 data-[state=open]:outline-[#028a51]/60 text-xs px-2.5 py-1 h-[26px] hidden lg:block" tabindex="0" href="/dashboard"><span class="truncate">Dashboard</span></a>
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-10 h-10 rounded-full bg-[#006239] flex items-center justify-center text-white font-regular hover:bg-[#00522a] transition-colors border-[#028a51]/75 dark:border-[#028a51]/30 hover:border-[#028a51]/60 dark:hover:border-[#028a51]/60 lowercase"
                  >
                    {userInitial}
                  </button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/login')}
                    className="hidden sm:inline-flex"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    onClick={() => router.push('/register')} className="bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
                  >
                    Registrarse
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
              <Link href="#features" className="block text-sm hover:text-primary transition py-2">
                Características
              </Link>
              <Link href="#benefits" className="block text-sm hover:text-primary transition py-2">
                Beneficios
              </Link>
              <Link href="#cta" className="block text-sm hover:text-primary transition py-2">
                Contacto
              </Link>
              {!user && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    onClick={() => router.push('/register')}
                    className="w-full bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <section className="pt-64 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className='flex justify-center mb-10'>
          <div class="relative w-fit max-w-xl flex justify-center">
          <a target="_blanc" class="announcement-link text-nowrap group/announcement relative flex flex-row items-center p-2 pr-0.5 text-sm w-auto gap-1.5 text-left rounded-full hover:border-foreground-muted hover:border-opacity-30 shadow-md overflow-hidden focus-visible:outline-none focus-visible:ring-brand-600 focus-visible:ring-2 focus-visible:rounded-full pl-5 bg-[#202120]" href="https://github.com/tuerre/FluxoApp">
          <span class="text-foreground announcement-text line-clamp-1 w-full hidden md:[display:-webkit-box]">Fluxo Beta 2026: Your Dominican expenses App</span>
          <span class="text-foreground announcement-text-mobile md:hidden line-clamp-1">Your Dominican expenses App</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right announcement-icon h-4 ml-2 -translate-x-1 text-foreground transition-transform group-hover/announcement:translate-x-0"><path d="m9 18 6-6-6-6"></path>
          </svg>
          <div class="announcement-overlay absolute inset-0 -z-10 bg-gradient-to-r from-[#006239]/20 to-[#006239]/5 blur-3xl transition-opacity overflow-hidden rounded-full backdrop-blur-md ">
          </div>
          </a>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
                Controla tu Dinero con
                <span className="text-primary"> Fluxo</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                La forma más inteligente y sencilla de gestionar tus gastos, presupuestos y alcanzar tus objetivos financieros.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
                >
                  Ir al Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg"
                    onClick={() => router.push('/register')}
                    className="bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
                  >
                    Comenzar Gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/login')}
                  >
                    Ya tengo cuenta
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[#006239]/20 border-2 border-background flex items-center justify-center text-xs font-bold text-[#006239]"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Únete a cientos de usuarios que controlan sus finanzas
              </p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#006239]/20 to-[#006239]/5 rounded-2xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Resumen Financiero</h3>
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Gastos este mes</span>
                    <span className="font-bold">RD$ 15,250.00</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>65% del presupuesto</span>
                    <span>RD$ 35,000.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categorías</span>
                  <span className="font-bold">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Métodos de Pago</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Presupuestos Activos</span>
                  <span className="font-bold">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Características Poderosas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para tomar control de tus finanzas en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-gray-700 transition group"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Por qué elegir Fluxo?
              </h2>
              <p className="text-lg text-muted-foreground">
                Fluxo es más que una app de gastos. Es tu socio financiero personal que te ayuda a entender, controlar y optimizar tu dinero.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#006239]/20 to-[#006239]/5 rounded-2xl blur-3xl"></div>
              <div className="relative space-y-4">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-gray-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Crecimiento Mensual</p>
                      <p className="text-2xl font-bold">+23%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:border-gray-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo Ahorrado</p>
                      <p className="text-2xl font-bold">5+ horas</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:border-gray-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Precisión en Reportes</p>
                      <p className="text-2xl font-bold">100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              ¿Listo para transformar tus Finanzas?
            </h2>
            <p className="text-lg text-muted-foreground">
              Comienza hoy mismo y obtén acceso a todas nuestras características de forma gratuita.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
              >
                Acceder al Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-[#006239] px-4 font-regular font-regular border border-[#028a51] hover:border-[#028a51]/75 transition-colors rounded-lg hover:bg-[#006239]/90"
                >
                  Crear Cuenta Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/login')}
                >
                  Iniciar Sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold">Fluxo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Fluxo. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                Privacidad
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                Términos
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                Soporte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
