import * as XLSX from 'xlsx'

export const parseImportFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Leer la primera hoja
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        
        // Mapear los datos al formato esperado
        const expenses = jsonData.map(row => {
          // Intentar diferentes formatos de columnas
          const fecha = row.fecha || row.Fecha || row.date || row.Date
          const monto = row.monto || row.Monto || row.amount || row.Amount
          const categoria = row.categoria || row.Categoría || row.category || row.Category
          const metodo = row.metodo_pago || row['Método de Pago'] || row.payment_method || row['Payment Method']
          const descripcion = row.descripcion || row.Descripción || row.description || row.Description || ''
          const nombre = row.nombre || row.Nombre || row.name || row.Name || 'Gasto importado'
          
          if (!fecha || !monto) {
            throw new Error('Las columnas "fecha" y "monto" son obligatorias')
          }
          
          // Convertir fecha a formato YYYY-MM-DD
          let parsedDate
          if (typeof fecha === 'string') {
            // Intentar parsear DD/MM/YYYY o YYYY-MM-DD
            const parts = fecha.split(/[\/\-]/)
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                // YYYY-MM-DD
                parsedDate = fecha
              } else {
                // DD/MM/YYYY
                parsedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
              }
            }
          } else if (typeof fecha === 'number') {
            // Fecha de Excel (número de días desde 1900-01-01)
            const excelDate = XLSX.SSF.parse_date_code(fecha)
            parsedDate = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`
          }
          
          return {
            name: nombre,
            amount: parseFloat(monto),
            expense_date: parsedDate,
            category: categoria,
            payment_method: metodo,
            description: descripcion
          }
        })
        
        resolve(expenses)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    if (file.name.endsWith('.json')) {
      reader.readAsText(file)
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)
          const expenses = Array.isArray(jsonData) ? jsonData : [jsonData]
          resolve(expenses)
        } catch (error) {
          reject(new Error('Formato JSON inválido'))
        }
      }
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

export const validateImportData = (expenses, categories, paymentMethods) => {
  const errors = []
  const warnings = []
  const validExpenses = []
  
  const categoryNames = categories.map(c => c.name.toLowerCase())
  const paymentMethodNames = paymentMethods.map(p => p.name.toLowerCase())
  
  expenses.forEach((expense, index) => {
    const lineNumber = index + 1
    
    // Validaciones básicas
    if (!expense.amount || isNaN(expense.amount)) {
      errors.push(`Línea ${lineNumber}: Monto inválido`)
      return
    }
    
    if (!expense.expense_date) {
      errors.push(`Línea ${lineNumber}: Fecha inválida o faltante`)
      return
    }
    
    // Validar categoría
    if (expense.category) {
      const categoryExists = categoryNames.includes(expense.category.toLowerCase())
      if (!categoryExists) {
        warnings.push(`Línea ${lineNumber}: La categoría "${expense.category}" no existe. Deberás crearla.`)
      }
    }
    
    // Validar método de pago
    if (expense.payment_method) {
      const methodExists = paymentMethodNames.includes(expense.payment_method.toLowerCase())
      if (!methodExists) {
        warnings.push(`Línea ${lineNumber}: El método de pago "${expense.payment_method}" no existe. Deberás crearlo.`)
      }
    }
    
    validExpenses.push(expense)
  })
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validExpenses
  }
}
