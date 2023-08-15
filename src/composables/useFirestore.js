import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/composables/useFirebase";
import { useStore } from "vuex";
import { ref } from "vue";

export default () => {
  const userEmail = ref("");
  const password = ref("");
  const isError = ref(false);
  const errorMessage = ref("");

  const action = ref({
    isActive: false,
    title: "",
    text: "",
    color: "",
  });

  const store = useStore();

  const createUser = () => {
    createUserWithEmailAndPassword(auth, userEmail.value, password.value)
      .then(() => {
        setTimeout(() => {
          window.location.href = "/biberons";
        }, 1000);
      })
      .catch((error) => {
        console.log(error.message);
        let errorType =
          error.message === "Firebase: Error (auth/email-already-in-use)."
            ? "L'utilisateur existe déjà"
            : "Une erreur est survenue";
        action.value = {
          isActive: true,
          title: "Erreur",
          text: errorType,
          color: "bg-red-500",
        };
      });
  };

  const loginUser = () => {
    signInWithEmailAndPassword(auth, userEmail.value, password.value)
      .then((userCredential) => {
        store
          .dispatch("updateUserId", userCredential.user.uid)
          .then(() => console.log(userCredential.user.uid));
        window.location.href = "/biberons";
      })
      .catch((error) => {
        errorMessage.value = error.message;
        isError.value = true;
      });
  };

  const signOut = () => {
    auth.signOut().then(() => {
      store.dispatch("updateUserId", null).then((r) => console.log(r));
      window.location.href = "/";
    });
  };

  return {
    createUser,
    loginUser,
    password,
    signOut,
    userEmail,
    isError,
    errorMessage,
  };
};
