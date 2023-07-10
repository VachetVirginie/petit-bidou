import { db } from "@/utils/useFirebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { format } from "date-fns";

export function saveMilkDrink(userId, quantity, currentDate, currentTime) {
  return setDoc(
    doc(db, "biberons", (userId, Math.random() + 1).toString(36).substring(4)),
    {
      userId,
      quantity: parseInt(quantity),
      date: currentDate,
      time: currentTime,
    },
    { merge: true }
  );
}

export async function getBiberons(userId) {
  const biberons = [];
  const querySnapshot = await getDocs(collection(db, "biberons"));
  querySnapshot.forEach((doc) => {
    biberons.push(doc.data());
  });
  return biberons.filter((biberon) => biberon.userId === userId);
}

export function aggregateQuantities(biberons) {
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

export function formatDate(date, formatStr, locale) {
  return format(new Date(date), formatStr, { locale });
}

export function getColor(quantity) {
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

export function getBarHeight(quantity, targetValue, maxHeight) {
  const height = (quantity / targetValue) * maxHeight;
  return height + "px";
}
