export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDateLong(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}min`;
}

export function generateReservationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `RES-${code}`;
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}