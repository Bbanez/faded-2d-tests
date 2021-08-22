export function loopMatrix(
  matrix: number[][],
  callback: (value: number, col: number, row: number) => void,
): void {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const value = matrix[col][row];
      callback(value, col, row);
    }
  }
}
