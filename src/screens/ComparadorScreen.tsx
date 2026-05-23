// src/screens/ComparadorScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { obtenerDetallePokemon } from '../services/pokemonService';
import { PokemonDetalle } from '../types/pokemos';

export default function ComparadorScreen() {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [pokemon1, setPokemon1] = useState<PokemonDetalle | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonDetalle | null>(null);
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comparar = async () => {
    if (!nombre1 || !nombre2) {
      setError("Por favor ingresa dos nombres válidos.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Hacemos ambas peticiones al mismo tiempo
      const [datos1, datos2] = await Promise.all([
        obtenerDetallePokemon(nombre1.toLowerCase().trim()),
        obtenerDetallePokemon(nombre2.toLowerCase().trim())
      ]);
      setPokemon1(datos1);
      setPokemon2(datos2);
    } catch (err) {
      setError("No se encontró uno o ambos Pokémon. Revisa los nombres.");
      setPokemon1(null);
      setPokemon2(null);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.instrucciones}>Escribe el nombre de dos Pokémon para comparar sus estadísticas base.</Text>
      
      <View style={estilos.filaInputs}>
        <TextInput style={estilos.input} placeholder="Ej. pikachu" value={nombre1} onChangeText={setNombre1} />
        <Text style={estilos.vs}>VS</Text>
        <TextInput style={estilos.input} placeholder="Ej. charizard" value={nombre2} onChangeText={setNombre2} />
      </View>

      <TouchableOpacity style={estilos.boton} onPress={comparar}>
        <Text style={estilos.textoBoton}>Comparar</Text>
      </TouchableOpacity>

      {error && <Text style={estilos.error}>{error}</Text>}
      {cargando && <ActivityIndicator size="large" color="#e3350d" style={{ marginTop: 20 }} />}

      {pokemon1 && pokemon2 && (
        <View style={estilos.resultados}>
          {/* Cabecera con Imágenes */}
          <View style={estilos.filaComparacion}>
            <View style={estilos.columna}>
              <Image source={{ uri: pokemon1.sprites.front_default }} style={estilos.imagen} />
              <Text style={estilos.nombrePokemon}>{pokemon1.name.toUpperCase()}</Text>
            </View>
            <View style={estilos.columna}>
              <Image source={{ uri: pokemon2.sprites.front_default }} style={estilos.imagen} />
              <Text style={estilos.nombrePokemon}>{pokemon2.name.toUpperCase()}</Text>
            </View>
          </View>

          {/* Estadísticas */}
          <View style={estilos.tarjetaStats}>
            {pokemon1.stats.map((stat1, index) => {
              const stat2 = pokemon2.stats[index];
              const gana1 = stat1.base_stat > stat2.base_stat;
              const gana2 = stat2.base_stat > stat1.base_stat;

              return (
                <View key={stat1.stat.name} style={estilos.filaStat}>
                  <Text style={[estilos.valorStat, gana1 && estilos.ganador]}>{stat1.base_stat}</Text>
                  <Text style={estilos.nombreStat}>{stat1.stat.name.toUpperCase()}</Text>
                  <Text style={[estilos.valorStat, gana2 && estilos.ganador]}>{stat2.base_stat}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { padding: 20, alignItems: 'center', backgroundColor: '#f5f5f5', flexGrow: 1 },
  instrucciones: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#555' },
  filaInputs: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 15 },
  input: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', textAlign: 'center' },
  vs: { fontWeight: 'bold', marginHorizontal: 10, fontSize: 18, color: '#e3350d' },
  boton: { backgroundColor: '#3b4cca', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginBottom: 20 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#d32f2f', marginTop: 10, fontWeight: 'bold', textAlign: 'center' },
  resultados: { width: '100%' },
  filaComparacion: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  columna: { alignItems: 'center' },
  imagen: { width: 100, height: 100 },
  nombrePokemon: { fontWeight: 'bold', fontSize: 16 },
  tarjetaStats: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  filaStat: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  nombreStat: { flex: 1, textAlign: 'center', fontSize: 12, color: '#777', fontWeight: '600' },
  valorStat: { width: 40, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#333' },
  ganador: { color: '#4caf50', fontSize: 18 } // Verde si gana
});