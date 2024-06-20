export function prepareFilter(filter: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(filter).map(([key, value]) => {
      if (typeof value === 'string' && value.includes('%')) {
        return [
          key,
          {
            contains: value.replace('%', ''),
          },
        ];
      } else if (Array.isArray(value)) {
        return [
          key,
          {
            in: value,
          },
        ];
      }
      return [key, value];
    }),
  );
}
