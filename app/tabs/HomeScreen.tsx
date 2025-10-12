
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  List: { genero: 'colegialas' | 'otras' | 'todos' };
  Detail: { code: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const handlePress = (genero: 'colegialas' | 'otras' | 'todos') => {
    navigation.navigate('List', { genero });
  };

  return (
    <View style={styles.container}>
      {/* Fila con Chicos y Chicas */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.boton} onPress={() => handlePress('colegialas')}>
          <Text style={styles.botonTexto}>Colegialas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={() => handlePress('otras')}>
          <Text style={styles.botonTexto}>Otros</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Todos abajo */}
      <TouchableOpacity style={[styles.boton, styles.todos]} onPress={() => handlePress('todos')}>
        <Text style={styles.botonTexto}>Todos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  boton: {
    flex:1,
    marginHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  todos: {
    flex: 0,
    marginTop: 10,
    width: '60%', // lo centramos y no ocupa toda la fila
    alignSelf: 'center',
    paddingVertical: 20,
  }
});
