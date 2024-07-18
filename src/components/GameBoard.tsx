import React, {useState, useEffect, useCallback, useRef} from 'react';
import {createEmptyGrid, getNextState, Grid} from '../utils/gameOfLife';
import Canvas from './Canvas';
import ControlsFooter from './ControlsFooter';
import SliderInput from './SliderInput';
import {Gauge, Grid3X3Icon} from 'lucide-react';

const GameBoard: React.FC = () => {
    const [cellSize, setCellSize] = useState<number>(20);
    const [speedValue, setSpeedValue] = useState<number>(100);
    const [grid, setGrid] = useState<Grid>([]);
    const [gridSize, setGridSize] = useState<{cols: number; rows: number}>({cols: 0, rows: 0});
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updateGrid = useCallback(() => {
        setGrid((prevGrid) => {
            const newGrid = getNextState(prevGrid);
            if (JSON.stringify(newGrid) === JSON.stringify(prevGrid)) {
                setIsRunning(false); // Pause if the grid is stable
                return prevGrid;
            }
            return newGrid;
        });
    }, []);

    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;

                const newCols = Math.floor(containerWidth / cellSize);
                const newRows = Math.floor(containerHeight / cellSize);

                setGridSize({cols: newCols, rows: newRows});

                // Create a new empty grid based on the updated size
                setGrid((prevGrid) => {
                    const newGrid = createEmptyGrid(newRows, newCols);

                    // Transfer the state of the previous grid to the new grid
                    for (let r = 0; r < Math.min(prevGrid.length, newRows); r++) {
                        for (let c = 0; c < Math.min(prevGrid[r].length, newCols); c++) {
                            newGrid[r][c] = prevGrid[r][c];
                        }
                    }

                    return newGrid;
                });
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
        setIsRunning(true);
    }, [gridSize.rows, gridSize.cols]);

    const toggleRunning = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const handleSpeedChange = useCallback((value: number) => {
        setSpeedValue(1100 - value); // Reverse slider value for speed
    }, []);

    const handleCellSizeChange = useCallback((size: number) => {
        setCellSize(size);
    }, []);

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
                    {/* For execution speed of game */}
                    <SliderInput
                        icon={<Gauge />}
                        min={100}
                        max={1000}
                        step={0.5}
                        handleSliderChange={handleSpeedChange}
                        sliderValue={1000 - speedValue}
                    />
                    {/* For grid size adjustment */}
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
            />
        </>
    );
};

GameBoard.displayName = 'GameBoard';

export default GameBoard;
