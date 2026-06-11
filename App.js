import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

export default function App() {
  // --- Estados da Aplicação ---
  const [nome, setNome] = useState(''); // estado para o campo do nome do materila 
  const [quantidade, setQuantidade] = useState(''); // estado para o campo da qtd do material
  const [materiais, setMateriais] = useState([]); // lista de materiais
  const [carregando, setCarregando] = useState(true); // controla se está carregando os dados
  const API_URL = 'https://6a2b3903b687a7d5cbc4f932.mockapi.io/api/v1/materiais';

  // --- Funções de Requisição e Efeitos (Os alunos implementarão aqui) ---

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Almoxarifado - Enfermagem</Text>
      
      {/* Breve descrição do projeto inserida abaixo */}
      <Text style={styles.description}>
        Este template servirá para desenvolver o projeto responsável por modernizar o controle de insumos médicos do almoxarifado. 
        Através desta interface conectada à API, é possível realizar o inventário em tempo real, cadastrar novos materiais e registrar baixas de estoque de forma ágil e segura.
      </Text>

      {/* Os alunos vão construir os componentes visuais das Sprints aqui dentro */}

        {/* campo para digitar o nome do material */}
        <TextInput
          testID="input-nome"
          style={styles.input}
          placeholder="Nome do material"
          value={nome}
          onChangeText={setNome}
        />

        {/* campo para digitar a quantidade */}
        <TextInput
          testID="input-quantidade"
          style={styles.input}
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />

        {/* botão para cadastrar o material */}
        <TouchableOpacity testID="btn-cadastrar" style={styles.botao}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        {/* mostra um indicador enquanto carrega, senão mostra a lista */}
        {carregando ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            testID="lista-materiais"
            data={materiais}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemQtd}>Qtd: {item.quantidade}</Text>
              </View>
            )}
          />
        )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10, // Reduzido ligeiramente para aproximar o texto explicativo
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20, // Dá um espaçamento confortável entre as linhas do parágrafo
    marginBottom: 30, // Margem inferior para afastar o texto dos futuros inputs dos alunos
  }
});