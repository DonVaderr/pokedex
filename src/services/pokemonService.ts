import axios from 'axios';
import { PokemonDetalle, RecursoAPI, RespuestaListaPokemon } from '../types/pokemos';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const obtenerListaPokemon = async (): Promise<RespuestaListaPokemon> => {
  try {
    const response = await axios.get<RespuestaListaPokemon>(`${API_BASE_URL}/pokemon?limit=30`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de Pokémon:", error);
    throw error;
  }
};

export const obtenerDetallePokemon = async (nombre: string): Promise<PokemonDetalle> => {
  try {
    const respuesta = await axios.get<PokemonDetalle>(`${API_BASE_URL}/pokemon/${nombre}`);
    return respuesta.data;
  } catch (error) {
    console.error(`Error al obtener detalle de ${nombre}:`, error);
    throw error;
  }
};

export const obtenerTiposPokemon = async (): Promise<RecursoAPI[]> => {
  try {
    const respuesta = await axios.get<RespuestaListaPokemon>(`${API_BASE_URL}/type`);
    return respuesta.data.results.filter((t: RecursoAPI) => t.name !== 'unknown' && t.name !== 'shadow');
  } catch (error) {
    console.error("Error al obtener tipos:", error);
    throw error;
  }
};

export const obtenerPokemonPorTipo = async (tipo: string): Promise<RecursoAPI[]> => {
  try {
    const respuesta = await axios.get<any>(`${API_BASE_URL}/type/${tipo}`);
    return respuesta.data.pokemon.map((p: any) => p.pokemon);
  } catch (error) {
    console.error(`Error al obtener Pokémon del tipo ${tipo}:`, error);
    throw error;
  }
};