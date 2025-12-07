import { render, screen, waitFor } from '@testing-library/react'
import EstadisticasSection, { procesarClubes } from '@/components/dashboard/EstadisticasSection'
import '@testing-library/jest-dom'

// 1. MOCK DE RECHARTS (Evita errores de canvas/SVG)
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
    BarChart: () => <div>BarChart Mock</div>,
    PieChart: () => <div>PieChart Mock</div>,
  }
})

// 2. MOCK DE FETCH GLOBAL
global.fetch = jest.fn()

const mockFetchResponse = (url: string) => {
  // CASO 1: JUGADORES (Devolvemos 3)
  if (url.includes('/api/jugadores')) {
    return Promise.resolve({ 
        ok: true, 
        json: async () => ({ jugadores: [{}, {}, {}] }) 
    })
  }
  // CASO 2: TORNEOS (Devolvemos 2 - Número único)
  if (url.includes('/api/torneos')) {
    return Promise.resolve({ 
        ok: true, 
        json: async () => ({ torneos: [{ id: 1, nombre: 'Torneo A' }, { id: 2, nombre: 'Torneo B' }] }) 
    })
  }
  // CASO 3: PARTIDOS (Devolvemos 5 - Número único)
  if (url.includes('/api/partidos')) {
    return Promise.resolve({ 
        ok: true, 
        json: async () => ({ partidos: [
            { torneo_id: 1 }, { torneo_id: 1 }, // 2 del A
            { torneo_id: 2 }, { torneo_id: 2 }, { torneo_id: 2 } // 3 del B
        ] }) 
    })
  }
  // CASO 4: ELO (Datos básicos)
  if (url.includes('elo-por-categoria')) {
    return Promise.resolve({ 
        ok: true, 
        json: async () => ([{ categoria: 'A', elo_promedio: 1500 }]) 
    })
  }
  // CASO 5: CLUBES (Devolvemos 6 para activar la lógica de "Otros")
  if (url.includes('jugadores-por-club')) {
    return Promise.resolve({ 
        ok: true, 
        json: async () => ([
            { club: 'C1', jugadores: 10 },
            { club: 'C2', jugadores: 9 },
            { club: 'C3', jugadores: 8 },
            { club: 'C4', jugadores: 7 },
            { club: 'C5', jugadores: 6 },
            { club: 'C6', jugadores: 5 } // Este debería irse a "Otros"
        ]) 
    })
  }
  return Promise.reject(new Error('URL desconocida'))
}

describe('EstadisticasSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockImplementation(mockFetchResponse)
  })

  // TEST 1: Renderizado completo
  it('debe renderizar las estadísticas correctamente con datos únicos', async () => {
    render(<EstadisticasSection />)

    // Esperar a que desaparezca el loading
    await waitFor(() => {
        expect(document.getElementsByClassName('animate-pulse').length).toBe(0)
    })

    // VERIFICACIONES CON NÚMEROS ÚNICOS
    // Jugadores: 3
    expect(screen.getByText('Jugadores')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    // Torneos: 2
    expect(screen.getByText('Torneos')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    // Partidos: 5
    expect(screen.getByText('Partidos')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    
    // Gráficas
    expect(screen.getAllByText('BarChart Mock')).toHaveLength(1)
    expect(screen.getAllByText('PieChart Mock')).toHaveLength(1)
  })

  // TEST 2: Manejo de errores
  it('debe manejar errores de la API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fallo de API'))

    render(<EstadisticasSection />)

    await waitFor(() => {
        expect(document.getElementsByClassName('animate-pulse').length).toBe(0)
    })
    
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // TEST 3: Lógica pura de clubes (Para asegurar 100% coverage en la función exportada)
  it('Logic: debe agrupar clubes en "Otros" si hay más de 5', () => {
    const clubesMock = [
        { club: '1', jugadores: 10 },
        { club: '2', jugadores: 10 },
        { club: '3', jugadores: 10 },
        { club: '4', jugadores: 10 },
        { club: '5', jugadores: 10 },
        { club: '6', jugadores: 5 }, // Se va a otros
        { club: '7', jugadores: 5 }  // Se va a otros
    ]
    const resultado = procesarClubes(clubesMock)
    
    expect(resultado).toHaveLength(6) // 5 top + 1 otros
    expect(resultado[5].club).toBe('Otros')
    expect(resultado[5].jugadores).toBe(10) // 5 + 5
  })
})