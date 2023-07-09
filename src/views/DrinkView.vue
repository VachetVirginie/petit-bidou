<template>
  <div>
    <h1>Biberons</h1>
    <v-dialog transition="dialog-bottom-transition" width="auto">
      <template v-slot:activator="{ props }">
        <v-btn color="success" v-bind="props">Ajouter biberon</v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="success" title="Enregister un biberon"></v-toolbar>
          <v-card-text>
            <div class="text-h2 pa-12">
              <v-sheet width="300" class="mx-auto">
                <v-form fast-fail @submit.prevent="saveMilkDrink">
                  <v-text-field v-model="currentDate"></v-text-field>

                  <v-text-field v-model="currentTime"></v-text-field>

                  <v-text-field
                    v-model="quantity"
                    type="number"
                    label="Quantité de lait bu (en ml)"
                    required
                  ></v-text-field>

                  <v-btn
                    type="submit"
                    block
                    color="success"
                    @click="isActive.value = false"
                    class="mt-2"
                    >Enregistrer</v-btn
                  >
                </v-form>
              </v-sheet>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" color="error" @click="isActive.value = false"
              >Fermer</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <h2>Historique</h2>
    <v-table v-if="lastBiberons.length > 0">
      <thead>
        <tr>
          <th class="text-center">Date</th>
          <th class="text-center">Quantite</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lastBiberons" :key="item.date">
          <td>{{ item.date }}</td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-alert
      v-else
      type="error"
      text="Pas d'elements enregistres"
      width="300"
      class="mx-auto py-6 my-6"
    ></v-alert>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/useFirebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

export default {
  setup() {
    const quantity = ref(0);
    const currentDate = ref("");
    const currentTime = ref("");
    const store = useStore();
    const userId = computed(() => store.state.userId);
    const lastBiberons = ref([]);
    const isActive = ref(false);

    onMounted(() => {
      currentDate.value = getCurrentDate();
      currentTime.value = getCurrentTime();
    });

    function getCurrentDate() {
      const now = new Date();
      return now.toISOString().split("T")[0];
    }

    function getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString();
    }

    function saveMilkDrink() {
      setDoc(
        doc(
          db,
          "biberons",
          (userId.value, Math.random() + 1).toString(36).substring(4)
        ),
        {
          userId: userId.value,
          quantity: parseInt(quantity.value),
          date: currentDate.value + " " + currentTime.value,
        },
        { merge: true }
      ).then(() => {
        quantity.value = 0;
        getBiberons().then((biberons) => {
          lastBiberons.value = biberons.filter((biberon) => {
            return biberon.userId === userId.value;
          });
        });
        isActive.value = false;
      });
    }

    async function getBiberons() {
      const biberons = [];
      const querySnapshot = await getDocs(collection(db, "biberons"));
      querySnapshot.forEach((doc) => {
        biberons.push(doc.data());
      });
      return biberons;
    }

    onMounted(() => {
      getBiberons().then((biberons) => {
        lastBiberons.value = biberons.filter((biberon) => {
          return biberon.userId === userId.value;
        });
      });
    });

    return {
      quantity,
      currentDate,
      currentTime,
      saveMilkDrink,
      lastBiberons,
    };
  },
};
</script>

<style>
/* Vos styles CSS ici */
</style>
