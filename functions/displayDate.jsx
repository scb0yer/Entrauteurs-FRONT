export default function DisplayDate({ date }) {
  const newDate = new Date(date);
  const number = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getFullYear();
  let monthName = "";

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  for (let m = 0; m < months.length; m++) {
    if (month === m) {
      monthName = months[m];
    }
  }
  const writtenDate = `${number} ${monthName} ${year}`;
  return <span>{writtenDate}</span>;
}
