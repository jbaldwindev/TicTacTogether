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
            // HelloWorldService.getMessage().then((response) => {
            //     setButtonText(response.data);
            // }).catch(() => {
            //     alert("An Error Occurred Setting the button Text");
            // });
        } else {
            var spaces = document.getElementsByClassName('space');
            for (var i = 0; i < spaces.length; i++) {
                spaces[i].innerText = " ";
            }
            setPlayerTurnText("Player 1's Turn");
            setButtonText("Start Game");
        }
    }

    const fillSpace = (e) => {
        if (playerTurnText.includes("1")) {
            if (e.target.innerText == "") {
                e.target.innerText = "X";
                setPlayerTurnText("Player 2's Turn");
                GameService.postMove("1");
            }
        } else {
            if (e.target.innerText == "") {
                e.target.innerText = "O";
                setPlayerTurnText("Player 1's Turn");
                GameService.postMove("2");
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