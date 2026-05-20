import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITOS_KEY = '@pokedex_favoritos';

export const obtenerFavoritos = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error leyendo favoritos", e);
    return [];
  }
};

export const guardarFavoritos = async (favoritos: string[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(favoritos);
    await AsyncStorage.setItem(FAVORITOS_KEY, jsonValue);
  } catch (e) {
    console.error("Error guardando favoritos", e);
  }
};