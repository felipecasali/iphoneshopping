// Dados dos dispositivos Apple com preços de referência (valores em BRL)
export const DEVICES = [
  // iPhones 2024
  {
    type: 'IPHONE',
    model: 'iPhone 16 Pro Max',
    storage: [256, 512, 1024],
    colors: ['Titânio Deserto', 'Titânio Natural', 'Titânio Branco', 'Titânio Preto'],
    year: 2024,
    basePrice: 10499,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 16 Pro',
    storage: [128, 256, 512, 1024],
    colors: ['Titânio Deserto', 'Titânio Natural', 'Titânio Branco', 'Titânio Preto'],
    year: 2024,
    basePrice: 9299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 16 Plus',
    storage: [128, 256, 512],
    colors: ['Ultramarine', 'Teal', 'Rosa', 'Branco', 'Preto'],
    year: 2024,
    basePrice: 7999,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 16',
    storage: [128, 256, 512],
    colors: ['Ultramarine', 'Teal', 'Rosa', 'Branco', 'Preto'],
    year: 2024,
    basePrice: 7199,
  },
  // iPhones 2023
  {
    type: 'IPHONE',
    model: 'iPhone 15 Pro Max',
    storage: [256, 512, 1024],
    colors: ['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto'],
    year: 2023,
    basePrice: 9299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 15 Pro',
    storage: [128, 256, 512, 1024],
    colors: ['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto'],
    year: 2023,
    basePrice: 8299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 15 Plus',
    storage: [128, 256, 512],
    colors: ['Azul', 'Rosa', 'Amarelo', 'Verde', 'Preto'],
    year: 2023,
    basePrice: 7299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 15',
    storage: [128, 256, 512],
    colors: ['Azul', 'Rosa', 'Amarelo', 'Verde', 'Preto'],
    year: 2023,
    basePrice: 6499,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 14 Pro Max',
    storage: [128, 256, 512, 1024],
    colors: ['Roxo Profundo', 'Dourado', 'Prateado', 'Preto Espacial'],
    year: 2022,
    basePrice: 7499,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 14 Pro',
    storage: [128, 256, 512, 1024],
    colors: ['Roxo Profundo', 'Dourado', 'Prateado', 'Preto Espacial'],
    year: 2022,
    basePrice: 6799,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 14 Plus',
    storage: [128, 256, 512],
    colors: ['Azul', 'Roxo', 'Meia-noite', 'Luz das Estrelas', 'Vermelho'],
    year: 2022,
    basePrice: 5799,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 14',
    storage: [128, 256, 512],
    colors: ['Azul', 'Roxo', 'Meia-noite', 'Luz das Estrelas', 'Vermelho'],
    year: 2022,
    basePrice: 4999,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 13 Pro Max',
    storage: [128, 256, 512, 1024],
    colors: ['Verde-alpino', 'Prateado', 'Dourado', 'Grafite', 'Azul-sierra'],
    year: 2021,
    basePrice: 5999,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 13 Pro',
    storage: [128, 256, 512, 1024],
    colors: ['Verde-alpino', 'Prateado', 'Dourado', 'Grafite', 'Azul-sierra'],
    year: 2021,
    basePrice: 5299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 13',
    storage: [128, 256, 512],
    colors: ['Verde', 'Rosa', 'Azul', 'Meia-noite', 'Luz das Estrelas', 'Vermelho'],
    year: 2021,
    basePrice: 4199,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 12 Pro Max',
    storage: [128, 256, 512],
    colors: ['Grafite', 'Prateado', 'Dourado', 'Azul-pacífico'],
    year: 2020,
    basePrice: 4799,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 12 Pro',
    storage: [128, 256, 512],
    colors: ['Grafite', 'Prateado', 'Dourado', 'Azul-pacífico'],
    year: 2020,
    basePrice: 4199,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 12',
    storage: [64, 128, 256],
    colors: ['Roxo', 'Azul', 'Verde', 'Vermelho', 'Branco', 'Preto'],
    year: 2020,
    basePrice: 3299,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 11 Pro Max',
    storage: [64, 256, 512],
    colors: ['Meia-noite Verde', 'Prateado', 'Dourado', 'Cinza Espacial'],
    year: 2019,
    basePrice: 3499,
  },
  {
    type: 'IPHONE',
    model: 'iPhone 11',
    storage: [64, 128, 256],
    colors: ['Roxo', 'Amarelo', 'Verde', 'Preto', 'Branco', 'Vermelho'],
    year: 2019,
    basePrice: 2499,
  },
  // iPads 2024-2023
  {
    type: 'IPAD',
    model: 'iPad Pro 13" M4 (2024)',
    storage: [256, 512, 1024, 2048],
    colors: ['Prateado', 'Cinza Espacial'],
    year: 2024,
    basePrice: 13999,
  },
  {
    type: 'IPAD',
    model: 'iPad Pro 11" M4 (2024)',
    storage: [256, 512, 1024, 2048],
    colors: ['Prateado', 'Cinza Espacial'],
    year: 2024,
    basePrice: 10999,
  },
  {
    type: 'IPAD',
    model: 'iPad Air 13" M2 (2024)',
    storage: [128, 256, 512, 1024],
    colors: ['Azul', 'Roxo', 'Luz das Estrelas', 'Cinza Espacial'],
    year: 2024,
    basePrice: 8999,
  },
  {
    type: 'IPAD',
    model: 'iPad Air 11" M2 (2024)',
    storage: [128, 256, 512, 1024],
    colors: ['Azul', 'Roxo', 'Luz das Estrelas', 'Cinza Espacial'],
    year: 2024,
    basePrice: 6999,
  },
  {
    type: 'IPAD',
    model: 'iPad (11ª geração)',
    storage: [64, 256],
    colors: ['Azul', 'Rosa', 'Amarelo', 'Prata'],
    year: 2024,
    basePrice: 4299,
  },
  {
    type: 'IPAD',
    model: 'iPad mini (7ª geração)',
    storage: [128, 256, 512],
    colors: ['Azul', 'Roxo', 'Luz das Estrelas', 'Cinza Espacial'],
    year: 2024,
    basePrice: 5299,
  },
  {
    type: 'IPAD',
    model: 'iPad Pro 12.9" (6ª geração)',
    storage: [128, 256, 512, 1024, 2048],
    colors: ['Prateado', 'Cinza Espacial'],
    year: 2022,
    basePrice: 11999,
  },
  {
    type: 'IPAD',
    model: 'iPad Pro 11" (4ª geração)',
    storage: [128, 256, 512, 1024, 2048],
    colors: ['Prateado', 'Cinza Espacial'],
    year: 2022,
    basePrice: 8999,
  },
  {
    type: 'IPAD',
    model: 'iPad Air (5ª geração)',
    storage: [64, 256],
    colors: ['Azul', 'Rosa', 'Roxo', 'Luz das Estrelas', 'Cinza Espacial'],
    year: 2022,
    basePrice: 5799,
  },
  {
    type: 'IPAD',
    model: 'iPad (10ª geração)',
    storage: [64, 256],
    colors: ['Azul', 'Rosa', 'Amarelo', 'Prata'],
    year: 2022,
    basePrice: 3999,
  },
  {
    type: 'IPAD',
    model: 'iPad mini (6ª geração)',
    storage: [64, 256],
    colors: ['Rosa', 'Luz das Estrelas', 'Roxo', 'Cinza Espacial'],
    year: 2021,
    basePrice: 4799,
  },
]

// Fatores de ajuste de preço baseado na condição
export const CONDITION_MULTIPLIERS = {
  NOVO: 0.95,           // 95% do preço novo
  EXCELENTE: 0.85,      // 85% do preço novo
  MUITO_BOM: 0.75,      // 75% do preço novo
  BOM: 0.65,            // 65% do preço novo
  REGULAR: 0.50,        // 50% do preço novo
  DEFEITO: 0.40,        // 40% do preço novo (aumentado de 0.30)
}

// Ajustes adicionais
export const ADJUSTMENTS = {
  hasBox: 150,           // + R$ 150
  hasCharger: 100,       // + R$ 100
  hasCable: 80,          // + R$ 80
  hasPencil: 400,        // + R$ 400 (Apple Pencil)
  hasKeyboard: 600,      // + R$ 600 (Teclado/Capa)
  hasInvoice: 200,       // + R$ 200
  hasWarranty: 300,      // + R$ 300
  icloudFree: 0,         // Obrigatório, não adiciona valor
  imeiClean: 0,          // Obrigatório, não adiciona valor
  batteryHealthGood: 0,  // >= 85% é esperado
  batteryHealthBad: -200, // < 80% desconta (reduzido de -300)
  batteryHealthTerrible: -400, // < 70% desconta mais (reduzido de -600)
  waterDamage: -300,     // Dano por água (reduzido de -500)
  functionalIssues: -300, // Problemas funcionais (reduzido de -400)
  screenPerfect: 0,
  screenLightScratches: -80,
  screenVisibleScratches: -200, // Reduzido de -300
  screenCracked: -500,   // Reduzido de -800
  bodyPerfect: 0,
  bodyLightMarks: -60,   // Reduzido de -80
  bodyVisibleMarks: -150, // Reduzido de -200
  bodyDented: -300,      // Reduzido de -400
}

// Depreciação mensal por tipo de aparelho
export const MONTHLY_DEPRECIATION = {
  IPHONE_PRO: 0.015,     // 1.5% ao mês (modelos Pro)
  IPHONE_REGULAR: 0.02,  // 2% ao mês (modelos regulares)
  IPAD: 0.018,           // 1.8% ao mês
}

// Função para calcular o preço de um dispositivo
export function calculateDevicePrice(evaluation: {
  device: typeof DEVICES[0]
  storage: number
  condition: keyof typeof CONDITION_MULTIPLIERS
  purchaseDate?: string
  hasBox: boolean
  hasCharger: boolean
  hasCable?: boolean
  hasPencil?: boolean
  hasKeyboard?: boolean
  hasInvoice?: boolean
  hasWarranty?: boolean
  icloudFree: boolean
  imeiClean?: boolean
  batteryHealth?: number
  screenCondition: string
  bodyCondition: string
  hasWaterDamage: boolean
  hasFunctionalIssues?: boolean
}) {
  let price = evaluation.device.basePrice

  // Ajuste por armazenamento
  const storageIndex = evaluation.device.storage.indexOf(evaluation.storage)
  if (storageIndex > 0) {
    price += storageIndex * 500 // +R$ 500 por tier de armazenamento
  }

  // Calcula depreciação por tempo de uso
  if (evaluation.purchaseDate) {
    const purchaseDate = new Date(evaluation.purchaseDate + '-01')
    const monthsOld = Math.max(0, 
      (new Date().getFullYear() - purchaseDate.getFullYear()) * 12 +
      (new Date().getMonth() - purchaseDate.getMonth())
    )
    
    let depreciationRate = MONTHLY_DEPRECIATION.IPHONE_REGULAR
    if (evaluation.device.type === 'IPAD') {
      depreciationRate = MONTHLY_DEPRECIATION.IPAD
    } else if (evaluation.device.model.includes('Pro')) {
      depreciationRate = MONTHLY_DEPRECIATION.IPHONE_PRO
    }
    
    // Aplica depreciação (mínimo de 40% do valor original)
    const depreciationFactor = Math.max(0.4, 1 - (monthsOld * depreciationRate))
    price *= depreciationFactor
  }

  // Aplica multiplicador de condição
  price *= CONDITION_MULTIPLIERS[evaluation.condition]

  // Ajustes por acessórios e documentação
  if (evaluation.hasBox) price += ADJUSTMENTS.hasBox
  if (evaluation.hasCharger) price += ADJUSTMENTS.hasCharger
  if (evaluation.hasCable) price += ADJUSTMENTS.hasCable
  if (evaluation.hasPencil) price += ADJUSTMENTS.hasPencil
  if (evaluation.hasKeyboard) price += ADJUSTMENTS.hasKeyboard
  if (evaluation.hasInvoice) price += ADJUSTMENTS.hasInvoice
  if (evaluation.hasWarranty) price += ADJUSTMENTS.hasWarranty

  // Ajustes por saúde da bateria (apenas iPhone)
  if (evaluation.device.type === 'IPHONE' && evaluation.batteryHealth) {
    if (evaluation.batteryHealth < 70) {
      price += ADJUSTMENTS.batteryHealthTerrible
    } else if (evaluation.batteryHealth < 80) {
      price += ADJUSTMENTS.batteryHealthBad
    }
  }

  // Ajustes por condição da tela
  switch (evaluation.screenCondition) {
    case 'PERFEITA':
      price += ADJUSTMENTS.screenPerfect
      break
    case 'LEVES_ARRANHOS':
      price += ADJUSTMENTS.screenLightScratches
      break
    case 'ARRANHOS_VISIVEIS':
      price += ADJUSTMENTS.screenVisibleScratches
      break
    case 'TRINCADA':
      price += ADJUSTMENTS.screenCracked
      break
  }

  // Ajustes por condição do corpo
  switch (evaluation.bodyCondition) {
    case 'PERFEITO':
      price += ADJUSTMENTS.bodyPerfect
      break
    case 'LEVES_MARCAS':
      price += ADJUSTMENTS.bodyLightMarks
      break
    case 'MARCAS_VISIVEIS':
      price += ADJUSTMENTS.bodyVisibleMarks
      break
    case 'AMASSADOS':
      price += ADJUSTMENTS.bodyDented
      break
  }

  // Ajustes por danos
  if (evaluation.hasWaterDamage) price += ADJUSTMENTS.waterDamage
  if (evaluation.hasFunctionalIssues) price += ADJUSTMENTS.functionalIssues

  // iCloud deve estar livre (obrigatório)
  if (!evaluation.icloudFree) {
    price = 0 // Não pode vender se iCloud estiver bloqueado
  }

  // IMEI deve estar limpo (obrigatório)
  if (evaluation.imeiClean === false) {
    price = 0 // Não pode vender se IMEI estiver bloqueado
  }

  // Garantir valor mínimo baseado no tipo de dispositivo e ano
  // Mesmo aparelhos antigos e com defeitos têm valor de peças/reposição
  if (price > 0) {
    const deviceAge = new Date().getFullYear() - evaluation.device.year
    let minValue = 300 // Valor mínimo padrão
    
    if (evaluation.device.type === 'IPHONE') {
      // iPhones mantêm valor por mais tempo
      if (deviceAge <= 2) minValue = 800      // Modelos recentes
      else if (deviceAge <= 4) minValue = 500 // 2-4 anos
      else minValue = 300                     // Mais de 4 anos
    } else if (evaluation.device.type === 'IPAD') {
      // iPads têm valor de revenda menor
      if (deviceAge <= 2) minValue = 600
      else if (deviceAge <= 4) minValue = 400
      else minValue = 250
    }
    
    price = Math.max(minValue, price)
  }

  return Math.max(0, Math.round(price))
}
