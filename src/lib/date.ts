/**
 * Calculate the number of days until a given date
 * @param dateISO - ISO date string
 * @returns Number of days until the date (negative if past)
 */
export function daysUntil(dateISO: string): number {
  const targetDate = new Date(dateISO);
  const today = new Date();
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Format a date to French short format (e.g., "sam. 27 sept.")
 * @param dateISO - ISO date string
 * @returns Formatted date string in French
 */
export function formatDateFR(dateISO: string): string {
  const date = new Date(dateISO);
  
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).format(date);
}

/**
 * Get a human-readable string for days until event
 * @param dateISO - ISO date string
 * @returns Human-readable string (e.g., "3 jours avant l'événement", "Aujourd'hui", "Demain")
 */
export function getDaysUntilEventText(dateISO: string): string {
  const days = daysUntil(dateISO);
  
  if (days < 0) return 'Événement passé';
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  return `${days} jours avant l'événement`;
}

/**
 * Format a date to full French format (e.g., "samedi 27 septembre 2024")
 * @param dateISO - ISO date string
 * @returns Full formatted date string in French
 */
export function formatDateFullFR(dateISO: string): string {
  const date = new Date(dateISO);
  
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Format time to French format (e.g., "14:30")
 * @param dateISO - ISO date string
 * @returns Formatted time string
 */
export function formatTimeFR(dateISO: string): string {
  const date = new Date(dateISO);
  
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
