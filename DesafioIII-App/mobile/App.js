
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from './services/api';

export default function App() {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (!title.trim()) return Alert.alert('Validação', 'Título é obrigatório');
      if (editingId) {
        await api.put('/reports/' + editingId, { title, description });
        setEditingId(null);
      } else {
        await api.post('/reports', { title, description, createdAt: new Date() });
      }
      setTitle(''); setDescription('');
      load();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  const edit = (item) => {
    setTitle(item.title); setDescription(item.description || ''); setEditingId(item._id);
  };

  const remove = async (id) => {
    try {
      await api.delete('/reports/' + id);
      load();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível deletar');
    }
  };

  return (
    <SafeAreaView style={{flex:1, padding:16}}>
      <Text style={styles.header}>Desafio III - Geo App (CRUD)</Text>
      <View style={styles.form}>
        <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Descrição" value={description} onChangeText={setDescription} style={styles.input} />
        <Button title={editingId ? 'Atualizar' : 'Criar'} onPress={save} />
      </View>

      <FlatList
        data={reports}
        keyExtractor={i => i._id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => edit(item)} style={styles.actionBtn}><Text>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item._id)} style={styles.actionBtn}><Text>Deletar</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize:18, fontWeight:'bold', marginBottom:8 },
  form: { marginBottom:16 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:8, borderRadius:4 },
  item: { padding:12, borderWidth:1, borderColor:'#ddd', borderRadius:6, marginBottom:8 },
  title: { fontWeight:'bold' },
  actions: { flexDirection:'row', marginTop:8 },
  actionBtn: { marginRight:12 }
});
