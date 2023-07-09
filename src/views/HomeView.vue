<template>
  <div>
    <h1>Page de connexion</h1>
    <input type="email" v-model="userEmail" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Mot de passe" />
    <button @click="onLoginUser">Se connecter</button>
    <button @click="onCreateUser">Creer un compte</button>
  </div>
</template>

<script setup>
import useFirestore from "@/utils/useFirestore";
import { useStore } from "vuex";

const { createUser, loginUser, password, userEmail } = useFirestore();
const store = useStore();

const onCreateUser = () => {
  createUser();
  store.dispatch("updateUserEmail", userEmail.value);
};

const onLoginUser = () => {
  loginUser();
  store.dispatch("updateUserEmail", userEmail.value);
};
</script>
