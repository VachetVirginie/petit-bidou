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
