import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // 1. Usamos Number.parseInt y agragamos la base 10 (radix) para evitar inferencias raras
    const clubId = Number.parseInt(id, 10)

    const body = await request.json()

    // 2. Usamos Number.isNaN que no hace coerción de tipos (es más estricto)
    if (Number.isNaN(clubId)) {
return NextResponse.json({ error: 'ID de club inválido' }, { status: 400 });
}

    try {
        const clubActualizado = await prisma.clubes.update({
            where: { id: clubId },
            data: body,
        })

        return NextResponse.json(clubActualizado)
    } catch (error) {
        console.error('Error al actualizar club:', error)
        return NextResponse.json({ error: 'Error al actualizar club' }, { status: 500 })
    }
}
