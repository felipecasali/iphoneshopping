/**
 * Script para testar geração de PDF do laudo
 * Uso: npm run test:pdf
 */

import { generateTechnicalReportPDF, downloadPDF } from '../src/lib/pdf-generator'

// Mock de dados completos para teste
const mockReport = {
  id: 'test-' + Date.now(),
  reportNumber: 'LDO-2026-' + Math.floor(Math.random() * 90000 + 10000),
  reportType: 'PREMIUM' as const,
  deviceModel: 'iPhone 15 Pro Max',
  deviceType: 'IPHONE' as const,
  storage: '256GB',
  color: 'Titânio Natural',
  imei: '356789012345678',
  serialNumber: 'F2LY3456ABC',
  
  // Condições físicas
  screenCondition: 'PERFEITO',
  screenConditionNotes: 'Sem arranhões ou marcas visíveis',
  bodyCondition: 'LEVES_MARCAS',
  bodyConditionNotes: 'Micro arranhões nas bordas laterais, normais de uso',
  cameraCondition: 'PERFEITO',
  cameraConditionNotes: 'Lentes sem arranhões, fotos nítidas',
  
  // Bateria
  batteryHealthPercent: 92,
  batteryHealthPhoto: null,
  
  // Testes funcionais (9/9 aprovados)
  touchWorking: true,
  faceIdWorking: true,
  wifiWorking: true,
  bluetoothWorking: true,
  speakersWorking: true,
  microphoneWorking: true,
  vibrationWorking: true,
  buttonsWorking: true,
  camerasWorking: true,
  
  // Status
  icloudFree: true,
  carrierUnlocked: true,
  hasWaterDamage: false,
  hasRepairs: false,
  repairDetails: null,
  
  // Acessórios (todos incluídos)
  hasBox: true,
  hasCharger: true,
  hasCable: true,
  hasEarphones: true,
  hasInvoice: true,
  hasPencil: false,
  hasKeyboard: false,
  
  // Fotos
  frontPhoto: null,
  backPhoto: null,
  sidesPhotos: null,
  screenOnPhoto: null,
  screenOffPhoto: null,
  imeiPhoto: null,
  boxPhoto: null,
  invoicePhoto: null,
  accessoriesPhotos: null,
  
  // Metadados
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
  evaluationId: 'eval-test',
  userId: 'user-test',
  validatedAt: null,
  validatedBy: null,
}

// Variações de teste para diferentes cenários
const testScenarios = {
  'excelente': {
    ...mockReport,
    deviceModel: 'iPhone 15 Pro Max',
    screenCondition: 'PERFEITO',
    bodyCondition: 'PERFEITO',
    batteryHealthPercent: 98,
    hasBox: true,
    hasCharger: true,
    hasCable: true,
    hasInvoice: true,
  },
  'bom': {
    ...mockReport,
    deviceModel: 'iPhone 14 Pro',
    screenCondition: 'LEVES_MARCAS',
    bodyCondition: 'LEVES_MARCAS',
    batteryHealthPercent: 85,
    hasBox: true,
    hasCharger: false,
  },
  'regular': {
    ...mockReport,
    deviceModel: 'iPhone 13',
    screenCondition: 'VISIVEIS_MARCAS',
    bodyCondition: 'VISIVEIS_MARCAS',
    batteryHealthPercent: 72,
    hasBox: false,
    hasCharger: true,
    wifiWorking: false,
  },
  'ruim': {
    ...mockReport,
    deviceModel: 'iPhone 12',
    screenCondition: 'TRINCADO',
    bodyCondition: 'DANIFICADO',
    batteryHealthPercent: 65,
    hasBox: false,
    hasCharger: false,
    hasCable: false,
    touchWorking: false,
    speakersWorking: false,
    hasWaterDamage: true,
  },
  'ipad': {
    ...mockReport,
    deviceModel: 'iPad Pro 11" M4 (2024)',
    deviceType: 'IPAD' as const,
    storage: '512GB',
    screenCondition: 'PERFEITO',
    bodyCondition: 'LEVES_MARCAS',
    batteryHealthPercent: 94,
    hasPencil: true,
    hasKeyboard: true,
    faceIdWorking: true,
  }
}

async function generateTestPDF(scenario: keyof typeof testScenarios = 'excelente') {
  console.log(`\n📄 Gerando PDF de teste: cenário "${scenario}"...\n`)
  
  const report = testScenarios[scenario]
  
  try {
    const pdfBlob = await generateTechnicalReportPDF(report as any)
    const filename = `Laudo_Teste_${scenario}_${report.reportNumber}.pdf`
    
    // Baixar automaticamente
    downloadPDF(pdfBlob, filename)
    
    console.log(`✅ PDF gerado com sucesso: ${filename}`)
    console.log(`📊 Detalhes do teste:`)
    console.log(`   - Modelo: ${report.deviceModel}`)
    console.log(`   - Tipo: ${report.reportType}`)
    console.log(`   - Nº Laudo: ${report.reportNumber}`)
    console.log(`   - Bateria: ${report.batteryHealthPercent}%`)
    console.log(`   - Condição Tela: ${report.screenCondition}`)
    console.log(`   - Condição Corpo: ${report.bodyCondition}`)
    console.log(`   - Acessórios: ${[report.hasBox && 'Caixa', report.hasCharger && 'Carregador', report.hasCable && 'Cabo', report.hasInvoice && 'NF'].filter(Boolean).join(', ') || 'Nenhum'}`)
    console.log(`\n💡 O PDF foi baixado automaticamente!\n`)
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error)
  }
}

// CLI handler
const scenarioArg = process.argv[2] || 'excelente'

if (scenarioArg === 'todos' || scenarioArg === 'all') {
  console.log('🔄 Gerando todos os cenários de teste...\n')
  Promise.all(
    Object.keys(testScenarios).map(async (key) => {
      await generateTestPDF(key as keyof typeof testScenarios)
      // Aguardar 500ms entre cada geração
      await new Promise(resolve => setTimeout(resolve, 500))
    })
  ).then(() => {
    console.log('\n✅ Todos os PDFs foram gerados!\n')
  })
} else if (scenarioArg in testScenarios) {
  const scenario = scenarioArg as keyof typeof testScenarios
  generateTestPDF(scenario)
} else {
  console.log(`
📄 Script de teste de geração de PDF

Uso: npm run test:pdf [cenário]

Cenários disponíveis:
  - excelente   (iPhone 15 Pro Max - condição perfeita, 98% bateria)
  - bom         (iPhone 14 Pro - leves marcas, 85% bateria)
  - regular     (iPhone 13 - marcas visíveis, 72% bateria)
  - ruim        (iPhone 12 - trincado, danificado, 65% bateria)
  - ipad        (iPad Pro 11" M4 - com Pencil e Keyboard)
  - todos       (gera todos os cenários acima)

Exemplo: npm run test:pdf excelente
  `)
}
