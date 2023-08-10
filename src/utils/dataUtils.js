export const sortDatasByDate = (sortedDatas) => {
  sortedDatas.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateB - dateA;
  });
  return sortedDatas;
};

export const groupDatasByDate = (datas) => {
  const groupedDatas = {};
  datas.forEach((data) => {
    const date = data.date;
    if (!groupedDatas[date]) {
      groupedDatas[date] = [];
    }
    groupedDatas[date].push(data);
  });
  return groupedDatas;
};
