import { randomUUID } from "crypto";
import {
  Incidente,
  CrearIncidenteDTO,
  ActualizarEstadoDTO,
  FiltroIncidente,
  EstadoIncidente,
} from "../types/incidentes";
import { incidentesDB } from "../database/base";

export function crearIncidente(dto: CrearIncidenteDTO): Incidente {
  const nuevo: Incidente = {
    id: `INC-${randomUUID()}`,
    titulo: dto.titulo,
    descripcion: dto.descripcion,
    reportadoPor: dto.reportadoPor,
    prioridad: dto.prioridad,
    estado: "abierto",
    fechaCreacion: new Date(),
  };
  incidentesDB.push(nuevo);
  console.log(`Ticket creado → [${nuevo.id}] ${nuevo.titulo}`);
  return nuevo;
}

export function actualizarEstado(dto: ActualizarEstadoDTO): Incidente {
  const incidente = buscarPorId(dto.id);
  if (!incidente) {
    throw new Error(`No se encontró el incidente: ${dto.id}`);
  }
  const transiciones: Record<EstadoIncidente, EstadoIncidente[]> = {
    abierto: ["en_progreso"],
    en_progreso: ["resuelto"],
    resuelto: [],
  };
  if (!transiciones[incidente.estado].includes(dto.nuevoEstado)) {
    throw new Error(`No se puede cambiar de "${incidente.estado}" a "${dto.nuevoEstado}"`);
  }
  incidente.estado = dto.nuevoEstado;
  incidente.fechaActualizacion = new Date();
  if (dto.nuevoEstado === "resuelto") {
    incidente.fechaResolucion = new Date();
  }
  console.log(`Ticket actualizado → [${incidente.id}] ahora está: ${incidente.estado}`);
  return incidente;
}

export function buscarPorId(id: Incidente["id"]): Incidente | undefined {
  return incidentesDB.find((i: Incidente) => i.id === id);
}

export function listarIncidentes(filtros?: FiltroIncidente): Incidente[] {
  return incidentesDB.filter((inc: Incidente) => {
    if (filtros?.prioridad && inc.prioridad !== filtros.prioridad) return false;
    if (filtros?.estado && inc.estado !== filtros.estado) return false;
    if (filtros?.reportadoPor && inc.reportadoPor !== filtros.reportadoPor) return false;
    if (filtros?.desde && inc.fechaCreacion < filtros.desde) return false;
    if (filtros?.hasta && inc.fechaCreacion > filtros.hasta) return false;
    return true;
  });
}

export function obtenerTodos(): Incidente[] {
  return [...incidentesDB];
}