const fs = require('fs');

const lcovPath = 'coverage/lcov.info';
const outPath = 'coverage/merged-lcov.info';

try {
    if (!fs.existsSync(lcovPath)) {
        console.error("❌ ERROR: No encuentro coverage/lcov.info. Ejecuta 'npm test' primero.");
        process.exit(1);
    }

    let content = fs.readFileSync(lcovPath, 'utf8');

    // SOLUCIÓN DEFINITIVA: Reemplazar TODAS las barras invertidas por barras normales
    // Esto funciona con tu path de Windows que tiene espacios.
    content = content.replace(/\\/g, '/');

    // Eliminamos cualquier posible prefijo absoluto de Windows (C:/...)
    // Aseguramos que la ruta inicie SIEMPRE con SF:src/
    content = content.replace(/^SF:.*?src\//gm, 'SF:src/');

    fs.writeFileSync(outPath, content);
    console.log("✅ Reporte LCOV 100% limpio y guardado en: " + outPath);

} catch (e) {
    console.error("❌ Error en el script de limpieza:", e);
}