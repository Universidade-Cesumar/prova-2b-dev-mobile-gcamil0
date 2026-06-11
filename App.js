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

  // busca os materiais cadastrados na api
  const buscarMateriais = async () => {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();
      setMateriais(dados);
    } catch (erro) {
      console.log('erro ao buscar materiais:', erro);
    } finally {
      setCarregando(false);
    }
  };

  // salva novo material na api
  const cadastrarMaterial = async () => {
    if (!nome || !quantidade) {
      alert('Preencha o nome e a quantidade!');
      return;
    }
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          quantidade: parseInt(quantidade, 10),
        }),
      });
      
      // limpa os campos depois de cadastrar
      setNome('');
      setQuantidade('');

      // atualiza lista depois de cadastrar
      buscarMateriais();
    } catch (erro) {
      console.log('erro ao cadastrar material:', erro);
    }
  };

  // executa a busca assim que o app abre
  useEffect(() => {
    buscarMateriais();
  }, []);

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
        <TouchableOpacity testID="btn-cadastrar" style={styles.botao} onPress={cadastrarMaterial}>
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#2a7ae2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemNome: {
    fontSize: 15,
    color: '#333',
  },
  itemQtd: {
    fontSize: 15,
    color: '#888',
  },
});