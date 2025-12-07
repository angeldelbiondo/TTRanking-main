import { 
    calcularPartidosPorTorneo, 
    formatTooltipBar, 
    formatTooltipPie, 
    formatLabelPie 
  } from '@/components/dashboard/EstadisticasSection'
  
  describe('Helper: calcularPartidosPorTorneo', () => {
    it('debe contar correctamente los partidos por torneo', () => {
      const torneosMock = [{ id: 1, nombre: 'Torneo A' }, { id: 2, nombre: 'Torneo B' }]
      const partidosMock = [{ torneo_id: 1 }, { torneo_id: 1 }, { torneo_id: 2 }, { torneo_id: 99 }] as any[]
  
      const resultado = calcularPartidosPorTorneo(torneosMock, partidosMock)
  
      expect(resultado).toHaveLength(2)
      expect(resultado[0].nombre).toBe('Torneo A')
      expect(resultado[0].partidos).toBe(2)
      expect(resultado[1].nombre).toBe('Torneo B')
      expect(resultado[1].partidos).toBe(1)
    })
  
    it('debe devolver 0 si no hay partidos para el torneo', () => {
      const torneosMock = [{ id: 1, nombre: 'Torneo Vacio' }]
      const partidosMock = [] as any[]
      const resultado = calcularPartidosPorTorneo(torneosMock, partidosMock)
      expect(resultado[0].partidos).toBe(0)
    })
  })
  
  // --- NUEVOS TESTS PARA FORMATTERS ---
  describe('Formatters de Gráficas', () => {
    it('formatTooltipBar debe formatear correctamente', () => {
        const resultado = formatTooltipBar(1500)
        expect(resultado).toEqual(['1500', 'Promedio'])
    })

    it('formatTooltipPie debe formatear correctamente', () => {
        const resultado = formatTooltipPie(10)
        expect(resultado).toEqual(['10 jugadores'])
    })

    it('formatLabelPie debe calcular el porcentaje', () => {
        // Simulamos el objeto que devuelve Recharts ({ name, percent })
        const payload = { name: 'Club A', percent: 0.3333 }
        const resultado = formatLabelPie(payload)
        // 0.3333 * 100 = 33.33 -> toFixed(0) = 33%
        expect(resultado).toBe('Club A: 33%')
    })
  })