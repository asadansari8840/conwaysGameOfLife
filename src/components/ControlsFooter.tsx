import {Play, Pause, Shuffle, RotateCw} from 'lucide-react';
import React from 'react';
import Button from './Button';

interface ControlsProps {
    isRunning: boolean;
    onStartStop: () => void;
    onClear: () => void;
    onRandomize: () => void;
}

const ControlsFooter: React.FC<ControlsProps> = ({isRunning, onStartStop, onClear, onRandomize}) => {
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
        </div>
    );
};

ControlsFooter.displayName = 'ControlsFooter';
export default ControlsFooter;
