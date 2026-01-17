# 💰 Fluxo - Aplicación de Gestión de Gastos Personales

Una aplicación web moderna y completa para gestionar y analizar gastos personales, construida con Next.js, Supabase y Tailwind CSS.

## ✨ Características Principales

### 🔐 Autenticación
- Sistema de registro e inicio de sesión con Supabase Auth
- Verificación de correo electrónico obligatoria
- Protección de rutas privadas
- Cambio seguro de contraseña

### 📊 Dashboard
- Resumen de gastos del mes actual
- Cards con estadísticas clave:
  - Total gastado
  - Número de transacciones
  - Categorías creadas
  - Promedio de gasto diario
- Lista de gastos recientes

### 💸 Gestión de Gastos
- CRUD completo de gastos
- Formulario detallado con:
- Sistema de filtros avanzados
- Importación de gastos desde Excel/JSON

### 💳 Métodos de Pago
- CRUD completo de métodos de pago
- Detalles opcionales (banco, últimos 4 dígitos, etc.)
- Vista en grid responsive

### 🎯 Presupuestos
- Presupuestos mensuales
- Seguimiento automático de gastos
- Visualización de progreso con barra de progreso
- Indicadores de alerta
- Asociación de gastos a presupuestos

### 📈 Reportes Financieros
- Selector de mes y año
- Estadísticas del período:
  - Gasto mensual total
  - Promedio diario
  - Categoría principal
  - Variación vs mes anterior
- Gráficos interactivos con Recharts:
- Exportación a Excel con

### 👤 Perfil de Usuario
- Información de la cuenta
- Cambio de contraseña
- Configuración de apariencia (tema claro/oscuro)
- Configuración de moneda (DOP/USD)
- Cerrar sesión
- Zona de peligro (eliminar cuenta)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** con tema personalizado
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interactivos
- **next-themes** - Sistema de temas
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas
- **xlsx** - Exportación a Excel
- **Sonner** - Notificaciones toast

### Backend
- **Supabase**
  - PostgreSQL (Base de datos)
  - Auth (Autenticación)
  - Row Level Security (RLS)
- **Node.js**

## 📁 Estructura del Proyecto

```
/app
├── app/
│   ├── layout.js          
│   ├── page.js                      # Landing Page
│
├── components/
│   ├── ui/                          # Componentes shadcn/ui
│   ├── layout/
│   ├── dashboard/
│   ├── expenses/
│   ├── categories/
│   ├── payment-methods/
│   └── budgets/
│
├── lib/
│   ├── supabase/
│   └── utils/
│
├── contexts/
│
├── .env                             
├── package.json                     
├── tailwind.config.js               
```

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+ instalado
- Una cuenta de Supabase
- yarn instalado

### 2. Configurar Supabase

### 3. Configurar Variables de Entorno

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# App Configuration
NEXT_PUBLIC_BASE_URL=https://gastosapp-2.preview.emergentagent.com
CORS_ORIGINS=*
```

### 4. Instalar Dependencias

```bash
cd /app
yarn install
```

### 5. Iniciar el Servidor

### 6. Acceder a la Aplicación

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias y reportes de bugs son bienvenidos.

## 📄 Licencia

Este proyecto es público, pero el creador, tuerre, se reserva la posesión de el y cualquier uso del mismo aparte de un buen forkeo, debe ser autorizado por tuerre.

## 👨‍💻 Autor

¡Disfruta gestionando tus gastos de manera inteligente! 💰✨
