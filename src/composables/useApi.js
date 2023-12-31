import { db } from "@/composables/useFirebase";
import {
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  collection,
} from "firebase/firestore";

export function postBiberon(
  userId,
  quantity,
  currentDate,
  currentTime,
  morningPill,
  middayPill,
  eveningPill
) {
  return setDoc(
    doc(db, "biberons", (userId, Math.random() + 1).toString(36).substring(4)),
    {
      userId,
      quantity: parseInt(quantity),
      date: currentDate,
      time: currentTime,
      morningPill: morningPill,
      middayPill: middayPill,
      eveningPill: eveningPill,
    },
    { merge: true }
  );
}

export async function getBiberons(userId) {
  const biberons = [];
  const querySnapshot = await getDocs(collection(db, "biberons"));
  querySnapshot.forEach((doc) => {
    const biberonData = doc.data();
    const biberonId = doc.id;

    biberons.push({ ...biberonData, id: biberonId });
  });
  return biberons.filter((biberon) => biberon.userId === userId);
}

export async function updateBiberon(
  biberonId,
  quantity,
  currentDate,
  currentTime,
  morningPill,
  middayPill,
  eveningPill
) {
  return setDoc(
    doc(db, "biberons", biberonId),
    {
      quantity: quantity,
      date: currentDate,
      time: currentTime,
      morningPill: morningPill,
      middayPill: middayPill,
      eveningPill: eveningPill,
    },
    { merge: true }
  );
}

export async function deleteBiberon(biberonId) {
  return deleteDoc(doc(db, "biberons", biberonId), { merge: true });
}
