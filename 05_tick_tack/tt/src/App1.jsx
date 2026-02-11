import { useState } from "react";

function Square({ value, func, isWin }) {
  return (
    <button className="square" disabled={isWin} onClick={func}>
      {value}
    </button>
  );
}

const checkWinner = (squares, symbol) => {
  const f_row = squares.slice(0, 3);
  const s_row = squares.slice(3, 6);
  const t_row = squares.slice(6, 9);

  const diag_f = squares.filter((v, i) => {
    return i == 0 || i == 4 || i == 8;
  });
  const diag_s = squares.filter((v, i) => {
    return i == 2 || i == 4 || i == 6;
  });

  const f_col = squares.filter((v, idx) => {
    return idx % 3 == 0;
  });
  const s_col = squares.filter((v, idx) => {
    return (idx + 1) % 3 == 0;
  });
  const t_col = squares.filter((v, idx) => {
    return (idx + 2) % 3 == 0;
  });

  const need_to_win = [symbol, symbol, symbol];
  const to_check = [f_row, s_row, t_row, diag_f, diag_s, f_col, s_col, t_col];

  for (let i = 0; i < to_check.length; i++) {
    if (JSON.stringify(to_check[i]) === JSON.stringify(need_to_win)) {
      return true;
    }
  }
  return false;
};

const checkWinner_light = (squares, symbol) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  return lines.some(([a, b, c]) => {
    return squares[a] == symbol && squares[b] == symbol && squares[c] == symbol;
  });
};

/*

0 1 2
3 4 5
6 7 8

*/

// TODO: Сделать загрузку в рилтайме, чтобы в checkWinner приходили актуальные квадраты
function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [isWin, setIsWin] = useState(false);

  const f = (isX, id) => {
    if (isWin || squares[id]) return;

    const nextSquares = [...squares];
    if (nextSquares[id]) return;
    nextSquares[id] = isX ? "X" : "O";

    setSquares(nextSquares);

    const nextSymbol = isX ? "X" : "O";
    if (checkWinner(nextSquares, nextSymbol)) {
      setIsWin(true);
      return;
    }
    setIsX(!isX);
  };

  const rows = 3;
  const generated = Array.from({ length: rows }, (t, j) => {
    return (
      <div className="board-row" key={j}>
        {Array.from({ length: rows }, (_, i) => {
          return (
            <Square
              isWin={isWin}
              key={i + 3 * j}
              value={squares[i + 3 * j]}
              func={() => f(isX, i + 3 * j)}
            />
          );
        })}
      </div>
    );
  });
  const status = `Winner is ${isX ? "X" : "O"}`;
  return (
    <>
      {isWin && <div className="status">{status}</div>}
      {generated}
    </>
  );
}

export default Board;
