import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const eloPorCategoria = await prisma.categorias.findMany({
      select: {
        nombre: true,
        jugadores: {
          select: {
            elo: true
          }
        }
      }
    });
    
  const result = eloPorCategoria.map((categoria: {
      nombre: string
      jugadores: { elo: number | null }[]
    }) => {
      const elos = categoria.jugadores
        .map((j: { elo: number | null }) => j.elo)
        .filter((elo: number | null): elo is number => elo !== null);

      const eloPromedio = elos.length > 0 
        ? elos.reduce((a: number, b: number) => a + b, 0) / elos.length
        : 0;
        
      return {
        categoria: categoria.nombre,
        elo_promedio: Math.round(eloPromedio)
      };
    });
    
    return NextResponse.json(result);
  }catch (error) {
    // 1. Registra el error real para que lo veas en los logs del servidor.
    console.error('Error en el endpoint elo-por-categoria:', error);
    // 2. Luego devuelve la respuesta al cliente
    return NextResponse.json(
        { message: "Error al obtener estadísticas" },
        { status: 500 }
    );
  }
}