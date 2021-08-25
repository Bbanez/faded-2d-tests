import { LinearFunctions } from '../../types';

export interface Edge {
  id: string;
  node: {
    start: string;
    end: string;
  };
  e: LinearFunctions;
}
