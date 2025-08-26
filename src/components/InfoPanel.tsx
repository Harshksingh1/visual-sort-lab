import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SortingAlgorithm } from '@/types/sorting';
import { Clock, MemoryStick, Info, TrendingUp } from 'lucide-react';

interface InfoPanelProps {
  selectedAlgorithm: SortingAlgorithm;
  currentStep: number;
  totalSteps: number;
}

const algorithmInfo: Record<SortingAlgorithm, {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  category: string;
}> = {
  bubble: {
    name: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    category: 'Comparison',
  },
  selection: {
    name: 'Selection Sort',
    description: 'Finds the minimum element from the unsorted portion and places it at the beginning. Simple but inefficient for large datasets.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    category: 'Comparison',
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time. Very efficient for small datasets and nearly sorted arrays.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    category: 'Comparison',
  },
  merge: {
    name: 'Merge Sort',
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them separately, and then merges them back together.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    category: 'Divide & Conquer',
  },
  quick: {
    name: 'Quick Sort',
    description: 'A highly efficient divide-and-conquer algorithm that selects a pivot element and partitions the array around it.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    category: 'Divide & Conquer',
  },
  heap: {
    name: 'Heap Sort',
    description: 'Uses a binary heap data structure to sort elements. Builds a max-heap and repeatedly extracts the maximum element.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    category: 'Comparison',
  },
  radix: {
    name: 'Radix Sort',
    description: 'A non-comparative sorting algorithm that sorts integers by processing individual digits. Works by sorting digit by digit.',
    timeComplexity: {
      best: 'O(nk)',
      average: 'O(nk)',
      worst: 'O(nk)',
    },
    spaceComplexity: 'O(n + k)',
    category: 'Non-comparison',
  },
};

export const InfoPanel = ({ selectedAlgorithm, currentStep, totalSteps }: InfoPanelProps) => {
  const info = algorithmInfo[selectedAlgorithm];
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>{info.name}</span>
            </CardTitle>
            <Badge variant="secondary">{info.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.description}
          </p>
          
          {/* Time Complexity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Time Complexity</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <ComplexityRow label="Best" value={info.timeComplexity.best} type="success" />
              <ComplexityRow label="Average" value={info.timeComplexity.average} type="warning" />
              <ComplexityRow label="Worst" value={info.timeComplexity.worst} type="error" />
            </div>
          </div>

          {/* Space Complexity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MemoryStick className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Space Complexity</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {info.spaceComplexity}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {totalSteps > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Steps completed</span>
                <span className="font-mono">{currentStep}/{totalSteps}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center text-xs text-muted-foreground">
                {progress.toFixed(1)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ComplexityRow = ({ 
  label, 
  value, 
  type 
}: { 
  label: string; 
  value: string; 
  type: 'success' | 'warning' | 'error' 
}) => {
  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <Badge variant={getVariant()} className="font-mono text-xs">
        {value}
      </Badge>
    </div>
  );
};