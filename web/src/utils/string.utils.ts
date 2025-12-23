export const norm = (s: string) => s.trim().toLowerCase();

// Разбивает строку на массив букв, исключая пробелы
export const splitToLetters = (s: string): string[] => {
  return Array.from(s).filter((ch) => ch.trim() !== '');
};
