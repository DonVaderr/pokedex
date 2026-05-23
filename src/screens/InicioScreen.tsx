// src/screens/InicioScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { obtenerListaPokemon, obtenerTiposPokemon, obtenerPokemonPorTipo } from '../services/pokemonService';
import { RecursoAPI } from '../types/pokemos';
import PokemonCard from '../components/PokemonCard';
import { obtenerFavoritos, guardarFavoritos } from '../storage/favoritosStorage';
import { RootStackParamList } from '../types/navegacion';

type Props = NativeStackScreenProps<RootStackParamList, 'Inicio'>;

export default function InicioScreen({ navigation }: Props) {
  const [listaOriginal, setListaOriginal] = useState<RecursoAPI[]>([]);
  const [listaPorTipo, setListaPorTipo] = useState<RecursoAPI[] | null>(null);
  const [listaVisible, setListaVisible] = useState<RecursoAPI[]>([]);
  const [tipos, setTipos] = useState<RecursoAPI[]>([]);

  const [textoBusqueda, setTextoBusqueda] = useState<string>('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('todos');

  const [favoritos, setFavoritos] = useState<string[]>([]);

  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPokemon = async () => {
      setCargando(true);
      setError(null);
      try {
        const [datos, tiposApi, favs] = await Promise.all([
          obtenerListaPokemon(),
          obtenerTiposPokemon(),
          obtenerFavoritos(),
        ]);
        setListaOriginal(datos.results);
        setTipos(tiposApi);
        setFavoritos(favs);
      } catch (e) {
        console.error('Error cargando los datos', e);
        setError('No se pudieron cargar los Pokémon.');
      } finally {
        setCargando(false);
      }
    };
    cargarPokemon();
  }, []);

  useEffect(() => {
    // si hay un tipo seleccionado distinto de 'todos', cargar por tipo
    let activo = true;
    const aplicarFiltro = async () => {
      setCargando(true);
      setError(null);
      try {
        if (tipoSeleccionado !== 'todos') {
          const datosTipo = await obtenerPokemonPorTipo(tipoSeleccionado);
          if (!activo) return;
          setListaPorTipo(datosTipo);
        } else {
          setListaPorTipo(null);
        }
      } catch (e) {
        console.error('Error al filtrar por tipo', e);
        setError('Error al filtrar por tipo');
      } finally {
        setCargando(false);
      }
    };
    aplicarFiltro();
    return () => { activo = false; };
  }, [tipoSeleccionado]);

  useEffect(() => {
    const base = listaPorTipo ?? listaOriginal;
    const filtrado = base.filter((p) => p.name.toLowerCase().includes(textoBusqueda.toLowerCase()));
    setListaVisible(filtrado);
  }, [textoBusqueda, listaOriginal, listaPorTipo]);

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando Pokédex...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={estilos.centrado}>
        <Text>{error}</Text>
      </View>
    );
  }

  const toggleFavorito = async (nombre: string) => {
    const existe = favoritos.includes(nombre);
    const nuevos = existe ? favoritos.filter((f) => f !== nombre) : [...favoritos, nombre];
    setFavoritos(nuevos);
    try {
      await guardarFavoritos(nuevos);
    } catch (e) {
      console.error('Error guardando favoritos', e);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <View style={{ padding: 12 }}>
        <TextInput
          placeholder="Buscar por nombre..."
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
          style={estilos.input}
        />
        <TouchableOpacity 
          style={{ backgroundColor: '#ffcb05', marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 8, alignItems: 'center' }}
          onPress={() => navigation.navigate('Comparador')}
        >
        <Text style={{ fontWeight: 'bold', color: '#333' }}>⚔️ Ir al Comparador de Pokémon</Text>
      </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          <TouchableOpacity onPress={() => setTipoSeleccionado('todos')} style={[estilos.tipoBtn, tipoSeleccionado === 'todos' && estilos.tipoBtnActivo]}>
            <Text style={tipoSeleccionado === 'todos' ? estilos.tipoTextoActivo : estilos.tipoTexto}>Todos</Text>
          </TouchableOpacity>
          {tipos.map((t) => (
            <TouchableOpacity key={t.name} onPress={() => setTipoSeleccionado(t.name)} style={[estilos.tipoBtn, tipoSeleccionado === t.name && estilos.tipoBtnActivo]}>
              <Text style={tipoSeleccionado === t.name ? estilos.tipoTextoActivo : estilos.tipoTexto}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {listaVisible.length === 0 ? (
        <View style={estilos.centrado}>
          <Text>No se encontraron resultados.</Text>
        </View>
      ) : (
        <FlatList
          data={listaVisible}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PokemonCard 
              nombre={item.name} 
              url={item.url}
              esFavorito={favoritos.includes(item.name)}
              alPresionar={() => navigation.navigate('Detalle', { nombre: item.name, url: item.url })}
              alAlternarFavorito={() => toggleFavorito(item.name)}
            />
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#f5f5f5' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  tipoBtn: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tipoBtnActivo: {
    backgroundColor: '#3b4cca',
  },
  tipoTexto: { color: '#333', fontWeight: 'bold' },
  tipoTextoActivo: { color: '#fff', fontWeight: 'bold' },
});