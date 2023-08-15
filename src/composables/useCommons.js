export function getColor(quantity) {
  const maxQuantity = 800;
  const percentage = (quantity / maxQuantity) * 100;
  let color = "";

  if (percentage <= 25) {
    color = "red";
  } else if (percentage <= 50) {
    color = "orange";
  } else if (percentage <= 75) {
    color = "#dcb233";
  } else {
    color = "green";
  }

  return color;
}

export function getBarHeight(quantity, targetValue, maxHeight) {
  const height = (quantity / targetValue) * maxHeight;
  return height + "px";
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
