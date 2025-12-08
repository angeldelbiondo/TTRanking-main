import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const eloPorCategoria = await prisma.jugadores.groupBy({
            by: ['categoria_id'],
            _avg: {
                elo: true,
            },
            orderBy: {
                categoria_id: 'asc',
            },
        });

        const resultado = await Promise.all(
            eloPorCategoria.map(async (data: any) => { // <-- USAMOS 'any' TEMPORALMENTE PARA EVITAR EL ERROR DE COMPILACIÓN
                const categoria = await prisma.categorias.findUnique({
                    where: { id: data.categoria_id },
                    select: { nombre: true },
                });

                const categoriaNombre = categoria?.nombre || `ID ${data.categoria_id}`;
                const eloPromedio = data._avg.elo ? Math.round(data._avg.elo) : 0;

                return {
                    categoria: categoriaNombre,
                    elo_promedio: eloPromedio,
                };
            })
        );

        return NextResponse.json(resultado);
    } catch (error) {
        console.error("Error al obtener ELO por categoría:", error);
        return NextResponse.json({
            message: "Error al obtener estadísticas de ELO",
            status: 500
        }, { status: 500 });
    }
}