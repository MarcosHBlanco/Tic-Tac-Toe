import { useState } from "react";

function Square({ value, onSquareClick }) {
	return (
		<button onClick={onSquareClick} className="square">
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i) {
		const nextSquares = squares.slice(); //creates a copy of squares, that is going to be mutable instead of square
		//check for square with value !== null or a winner at all, and returns early if so
		if (squares[i] || calculateWinner(squares)) {
			return;
		}
		//modifying state and taking turns
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares);
	}
	const winner = calculateWinner(squares);
	let status; //displays winner of next player's turn
	if (winner) {
		status = "Winner: " + winner;
	} else {
		status = "Next Player: " + (xIsNext ? "X" : "O");
	}
	return (
		<>
			<div>
				<p className="status">{status}</p>
			</div>
			{/* game board */}
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]); //Sets the start state for history as an array with 9 positions filled with null;
	const [currentMove, setCurrentMove] = useState(0); //Creates a state to update moves according to current play;
	const xIsNext = currentMove % 2 === 0; //Sets turn based on the curretn move;
	const currentSquares = history[currentMove]; //Stores the last state of the history array, used to update the Board element;

	//stores a copy of the last movement on history array, and updates the state of history with it
	// and updates current move to the previous play;
	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	//time travel function that allows players to revisit their movements
	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	//creates an list of elements based on the player's moves
	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = "Go to move #" + move;
		} else {
			description = "Go to game start";
		}
		if (currentMove === move) {
			description = "You are at move #" + move;
			return <li key={move}>{description}</li>;
		} else {
			return (
				<li key={move}>
					<button onClick={() => jumpTo(move)}>{description}</button>
				</li>
			);
		}
	});
	return (
		<>
			<div id="game-container">
				<div id="board-container">
					<h1>Tic-Tac-Toe</h1>
					<Board
						xIsNext={xIsNext}
						squares={currentSquares}
						onPlay={handlePlay}
					/>
				</div>
				<div className="game-info">
					<ol>{moves}</ol>
				</div>
			</div>
		</>
	);
}

function calculateWinner(squares) {
	const lines = [
		//possible winning combinations
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	//loops through combinations to check for winner
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
