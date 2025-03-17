import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "./firebase-config.js";

// Alternar entre Login e Registro
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

btnLogin.addEventListener("click", () => {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  btnLogin.classList.add("active");
  btnRegister.classList.remove("active");
});

btnRegister.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  btnRegister.classList.add("active");
  btnLogin.classList.remove("active");
});

// Função para exibir o toast
function exibirToast(mensagem, tipo) {
  const toast = document.createElement("div");
  toast.classList.add("toast", tipo); // Tipo vai ser 'sucesso' ou 'erro'
  toast.textContent = mensagem;

  // Adiciona o toast à tela
  document.body.appendChild(toast);

  // Faz o toast desaparecer após 2 segundos
  setTimeout(() => {
    toast.classList.add("hide");
  }, 2000);

  // Remove o toast após a animação de desaparecimento
  setTimeout(() => {
    toast.remove();
  }, 2500);
}

// LOGIN
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("userEmail", email); // Salva o e-mail no armazenamento local
      exibirToast("Login realizado com sucesso!", "sucesso");
      console.log(userCredential.user);
      
      setTimeout(() => {
        window.location.href = "manutencao.html";
      }, 2000);
    })
    .catch((error) => {
      exibirToast("Erro ao fazer login: " + error.message, "erro");
    });
});

// REGISTRO
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const senhaValida = /^(?=.*[A-Z]).{8,}$/;
  if (!senhaValida.test(password)) {
    alert("A senha deve ter no mínimo 8 caracteres e pelo menos 1 letra maiúscula.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      exibirToast("Usuário registrado com sucesso! Agora faça login.", "sucesso");
      console.log(userCredential.user);
      btnLogin.click();
    })
    .catch((error) => {
      exibirToast("Erro ao registrar: " + error.message, "erro");
    });
});
