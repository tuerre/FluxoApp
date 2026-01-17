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
  - Nombre del gasto
  - Monto
  - Fecha (selector de día, mes y año)
  - Categoría
  - Método de pago
  - Asociación a presupuesto
  - Descripción opcional
- Sistema de filtros avanzados:
  - Por fecha exacta
  - Por rango de fechas
  - Por categoría
  - Por método de pago
- Importación de gastos desde Excel/JSON
- Vista de lista con tags coloridos

### 🏷️ Categorías
- Creación y gestión de categorías
- Personalización con colores pastel predefinidos
- Selector de color personalizado
- Descripción opcional
- Estado vacío amigable

### 💳 Métodos de Pago
- CRUD completo de métodos de pago
- Detalles opcionales (banco, últimos 4 dígitos, etc.)
- Vista en grid responsive

### 🎯 Presupuestos
- Presupuestos mensuales
- Seguimiento automático de gastos
- Visualización de progreso con barra de progreso
- Indicadores de alerta:
  - Verde: < 80% gastado
  - Amarillo: 80-100% gastado
  - Rojo: > 100% gastado (excedido)
- Asociación de gastos a presupuestos

### 📈 Reportes Financieros
- Selector de mes y año
- Estadísticas del período:
  - Gasto mensual total
  - Promedio diario
  - Categoría principal
  - Variación vs mes anterior
- Gráficos interactivos con Recharts:
  - **Gráfico Circular**: Distribución por categoría
  - **Gráfico de Barras**: Top 4 categorías
  - **Gráfico de Línea**: Tendencia de los últimos 6 meses
- Exportación a Excel con:
  - Resumen mensual
  - Métricas clave
  - Desglose por categoría
  - Gastos detallados

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
│   ├── layout.js                    # Layout principal con providers
│   ├── page.js                      # Página de redirección
│   ├── globals.css                  # Estilos globales
│   ├── login/page.js                # Página de login
│   ├── register/page.js             # Página de registro
│   ├── dashboard/page.js            # Dashboard principal
│   ├── expenses/page.js             # Gestión de gastos
│   ├── categories/page.js           # Gestión de categorías
│   ├── payment-methods/page.js      # Gestión de métodos de pago
│   ├── budgets/page.js              # Gestión de presupuestos
│   ├── reports/page.js              # Reportes financieros
│   └── profile/page.js              # Perfil de usuario
│
├── components/
│   ├── ui/                          # Componentes shadcn/ui
│   ├── layout/
│   │   └── AppLayout.js             # Layout con sidebar
│   ├── dashboard/
│   │   ├── StatsCard.js             # Card de estadísticas
│   │   └── RecentExpenses.js        # Lista de gastos recientes
│   ├── expenses/
│   │   ├── ExpenseForm.js           # Formulario de gastos
│   │   └── ExpenseFilters.js        # Filtros de gastos
│   ├── categories/
│   │   ├── CategoryCard.js          # Card de categoría
│   │   └── CategoryForm.js          # Formulario de categoría
│   ├── payment-methods/
│   │   ├── PaymentMethodCard.js     # Card de método de pago
│   │   └── PaymentMethodForm.js     # Formulario de método
│   └── budgets/
│       ├── BudgetCard.js            # Card de presupuesto
│       └── BudgetForm.js            # Formulario de presupuesto
│
├── lib/
│   ├── supabase/
│   │   ├── client.js                # Cliente de Supabase
│   │   ├── expenses.js              # Operaciones de gastos
│   │   ├── categories.js            # Operaciones de categorías
│   │   ├── payment-methods.js       # Operaciones de métodos
│   │   ├── budgets.js               # Operaciones de presupuestos
│   │   └── settings.js              # Configuración de usuario
│   └── utils/
│       ├── currency.js              # Formateo de moneda
│       ├── dates.js                 # Manejo de fechas
│       ├── excel.js                 # Exportación a Excel
│       └── import.js                # Importación de gastos
│
├── contexts/
│   └── AuthContext.js               # Context de autenticación
│
├── .env                             # Variables de entorno
├── package.json                     # Dependencias
├── tailwind.config.js               # Configuración de Tailwind
└── SUPABASE_SETUP_GUIDE.md         # Guía de configuración de Supabase
```

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+ instalado
- Una cuenta de Supabase (gratuita)
- yarn instalado

### 2. Configurar Supabase

**Sigue la guía completa en `SUPABASE_SETUP_GUIDE.md`**

Pasos resumidos:
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los scripts SQL para crear las tablas
3. Configura Row Level Security (RLS)
4. Habilita la autenticación por email
5. Obtén las credenciales (URL y ANON KEY)

### 3. Configurar Variables de Entorno

Edita el archivo `.env` con tus credenciales de Supabase:

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

El servidor Next.js ya está configurado para iniciar automáticamente con supervisor.

Para reiniciar manualmente:
```bash
sudo supervisorctl restart nextjs
```

### 6. Acceder a la Aplicación

Abre tu navegador y ve a:
- **Desarrollo**: http://localhost:3000
- **Producción**: https://gastosapp-2.preview.emergentagent.com

## 📊 Base de Datos

### Tablas Principales

#### `categories`
- Categorías de gastos
- Campos: name, description, color
- RLS habilitado

#### `payment_methods`
- Métodos de pago
- Campos: name, details
- RLS habilitado

#### `budgets`
- Presupuestos mensuales
- Campos: name, amount, month, year
- RLS habilitado

#### `expenses`
- Gastos registrados
- Campos: name, amount, expense_date, category_id, payment_method_id, budget_id, description
- RLS habilitado
- Índices optimizados para consultas

#### `user_settings`
- Configuración de usuario
- Campos: currency, theme
- RLS habilitado

### Políticas de Seguridad (RLS)

Todas las tablas tienen políticas RLS que garantizan que:
- Los usuarios solo pueden ver sus propios datos
- Los usuarios solo pueden crear/editar/eliminar sus propios registros
- Seguridad a nivel de base de datos

## 🎨 Personalización

### Colores de Categorías

Colores pastel predefinidos:
- Rojo: `#FFB3BA`
- Amarillo: `#FFFFBA`
- Naranja: `#FFDFBA`
- Verde: `#BAFFC9`
- Azul: `#BAE1FF`
- Morado: `#E0BBE4`
- Rosado: `#FFD1DC`
- Celeste: `#C7CEEA`
- Azul Cielo: `#09f`

### Temas

- **Tema Oscuro** (por defecto):
  - Background: `#121212`
  - Text: `#FAFAFA`
  - Primary: `#006239`

- **Tema Claro**:
  - Background: `#FFFFFF`
  - Text: `#0A0A0A`
  - Primary: `#006239`

### Monedas Soportadas

- **DOP** (Peso Dominicano): RD$
- **USD** (Dólar): $

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

Características responsive:
- Sidebar colapsable en móvil
- Grid adaptativo
- Formularios optimizados
- Gráficos responsive con Recharts

## 🔒 Seguridad

### Implementaciones de Seguridad

1. **Row Level Security (RLS)**
   - Todas las operaciones de base de datos están protegidas
   - Los usuarios solo acceden a sus propios datos

2. **Autenticación**
   - Tokens JWT gestionados por Supabase
   - Verificación de email obligatoria
   - Sesiones seguras

3. **Validaciones**
   - Validación en frontend
   - Validación en base de datos (constraints)
   - Sanitización de inputs

4. **Variables de Entorno**
   - Credenciales nunca expuestas en el código
   - Solo keys públicas (anon key) en el frontend

## 📝 Uso de la Aplicación

### Flujo Básico

1. **Registro**
   - Crea una cuenta con email y contraseña
   - Verifica tu email
   - Inicia sesión

2. **Configuración Inicial**
   - Crea algunas categorías (ej: Alimentación, Transporte, Entretenimiento)
   - Crea métodos de pago (ej: Efectivo, Tarjeta VISA)
   - (Opcional) Crea un presupuesto mensual

3. **Registrar Gastos**
   - Ve a "Gastos"
   - Haz clic en "Registrar Gasto"
   - Completa el formulario
   - Guarda

4. **Ver Reportes**
   - Ve a "Reportes"
   - Selecciona mes y año
   - Analiza tus gráficos
   - Exporta a Excel si lo necesitas

5. **Gestionar Presupuestos**
   - Ve a "Presupuestos"
   - Crea un presupuesto para el mes
   - Los gastos se asociarán automáticamente
   - Monitorea el progreso

### Tips de Uso

- **Categorías**: Crea categorías específicas pero no demasiadas (5-10 es ideal)
- **Presupuestos**: Define presupuestos realistas basados en tus gastos históricos
- **Descripciones**: Usa el campo de descripción para detalles importantes
- **Filtros**: Usa los filtros para encontrar gastos específicos rápidamente
- **Reportes**: Revisa tus reportes mensualmente para ajustar hábitos

## 🐛 Solución de Problemas

### Error: "Invalid supabaseUrl"
**Causa**: Las variables de entorno de Supabase no están configuradas.
**Solución**: Edita el archivo `.env` con tus credenciales de Supabase.

### Error al iniciar sesión
**Causa**: Email no verificado o credenciales incorrectas.
**Solución**: 
1. Verifica tu email en la bandeja de entrada
2. Asegúrate de usar las credenciales correctas
3. Intenta restablecer tu contraseña si es necesario

### Los gastos no aparecen
**Causa**: Filtros activos o problema de RLS.
**Solución**:
1. Limpia los filtros
2. Verifica que las políticas RLS estén correctamente configuradas
3. Revisa la consola del navegador para errores

### Error al exportar a Excel
**Causa**: Datos insuficientes o error en el formato.
**Solución**: Asegúrate de tener al menos un gasto registrado en el mes seleccionado.

## 🚀 Funcionalidades Futuras (Roadmap)

- [ ] Importación masiva de gastos desde Excel/CSV
- [ ] Gráficos adicionales (comparaciones, tendencias personalizadas)
- [ ] Recordatorios de presupuestos
- [ ] Múltiples monedas con conversión automática
- [ ] Gastos recurrentes
- [ ] Exportación a PDF
- [ ] Compartir reportes
- [ ] Aplicación móvil (PWA)
- [ ] Integración con bancos (Open Banking)
- [ ] Análisis con IA (predicciones, recomendaciones)

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias y reportes de bugs son bienvenidos.

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Next.js, Supabase y Tailwind CSS.

---

## 📞 Soporte

Si tienes problemas con:
- **Configuración de Supabase**: Consulta `SUPABASE_SETUP_GUIDE.md`
- **Errores de la aplicación**: Revisa los logs del servidor
- **Preguntas generales**: Revisa este README

---

¡Disfruta gestionando tus gastos de manera inteligente! 💰✨
