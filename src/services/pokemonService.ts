import axios from 'axios';
import { RespuestaListaPokemon } from '../types/pokemos';

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