<template>
  <div>
    <h1 class="text-4xl font-bold mb-6">Biberons</h1>
    <v-dialog transition="dialog-bottom-transition" width="auto">
      <template v-slot:activator="{ props }">
        <v-btn color="success" v-bind="props" class="mb-4"
          >Ajouter biberon</v-btn
        >
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="success" title="Enregistrer un biberon"></v-toolbar>
          <v-card-text>
            <div class="text-h2 px-12 py-8">
              <v-sheet width="300" class="mx-auto">
                <v-form fast-fail @submit.prevent="postMilkDrink()">
                  <v-text-field
                    v-model="currentDate"
                    label="Date"
                  ></v-text-field>

                  <v-text-field
                    v-model="currentTime"
                    label="Heure"
                  ></v-text-field>

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
                  >
                    Enregistrer
                  </v-btn>
                </v-form>
              </v-sheet>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" color="error" @click="isActive.value = false">
              Fermer
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <h2 class="text-2xl font-bold mt-8 mb-4">Historique</h2>
    <div class="flex justify-center items-center flex-wrap gap-8">
      <div
        class="chart-bar flex flex-col items-center justify-end text-white"
        v-for="item in aggregatedBiberons"
        :key="item.date"
        :style="{
          backgroundColor: getColor(item.quantity),
          height: getBarHeight(item.quantity),
        }"
      >
        <div class="bar-total text-xl font-bold mb-1">
          {{ item.quantity }} ml
        </div>
        <div class="bar-date text-sm">{{ formatDate(item.date, "dd/MM") }}</div>
      </div>
    </div>
    <v-table v-if="lastBiberons.length > 0" class="my-8">
      <thead>
        <tr>
          <th class="text-center">Date</th>
          <th class="text-center">Heure</th>
          <th class="text-center">Quantité</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lastBiberons" :key="item.date">
          <td>{{ item.date }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.quantity }} ml</td>
        </tr>
      </tbody>
    </v-table>
    <v-alert
      v-else
      type="error"
      text="Pas d'éléments enregistrés"
      width="300"
      class="mx-auto py-6 my-6"
    ></v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { postMilkDrink as postMilkDrinkApi, getBiberons } from "@/utils/useApi";

import {
  aggregateQuantities,
  formatDate,
  getBarHeight,
  getColor,
} from "@/utils/useCommons";

const quantity = ref(0);
const currentDate = ref("");
const currentTime = ref("");
const store = useStore();
const userId = computed(() => store.state.userId);
const lastBiberons = ref([]);
const aggregatedBiberons = ref();

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

onMounted(() => {
  getBiberons(userId.value).then((biberons) => {
    lastBiberons.value = biberons.sort((a, b) => {
      const dateA = new Date(a.date + " " + a.time);
      const dateB = new Date(b.date + " " + b.time);
      return dateB - dateA;
    });
    aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
  });
});

const postMilkDrink = () => {
  postMilkDrinkApi(
    userId.value,
    quantity.value,
    currentDate.value,
    currentTime.value
  ).then(() => {
    getBiberons(userId.value).then((biberons) => {
      lastBiberons.value = biberons;
      aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
    });
  });
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
