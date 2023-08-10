<template>
  <div>
    <div class="d-flex justify-end m-3">
      <v-btn @click="onSignOut">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </v-btn>
    </div>
    <h1 class="text-4xl font-bold mb-6">Biberons</h1>
    <v-dialog
      transition="dialog-bottom-transition"
      width="auto"
      v-model="dialogVisible"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="success" @click="openDialog(props)" class="mb-4"
          >Ajouter biberon</v-btn
        >
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="success" title="Enregistrer un biberon"></v-toolbar>
          <v-card-text>
            <div class="text-h2 px-12 py-8">
              <v-sheet class="mx-auto">
                <v-form fast-fail @submit.prevent="postBiberon()">
                  <v-text-field
                    type="date"
                    v-model="currentDate"
                    label="Date"
                  ></v-text-field>

                  <v-text-field
                    type="time"
                    v-model="currentTime"
                    label="Heure"
                  ></v-text-field>

                  <v-text-field
                    v-model="quantity"
                    type="number"
                    label="Quantité de lait bu (en ml)"
                    required
                  ></v-text-field>

                  <div class="inline">
                    <v-checkbox v-model="morningPill" label="Fer1"></v-checkbox>
                    <v-checkbox v-model="middayPill" label="Vit"></v-checkbox>
                    <v-checkbox v-model="eveningPill" label="Fer2"></v-checkbox>
                  </div>

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
    <template
      v-for="(groupedBiberons, date) in groupedLastBiberons"
      :key="date"
    >
      <h2 class="text-2xl font-bold mt-8 mb-4">
        {{ formatDate(date, "dd/MM") }}
      </h2>
      <v-table class="my-8">
        <thead>
          <tr>
            <th class="text-center">Heure</th>
            <th class="text-center">Quantité</th>
            <th class="text-center">Medicaments</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in groupedBiberons" :key="item.date">
            <td>{{ item.time }}</td>
            <td>{{ item.quantity }} ml</td>
            <td>
              <span
                class="pill-dot"
                :class="{
                  'pill-dot-green': item.morningPill,
                  'pill-dot-red': !item.morningPill,
                }"
              ></span>
              <span
                class="pill-dot"
                :class="{
                  'pill-dot-green': item.middayPill,
                  'pill-dot-red': !item.middayPill,
                }"
              ></span>
              <span
                class="pill-dot"
                :class="{
                  'pill-dot-green': item.eveningPill,
                  'pill-dot-red': !item.eveningPill,
                }"
              ></span>
            </td>
            <td>
              <v-btn
                density="compact"
                icon="mdi-delete"
                @click="onDeleteBiberon(item.id)"
              ></v-btn>
              <v-btn
                density="compact"
                icon="mdi-pencil-outline"
                @click="onEdit(item)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>
    <v-alert
      v-if="lastBiberons.length === 0"
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
import {
  postBiberon as postBiberonApi,
  getBiberons,
  deleteBiberon,
  updateBiberon,
} from "@/composables/useApi";

import {
  aggregateQuantities,
  getBarHeight,
  getColor,
} from "@/composables/useCommons";

import {
  formatDate,
  getCurrentTime,
  getCurrentDate,
} from "@/utils/dateTimeUtils";

import useFirestore from "@/composables/useFirestore";

import { groupDatasByDate, sortDatasByDate } from "@/utils/dataUtils";

const quantity = ref(0);
const currentDate = ref("");
const currentTime = ref("");
const morningPill = ref(false);
const eveningPill = ref(false);
const middayPill = ref(false);
const store = useStore();
const userId = computed(() => store.state.userId);
const lastBiberons = ref([]);
const aggregatedBiberons = ref();
const dialogVisible = ref(false);
const editedItem = ref(null);
const { signOut } = useFirestore();

const onSignOut = () => {
  signOut();
  store.commit("setUserId", null);
};

const postBiberon = () => {
  if (editedItem.value) {
    updateBiberon(
      userId.value,
      editedItem.value.id,
      parseInt(quantity.value),
      currentDate.value,
      currentTime.value,
      morningPill.value,
      middayPill.value,
      eveningPill.value
    ).then(() => {
      updateBiberon(
        editedItem.value.id,
        parseInt(quantity.value),
        currentDate.value,
        currentTime.value,
        morningPill.value,
        middayPill.value,
        eveningPill.value
      ).then(() => {
        getBiberons(userId.value).then((biberons) => {
          lastBiberons.value = biberons;
          aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
        });
        editedItem.value = null;
      });
    });
  } else {
    postBiberonApi(
      userId.value,
      quantity.value,
      currentDate.value,
      currentTime.value,
      morningPill.value,
      middayPill.value,
      eveningPill.value
    ).then(() => {
      getBiberons(userId.value).then((biberons) => {
        lastBiberons.value = biberons;
        aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
      });
    });
  }
};

const onDeleteBiberon = (id) => {
  deleteBiberon(id).then(() => {
    getBiberons(userId.value).then((biberons) => {
      lastBiberons.value = biberons;
      aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
    });
  });
};

// Méthode pour ouvrir le v-dialog
const openDialog = (props) => {
  console.log(props);
  dialogVisible.value = true;
  updateCurrentDateTime();
};

// Méthode pour fermer le v-dialog
// const closeDialog = () => {
//   dialogVisible.value = false;
// };

const updateCurrentDateTime = () => {
  currentDate.value = getCurrentDate();
  currentTime.value = getCurrentTime();
};

const onEdit = (item) => {
  openDialog();
  editedItem.value = { ...item };

  currentDate.value = editedItem.value.date;
  currentTime.value = editedItem.value.time;
  quantity.value = editedItem.value.quantity;
  morningPill.value = editedItem.value.morningPill;
  middayPill.value = editedItem.value.middayPill;
  eveningPill.value = editedItem.value.eveningPill;
};

const groupedLastBiberons = computed(() => {
  return groupDatasByDate(lastBiberons.value);
});

onMounted(() => {
  currentDate.value = getCurrentDate();
  currentTime.value = getCurrentTime();

  getBiberons(userId.value).then((biberons) => {
    lastBiberons.value = sortDatasByDate(biberons);
    aggregatedBiberons.value = aggregateQuantities(lastBiberons.value);
  });
});
</script>

<style>
.chart-bar {
  @apply flex flex-col justify-end items-center w-12 mr-2 rounded;
}

.bar-total {
  @apply mt-auto;
}

.bar-date {
  @apply mt-1 text-center;
}

.inline {
  @apply flex items-center;
}

.pill-dot {
  background-color: green;
  width: 8px;
  height: 8px;
  border-radius: 6px;
  margin-right: 4px;
  display: inline-block;
}

.pill-dot-red {
  background-color: red;
}
</style>
