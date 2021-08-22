import * as uuid from 'uuid';
import { TickerService as TickerServiceType } from '../types';

export function tickerService(): TickerServiceType {
  const handlers: Array<{ id: string; fn: (time: number) => void }> = [];
  const timeOffset = Date.now();
  const self: TickerServiceType = {
    tick() {
      const time = Date.now() - timeOffset;
      handlers.forEach((handler) => {
        handler.fn(time);
      });
    },
    handler: {
      add(handler) {
        const id = uuid.v4();
        handlers.push({
          id,
          fn: handler,
        });
        return () => {
          for (let i = 0; i < handlers.length; i = i + 1) {
            if (handlers[i].id === id) {
              handlers.splice(i, 1);
              return;
            }
          }
        };
      },
    },
    destroy() {
      while (handlers.length > 0) {
        handlers.pop();
      }
    },
  };
  return self;
}

export const TickerService = tickerService();
