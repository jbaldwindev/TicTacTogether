import React, { useState, useEffect } from 'react'
import HelloWorldService from '../services/HelloWorldService'
import './styles/Board.css'

const ViewMessageComponent = (props) => {
    const [buttonText, setButtonText] = useState("Start Game");
    const [playerTurnText, setPlayerTurnText] = useState("Player 1's Turn");
    const [resetText] = useState("");


    const startResetClick = () => {
        if (buttonText.toLowerCase() == "start game") {
            setButtonText("Reset");
        } else {
            setPlayerTurnText("Player 1's Turn");
            setButtonText("Start Game");
        }
    }

    const fillSpace = (e) => {
        console.log(e)
        e.target.innerText = "HELP"
    }

    return (
        <div>
            <h1>{playerTurnText}</h1>
            <div className="Board">
                <table>
                    <tbody>
                        <tr>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                        </tr>
                        <tr>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                        </tr>
                        <tr>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                            <td onClick={(e) => fillSpace(e)}></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={startResetClick}>{buttonText}</button>
            </div>
        </div>
    );
}

export default ViewMessageComponent;