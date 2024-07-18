import React, {useRef, useEffect, useCallback} from 'react';

interface CanvasProps {
    grid: number[][];
    cols: number;
    rows: number;
    cellSize: number;
    onClick: (row: number, col: number) => void;
}

/**
 * Canvas component which dyamically changes its size based on screen and size choose by user
 * @param param0
 * @returns
 */
const Canvas: React.FC<CanvasProps> = ({grid, cols, rows, cellSize, onClick}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;

        const renderGrid = () => {
            if (!context) return;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = grid[r][c];
                    context.fillStyle = cell === 1 ? 'black' : 'rgba(255,255,255,0.8)';
                    context.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                    context.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
            }
        };

        renderGrid();
    }, [grid, cols, rows, cellSize]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);

            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                onClick(row, col);
            }
        },
        [cellSize, onClick, cols, rows],
    );

    return (
        <canvas
            ref={canvasRef}
            style={{cursor: 'pointer'}}
            onClick={handleClick}
        />
    );
};

Canvas.displayName = 'Canvas';

export default Canvas;
