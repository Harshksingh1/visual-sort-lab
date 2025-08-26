import { ArrayElement } from '@/types/sorting';
import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  array: ArrayElement[];
  isPlaying: boolean;
}

export const ArrayVisualizer = ({ array, isPlaying }: ArrayVisualizerProps) => {
  const maxValue = Math.max(...array.map(el => el.value));
  const minHeight = 20;
  const maxHeight = 300;

  const getBarHeight = (value: number) => {
    const ratio = value / maxValue;
    return minHeight + (maxHeight - minHeight) * ratio;
  };

  const getBarColor = (state: ArrayElement['state']) => {
    switch (state) {
      case 'comparing':
        return 'bg-comparing border-comparing';
      case 'swapping':
        return 'bg-swapping border-swapping';
      case 'sorted':
        return 'bg-sorted border-sorted';
      default:
        return 'bg-default-bar border-border';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border">
      <div className="flex items-end justify-center space-x-1 overflow-hidden" style={{ height: maxHeight + 40 }}>
        {array.map((element, index) => (
          <div
            key={element.id}
            className={cn(
              'transition-all duration-300 ease-in-out border-2 rounded-t-sm relative group',
              getBarColor(element.state),
              'hover:brightness-110',
              isPlaying ? 'cursor-not-allowed' : 'cursor-default'
            )}
            style={{
              height: getBarHeight(element.value),
              width: Math.max(Math.floor(600 / array.length), 4),
              minWidth: '4px',
            }}
          >
            {/* Value tooltip on hover */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {element.value}
            </div>
            
            {/* Index number at bottom for small arrays */}
            {array.length <= 20 && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                {index}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t">
        <LegendItem color="bg-default-bar" label="Default" />
        <LegendItem color="bg-comparing" label="Comparing" />
        <LegendItem color="bg-swapping" label="Swapping" />
        <LegendItem color="bg-sorted" label="Sorted" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center space-x-2">
    <div className={cn('w-4 h-4 rounded border', color)} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);