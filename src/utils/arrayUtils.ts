import { ArrayElement } from '@/types/sorting';

export const generateRandomArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  
  for (let i = 0; i < size; i++) {
    array.push({
      id: i,
      value: Math.floor(Math.random() * 300) + 10, // Values between 10-310
      state: 'default',
    });
  }
  
  return array;
};

export const parseCustomArray = (input: string): number[] => {
  try {
    // Remove extra spaces and split by comma or space
    const values = input
      .trim()
      .replace(/\s+/g, ' ')
      .split(/[,\s]+/)
      .map(val => parseInt(val.trim(), 10))
      .filter(val => !isNaN(val) && val > 0 && val <= 500);
    
    // Limit to reasonable size
    return values.slice(0, 100);
  } catch {
    return [];
  }
};

export const validateArrayInput = (input: string): { valid: boolean; error?: string } => {
  if (!input.trim()) {
    return { valid: false, error: 'Please enter some numbers' };
  }
  
  const values = parseCustomArray(input);
  
  if (values.length === 0) {
    return { valid: false, error: 'Please enter valid numbers (1-500)' };
  }
  
  if (values.length < 2) {
    return { valid: false, error: 'Please enter at least 2 numbers' };
  }
  
  return { valid: true };
};