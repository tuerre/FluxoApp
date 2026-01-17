'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import PaymentMethodCard from '@/components/payment-methods/PaymentMethodCard'
import PaymentMethodForm from '@/components/payment-methods/PaymentMethodForm'
import { Button } from '@/components/ui/button'
import { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/lib/supabase/payment-methods'
import { Plus, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentMethodsPage() {
  const [loading, setLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  useEffect(() => {
    document.title = 'Fluxo App | Métodos de Pago'
  }, [])

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const data = await getPaymentMethods()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error)
      toast.error('Error al cargar los métodos de pago')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (methodData) => {
    try {
      await createPaymentMethod(methodData)
      toast.success('Método de pago creado exitosamente')
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error al crear método de pago:', error)
      if (error.message.includes('duplicate')) {
        toast.error('Ya existe un método de pago con ese nombre')
      } else {
        toast.error('Error al crear el método de pago')
      }
      throw error
    }
  }

  const handleUpdate = async (methodData) => {
    try {
      await updatePaymentMethod(editingMethod.id, methodData)
      toast.success('Método de pago actualizado exitosamente')
      setEditingMethod(null)
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error al actualizar método de pago:', error)
      toast.error('Error al actualizar el método de pago')
      throw error
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago? Los gastos asociados perderán su método de pago.')) return

    try {
      await deletePaymentMethod(id)
      toast.success('Método de pago eliminado exitosamente')
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error al eliminar método de pago:', error)
      toast.error('Error al eliminar el método de pago')
    }
  }

  const handleEdit = (method) => {
    setEditingMethod(method)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingMethod(null)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando métodos de pago...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Métodos de Pago</h1>
            <p className="text-muted-foreground">Gestiona tus métodos de pago</p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Método
          </Button>
        </div>

        {/* Payment Methods Grid */}
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay métodos de pago creados</h3>
            <p className="text-muted-foreground mb-4">
              Crea métodos de pago para organizar mejor tus gastos
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Método de Pago
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                paymentMethod={method}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Method Form */}
      <PaymentMethodForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingMethod ? handleUpdate : handleCreate}
        initialData={editingMethod}
      />
    </AppLayout>
  )
}
