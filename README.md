# 💰 Fluxo - Aplicación de Gestión de Gastos Personales

Una aplicación web moderna y completa para gestionar y analizar gastos personales, construida con Next.js, Supabase y Tailwind CSS.

## ✨ Características Principales

### 🔐 Autenticación

- Sistema de registro e inicio de sesión con Supabase Auth
- Verificación de correo electrónico obligatoria
- Protección de rutas privadas
- Cambio seguro de contraseña
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
  /app
  ├── app/
  │ ├── layout.js  
  │ ├── page.js # Landing Page
  │
  ├── components/
  │ ├── ui/ # Componentes shadcn/ui
  │ ├── layout/
  │ ├── dashboard/
  │ ├── expenses/
  │ ├── categories/
  │ ├── payment-methods/
  │ └── budgets/
  │
  ├── lib/
  │ ├── supabase/
  │ └── utils/
  │
  ├── contexts/
  │
  ├── .env  
  ├── package.json  
  ├── tailwind.config.js

````

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+ instalado
- Una cuenta de Supabase

### 2. Configurar Supabase

### 3. Configurar Variables de Entorno

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# App Configuration
NEXT_PUBLIC_BASE_URL=https://fluxoapp.vercel.app
CORS_ORIGINS=¿?
````

### 4. Instalar Dependencias

```bash
cd /app
npm install
```

### 5. Iniciar el Servidor

### 6. Acceder a la Aplicación

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias y reportes de bugs son bienvenidos.

## 📄 Licencia

Este proyecto es público, pero el creador, tuerre, se reserva la posesión de el y cualquier uso del mismo aparte de un buen forkeo, debe ser autorizado por tuerre.

## 👨‍💻 Autor

¡Disfruta gestionando tus gastos de manera inteligente! 💰✨
