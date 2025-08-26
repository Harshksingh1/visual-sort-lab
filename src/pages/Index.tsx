import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { ArrayVisualizer } from '@/components/ArrayVisualizer';
import { ControlPanel } from '@/components/ControlPanel';
import { InfoPanel } from '@/components/InfoPanel';
import { Toaster } from '@/components/ui/toaster';
import { generateRandomArray } from '@/utils/arrayUtils';
import { getSortingSteps } from '@/utils/sortingAlgorithms';
import { SortingAlgorithm, ArrayElement, PlaybackState, SortingStep } from '@/types/sorting';

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
  const [sortingSteps, setSortingSteps] = useState<SortingStep[]>([]);
  const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
  
  // Animation control
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize array on component mount
  useEffect(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setOriginalArray([...newArray]);
  }, [arraySize]);

  // Calculate animation delay based on speed (1-100)
  const getAnimationDelay = useCallback(() => {
    return Math.max(10, 1000 - (speed * 10)); // 990ms (slow) to 10ms (fast)
  }, [speed]);

  // Start sorting algorithm
  const startSorting = useCallback(() => {
    if (playbackState === 'playing') return;
    
    const steps = getSortingSteps(selectedAlgorithm, [...originalArray]);
    setSortingSteps(steps);
    setTotalSteps(steps.length);
    
    if (currentStep === 0) {
      // Starting fresh
      setCurrentStep(0);
      setArray(steps[0]?.array || originalArray);
    }
    
    setPlaybackState('playing');
    isPlayingRef.current = true;
  }, [selectedAlgorithm, originalArray, currentStep, playbackState]);

  // Animation loop
  useEffect(() => {
    if (playbackState === 'playing' && isPlayingRef.current) {
      animationRef.current = setTimeout(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          
          if (nextStep >= sortingSteps.length) {
            setPlaybackState('stopped');
            isPlayingRef.current = false;
            return prev;
          }
          
          if (sortingSteps[nextStep]) {
            setArray(sortingSteps[nextStep].array);
          }
          
          return nextStep;
        });
      }, getAnimationDelay());
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [playbackState, currentStep, sortingSteps, getAnimationDelay]);

  // Control functions
  const handlePlay = useCallback(() => {
    if (totalSteps === 0) {
      startSorting();
    } else {
      setPlaybackState('playing');
      isPlayingRef.current = true;
    }
  }, [startSorting, totalSteps]);

  const handlePause = useCallback(() => {
    setPlaybackState('paused');
    isPlayingRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  const handleReset = useCallback(() => {
    setPlaybackState('stopped');
    isPlayingRef.current = false;
    setCurrentStep(0);
    setTotalSteps(0);
    setSortingSteps([]);
    setArray([...originalArray]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [originalArray]);

  const handleStepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (sortingSteps[nextStep]) {
        setArray(sortingSteps[nextStep].array);
      }
    }
  }, [currentStep, totalSteps, sortingSteps]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (sortingSteps[prevStep]) {
        setArray(sortingSteps[prevStep].array);
      }
    }
  }, [currentStep, sortingSteps]);

  const handleSkipToEnd = useCallback(() => {
    if (sortingSteps.length > 0) {
      const lastStep = sortingSteps.length - 1;
      setCurrentStep(lastStep);
      setArray(sortingSteps[lastStep].array);
      setPlaybackState('stopped');
      isPlayingRef.current = false;
    }
  }, [sortingSteps]);

  const handleArrayGenerate = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setOriginalArray([...newArray]);
    setCurrentStep(0);
    setTotalSteps(0);
    setSortingSteps([]);
    setPlaybackState('stopped');
    isPlayingRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [arraySize]);

  const handleCustomArray = useCallback((values: number[]) => {
    const newArray = values.map((value, index) => ({
      id: index,
      value,
      state: 'default' as const,
    }));
    setArray(newArray);
    setOriginalArray([...newArray]);
    setCurrentStep(0);
    setTotalSteps(0);
    setSortingSteps([]);
    setPlaybackState('stopped');
    isPlayingRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  // Update array size
  const handleArraySizeChange = useCallback((newSize: number) => {
    setArraySize(newSize);
    handleReset();
  }, [handleReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
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
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onSkipToEnd={handleSkipToEnd}
              arraySize={arraySize}
              onArraySizeChange={handleArraySizeChange}
              speed={speed}
              onSpeedChange={setSpeed}
              onArrayGenerate={handleArrayGenerate}
              onCustomArray={handleCustomArray}
              currentStep={currentStep}
              totalSteps={totalSteps}
              currentStepDescription={sortingSteps[currentStep]?.description || undefined}
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
      <Toaster />
    </div>
  );
};

export default Index;