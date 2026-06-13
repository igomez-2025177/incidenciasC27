import * as readline from "readline-sync";
import { crearIncidente, actualizarEstado, listarIncidentes, obtenerTodos } from "./service/service";
import { generarReporteDiario, generarReporteMensual, imprimirReporte } from "./reports/reportes";

function limpiar() {
  console.clear();
}

function encabezado() {
  console.log("=".repeat(50));
  console.log("   LABORATORIO C27 — Control de Incidentes");
  console.log("=".repeat(50));
}

function menu() {
  limpiar();
  encabezado();
  console.log("\n  1. Crear nuevo ticket");
  console.log("  2. Ver todos los tickets");
  console.log("  3. Actualizar estado de ticket");
  console.log("  4. Filtrar por prioridad");
  console.log("  5. Filtrar por estado");
  console.log("  6. Reporte diario");
  console.log("  7. Reporte mensual");
  console.log("  0. Salir\n");

  const opcion = readline.question("  Elige una opcion: ");
  return opcion;
}

function crearTicket() {
  limpiar();
  encabezado();
  console.log("\n  NUEVO TICKET\n");

  const titulo      = readline.question("  Titulo: ");
  const descripcion = readline.question("  Descripcion: ");
  const reportadoPor = readline.question("  Reportado por: ");

  console.log("\n  Prioridad:");
  console.log("  1. Baja");
  console.log("  2. Media");
  console.log("  3. Alta");
  const p = readline.question("  Elige: ");

  const prioridades = { "1": "baja", "2": "media", "3": "alta" } as const;
  const prioridad = prioridades[p as "1" | "2" | "3"] ?? "media";

  const inc = crearIncidente({ titulo, descripcion, reportadoPor, prioridad });
  console.log(`\n  Ticket creado: ${inc.id}`);
  readline.question("\n  Presiona Enter para continuar...");
}

function verTodos() {
  limpiar();
  encabezado();
  console.log("\n  TODOS LOS TICKETS\n");

  const todos = obtenerTodos();
  if (todos.length === 0) {
    console.log("  No hay incidentes registrados.");
  } else {
    todos.forEach((inc, i) => {
      console.log(`  ${i + 1}. [${inc.prioridad.toUpperCase()}] ${inc.titulo}`);
      console.log(`     Estado: ${inc.estado} | Por: ${inc.reportadoPor}`);
      console.log(`     ID: ${inc.id}\n`);
    });
  }
  readline.question("  Presiona Enter para continuar...");
}

function actualizarTicket() {
  limpiar();
  encabezado();
  console.log("\n  ACTUALIZAR ESTADO\n");

  const todos = obtenerTodos();
  if (todos.length === 0) {
    console.log("  No hay incidentes registrados.");
    readline.question("\n  Presiona Enter para continuar...");
    return;
  }

  todos.forEach((inc, i) => {
    console.log(`  ${i + 1}. [${inc.estado}] ${inc.titulo}`);
  });

  const idx = parseInt(readline.question("\n  Numero del ticket: ")) - 1;
  const inc = todos[idx];

  if (!inc) {
    console.log("  Numero invalido.");
    readline.question("\n  Presiona Enter para continuar...");
    return;
  }

  console.log(`\n  Ticket: ${inc.titulo}`);
  console.log(`  Estado actual: ${inc.estado}`);
  console.log("\n  Nuevo estado:");
  console.log("  1. En progreso");
  console.log("  2. Resuelto");

  const op = readline.question("  Elige: ");
  const estados = { "1": "en_progreso", "2": "resuelto" } as const;
  const nuevoEstado = estados[op as "1" | "2"];

  if (!nuevoEstado) {
    console.log("  Opcion invalida.");
    readline.question("\n  Presiona Enter para continuar...");
    return;
  }

  try {
    actualizarEstado({ id: inc.id, nuevoEstado });
    console.log(`\n   Estado actualizado a: ${nuevoEstado}`);
  } catch (e) {
    console.log(`\n  Error: ${(e as Error).message}`);
  }

  readline.question("\n  Presiona Enter para continuar...");
}

function filtrarPor(campo: "prioridad" | "estado") {
  limpiar();
  encabezado();

  let valor: string;

  if (campo === "prioridad") {
    console.log("\n  FILTRAR POR PRIORIDAD\n");
    console.log("  1. Baja  2. Media  3. Alta");
    const op = readline.question("  Elige: ");
    const map = { "1": "baja", "2": "media", "3": "alta" };
    valor = map[op as "1" | "2" | "3"] ?? "baja";
  } else {
    console.log("\n  FILTRAR POR ESTADO\n");
    console.log("  1. Abierto  2. En progreso  3. Resuelto");
    const op = readline.question("  Elige: ");
    const map = { "1": "abierto", "2": "en_progreso", "3": "resuelto" };
    valor = map[op as "1" | "2" | "3"] ?? "abierto";
  }

  const resultado = listarIncidentes({ [campo]: valor } as any);
  console.log(`\n  Resultados (${resultado.length}):\n`);

  if (resultado.length === 0) {
    console.log("  Sin resultados.");
  } else {
    resultado.forEach(inc => {
      console.log(`  • ${inc.titulo}`);
      console.log(`    Estado: ${inc.estado} | Por: ${inc.reportadoPor}\n`);
    });
  }

  readline.question("  Presiona Enter para continuar...");
}

let corriendo = true;
while (corriendo) {
  const opcion = menu();
  switch (opcion) {
    case "1": crearTicket(); break;
    case "2": verTodos(); break;
    case "3": actualizarTicket(); break;
    case "4": filtrarPor("prioridad"); break;
    case "5": filtrarPor("estado"); break;
    case "6": limpiar(); encabezado(); imprimirReporte(generarReporteDiario()); readline.question("\n  Presiona Enter para continuar..."); break;
    case "7": limpiar(); encabezado(); imprimirReporte(generarReporteMensual()); readline.question("\n  Presiona Enter para continuar..."); break;
    case "0": corriendo = false; console.log("\n  Hasta luego.\n"); break;
    default: console.log("  Opcion invalida."); readline.question("\n  Presiona Enter para continuar...");
  }
}