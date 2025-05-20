export const getUser = () =>
  inject("USER", ref<IChzzkChannelUser | undefined>(undefined));

// Watch for changes in rows and emit updates
export const range = (n: number, start: number = 0): number[] => {
    return Array.from({length: n - start}, (_, i) => start + i);
};