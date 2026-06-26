import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { validarRetirada } from './src/utils/validacoes'; //função de validar retirada

// exibe um alerta multiplataforma (web usa alert nativo, mobile usa Alert do RN)
const exibirAlerta = (titulo, mensagem) => {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const API_URL = 'https://6a2b3903b687a7d5cbc4f932.mockapi.io/api/v1/materiais';

export default function App() {
  // --- Estados da Aplicação ---
  const [nome, setNome] = useState(''); // estado para o campo do nome do materila 
  const [quantidade, setQuantidade] = useState(''); // estado para o campo da qtd do material
  const [materiais, setMateriais] = useState([]); // lista de materiais
  const [carregando, setCarregando] = useState(true); // controla se está carregando os dados
  const [retiradas, setRetiradas] = useState({}); //guarda a quantidade de retirada digirada para cada item
  const [busca, setBusca] = useState(''); // texto digitado no campo de pesquisa
  const [validade, setValidade] = useState(''); // data de validade no formato aaaa-mm-dd
  const [validadeIndeterminada, setValidadeIndeterminada] = useState(false); // true para materiais permanentes
  // --- Funções de Requisição e Efeitos (Os alunos implementarão aqui) ---

  // busca os materiais cadastrados na api
  const buscarMateriais = async () => {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();
      setMateriais(dados);
    } catch (erro) {
      console.log('erro ao buscar materiais:', erro);
      exibirAlerta('Erro de conexão', 'Não foi possível carregar os materiais. Verifique sua internet.');
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
          validade: validadeIndeterminada ? '' : validade,
        }),
      });

      // limpa os campos depois de cadastrar
      setNome('');
      setQuantidade('');
      setValidade('');
      setValidadeIndeterminada(false);
      // atualiza lista depois de cadastrar
      buscarMateriais();
    } catch (erro) {
      console.log('erro ao cadastrar material:', erro);
      exibirAlerta('Erro ao cadastrar', 'Não foi possível salvar o material. Tente novamente.');
    }
  };
  // atualiza a quantidade de retirada de um material
  const atualizarRetirada = (id, valor) => {
    setRetiradas((anterior) => ({ ...anterior, [id]: valor}));
  };
  
  // remove o material da api, com confirmação antes
  const excluirMaterial = (id) => {
    const confirmarExclusao = async () => {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        buscarMateriais();
      } catch (erro) {
        console.log('erro ao excluir o material:', erro);
        exibirAlerta('Erro ao excluir', 'Não foi possível excluir o material. Tente novamente.');
      }
    };

    // no navegador o Alert.alert não funciona, então usamos window.confirm
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir este material?')) {
        confirmarExclusao();
      }
    } else {
      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este material?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: confirmarExclusao },
        ]
      );
    }
  };
  // realiza baixa do estoque 
  const retirarMaterial = async (item) => {
    const quantidadeRetirada = parseInt(retiradas[item.id] || '0', 10);
    console.log('retirando', quantidadeRetirada, 'de', item.quantidade);
    //valida a retirada
    if(!validarRetirada(item.quantidade, quantidadeRetirada)) {
      alert('Quantidade inválida para retirada!');
      return;
    }

    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantidade: item.quantidade - quantidadeRetirada,
        }),
      });

      //limpa o campo de retirada
      atualizarRetirada(item.id, '');
      //atualiza a lista
      buscarMateriais();
    } catch (erro) {
      console.log('erro ao retirar material:', erro);
      exibirAlerta('Erro ao retirar estoque', 'Não foi possível processar a baixa. Tente novamente.');
    }
  };
  // executa a busca assim que o app abre
  useEffect(() => {
    buscarMateriais();
  }, []);

  // filtra os materiais pelo nome digitado na busca
  const materiaisFiltrados = materiais.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // calcula o status da validade de um material
  const statusValidade = (validade) => {
    if (!validade) return 'sem-validade';

    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 30) return 'vencendo';
    return 'normal';
  };

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
        {/* campo de validade, desabilitado quando indeterminada */}
        <TextInput
          style={[styles.input, validadeIndeterminada && styles.inputDesabilitado]}
          placeholder="Validade (aaaa-mm-dd)"
          value={validadeIndeterminada ? '' : validade}
          onChangeText={setValidade}
          editable={!validadeIndeterminada}
        />
        {/* checkbox simulado para validade indeterminada */}
        <TouchableOpacity
          style={styles.checkboxLinha}
          onPress={() => setValidadeIndeterminada((anterior) => !anterior)}
        >
          <View style={[styles.checkbox, validadeIndeterminada && styles.checkboxMarcado]}>
            {validadeIndeterminada && <Text style={styles.checkboxIcone}>✓</Text>}
          </View>
          <Text style={styles.checkboxTexto}>Validade indeterminada (material permanente)</Text>
        </TouchableOpacity>
        {/* botão para cadastrar o material */}
        <TouchableOpacity testID="btn-cadastrar" style={styles.botao} onPress={cadastrarMaterial}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        {/* mostra um indicador enquanto carrega, senão mostra a lista */}
        {carregando && (
          <ActivityIndicator size="large" color="#2e9e5b" style={{ marginTop: 20 }} />
        )}
        {/* campo de busca para filtrar a lista */}
        <TextInput
          testID="input-busca"
          style={styles.input}
          placeholder="Buscar material..."
          value={busca}
          onChangeText={setBusca}
        />

        {/* mostra quantos itens estão sendo exibidos na lista filtrada */}
        <Text testID="total-itens" style={styles.totalItens}>
          {materiaisFiltrados.length} {materiaisFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
        </Text>

        <FlatList
          ListHeaderComponent={<Text style={styles.listaTitle}>Materiais em estoque</Text>}
          ListEmptyComponent={
            carregando
              ? null
              : <Text style={styles.listaVazia}>Nenhum material cadastrado.</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          testID="lista-materiais"
          data={materiaisFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const status = statusValidade(item.validade);
            const estiloValidade =
              status === 'vencendo' ? styles.itemValidadeVencendo :
              status === 'vencido' ? styles.itemValidadeVencido :
              styles.itemValidadeNormal;

            return (
              <View
                style={[
                  styles.item,
                  item.quantidade < 10 && styles.itemEstoqueBaixo,
                  estiloValidade,
                ]}
                accessibilityLabel={item.quantidade < 10 ? 'estoque-critico' : undefined}
              >

                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  <Text style={styles.itemQtd}>Qtd: {item.quantidade}</Text>
                </View>

                {/* texto informativo sobre a validade do material */}
                <Text style={styles.itemValidadeTexto}>
                  {status === 'sem-validade' && 'Sem validade'}
                  {status === 'normal' && `Validade: ${item.validade}`}
                  {status === 'vencendo' && `Atenção: vence em breve (${item.validade})`}
                  {status === 'vencido' && `Vencido em ${item.validade}`}
                </Text>

                <View style={styles.itemAcoes}>
                  ...
                </View>
              </View>
            );
          }}
        />
              
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
    backgroundColor: '#2e9e5b',
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
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemNome: {
    fontSize: 15,
    color: '#333',
  },
  itemQtd: {
    fontSize: 15,
    color: '#888',
  },
  listaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  listaVazia: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  },
  separador: {
    height: 1,
    backgroundColor: '#eee',
  },
  itemAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  inputRetirada: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    width: 80,
    fontSize: 14,
  },
  botaoBaixar: {
    backgroundColor: '#f0a500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoAcaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoExcluir: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  itemEstoqueBaixo: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  totalItens: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  checkboxLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMarcado: {
    backgroundColor: '#2e9e5b',
    borderColor: '#2e9e5b',
  },
  checkboxIcone: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxTexto: {
    fontSize: 13,
    color: '#666',
  },
  inputDesabilitado: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  itemValidadeNormal: {
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  itemValidadeVencendo: {
    borderLeftWidth: 4,
    borderLeftColor: '#f0a500',
  },
  itemValidadeVencido: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  itemValidadeTexto: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
});