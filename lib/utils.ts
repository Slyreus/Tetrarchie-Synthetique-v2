export const cn = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(' ');

export const formatPercent = (value: number) => `${Math.max(0, Math.min(100, value))}%`;
