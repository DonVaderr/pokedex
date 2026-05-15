// src/screens/InicioScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { obtenerListaPokemon } from '../services/pokemonService';
import { RecursoAPI } from '../types/pokemos';
import PokemonCard from '../components/PokemonCard';
import { RootStackParamList } from '../types/navegacion';

type Props = NativeStackScreenProps<RootStackParamList, 'Inicio'>;

export default function InicioScreen({ navigation }: Props) {
  const [listaPokemon, setListaPokemon] = useState<RecursoAPI[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarPokemon = async () => {
      try {
        const datos = await obtenerListaPokemon();
        setListaPokemon(datos.results);
      } catch (error) {
        console.error("Error cargando los datos");
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
        <Text>Cargando Pokédex...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={listaPokemon}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonCard 
            nombre={item.name} 
            url={item.url}
            alPresionar={() => navigation.navigate('Detalle', { nombre: item.name, url: item.url })}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#f5f5f5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});