export interface TickerService {
  tick(): void;
  handler: {
    add(handler: (time: number) => void): () => void;
  };
  destroy(): void;
}