export const mergePagedCache = <TPage, TValue>(
  pages: TPage[] | undefined,
  selector: (page: TPage) => Record<string, TValue> | undefined
): Record<string, TValue> => {
  if (!pages?.length) return {};

  return pages.reduce<Record<string, TValue>>((acc, page) => {
    const cache = selector(page);
    if (cache) {
      Object.assign(acc, cache);
    }
    return acc;
  }, {});
};