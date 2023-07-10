import { db } from "@/utils/useFirebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

export function postBiberon(userId, quantity, currentDate, currentTime) {
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
