const numberFormatter = new Intl.NumberFormat();
const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 0,
});

export const formatNumber = (value: number): string => numberFormatter.format(value);
export const formatPercent = (value: number): string => percentFormatter.format(value);
