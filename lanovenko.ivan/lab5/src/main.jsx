import {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  BLACK,
  WHITE,
  applyMove,
  createInitialState,
  getLegalMoves,
  getMovableSquares,
  pieceSymbol,
} from './chess.js';
import './styles.css';

function statusText(state) {
  if (state.status === 'checkmate') {
    const winner = state.winner === WHITE ? 'Белые' : 'Чёрные';
    return `Мат! Победа: ${winner}`;
  }
  if (state.status === 'stalemate') {
    return 'Пат. Ничья';
  }
  if (state.check) {
    return state.turn === WHITE ? 'Шах белым' : 'Шах чёрным';
  }
  return state.turn === WHITE ? 'Ход белых' : 'Ход чёрных';
}

function App() {
  const [state, setState] = useState(createInitialState);
  const [selected, setSelected] = useState(null);

  const legalTargets = useMemo(
    () => (selected === null ? [] : getLegalMoves(state, selected)),
    [selected, state],
  );
  const movableSquares = useMemo(() => getMovableSquares(state), [state]);
  const movableSet = useMemo(() => new Set(movableSquares), [movableSquares]);
  const targetSet = useMemo(() => new Set(legalTargets), [legalTargets]);

  const handleSquareClick = (square) => {
    if (state.status !== 'playing') {
      return;
    }

    const piece = state.board[square];

    if (selected !== null && targetSet.has(square)) {
      setState(applyMove(state, selected, square));
      setSelected(null);
      return;
    }

    if (piece && piece.color === state.turn && movableSet.has(square)) {
      setSelected(square);
      return;
    }

    setSelected(null);
  };

  const handleRestart = () => {
    setState(createInitialState());
    setSelected(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Шахматы</h1>
        <p className="app-status" data-testid="game-status">
          {statusText(state)}
        </p>
        <button
          type="button"
          className="restart-button"
          data-testid="game-restart"
          onClick={handleRestart}
        >
          Новая партия
        </button>
      </header>

      <div
        className="board"
        data-testid="chess-board"
        role="grid"
        aria-label="Шахматная доска"
      >
        {state.board.map((piece, square) => {
          const row = Math.floor(square / 8);
          const col = square % 8;
          const isDark = (row + col) % 2 === 1;
          const isSelected = selected === square;
          const isAvailable = targetSet.has(square);
          const isMovable = movableSet.has(square);
          const isCapture = Boolean(isAvailable && piece);

          return (
            <button
              key={square}
              type="button"
              role="gridcell"
              className={[
                'chess-cell',
                isDark ? 'chess-cell-dark' : 'chess-cell-light',
                isSelected ? 'chess-cell-selected' : '',
                isAvailable ? 'chess-cell-available' : '',
                isCapture ? 'chess-cell-capture' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-testid="chess-cell"
              data-square={square}
              aria-label={`Клетка ${String.fromCharCode(97 + col)}${8 - row}`}
              onClick={() => handleSquareClick(square)}
            >
              {isAvailable ? (
                <span className="available-move" data-testid="available-move" />
              ) : null}
              {piece ? (
                <span
                  className={[
                    'chess-piece',
                    piece.color === WHITE
                      ? 'chess-piece-white'
                      : 'chess-piece-black',
                  ].join(' ')}
                  data-testid="chess-piece"
                >
                  {isMovable ? (
                    <span className="movable-piece" data-testid="movable-piece">
                      {pieceSymbol(piece)}
                    </span>
                  ) : (
                    pieceSymbol(piece)
                  )}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="turn-hint">
        Сторона: {state.turn === WHITE ? 'белые' : 'чёрные'}
        {state.turn === BLACK ? ' (играйте обеими)' : ''}
      </p>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
