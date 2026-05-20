// src/screens/DetalleScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navegacion';
import { obtenerDetallePokemon } from '../services/pokemonService';
import { obtenerFavoritos, guardarFavoritos } from '../storage/favoritosStorage';
import { PokemonDetalle } from '../types/pokemos';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

export default function DetalleScreen({ route }: Props) {
  const { nombre } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetalle | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [esFavorito, setEsFavorito] = useState<boolean>(false);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const datos = await obtenerDetallePokemon(nombre);
        setPokemon(datos);
      } catch (error) {
        console.error("Error cargando el detalle del Pokémon");
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
    const cargarFavoritos = async () => {
      try {
        const favs = await obtenerFavoritos();
        setFavoritos(favs);
        setEsFavorito(favs.includes(nombre));
      } catch (e) {
        console.error('Error leyendo favoritos', e);
      }
    };
    cargarFavoritos();
  }, [nombre]);

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Buscando datos...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={estilos.centrado}>
        <Text>No se pudo cargar la información.</Text>
      </View>
    );
  }

  const imagenUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      {/* Imagen y Nombre/ID */}
      {imagenUrl && <Image source={{ uri: imagenUrl }} style={estilos.imagen} />}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={estilos.titulo}>
          #{pokemon.id} - {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
        <TouchableOpacity onPress={async () => {
          try {
            const existe = favoritos.includes(nombre);
            const nuevos = existe ? favoritos.filter(f => f !== nombre) : [...favoritos, nombre];
            setFavoritos(nuevos);
            setEsFavorito(!existe);
            await guardarFavoritos(nuevos);
          } catch (e) {
            console.error('Error guardando favorito', e);
          }
        }}>
          <Text style={{ fontSize: 26 }}>{esFavorito ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tipos */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>Tipos:</Text>
        <View style={estilos.filaDatos}>
          {pokemon.types.map((t, index) => (
            <Text key={index} style={estilos.etiqueta}>{t.type.name}</Text>
          ))}
        </View>
      </View>

      {/* Peso y Altura */}
      <View style={estilos.filaMitaYMitad}>
        <View style={[estilos.tarjeta, estilos.mitad]}>
          <Text style={estilos.subtitulo}>Peso</Text>
          <Text style={estilos.textoCentro}>{pokemon.weight / 10} kg</Text>
        </View>
        <View style={[estilos.tarjeta, estilos.mitad]}>
          <Text style={estilos.subtitulo}>Altura</Text>
          <Text style={estilos.textoCentro}>{pokemon.height / 10} m</Text>
        </View>
      </View>

      {/* Habilidades */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>Habilidades:</Text>
        {pokemon.abilities.map((h, index) => (
          <Text key={index} style={estilos.textoGris}>• {h.ability.name}</Text>
        ))}
      </View>

      {/* Estadísticas Base */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>Estadísticas Base:</Text>
        {pokemon.stats.map((s, index) => (
          <View key={index} style={estilos.filaStat}>
            <Text style={estilos.statNombre}>{s.stat.name.toUpperCase()}</Text>
            <Text style={estilos.statValor}>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contenedor: { padding: 20, alignItems: 'center', backgroundColor: '#f5f5f5', flexGrow: 1 },
  imagen: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 10 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  tarjeta: { 
    width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, 
    marginBottom: 15, elevation: 2, shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 
  },
  
  filaMitaYMitad: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  mitad: { width: '48%', alignItems: 'center' },
  
  subtitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  textoCentro: { fontSize: 18, color: '#555' },
  textoGris: { fontSize: 16, color: '#555', textTransform: 'capitalize', marginBottom: 5 },
  
  filaDatos: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  etiqueta: { 
    backgroundColor: '#e0e0e0', paddingVertical: 5, paddingHorizontal: 15, 
    borderRadius: 20, textTransform: 'capitalize', fontWeight: 'bold' 
  },
  
  filaStat: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statNombre: { fontSize: 14, fontWeight: '600', color: '#555' },
  statValor: { fontSize: 16, fontWeight: 'bold', color: '#000' }
});