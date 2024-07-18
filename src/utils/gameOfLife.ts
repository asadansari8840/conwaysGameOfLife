export type Grid = number[][];

export const createEmptyGrid = (rows: number, cols: number): Grid => {
    return Array.from({length: rows}, () => Array(cols).fill(0));
};

export const getNextState = (grid: Grid): Grid => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = createEmptyGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const liveNeighbors = countLiveNeighbors(grid, r, c);
            if (grid[r][c] === 1) {
                newGrid[r][c] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
            } else {
                newGrid[r][c] = liveNeighbors === 3 ? 1 : 0;
            }
        }
    }
    return newGrid;
};

const countLiveNeighbors = (grid: Grid, row: number, col: number): number => {
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    let count = 0;
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            count += grid[newRow][newCol];
        }
    }
    return count;
};
