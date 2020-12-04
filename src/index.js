import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }
    createSquares(){
        let rows = [];
        for(var i = 0; i < 3; i++){
            let sqrs = [];
            for(var j = 0; j < 3; j++){
                sqrs.push(this.renderSquare(3*i+j));
            }
            rows.push(<div className="board-row">{sqrs}</div>)
        }
        return rows
    }
    render() {
        return (
        <div>
            {this.createSquares()}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                x: null,
                y: null,
            }],
            
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        console.log(current)
        
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        var x;
        var y;
        if(i === 0){
            x = 1;
            y = 1;
        }
        else if(i === 1){
            x = 1;
            y = 2;
        }
        else if(i === 2){
            x = 1;
            y = 3;
        }
        else if(i === 3){
            x = 2;
            y = 1;
        }
        else if(i === 4){
            x = 2;
            y = 2;
        }
        else if(i === 5){
            x = 2;
            y = 3;
        }
        else if(i === 6){
            x = 3;
            y = 1;
        }
        else if(i === 7){
            x = 3;
            y = 2;
        }
        else if(i === 8){
            x = 3;
            y = 3;
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                x: x,
                y: y,
            }]),
            
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext : (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        console.log(history)
        const moves = history.map((step, move) => {
            const desc = move ? 
            'Go to move #' + move  +'{' + history[move].x +', '+ history[move].y + '}': 
            'Go to game start';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div style={ winner ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}