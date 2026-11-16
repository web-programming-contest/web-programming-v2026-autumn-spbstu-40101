export const WHITE = 'w';
export const BLACK = 'b';

const FILES = 'abcdefgh';

export const PIECE_SYMBOLS = {
  wk: '♔',
  wq: '♕',
  wr: '♖',
  wb: '♗',
  wn: '♘',
  wp: '♙',
  bk: '♚',
  bq: '♛',
  br: '♜',
  bb: '♝',
  bn: '♞',
  bp: '♟',
};

function emptyBoard() {
  return Array.from({length: 64}, () => null);
}

function place(board, square, piece) {
  board[square] = piece;
}

function squareFromAlgebraic(name) {
  const file = FILES.indexOf(name[0]);
  const rank = Number(name[1]);
  return (8 - rank) * 8 + file;
}

export function createInitialState() {
  const board = emptyBoard();
  const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

  back.forEach((type, file) => {
    place(board, file, {type, color: BLACK});
    place(board, 8 + file, {type: 'p', color: BLACK});
    place(board, 48 + file, {type: 'p', color: WHITE});
    place(board, 56 + file, {type, color: WHITE});
  });

  return {
    board,
    turn: WHITE,
    castling: {wK: true, wQ: true, bK: true, bQ: true},
    enPassant: null,
    status: 'playing',
    winner: null,
    check: false,
    moveHistory: [],
  };
}

function inBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function toSquare(row, col) {
  return row * 8 + col;
}

function opponent(color) {
  return color === WHITE ? BLACK : WHITE;
}

function cloneState(state) {
  return {
    board: state.board.map((piece) => (piece ? {...piece} : null)),
    turn: state.turn,
    castling: {...state.castling},
    enPassant: state.enPassant,
    status: state.status,
    winner: state.winner,
    check: state.check,
    moveHistory: [...state.moveHistory],
  };
}

function findKing(board, color) {
  return board.findIndex(
    (piece) => piece && piece.type === 'k' && piece.color === color,
  );
}

function isSquareAttacked(board, square, byColor) {
  for (let from = 0; from < 64; from += 1) {
    const piece = board[from];
    if (!piece || piece.color !== byColor) {
      continue;
    }

    const moves = generatePseudoMoves(board, from, piece, null, true);
    if (moves.includes(square)) {
      return true;
    }
  }

  return false;
}

function rayMoves(board, from, color, directions) {
  const result = [];
  const startRow = Math.floor(from / 8);
  const startCol = from % 8;

  for (const [dr, dc] of directions) {
    let row = startRow + dr;
    let col = startCol + dc;

    while (inBounds(row, col)) {
      const square = toSquare(row, col);
      const target = board[square];
      if (!target) {
        result.push(square);
      } else {
        if (target.color !== color) {
          result.push(square);
        }
        break;
      }
      row += dr;
      col += dc;
    }
  }

  return result;
}

function generatePseudoMoves(board, from, piece, enPassant, forAttack = false) {
  const result = [];
  const row = Math.floor(from / 8);
  const col = from % 8;
  const {type, color} = piece;

  if (type === 'p') {
    const dir = color === WHITE ? -1 : 1;
    const startRow = color === WHITE ? 6 : 1;
    const forward = toSquare(row + dir, col);

    if (!forAttack) {
      if (inBounds(row + dir, col) && !board[forward]) {
        result.push(forward);
        const doubleForward = toSquare(row + 2 * dir, col);
        if (row === startRow && !board[doubleForward]) {
          result.push(doubleForward);
        }
      }
    }

    for (const dc of [-1, 1]) {
      const captureRow = row + dir;
      const captureCol = col + dc;
      if (!inBounds(captureRow, captureCol)) {
        continue;
      }
      const captureSquare = toSquare(captureRow, captureCol);
      const target = board[captureSquare];
      if (forAttack || (target && target.color !== color)) {
        result.push(captureSquare);
      } else if (!forAttack && enPassant === captureSquare) {
        result.push(captureSquare);
      }
    }

    return result;
  }

  if (type === 'n') {
    const jumps = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of jumps) {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (!inBounds(nextRow, nextCol)) {
        continue;
      }
      const square = toSquare(nextRow, nextCol);
      const target = board[square];
      if (!target || target.color !== color) {
        result.push(square);
      }
    }
    return result;
  }

  if (type === 'b') {
    return rayMoves(board, from, color, [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]);
  }

  if (type === 'r') {
    return rayMoves(board, from, color, [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  }

  if (type === 'q') {
    return rayMoves(board, from, color, [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
  }

  if (type === 'k') {
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) {
          continue;
        }
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (!inBounds(nextRow, nextCol)) {
          continue;
        }
        const square = toSquare(nextRow, nextCol);
        const target = board[square];
        if (!target || target.color !== color) {
          result.push(square);
        }
      }
    }

    return result;
  }

  return result;
}

function applyCastlingRights(state, from, to, piece) {
  const next = {...state.castling};

  if (piece.type === 'k') {
    if (piece.color === WHITE) {
      next.wK = false;
      next.wQ = false;
    } else {
      next.bK = false;
      next.bQ = false;
    }
  }

  if (piece.type === 'r') {
    if (from === squareFromAlgebraic('a1')) {
      next.wQ = false;
    }
    if (from === squareFromAlgebraic('h1')) {
      next.wK = false;
    }
    if (from === squareFromAlgebraic('a8')) {
      next.bQ = false;
    }
    if (from === squareFromAlgebraic('h8')) {
      next.bK = false;
    }
  }

  if (to === squareFromAlgebraic('a1')) {
    next.wQ = false;
  }
  if (to === squareFromAlgebraic('h1')) {
    next.wK = false;
  }
  if (to === squareFromAlgebraic('a8')) {
    next.bQ = false;
  }
  if (to === squareFromAlgebraic('h8')) {
    next.bK = false;
  }

  return next;
}

function addCastlingMoves(state, from, piece, moves) {
  if (piece.type !== 'k') {
    return moves;
  }

  const color = piece.color;
  const enemy = opponent(color);
  const backRank = color === WHITE ? 7 : 0;
  const kingStart = toSquare(backRank, 4);
  if (from !== kingStart) {
    return moves;
  }

  const rights = state.castling;
  const board = state.board;

  const tryCastle = (kingSide) => {
    const rookCol = kingSide ? 7 : 0;
    const pathCols = kingSide ? [5, 6] : [1, 2, 3];
    const passCols = kingSide ? [5, 6] : [3, 2];
    const rightKey =
      color === WHITE ? (kingSide ? 'wK' : 'wQ') : kingSide ? 'bK' : 'bQ';

    if (!rights[rightKey]) {
      return;
    }

    const rookSquare = toSquare(backRank, rookCol);
    const rook = board[rookSquare];
    if (!rook || rook.type !== 'r' || rook.color !== color) {
      return;
    }

    for (const col of pathCols) {
      if (board[toSquare(backRank, col)]) {
        return;
      }
    }

    if (isSquareAttacked(board, kingStart, enemy)) {
      return;
    }

    for (const col of passCols) {
      if (isSquareAttacked(board, toSquare(backRank, col), enemy)) {
        return;
      }
    }

    moves.push(toSquare(backRank, kingSide ? 6 : 2));
  };

  tryCastle(true);
  tryCastle(false);
  return moves;
}

function makeRawMove(state, from, to) {
  const next = cloneState(state);
  const piece = next.board[from];
  const captured = next.board[to];
  const fromRow = Math.floor(from / 8);
  const toRow = Math.floor(to / 8);
  const toCol = to % 8;

  next.board[to] = piece;
  next.board[from] = null;

  // En passant capture
  if (piece.type === 'p' && to === state.enPassant && !captured) {
    const dir = piece.color === WHITE ? 1 : -1;
    next.board[toSquare(toRow + dir, toCol)] = null;
  }

  // Pawn promotion
  if (piece.type === 'p' && (toRow === 0 || toRow === 7)) {
    next.board[to] = {type: 'q', color: piece.color};
  }

  // Castling rook move
  if (piece.type === 'k' && Math.abs((from % 8) - toCol) === 2) {
    const backRank = piece.color === WHITE ? 7 : 0;
    if (toCol === 6) {
      next.board[toSquare(backRank, 5)] = next.board[toSquare(backRank, 7)];
      next.board[toSquare(backRank, 7)] = null;
    } else if (toCol === 2) {
      next.board[toSquare(backRank, 3)] = next.board[toSquare(backRank, 0)];
      next.board[toSquare(backRank, 0)] = null;
    }
  }

  next.castling = applyCastlingRights(state, from, to, piece);

  if (piece.type === 'p' && Math.abs(fromRow - toRow) === 2) {
    next.enPassant = toSquare((fromRow + toRow) / 2, toCol);
  } else {
    next.enPassant = null;
  }

  next.turn = opponent(state.turn);
  next.moveHistory = [
    ...state.moveHistory,
    {from, to, piece: piece.type, color: piece.color},
  ];

  return next;
}

export function getLegalMoves(state, from) {
  const piece = state.board[from];
  if (!piece || piece.color !== state.turn || state.status !== 'playing') {
    return [];
  }

  let candidates = generatePseudoMoves(
    state.board,
    from,
    piece,
    state.enPassant,
    false,
  );
  candidates = addCastlingMoves(state, from, piece, candidates);

  return candidates.filter((to) => {
    const next = makeRawMove(state, from, to);
    const kingSquare = findKing(next.board, piece.color);
    if (kingSquare < 0) {
      return false;
    }
    return !isSquareAttacked(next.board, kingSquare, opponent(piece.color));
  });
}

export function getMovableSquares(state) {
  const movable = [];
  for (let square = 0; square < 64; square += 1) {
    if (getLegalMoves(state, square).length > 0) {
      movable.push(square);
    }
  }
  return movable;
}

function hasAnyLegalMove(state) {
  return getMovableSquares(state).length > 0;
}

function finalizeStatus(state) {
  const next = cloneState(state);
  const kingSquare = findKing(next.board, next.turn);
  const inCheck =
    kingSquare >= 0 &&
    isSquareAttacked(next.board, kingSquare, opponent(next.turn));
  next.check = inCheck;

  if (!hasAnyLegalMove(next)) {
    if (inCheck) {
      next.status = 'checkmate';
      next.winner = opponent(next.turn);
    } else {
      next.status = 'stalemate';
      next.winner = null;
    }
  } else {
    next.status = 'playing';
    next.winner = null;
  }

  return next;
}

export function applyMove(state, from, to) {
  const legal = getLegalMoves(state, from);
  if (!legal.includes(to)) {
    return state;
  }

  return finalizeStatus(makeRawMove(state, from, to));
}

export function pieceSymbol(piece) {
  if (!piece) {
    return '';
  }
  return PIECE_SYMBOLS[`${piece.color}${piece.type}`];
}
