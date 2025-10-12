
    
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  List: { genero: 'colegialas' | 'otras' | 'todos'};
  Detail: { code: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function ListScreen({ route, navigation }: Props) {
  const { genero } = route.params;
  const [item, setItem] = useState<{ title: string } | null>(null);
  const [vistos, setVistos] = useState<string[]>([]); // lista de códigos marcados como vistos


  const fetchRandomItem = async () => {
  try {
    const urls = {
      colegialas: 'https://raw.githubusercontent.com/juanitu82/videos/main/colegialas.json',
      otras: 'https://raw.githubusercontent.com/juanitu82/videos/main/otras.json',
    };

    let data: { title: string }[] = [];

    if (genero === 'todos') {
  const resChicos = await fetch(urls.colegialas);
  const jsonChicos = await resChicos.json();

  const resChicas = await fetch(urls.otras);
  const jsonChicas = await resChicas.json();

  data = [...jsonChicos, ...jsonChicas];
} else {
  // TS sabe que genero es 'chicos' | 'chicas' aquí
  const res = await fetch(urls[genero]);
  data = await res.json();
}

    // Elegimos uno aleatorio
    const randomIndex = Math.floor(Math.random() * data.length);
    setItem(data[randomIndex]);
  } catch (error) {
    console.error(error);
  }
};


  useEffect(() => {
    fetchRandomItem();
  }, [genero]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const marcarVista = () => {
    if (!vistos.includes(item.title)) {
      setVistos([...vistos, item.title]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, vistos.includes(item.title) && styles.visto]}
        onPress={() => navigation.navigate('Detail', { code: item.title })}
      >
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.boton} onPress={fetchRandomItem}>
          <Text style={styles.botonTexto}>Otro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={marcarVista}>
          <Text style={styles.botonTexto}>Vista</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  card: { 
  width: '100%',
  minHeight: 200, // mínimo alto para que se vea grande
  justifyContent: 'center', // centra el texto verticalmente
  alignItems: 'center', // centra el texto horizontalmente
  backgroundColor: '#eee', 
  borderRadius: 12, 
  marginBottom: 20, 
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 5, // para Android
  padding: 20,
},
  visto: { backgroundColor: '#cfc' },
  title: { fontSize: 24, fontWeight: 'bold' },

  // <- ESTILOS QUE TE FALTABAN
  botones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 20 
  },
  boton: { 
    flex: 1, 
    marginHorizontal: 5, 
    padding: 15, 
    backgroundColor: '#007bff', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  botonTexto: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
