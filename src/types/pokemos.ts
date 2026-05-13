export interface RecursoAPI {
  name: string;
  url: string;
}

export interface RespuestaListaPokemon {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecursoAPI[];
}