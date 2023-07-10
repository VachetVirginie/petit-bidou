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
    <div class="chart-container">
      <div
        class="chart-bar"
        v-for="item in aggregatedBiberons"
        :key="item.date"
        :style="{
          backgroundColor: getColor(item.quantity),
          height: getBarHeight(item.quantity),
        }"
      >
        <div class="bar-total">{{ item.quantity }} ml</div>
        <div class="bar-date">{{ formatDate(item.date, "dd/MM") }}</div>
      </div>
    </div>
    <v-table v-if="lastBiberons.length > 0">
      <thead>
        <tr>
          <th class="text-center">Date</th>
          <th class="text-center">Heure</th>
          <th class="text-center">Quantite</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lastBiberons" :key="item.date">
          <td>{{ item.date }}</td>
          <td>{{ item.time }}</td>
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
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import the French locale module

export default {
  setup() {
    const quantity = ref(0);
    const currentDate = ref("");
    const currentTime = ref("");
    const store = useStore();
    const userId = computed(() => store.state.userId);
    const lastBiberons = ref([]);
    const isActive = ref(false);
    const targetValue = ref(660);
    const maxHeight = ref(100);
    const aggregatedBiberons = ref();
    const frenchLocale = fr;

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
          date: currentDate.value,
          time: currentTime.value,
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

    function getBarHeight(quantity) {
      const height = (quantity / targetValue.value) * maxHeight.value;
      return height + "px";
    }

    function getColor(quantity) {
      let color = "";

      if (quantity >= 0 && quantity <= 250) {
        color = "red";
      } else if (quantity > 250 && quantity <= 500) {
        color = "orange";
      } else if (quantity > 500 && quantity <= 600) {
        color = "yellow";
      } else {
        color = "green";
      }

      return color;
    }

    function aggregateQuantities(biberons) {
      const quantitiesMap = new Map();

      for (const biberon of biberons) {
        const { date, quantity } = biberon;

        if (quantitiesMap.has(date)) {
          quantitiesMap.set(date, quantitiesMap.get(date) + quantity);
        } else {
          quantitiesMap.set(date, quantity);
        }
      }

      const aggregatedBiberons = [];
      quantitiesMap.forEach((quantity, date) => {
        aggregatedBiberons.push({ date, quantity });
      });

      return aggregatedBiberons;
    }

    onMounted(() => {
      getBiberons().then((biberons) => {
        lastBiberons.value = biberons.filter((biberon) => {
          return biberon.userId === userId.value;
        });
        aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
      });
    });

    function formatDate(date, formatStr, locale) {
      return format(new Date(date), formatStr, { locale });
    }

    return {
      quantity,
      currentDate,
      currentTime,
      saveMilkDrink,
      lastBiberons,
      getBarHeight,
      getColor,
      aggregatedBiberons: computed(() =>
        aggregateQuantities(lastBiberons.value)
      ),
      formatDate,
      frenchLocale,
    };
  },
};
</script>

<style>
.chart-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 300px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 50px;
  margin-right: 10px;
  border-radius: 5px;
}

.bar-total {
  margin-top: auto;
}

.bar-date {
  margin-top: 5px;
  text-align: center;
}
</style>
