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

export interface Habilidad {
  ability: { name: string };
}

export interface Tipo {
  type: { name: string };
}

export interface Estadistica {
  base_stat: number;
  stat: { name: string };
}

// Interfaz principal para el detalle del Pokémon
export interface PokemonDetalle {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  abilities: Habilidad[];
  types: Tipo[];
  stats: Estadistica[];
}