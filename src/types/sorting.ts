export type SortingAlgorithm = 
  | 'bubble' 
  | 'selection' 
  | 'insertion' 
  | 'merge' 
  | 'quick' 
  | 'heap' 
  | 'radix';

export type ArrayElementState = 'default' | 'comparing' | 'swapping' | 'sorted';

export interface ArrayElement {
  id: number;
  value: number;
  state: ArrayElementState;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped';

export interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}

export interface SortingStep {
  array: ArrayElement[];
  description: string;
  comparingIndices?: number[];
  swappingIndices?: number[];
}