const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const pad = (value: number): string => value.toString().padStart(2, '0');

export const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  return `${year}-${month}-${day}`;
};

export const normalizeDate = (value: unknown): string => {
  if (typeof value === 'string' && DATE_RE.test(value)) {
    return value;
  }

  return getTodayDate();
};

export const formatDateText = (date: string): string => {
  return date;
};
