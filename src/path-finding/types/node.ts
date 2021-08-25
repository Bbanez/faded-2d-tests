import { CircleFunctions } from '../../types';

export interface Node {
  id: string;
  next: string;
  chunkIds: string[];
  c: CircleFunctions;
}
