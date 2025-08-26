import { ArrayElement, SortingStep, SortingAlgorithm } from '@/types/sorting';

// Helper function to create a deep copy of array with updated states
const createStep = (
  array: ArrayElement[],
  description: string,
  comparingIndices: number[] = [],
  swappingIndices: number[] = []
): SortingStep => {
  const newArray = array.map((element, index) => ({
    ...element,
    state: swappingIndices.includes(index) 
      ? 'swapping' as const
      : comparingIndices.includes(index) 
      ? 'comparing' as const 
      : element.state
  }));
  
  return {
    array: newArray,
    description,
    comparingIndices,
    swappingIndices
  };
};

// Helper function to mark elements as sorted
const markSorted = (array: ArrayElement[], indices: number[]): ArrayElement[] => {
  return array.map((element, index) => ({
    ...element,
    state: indices.includes(index) ? 'sorted' as const : element.state
  }));
};

// Helper function to reset all states to default
const resetStates = (array: ArrayElement[]): ArrayElement[] => {
  return array.map(element => ({ ...element, state: 'default' as const }));
};

// Bubble Sort Implementation
export const bubbleSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);
  const n = array.length;

  steps.push(createStep(array, "Starting Bubble Sort"));

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      steps.push(createStep(array, `Comparing elements at positions ${j} and ${j + 1}`, [j, j + 1]));

      if (array[j].value > array[j + 1].value) {
        // Swap elements
        steps.push(createStep(array, `Swapping elements at positions ${j} and ${j + 1}`, [], [j, j + 1]));
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push(createStep(array, `Elements swapped`, []));
      }
    }
    // Mark the last element as sorted
    array[n - i - 1].state = 'sorted';
    steps.push(createStep(array, `Element at position ${n - i - 1} is now in its final position`));
  }

  // Mark the first element as sorted
  array[0].state = 'sorted';
  steps.push(createStep(array, "Bubble Sort completed!"));
  
  return steps;
};

// Selection Sort Implementation
export const selectionSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);
  const n = array.length;

  steps.push(createStep(array, "Starting Selection Sort"));

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    steps.push(createStep(array, `Finding minimum element in unsorted portion starting from position ${i}`, [i]));

    for (let j = i + 1; j < n; j++) {
      steps.push(createStep(array, `Comparing element at position ${j} with current minimum at position ${minIndex}`, [j, minIndex]));
      
      if (array[j].value < array[minIndex].value) {
        minIndex = j;
        steps.push(createStep(array, `New minimum found at position ${j}`, [j]));
      }
    }

    if (minIndex !== i) {
      steps.push(createStep(array, `Swapping elements at positions ${i} and ${minIndex}`, [], [i, minIndex]));
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }

    array[i].state = 'sorted';
    steps.push(createStep(array, `Element at position ${i} is now in its final position`));
  }

  array[n - 1].state = 'sorted';
  steps.push(createStep(array, "Selection Sort completed!"));
  
  return steps;
};

// Insertion Sort Implementation
export const insertionSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);
  const n = array.length;

  steps.push(createStep(array, "Starting Insertion Sort"));
  array[0].state = 'sorted';
  steps.push(createStep(array, "First element is considered sorted"));

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push(createStep(array, `Inserting element ${key.value} into sorted portion`, [i]));

    while (j >= 0 && array[j].value > key.value) {
      steps.push(createStep(array, `Comparing ${key.value} with ${array[j].value}`, [i, j]));
      steps.push(createStep(array, `Shifting element ${array[j].value} to the right`, [], [j, j + 1]));
      
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
    
    // Mark all elements from 0 to i as sorted
    for (let k = 0; k <= i; k++) {
      array[k].state = 'sorted';
    }
    
    steps.push(createStep(array, `Element ${key.value} inserted at position ${j + 1}`));
  }

  steps.push(createStep(array, "Insertion Sort completed!"));
  return steps;
};

// Merge Sort Implementation
export const mergeSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);

  steps.push(createStep(array, "Starting Merge Sort"));

  const merge = (arr: ArrayElement[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push(createStep(arr, `Merging subarrays [${left}-${mid}] and [${mid + 1}-${right}]`, 
      Array.from({length: right - left + 1}, (_, i) => left + i)));

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push(createStep(arr, `Comparing ${leftArr[i].value} and ${rightArr[j].value}`, [left + i, mid + 1 + j]));
      
      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
    }

    steps.push(createStep(arr, `Merged subarrays [${left}-${right}]`));
  };

  const mergeSortRecursive = (arr: ArrayElement[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(arr, `Dividing array into [${left}-${mid}] and [${mid + 1}-${right}]`));
      
      mergeSortRecursive(arr, left, mid);
      mergeSortRecursive(arr, mid + 1, right);
      merge(arr, left, mid, right);
    }
  };

  mergeSortRecursive(array, 0, array.length - 1);
  
  // Mark all as sorted
  array.forEach(element => element.state = 'sorted');
  steps.push(createStep(array, "Merge Sort completed!"));
  
  return steps;
};

// Quick Sort Implementation
export const quickSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);

  steps.push(createStep(array, "Starting Quick Sort"));

  const partition = (arr: ArrayElement[], low: number, high: number): number => {
    const pivot = arr[high];
    steps.push(createStep(arr, `Chosen pivot: ${pivot.value} at position ${high}`, [high]));
    
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push(createStep(arr, `Comparing ${arr[j].value} with pivot ${pivot.value}`, [j, high]));
      
      if (arr[j].value < pivot.value) {
        i++;
        if (i !== j) {
          steps.push(createStep(arr, `Swapping elements at positions ${i} and ${j}`, [], [i, j]));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    steps.push(createStep(arr, `Placing pivot at position ${i + 1}`, [], [i + 1, high]));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1;
  };

  const quickSortRecursive = (arr: ArrayElement[], low: number, high: number) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      
      steps.push(createStep(arr, `Pivot ${arr[pi].value} is now at its final position ${pi}`));
      arr[pi].state = 'sorted';
      
      quickSortRecursive(arr, low, pi - 1);
      quickSortRecursive(arr, pi + 1, high);
    } else if (low === high) {
      arr[low].state = 'sorted';
      steps.push(createStep(arr, `Single element at position ${low} is sorted`));
    }
  };

  quickSortRecursive(array, 0, array.length - 1);
  steps.push(createStep(array, "Quick Sort completed!"));
  
  return steps;
};

// Heap Sort Implementation
export const heapSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);
  const n = array.length;

  steps.push(createStep(array, "Starting Heap Sort"));

  const heapify = (arr: ArrayElement[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push(createStep(arr, `Heapifying at index ${i}`, [i]));

    if (left < n) {
      steps.push(createStep(arr, `Comparing parent ${arr[i].value} with left child ${arr[left].value}`, [i, left]));
      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push(createStep(arr, `Comparing with right child ${arr[right].value}`, [largest, right]));
      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }

    if (largest !== i) {
      steps.push(createStep(arr, `Swapping ${arr[i].value} with ${arr[largest].value}`, [], [i, largest]));
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  // Build max heap
  steps.push(createStep(array, "Building max heap"));
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i);
  }

  steps.push(createStep(array, "Max heap built, starting extraction"));

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push(createStep(array, `Moving maximum element ${array[0].value} to position ${i}`, [], [0, i]));
    [array[0], array[i]] = [array[i], array[0]];
    
    array[i].state = 'sorted';
    steps.push(createStep(array, `Element at position ${i} is now sorted`));
    
    heapify(array, i, 0);
  }

  array[0].state = 'sorted';
  steps.push(createStep(array, "Heap Sort completed!"));
  
  return steps;
};

// Radix Sort Implementation
export const radixSort = (initialArray: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = resetStates([...initialArray]);

  steps.push(createStep(array, "Starting Radix Sort"));

  const getMax = (arr: ArrayElement[]): number => {
    return Math.max(...arr.map(el => el.value));
  };

  const countingSort = (arr: ArrayElement[], exp: number) => {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);

    steps.push(createStep(arr, `Sorting by digit at position ${exp} (${exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'})`));

    // Store count of occurrences
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i].value / exp) % 10;
      count[digit]++;
      steps.push(createStep(arr, `Element ${arr[i].value} has digit ${digit} at position ${exp}`, [i]));
    }

    // Change count[i] so that it contains actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i].value / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // Copy output array to arr
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }

    steps.push(createStep(arr, `Completed sorting by digit at position ${exp}`));
  };

  const max = getMax(array);
  steps.push(createStep(array, `Maximum value is ${max}`));

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(array, exp);
  }

  // Mark all as sorted
  array.forEach(element => element.state = 'sorted');
  steps.push(createStep(array, "Radix Sort completed!"));
  
  return steps;
};

// Main sorting function that delegates to specific algorithms
export const getSortingSteps = (algorithm: SortingAlgorithm, array: ArrayElement[]): SortingStep[] => {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort(array);
    case 'selection':
      return selectionSort(array);
    case 'insertion':
      return insertionSort(array);
    case 'merge':
      return mergeSort(array);
    case 'quick':
      return quickSort(array);
    case 'heap':
      return heapSort(array);
    case 'radix':
      return radixSort(array);
    default:
      return [];
  }
};