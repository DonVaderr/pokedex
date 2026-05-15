import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  nombre: string;
  url: string;
  alPresionar: () => void;
}

export default function PokemonCard({ nombre, url, alPresionar }: Props) {
  return (
    <TouchableOpacity onPress={alPresionar} activeOpacity={0.7}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.nombre}>
          {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
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
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});