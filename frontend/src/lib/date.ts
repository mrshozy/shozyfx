export function getPreviousWorkDay(): Date {
  const today = new Date();
  const previousWorkDay = new Date(today);
  do {
    previousWorkDay.setDate(previousWorkDay.getDate() - 1);
  } while (previousWorkDay.getDay() === 0 || previousWorkDay.getDay() === 6); // Skip weekends
  previousWorkDay.setHours(0, 0, 0, 0);
  return previousWorkDay;
}

export function getNextFriday(): Date {
  const today = new Date();
  const nextFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7;
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday;
}

export const formattedDate = (date: Date, d?: number) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month to adjust for 0-based months
  const day = (date.getDate() + (d != undefined ? d : 0)).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formattedHours = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
};

export const dateFormatter = (date: number) => {
  const formattedDate = new Date(date * 1000);
  const hours = formattedDate.getHours().toString().padStart(2, '0');
  const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


export const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const month = monthNames[date.getMonth()];
  const day = dayNames[date.getDay()];
  const dateNumber = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day} ${dateNumber} ${hours}:${minutes}`;
};

export function getLastWeekdayBeforeWeekend():Date {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  // Calculate the number of days to subtract to get to the last weekday before the weekend
  const daysToSubtract = currentDay === 0 ? 2 : 1;

  const lastWeekdayBeforeWeekend = new Date(currentDate);
  lastWeekdayBeforeWeekend.setDate(currentDate.getDate() - daysToSubtract);
  return lastWeekdayBeforeWeekend;
}