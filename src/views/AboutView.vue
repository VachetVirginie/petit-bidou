<template>
  <div>
    <h1>Enregistrer la consomation de lait</h1>
    <form @submit.prevent="saveMilkDrink">
      <label>Date du jour: {{ currentDate }}</label>
      <br />
      <label>Heure du moment: {{ currentTime }}</label>
      <br />
      <label>Quantité de lait bu (en ml):</label>
      <input type="number" v-model="quantity" required />
      <br />
      <button type="submit">Enregistrer</button>
    </form>
    <svg :width="svgSize" :height="svgSize">
      <rect :width="fillSize" :height="svgSize" :fill="color" />
    </svg>
    <pre> {{ lastBiberons }} </pre>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/useFirebase";
import { getDocs, collection } from "firebase/firestore";
import { addDrinkedMilk } from "@/utils/useFirestore";
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

function saveMilkDrink() {
  addDrinkedMilk(
    userId.value,
    quantity.value,
    currentDate.value,
    currentTime.value
  );
}

async function getBiberons() {
  const biberonsCol = collection(db, "biberons");
  const biberonsSnapshot = await getDocs(biberonsCol);
  const biberonsList = biberonsSnapshot.docs.map((doc) => doc.data());
  return biberonsList;
}

onMounted(() => {
  getBiberons().then((biberons) => {
    lastBiberons.value = biberons.filter((biberon) => {
      return (
        biberon.userId === userId.value && biberon.date === currentDate.value
      );
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
