import { Reporte, EstadoIncidente, Prioridad } from "../types/incidentes";
import { listarIncidentes } from "../service/service";

function inicioDelDia(f: Date): Date {
  const d = new Date(f); d.setHours(0,0,0,0); return d;
}
function finDelDia(f: Date): Date {
  const d = new Date(f); d.setHours(23,59,59,999); return d;
}
function inicioDelMes(f: Date): Date {
  return new Date(f.getFullYear(), f.getMonth(), 1);
}
function finDelMes(f: Date): Date {
  return new Date(f.getFullYear(), f.getMonth() + 1, 0, 23, 59, 59, 999);
}

type ListaIncidentes = ReturnType<typeof listarIncidentes>;

function porEstado(lista: ListaIncidentes): Record<EstadoIncidente, number> {
  return {
    abierto:     lista.filter((i: ListaIncidentes[number]) => i.estado === "abierto").length,
    en_progreso: lista.filter((i: ListaIncidentes[number]) => i.estado === "en_progreso").length,
    resuelto:    lista.filter((i: ListaIncidentes[number]) => i.estado === "resuelto").length,
  };
}

function porPrioridad(lista: ListaIncidentes): Record<Prioridad, number> {
  return {
    baja:  lista.filter((i: ListaIncidentes[number]) => i.prioridad === "baja").length,
    media: lista.filter((i: ListaIncidentes[number]) => i.prioridad === "media").length,
    alta:  lista.filter((i: ListaIncidentes[number]) => i.prioridad === "alta").length,
  };
}

export function generarReporteDiario(fecha = new Date()): Reporte {
  const desde = inicioDelDia(fecha);
  const hasta  = finDelDia(fecha);
  const incidentes = listarIncidentes({ desde, hasta });
  return {
    tipo: "diario",
    fechaGeneracion: new Date(),
    periodo: { desde, hasta },
    totalIncidentes: incidentes.length,
    porEstado: porEstado(incidentes),
    porPrioridad: porPrioridad(incidentes),
    incidentes,
  };
}

export function generarReporteMensual(fecha = new Date()): Reporte {
  const desde = inicioDelMes(fecha);
  const hasta  = finDelMes(fecha);
  const incidentes = listarIncidentes({ desde, hasta });
  return {
    tipo: "mensual",
    fechaGeneracion: new Date(),
    periodo: { desde, hasta },
    totalIncidentes: incidentes.length,
    porEstado: porEstado(incidentes),
    porPrioridad: porPrioridad(incidentes),
    incidentes,
  };
}

export function imprimirReporte(r: Reporte): void {
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                 "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const titulo = r.tipo === "diario"
    ? `Reporte Diario — ${r.periodo.desde.toLocaleDateString("es-GT")}`
    : `Reporte Mensual — ${meses[r.periodo.desde.getMonth()]} ${r.periodo.desde.getFullYear()}`;

  console.log("\n" + "=".repeat(50));
  console.log(`  Laboratorio C27 | ${titulo}`);
  console.log("=".repeat(50));
  console.log(`  Total incidentes : ${r.totalIncidentes}`);
  console.log(`  Abiertos         : ${r.porEstado.abierto}`);
  console.log(`  En progreso      : ${r.porEstado.en_progreso}`);
  console.log(`  Resueltos        : ${r.porEstado.resuelto}`);
  console.log(`  Alta prioridad   : ${r.porPrioridad.alta}`);
  console.log(`  Media prioridad  : ${r.porPrioridad.media}`);
  console.log(`  Baja prioridad   : ${r.porPrioridad.baja}`);

  r.incidentes.forEach(i => {
    console.log(`\n  • ${i.titulo}`);
    console.log(`    Estado: ${i.estado} | Prioridad: ${i.prioridad} | Por: ${i.reportadoPor}`);
  });
  console.log("=".repeat(50) + "\n");
}