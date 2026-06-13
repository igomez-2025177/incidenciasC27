export type Prioridad = "baja" | "media" | "alta";

export type EstadoIncidente = "abierto" | "en_progreso" | "resuelto";

export interface Incidente {
  readonly id: `INC-${string}`;
  titulo: string;
  descripcion: string;
  reportadoPor: string;
  prioridad: Prioridad;
  estado: EstadoIncidente;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaResolucion?: Date;
}

export type CrearIncidenteDTO = Pick<Incidente, "titulo" | "descripcion" | "reportadoPor" | "prioridad">;

export interface ActualizarEstadoDTO {
  id: Incidente["id"];
  nuevoEstado: EstadoIncidente;
}

export interface FiltroIncidente {
  prioridad?: Prioridad;
  estado?: EstadoIncidente;
  reportadoPor?: string;
  desde?: Date;
  hasta?: Date;
}

export interface Reporte {
  tipo: "diario" | "mensual";
  fechaGeneracion: Date;
  periodo: { desde: Date; hasta: Date };
  totalIncidentes: number;
  porEstado: Record<EstadoIncidente, number>;
  porPrioridad: Record<Prioridad, number>;
  incidentes: Incidente[];
}