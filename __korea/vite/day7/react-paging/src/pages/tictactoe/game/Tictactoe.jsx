import styles from './Tictactoe.module.css';
import { useRef, useState } from "react";
import showNotification from '../reference/showNotification';
import { ToastContainer } from 'react-toastify';

function Square({ value, onSquareClick }){
    return (
        <button
            className={styles.square}
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }

    return null;
}

function Board({ xIsNext, squares, onPlay }){
    const winner = calculateWinner(squares);
    let status;
    if(winner){
        status = 'Winner: ' + winner;
    }else{
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function handleClick(i){
        if(calculateWinner(squares) || squares[i]){ return; } // 이미 클릭된 칸은 무시

        const nextSquares = squares.slice();
        if(xIsNext){
            nextSquares[i] = 'X';
        }else{
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    return(
        <>
            <div className={styles.status}>{status}</div>
            <div className={styles['board-row']}>
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className={styles['board-row']}>
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className={styles['board-row']}>
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    )
}

export default function Game() {
    const [squares, setSquares] = useState(Array(9).fill(null)); // 상태를 초기화할 때 배열 만들기
    const [xIsNext, setXIsNext] = useState(true); // X가 다음 차례인지 여부를 상태로 관리
    const [roomID, setRoomId] = useState('general');
    const [isDark, setIsDark] = useState(false);
    // const currentSquares = history[history.length - 1]; // ??

    // function handlePlay(nextSquares){
    //     setHistory([...history, nextSquares]);
    //     setXIsNext(!xIsNext);
    // }

    return(
        <>
            <div className={styles.game}>
                {/* <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /> */}
            </div>
            <div className={styles['game-info']}>
                <ol>
                    <li>test</li>
                </ol>
            </div>
            <Counter />

            <button
                onClick={() => showNotification('실험', 'isDark' ? 'dark' : 'light')}
            >알림 버튼</button>

            <ToastContainer />
        </>
    )
}

function Counter(){
    let ref = useRef(0);

    function handleClick2(){
        ref.current = ref.current + 1;
        alert(ref.current + 'time');
    }

    return(
        <button onClick={handleClick2}>버튼</button>
    )
}