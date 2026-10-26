export const isOverdue = (dueDate: string): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  // YYYY-MM-DD strings sort the same as dates, so a string compare works
  return dueDate < today;
};

export const formatToMonthDate = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
