const fs = require('fs');
const path = require('path');

const lcovPath = path.join(__dirname, 'coverage', 'lcov.info');
const outputPath = path.join(__dirname, 'coverage', 'merged-lcov.info');

if (!fs.existsSync(lcovPath)) {
    console.error("❌ ERROR: No encuentro coverage/lcov.info. Ejecuta 'npm test' primero.");
    process.exit(1);
}

let content = fs.readFileSync(lcovPath, 'utf8');
console.log("1. Leído archivo LCOV original.");

// Convertir todas las barras invertidas de Windows a normales
content = content.replace(/\\/g, '/');

// TRUCO MAESTRO: Reemplazo con Regex agresivo
// Busca cualquier cosa que termine en "/src/" y lo reemplaza solo por "src/"
// Esto elimina C:/Users/Tu Nombre con Espacios/Desktop/... de un golpe.
content = content.replace(/^SF:.*\/src\//gm, 'SF:src/');

// FILTRO DE ORO:
// Vamos a asegurarnos de que el archivo EstadisticasSection se llame EXACTAMENTE como Sonar espera.
// Si el script ve el archivo, lo dejará listo.
if (content.includes('EstadisticasSection.tsx')) {
    console.log("✅ Encontrado test de EstadisticasSection. Rutas corregidas.");
} else {
    console.warn("⚠️ OJO: No vi EstadisticasSection en el reporte. ¿Seguro que npm test corrió bien?");
}

fs.writeFileSync(outputPath, content);
console.log("🚀 Archivo arreglado guardado en: " + outputPath);