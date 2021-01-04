export function daysInMonth(month = 0, year = 0): number[] {
  let day = 1;
  const result = [day];
  let date = new Date(year, month, day);
  while (month === date.getMonth()) {
    day++;
    date = new Date(year, month, day);
    result.push(day);
  }
  return result;
}
