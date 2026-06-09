const appTimeZone = "Asia/Jakarta";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function dateFromParts(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function getJakartaDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: appTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return dateFromParts(year, month, day);
}

export function getCurrentMonthValue(date = new Date()) {
  return getJakartaDateString(date).slice(0, 7);
}

export function isValidMonthValue(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

export function getMonthRange(monthValue: string) {
  const [yearText, monthText] = monthValue.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const nextMonthDate = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = startDate.getUTCDay();

  return {
    year,
    month,
    start: dateFromParts(year, month, 1),
    end: dateFromParts(
      nextMonthDate.getUTCFullYear(),
      nextMonthDate.getUTCMonth() + 1,
      nextMonthDate.getUTCDate()
    ),
    daysInMonth,
    firstDayOffset: (firstDay + 6) % 7,
    label: new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(startDate),
  };
}

export function formatDateId(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
