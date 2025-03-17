// Importação do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDIYtVfwm3P6HfPtuDYjK7WAuUiXgtO650",
    authDomain: "aplicativo-manuntencao.firebaseapp.com",
    databaseURL: "https://aplicativo-manuntencao-default-rtdb.firebaseio.com",
    projectId: "aplicativo-manuntencao",
    storageBucket: "aplicativo-manuntencao.firebasestorage.app",
    messagingSenderId: "780156006549",
    appId: "1:780156006549:web:e38565b02bfc54d882eb9c"
  };

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exporta os módulos corretamente
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
