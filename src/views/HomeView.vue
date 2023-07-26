<template>
  <div>
    <h1>Page de connexion</h1>
    <v-sheet width="300" class="mx-auto">
      <v-text-field v-model="userEmail" label="Email"></v-text-field>
      <v-text-field v-model="password" label="Mot de passe"></v-text-field>
      <div class="d-flex flex-column">
        <v-btn
          class="text-none text-subtitle-1"
          color="success"
          block
          @click="onLoginUser"
        >
          Se connecter
        </v-btn>
        <v-btn
          class="text-none text-subtitle-1 mt-4"
          color="success"
          block
          @click="onCreateUser"
        >
          Creer un compte
        </v-btn>
      </div>
    </v-sheet>
    <v-dialog v-model="isError" activator="parent" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" block @click="isError = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import useFirestore from "@/composables/useFirestore";
import { useStore } from "vuex";

const { createUser, loginUser, password, userEmail, errorMessage, isError } =
  useFirestore();
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
