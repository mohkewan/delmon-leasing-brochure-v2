/**
 * تنسيق الأرقام بالأرقام الغربية (1,2,3) دائماً بغض النظر عن locale المتصفح
 * يستخدم en-US-u-nu-latn لضمان الأرقام اللاتينية حتى في المتصفحات العربية
 */
export function formatNumber(value: number | string | undefined | null, decimals?: number): string {
  if (value === undefined || value === null || value === "") return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
    useGrouping: true,
  }).format(num);
}

export function formatArea(value: number | string | undefined | null): string {
  const formatted = formatNumber(value, 0);
  return formatted === "—" ? "—" : `${formatted} م²`;
}

export function formatCurrency(value: number | string | undefined | null): string {
  const formatted = formatNumber(value, 0);
  return formatted === "—" ? "—" : `${formatted} ر.س`;
}
