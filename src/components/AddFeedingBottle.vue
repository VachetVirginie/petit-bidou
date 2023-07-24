<template>
  <div>
    <h1>Enregistrer un biberon</h1>
    <pre>{{ lastBiberons }}</pre>
    <svg :width="svgSize" :height="svgSize">
      <rect :width="fillSize" :height="svgSize" :fill="color" />
    </svg>
  </div>
  <v-sheet width="300" class="mx-auto">
    <span class="text-h5">Date: {{ currentDate }}</span>
    <span class="text-h5">Heure du biberon: {{ currentTime }}</span>
    <v-form ref="form">
      <v-text-field
        v-model="quantity"
        :counter="3"
        label="Quantité de lait bu (en ml):"
        required
      ></v-text-field>

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" block @click="postBiberon">
          Enregistrer
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/useFirebase";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
import { getCurrentDate, getCurrentTime } from "@/utils/useCommons";

const quantity = ref(0);
const currentDate = ref("");
const currentTime = ref("");
const store = useStore();
const userId = computed(() => store.state.userId);
const lastBiberons = ref([]);

onMounted(() => {
  currentDate.value = getCurrentDate();
  currentTime.value = getCurrentTime();
});

async function postBiberon() {
  setDoc(
    doc(
      db,
      "biberons",
      `${userId.value}-${(Math.random() + 1).toString(36).substring(4)}`
    ),
    {
      userId: userId.value,
      quantity: parseInt(quantity.value),
      date: currentDate.value + " " + currentTime.value,
    },
    { merge: true }
  ).then(() => getDrinkedMilk());
}

async function getDrinkedMilk() {
  const biberonsCol = collection(db, "biberons");
  const biberonsSnapshot = await getDocs(biberonsCol);
  const biberonsList = biberonsSnapshot.docs.map((doc) => doc.data());
  console.log(biberonsList);
  return biberonsList;
}

onMounted(() => {
  getDrinkedMilk().then((biberons) => {
    console.log(biberons);
    lastBiberons.value = biberons.filter((biberon) => {
      return biberon.userId === userId.value;
    });
  });
});

const svgSize = ref(200);
const fillSize = computed(() => (quantity.value / 100) * svgSize.value);
const color = computed(() => {
  if (quantity.value < 25) {
    return "red";
  } else if (quantity.value < 50) {
    return "orange";
  } else if (quantity.value < 95) {
    return "yellow";
  } else {
    return "green";
  }
});
</script>
