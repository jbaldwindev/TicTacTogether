import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import HelloWorldService from '../services/HelloWorldService'
import GameService from '../services/GameService'
import './styles/Board.css'

const ViewMessageComponent = (props) => {
    const [buttonText, setButtonText] = useState("Start Game");
    const [playerTurnText, setPlayerTurnText] = useState("Player 1's Turn");
    const [resetText] = useState("");


    const startResetClick = () => {
        if (buttonText.toLowerCase() == "start game") {
            setButtonText("Reset");
        } else {
            var spaces = document.getElementsByClassName('space');
            for (var i = 0; i < spaces.length; i++) {
                spaces[i].innerText = " ";
            }
            setPlayerTurnText("Player 1's Turn");
            setButtonText("Start Game");
            GameService.postReset();
        }
    }

    const fillSpace = (e) => {
        let resData;
        if (buttonText.toLowerCase() == "reset") {
            if (playerTurnText.includes("1")) {
                if (e.target.innerText == "") {
                    e.target.innerText = "X";
                    setPlayerTurnText("Player 2's Turn");
                    GameService.postMove("1", e.target.id.toString()).then((response) => {
                        resData = response.data;
                        console.log(resData)
                    }).catch(() => {
                        alert("Error processing move");
                    });
                }
            } else {
                if (e.target.innerText == "") {
                    e.target.innerText = "O";
                    setPlayerTurnText("Player 1's Turn");
                    GameService.postMove("2",  e.target.id.toString()).then((response) => {
                        resData = response.data;
                        console.log(resData)
                    }).catch(() => {
                        alert("Error processing move");
                    });
                }
    
            }
        }
    }

    return (

        <div>
            <h1>{playerTurnText}</h1>
            <div className="Board">
                <table>
                    <tbody>
                        <tr>
                            <td id="1" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="2" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="3" className="space" onClick={(e) => fillSpace(e)}></td>
                        </tr>
                        <tr>
                            <td id="4" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="5" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="6" className="space" onClick={(e) => fillSpace(e)}></td>
                        </tr>
                        <tr>
                            <td id="7" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="8" className="space" onClick={(e) => fillSpace(e)}></td>
                            <td id="9" className="space" onClick={(e) => fillSpace(e)}></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={startResetClick}>{buttonText}</button>
            </div>
        </div>
    );
}

export default ViewMessageComponent;