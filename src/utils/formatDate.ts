const months = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
