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

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

export default {
  setup() {
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
      );
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
          return (
            biberon.userId === userId.value &&
            biberon.date === currentDate.value
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

    return {
      quantity,
      currentDate,
      currentTime,
      saveMilkDrink,
      lastBiberons,
      svgSize,
      fillSize,
      color,
    };
  },
};
</script>

<style>
/* Vos styles CSS ici */
</style>
