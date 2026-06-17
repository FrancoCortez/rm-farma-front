export function formatDate(date: Date) {
  const inDate = new Date(date);
  const day = String(inDate.getDate()).padStart(2, '0');
  const month = String(inDate.getMonth() + 1).padStart(2, '0');
  const year = String(inDate.getFullYear()).slice(-4);
  const hours = String(inDate.getHours()).padStart(2, '0');
  const minutes = String(inDate.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatDateTimeSeparated(inDate: any) {
  const date = formatDate(inDate as Date);
  const [datePart, timePart] = date.split(' ');
  const [dayExtract, monthExtract, yearExtract] = datePart.split('/');
  const [hoursExtract, minutesExtract] = timePart.split(':');
  const dateExtract = new Date(
    Number(yearExtract),
    Number(monthExtract) - 1,
    Number(dayExtract),
    Number(hoursExtract),
    Number(minutesExtract),
  );
  const day = String(dateExtract.getDate()).padStart(2, '0');
  const month = String(dateExtract.getMonth() + 1).padStart(2, '0');
  const year = dateExtract.getFullYear();
  const hours = String(dateExtract.getHours()).padStart(2, '0');
  const minutes = String(dateExtract.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;
  return {
    formattedDate,
    formattedTime,
  };
}
