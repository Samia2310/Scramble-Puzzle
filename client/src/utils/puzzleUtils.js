// client/src/utils/puzzleUtils.js

/**
 * Generates a solvable slide puzzle.
 * Uses the inversion count method to ensure solvability.
 * For an N x N puzzle:
 * - If N is odd, the puzzle is solvable if the number of inversions is even.
 * - If N is even, the puzzle is solvable if:
 * - The blank is on an even row counting from the bottom (row 1, 3, 5...) AND the number of inversions is odd.
 * - The blank is on an odd row counting from the bottom (row 0, 2, 4...) AND the number of inversions is even.
 *
 * @param {number} level The size of one side of the square puzzle (e.g., 3 for 3x3).
 * @returns {number[]} An array representing the shuffled puzzle tiles.
 */
export function generateSolvablePuzzle(level) {
    const numTiles = level * level;
    let puzzle = Array.from({ length: numTiles }, (_, i) => i); // [0, 1, ..., N*N-1]

    let shuffledPuzzle = [];
    let tempPuzzle = [...puzzle]; // Create a copy to shuffle

    // Fisher-Yates (Knuth) shuffle
    for (let i = tempPuzzle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempPuzzle[i], tempPuzzle[j]] = [tempPuzzle[j], tempPuzzle[i]];
    }
    shuffledPuzzle = tempPuzzle;

    // Check for solvability
    const inversions = countInversions(shuffledPuzzle);
    const blankTileIndex = shuffledPuzzle.indexOf(numTiles - 1); // The last tile is the blank
    const blankRowFromBottom = level - Math.floor(blankTileIndex / level); // Rows are 1-indexed from bottom

    let isSolvable = false;

    if (level % 2 !== 0) { // N is odd (e.g., 3x3, 5x5)
        isSolvable = (inversions % 2 === 0);
    } else { // N is even (e.g., 2x2, 4x4)
        if (blankRowFromBottom % 2 !== 0) { // Blank on odd row from bottom (1, 3, 5...)
            isSolvable = (inversions % 2 === 0); // Should have even inversions
        } else { // Blank on even row from bottom (0, 2, 4...)
            isSolvable = (inversions % 2 !== 0); // Should have odd inversions
        }
    }

    // If not solvable, perform a single swap (excluding the blank tile) to make it solvable.
    // Swapping any two non-blank tiles changes the inversion count by an odd number, thus flipping parity.
    if (!isSolvable) {
        let swapIndex1 = 0;
        let swapIndex2 = 0;

        // Find two non-blank tiles to swap
        // Ensure they are not the blank tile (numTiles - 1)
        if (shuffledPuzzle[0] !== numTiles - 1 && shuffledPuzzle[1] !== numTiles - 1) {
            swapIndex1 = 0;
            swapIndex2 = 1;
        } else if (shuffledPuzzle[0] !== numTiles - 1 && shuffledPuzzle[2] !== numTiles - 1) {
            swapIndex1 = 0;
            swapIndex2 = 2;
        } else {
            // Fallback: search for any two non-blank tiles
            let found = 0;
            for (let i = 0; i < numTiles && found < 2; i++) {
                if (shuffledPuzzle[i] !== numTiles - 1) {
                    if (found === 0) {
                        swapIndex1 = i;
                    } else {
                        swapIndex2 = i;
                    }
                    found++;
                }
            }
        }
        [shuffledPuzzle[swapIndex1], shuffledPuzzle[swapIndex2]] = [shuffledPuzzle[swapIndex2], shuffledPuzzle[swapIndex1]];
    }

    return shuffledPuzzle;
}

/**
 * Counts the number of inversions in a given puzzle array.
 * An inversion is a pair of tiles (a, b) where a appears before b, but a > b.
 * The blank tile (N*N - 1) is excluded from inversion counting.
 * @param {number[]} puzzle The current state of the puzzle tiles.
 * @returns {number} The total number of inversions.
 */
function countInversions(puzzle) {
    let inversions = 0;
    const n = puzzle.length;
    const blankTileValue = n - 1; // The value of the blank tile

    for (let i = 0; i < n - 1; i++) {
        // Skip the blank tile when counting inversions
        if (puzzle[i] === blankTileValue) {
            continue;
        }
        for (let j = i + 1; j < n; j++) {
            // Skip the blank tile when counting inversions
            if (puzzle[j] === blankTileValue) {
                continue;
            }
            if (puzzle[i] > puzzle[j]) {
                inversions++;
            }
        }
    }
    return inversions;
}

/**
 * Checks if the puzzle is in its solved state.
 * The solved state is when tiles are in ascending order (0, 1, 2, ..., N*N - 1).
 * @param {number[]} puzzle The current state of the puzzle tiles.
 * @param {number} level The size of one side of the square puzzle.
 * @returns {boolean} True if the puzzle is solved, false otherwise.
 */
export function isSolved(puzzle, level) {
    const numTiles = level * level;
    for (let i = 0; i < numTiles; i++) {
        if (puzzle[i] !== i) {
            return false;
        }
    }
    return true;
}