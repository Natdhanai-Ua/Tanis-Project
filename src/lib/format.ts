/** แปลงพิกัดทศนิยมเป็นข้อความอ่านง่าย เช่น 35.6329° N */
export function formatLat(lat: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
}

export function formatLng(lng: number): string {
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
}

export function formatCoords(c: { lat: number; lng: number }): string {
  return `${formatLat(c.lat)}, ${formatLng(c.lng)}`;
}

const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

/** แปลงเลขอารบิกเป็นเลขไทย ใช้กับหมายเลขลำดับหัวข้อ */
export function toThaiDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => THAI_DIGITS[Number(d)]);
}

/** เติมศูนย์ข้างหน้าให้เป็นสองหลัก */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
