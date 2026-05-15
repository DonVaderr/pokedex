// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from './src/screens/InicioScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import { RootStackParamList } from './src/types/navegacion';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen 
          name="Inicio" 
          component={InicioScreen} 
          options={{ title: 'Pokedex' }} 
        />
        <Stack.Screen 
          name="Detalle" 
          component={DetalleScreen} 
          options={({ route }) => ({ 
            title: route.params.nombre.charAt(0).toUpperCase() + route.params.nombre.slice(1) 
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}