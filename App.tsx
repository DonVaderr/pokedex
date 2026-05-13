import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { obtenerListaPokemon } from './src/services/pokemonService';
import { RecursoAPI } from './src/types/pokemos';

export default function App() {
  const [listaPokemon, setListaPokemon] = useState<RecursoAPI[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarPokemon = async () => {
      try {
        const datos = await obtenerListaPokemon();
        setListaPokemon(datos.results);
      } catch (error) {
        console.error("Hubo un problema cargando los datos");
      } finally {
        setCargando(false);
      }
    };

    cargarPokemon();
  }, []);

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando Pokedex...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Pokedex</Text>
      <FlatList
        data={listaPokemon}
        keyExtractor={(item) => item.name} 
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <Text style={estilos.nombrePokemon}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nombrePokemon: {
    fontSize: 18,
    fontWeight: '600',
  },
});