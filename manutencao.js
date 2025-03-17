// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDIYtVfwm3P6HfPtuDYjK7WAuUiXgtO650",
  authDomain: "aplicativo-manuntencao.firebaseapp.com",
  databaseURL: "https://aplicativo-manuntencao-default-rtdb.firebaseio.com",
  projectId: "aplicativo-manuntencao",
  storageBucket: "aplicativo-manuntencao.firebasestorage.app",
  messagingSenderId: "780156006549",
  appId: "1:780156006549:web:e38565b02bfc54d882eb9c",
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userEmail = localStorage.getItem("userEmail") || ""; // Variável para armazenar o e-mail do usuário logado

// Elementos do DOM
const maquinaSelect = document.getElementById("maquina");
const descricaoTextarea = document.getElementById("descricao"); // Alteração aqui
const responsavelInput = document.getElementById("responsavel");
const tempoProximaSelect = document.getElementById("tempoProxima");
const salvarBtn = document.getElementById("salvarBtn");
const historicoDiv = document.getElementById("historico");

  // Carregar histórico ao carregar a página
  const maquinaInicial = maquinaSelect.value; // Obtém a máquina selecionada inicialmente
  if (maquinaInicial) {
    carregarHistorico(maquinaInicial); // Carrega o histórico correspondente
  }

  // Adiciona o evento para quando a máquina for alterada
  maquinaSelect.addEventListener("change", function () {
    carregarHistorico(maquinaSelect.value); // Atualiza o histórico com a nova máquina selecionada
  });
window.addEventListener("load", function () {
  // Verifica o estado de autenticação
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userEmail = user.email; // Captura o e-mail do usuário logado
    } else {
      // Se não houver um usuário logado, redireciona para a tela de login
      window.location.href = "login.html";
    }
  });


});

// Salva os dados no Realtime Database
salvarBtn.addEventListener("click", async function () {
  const maquina = maquinaSelect.value;
  const manutencaoDescricao = descricaoTextarea.value.trim(); // Captura a descrição digitada
  const responsavel = responsavelInput.value.trim();
  const tempoProxima = tempoProximaSelect.value;

  if (!responsavel || !manutencaoDescricao) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Salva os dados no Firebase
  await db.ref("manutencoes").push({
    maquina,
    manutencao: manutencaoDescricao, // Descrição da manutenção
    responsavel,
    email: userEmail, // Salva o e-mail do usuário logado
    proxima: tempoProxima,
    dataRegistro: new Date().toLocaleString("pt-BR"),
  });

  // Exibe a mensagem de sucesso (Toast)
  exibirToast();
  carregarHistorico(maquina);

  // Limpar os campos do formulário após salvar
  maquinaSelect.value = "";
  descricaoTextarea.value = ""; // Limpar a área de texto
  responsavelInput.value = "";
  tempoProximaSelect.value = "";
});

// Exibe a mensagem de sucesso (Toast)
function exibirToast() {
  // Verifica se já existe um toast ativo e remove antes de criar outro
  const toastExistente = document.querySelector(".toast");
  if (toastExistente) {
    toastExistente.remove();
  }

  // Criar o toast
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = "Manutenção registrada com sucesso!";

  // Posicionar abaixo do botão
  const salvarBtn = document.getElementById("salvarBtn");
  salvarBtn.parentNode.insertBefore(toast, salvarBtn.nextSibling);

  // Fazer o toast sumir após 2 segundos
  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);

  // Remover do DOM após a transição (2.5s no total)
  setTimeout(() => {
    toast.remove();
  }, 2500);
}

// Função para carregar o histórico filtrado
function carregarHistorico(maquinaSelecionada) {
  historicoDiv.innerHTML = ""; // Limpa o histórico antes de carregar

  db.ref("manutencoes")
    .orderByChild("maquina")
    .equalTo(maquinaSelecionada)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const dados = childSnapshot.val();
          const historicoItem = document.createElement("div");
          historicoItem.classList.add("historico-item");

          historicoItem.innerHTML = `
            <strong>Máquina:</strong> ${dados.maquina} <br>
            <strong>Manutenção:</strong> ${dados.manutencao} <br>
            <strong>Responsável:</strong> ${dados.responsavel} <br>
            <strong>E-mail:</strong> ${dados.email} <br> <!-- Exibindo o e-mail -->
            <strong>Próxima em:</strong> ${dados.proxima} <br>
            <strong>Data:</strong> ${dados.dataRegistro}
            <hr>
          `;
          historicoDiv.appendChild(historicoItem);
        });
      } else {
        historicoDiv.innerHTML = "<p>Nenhuma manutenção registrada.</p>";
      }
    });
}
