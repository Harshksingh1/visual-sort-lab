import { useState } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Shuffle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SortingAlgorithm, PlaybackState } from '@/types/sorting';
import { parseCustomArray, validateArrayInput } from '@/utils/arrayUtils';
import { useToast } from '@/hooks/use-toast';

interface ControlPanelProps {
  selectedAlgorithm: SortingAlgorithm;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  playbackState: PlaybackState;
  onPlaybackStateChange: (state: PlaybackState) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onArrayGenerate: () => void;
  onCustomArray: (values: number[]) => void;
  currentStep: number;
  totalSteps: number;
}

const algorithms: { value: SortingAlgorithm; label: string }[] = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
  { value: 'radix', label: 'Radix Sort' },
];

export const ControlPanel = ({
  selectedAlgorithm,
  onAlgorithmChange,
  playbackState,
  onPlaybackStateChange,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  onArrayGenerate,
  onCustomArray,
  currentStep,
  totalSteps,
}: ControlPanelProps) => {
  const [customInput, setCustomInput] = useState('');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const { toast } = useToast();

  const handlePlayPause = () => {
    if (playbackState === 'playing') {
      onPlaybackStateChange('paused');
    } else {
      onPlaybackStateChange('playing');
    }
  };

  const handleStop = () => {
    onPlaybackStateChange('stopped');
  };

  const handleCustomSubmit = () => {
    const validation = validateArrayInput(customInput);
    
    if (!validation.valid) {
      toast({
        title: 'Invalid Input',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    const values = parseCustomArray(customInput);
    onCustomArray(values);
    setIsCustomDialogOpen(false);
    setCustomInput('');
    
    toast({
      title: 'Array Updated',
      description: `Custom array with ${values.length} elements loaded successfully.`,
    });
  };

  const getSpeedLabel = (speed: number) => {
    if (speed < 25) return 'Very Slow';
    if (speed < 50) return 'Slow';
    if (speed < 75) return 'Normal';
    return 'Fast';
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Algorithm Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Algorithm</Label>
        <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {algorithms.map((algo) => (
              <SelectItem key={algo.value} value={algo.value}>
                {algo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Playback Controls */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Playback</Label>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* TODO: Step backward */}}
            disabled={playbackState === 'playing' || currentStep === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant={playbackState === 'playing' ? 'secondary' : 'default'}
            size="sm"
            onClick={handlePlayPause}
            className="px-6"
          >
            {playbackState === 'playing' ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            disabled={playbackState === 'stopped'}
          >
            <Square className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* TODO: Step forward */}}
            disabled={playbackState === 'playing' || currentStep === totalSteps}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        {totalSteps > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        )}
      </div>

      {/* Array Controls */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Array Controls</Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Size: {arraySize}</Label>
          </div>
          <Slider
            value={[arraySize]}
            onValueChange={([value]) => onArraySizeChange(value)}
            min={10}
            max={100}
            step={5}
            className="w-full"
            disabled={playbackState === 'playing'}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Speed: {getSpeedLabel(speed)}</Label>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onArrayGenerate}
            disabled={playbackState === 'playing'}
            className="flex-1"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Generate
          </Button>
          
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={playbackState === 'playing'}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Custom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Custom Array</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-array">
                    Numbers (comma or space separated)
                  </Label>
                  <Input
                    id="custom-array"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter numbers between 1-500. Maximum 100 elements.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCustomSubmit}>
                    Apply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
};