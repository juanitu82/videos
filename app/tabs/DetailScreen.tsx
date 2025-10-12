import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Definimos los parámetros de navegación
type RootStackParamList = {
  Home: undefined;
  List: { genero: 'colegialas' | 'otras' };
  Detail: { code: string }; // <- DetailScreen recibe code
};

// Tipamos las props de la pantalla Detail
type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { code } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center' 
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
