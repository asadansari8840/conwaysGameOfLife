import React, {useState, useEffect, useCallback, useRef} from 'react';
import {createEmptyGrid, getNextState} from '../utils/gameOfLife'; // Import getNextState
import type {Grid} from '../utils/gameOfLife';
import Canvas from './Canvas';
import ControlsFooter from './ControlsFooter';
import SliderInput from './SliderInput';
import {Gauge, Grid3X3Icon} from 'lucide-react';
import {drawLetterOnGrid, letterMap} from '../utils/letterMap'; // Import the letter drawing function

const GameBoard: React.FC = () => {
    const [cellSize, setCellSize] = useState<number>(20);
    const [inputValue, setInputValue] = useState('');
    const [speedValue, setSpeedValue] = useState<number>(100);
    const [grid, setGrid] = useState<Grid>(createEmptyGrid(20, 20));
    const [gridSize, setGridSize] = useState<{cols: number; rows: number}>({cols: 0, rows: 0});
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updateGrid = useCallback(() => {
        setGrid((prevGrid) => getNextState(prevGrid));
    }, []);

    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;

                const newCols = Math.floor(containerWidth / cellSize);
                const newRows = Math.floor(containerHeight / cellSize);

                setGridSize({cols: newCols, rows: newRows});
                setGrid(createEmptyGrid(newRows, newCols));
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [cellSize]);

    useEffect(() => {
        if (isRunning) {
            const id = window.setInterval(updateGrid, speedValue);
            setIntervalId(id);
        } else {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        }
        return () => {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        };
    }, [isRunning, speedValue, updateGrid]);

    const handleCellClick = useCallback((row: number, col: number) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((r) => r.slice());
            newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
            return newGrid;
        });
    }, []);

    const clearBoard = useCallback(() => {
        setIsRunning(false);
        setGrid(createEmptyGrid(gridSize.rows, gridSize.cols));
    }, [gridSize.rows, gridSize.cols]);

    const randomizeBoard = useCallback(() => {
        setGrid(createEmptyGrid(gridSize.rows, gridSize.cols).map((row) => row.map(() => (Math.random() > 0.7 ? 1 : 0))));
    }, [gridSize.rows, gridSize.cols]);

    const toggleRunning = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const handleSpeedChange = useCallback((value: number) => {
        setSpeedValue(1100 - value);
    }, []);

    const handleCellSizeChange = useCallback((size: number) => {
        setCellSize(size);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const generateTextGrid = () => {
        const newGrid = createEmptyGrid(gridSize.rows, gridSize.cols);
        const text = inputValue.toUpperCase(); // Convert text to uppercase for consistency

        const charWidth = 5; // Width of each character in grid units
        const charHeight = 7; // Height of each character in grid units
        const lineSpacing = 1; // Space between lines
        const charSpacing = 1; // Space between characters

        let startX = 0; // Starting X position for the first character
        let startY = 0; // Starting Y position for the first character
        const maxWidth = gridSize.cols; // Maximum width of the grid
        const maxHeight = gridSize.rows; // Maximum height of the grid

        text.split('').forEach((char) => {
            if (char in letterMap) {
                const letterGrid = drawLetterOnGrid(char, charWidth, charHeight);

                if (startX + letterGrid[0].length > maxWidth) {
                    startX = 0;
                    startY += charHeight + lineSpacing;

                    if (startY + charHeight > maxHeight) {
                        return;
                    }
                }

                for (let r = 0; r < letterGrid.length; r++) {
                    for (let c = 0; c < letterGrid[r].length; c++) {
                        if (letterGrid[r][c] === 1) {
                            const gridRow = startY + r;
                            const gridCol = startX + c;
                            if (gridRow < maxHeight && gridCol < maxWidth) {
                                newGrid[gridRow][gridCol] = 1;
                            }
                        }
                    }
                }

                // Move to the next character position
                startX += letterGrid[0].length + charSpacing;
            }
        });

        setGrid(newGrid);
    };
    return (
        <>
            <div
                className="h-[calc(100%-200px)] flex items-center justify-center bg-black w-full relative overflow-hidden"
                ref={containerRef}
            >
                <Canvas
                    grid={grid}
                    cols={gridSize.cols}
                    rows={gridSize.rows}
                    cellSize={cellSize}
                    onClick={handleCellClick}
                />
                <div className="absolute right-5 flex flex-col gap-5 bg-gray-400 rounded-xl border border-black p-3 bottom-10">
                    <SliderInput
                        icon={<Gauge />}
                        min={100}
                        max={1000}
                        step={0.5}
                        handleSliderChange={handleSpeedChange}
                        sliderValue={1000 - speedValue}
                    />
                    <SliderInput
                        min={5}
                        max={200}
                        step={5}
                        icon={<Grid3X3Icon />}
                        handleSliderChange={handleCellSizeChange}
                        sliderValue={cellSize}
                    />
                </div>
            </div>
            <ControlsFooter
                isRunning={isRunning}
                onStartStop={toggleRunning}
                onClear={clearBoard}
                onRandomize={randomizeBoard}
                onGenerate={generateTextGrid}
                inputValue={inputValue}
                onInputChange={handleInputChange}
            />
        </>
    );
};

GameBoard.displayName = 'GameBoard';

export default GameBoard;
