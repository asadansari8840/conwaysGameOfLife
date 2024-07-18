import {Play, Pause, Shuffle, RotateCw, WandSparkles} from 'lucide-react';
import React from 'react';
import Button from './Button';

interface ControlsProps {
    isRunning: boolean;
    onStartStop: () => void;
    onClear: () => void;
    onRandomize: () => void;
    onGenerate: () => void;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlsFooter: React.FC<ControlsProps> = ({isRunning, onStartStop, onClear, onRandomize, onGenerate, inputValue, onInputChange}) => {
    return (
        <div className="h-[120px] flex gap-4 items-center justify-center bg-gray-600">
            <Button onClick={onStartStop}>
                {isRunning ? <Pause className="mr-3" /> : <Play className="mr-3" />}
                {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button
                onClick={onClear}
                className={!isRunning ? 'opacity-90' : ''}
            >
                <RotateCw className="mr-3" />
                Clear
            </Button>
            <Button onClick={onRandomize}>
                <Shuffle className="mr-3" />
                Randomize
            </Button>
            <input
                name="name"
                value={inputValue}
                onChange={onInputChange}
                className="px-2 py-2 rounded-xl text-white bg-black placeholder:text-white"
                placeholder="Enter something here.."
            />
            <Button onClick={onGenerate}>
                <WandSparkles className="mr-3" />
                Generate
            </Button>
        </div>
    );
};

ControlsFooter.displayName = 'ControlsFooter';
export default ControlsFooter;
