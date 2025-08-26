import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { ArrayVisualizer } from '@/components/ArrayVisualizer';
import { ControlPanel } from '@/components/ControlPanel';
import { InfoPanel } from '@/components/InfoPanel';
import { generateRandomArray } from '@/utils/arrayUtils';
import { SortingAlgorithm, ArrayElement, PlaybackState } from '@/types/sorting';

const Index = () => {
  // Array state
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);

  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  // Initialize array on component mount
  useEffect(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
  }, [arraySize]);

  const handleArrayGenerate = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setPlaybackState('stopped');
  }, [arraySize]);

  const handleCustomArray = useCallback((values: number[]) => {
    const newArray = values.map((value, index) => ({
      id: index,
      value,
      state: 'default' as const,
    }));
    setArray(newArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setPlaybackState('stopped');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main visualization area */}
          <div className="lg:col-span-3 space-y-6">
            <ArrayVisualizer 
              array={array}
              isPlaying={playbackState === 'playing'}
            />
            
            <ControlPanel
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              playbackState={playbackState}
              onPlaybackStateChange={setPlaybackState}
              arraySize={arraySize}
              onArraySizeChange={setArraySize}
              speed={speed}
              onSpeedChange={setSpeed}
              onArrayGenerate={handleArrayGenerate}
              onCustomArray={handleCustomArray}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>

          {/* Info panel */}
          <div className="lg:col-span-1">
            <InfoPanel 
              selectedAlgorithm={selectedAlgorithm}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;