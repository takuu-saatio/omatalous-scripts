export function getCurrentMonth() {

  const date = new Date();
  const monthPadding = date.getMonth() < 9 ? "0" : "";
  const currentMonth = date.getFullYear() + "-" +
    monthPadding + (date.getMonth() + 1);

  return currentMonth;

}

export function getMonthLabel(year, month) {
  
  const padding = month < 10 ? "0" : "";
  const label = year + "-" + padding + month;

  return label;

}
