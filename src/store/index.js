import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  plugins: [createPersistedState()],
  state() {
    return {
      userEmail: "",
      userId: "",
    };
  },
  mutations: {
    setUserEmail(state, newEmail) {
      state.userEmail = newEmail;
    },
    setUserId(state, newId) {
      state.userId = newId;
    },
  },
  actions: {
    updateUserEmail({ commit }, newEmail) {
      commit("setUserEmail", newEmail);
    },
    updateUserId({ commit }, newId) {
      commit("setUserId", newId);
    },
  },
  getters: {
    getUserEmail(state) {
      return state.userEmail;
    },
    getUserId(state) {
      return state.userId;
    },
  },
});

export default store;
