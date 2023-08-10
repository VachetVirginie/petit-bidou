export const sortDatasByDate = (sortedDatas) => {
  sortedDatas.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateB - dateA;
  });
  return sortedDatas;
};
