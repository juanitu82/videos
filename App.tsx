import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DetailScreen from './app/tabs/DetailScreen';
import HomeScreen from './app/tabs/HomeScreen';
import ListScreen from './app/tabs/ListScreen';

// 1️⃣ Tipamos todos los parámetros del stack
export type RootStackParamList = {
  Home: undefined;
  List: { genero: 'colegialas' | 'otras' };
  Detail: { code: string };
};

// 2️⃣ Creamos el stack con los tipos
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }} 
        />
        <Stack.Screen 
          name="List" 
          component={ListScreen} 
          options={{ title: 'Lista' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Detalle' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
