import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import HelloWorldService from '../services/HelloWorldService'
import GameService from '../services/GameService'
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './styles/Board.css'

const ViewMessageComponent = (props) => {
    const [buttonText, setButtonText] = useState("Start Game");
    const [playerTurnText, setPlayerTurnText] = useState("Player 1's Turn");
    const [resetText] = useState("");
    const [moveList, setMoveList] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [displayMessage, setDisplayMessage] = useState("");
    const [playerID, setPlayerID] = useState();
    const [spaceClicked, setSpaceClicked] = useState();


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

    //topic/playermoved
    useEffect(() => {
        const socket = new SockJS('http:/localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe('/topic/playermoved', (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log("MESSAGE HAS BEEN RECEIVED: ");
                console.log(receivedMessage);
                setMoveList((prevMoveList) => [...prevMoveList, receivedMessage]);
                setDisplayMessage(receivedMessage);
            });
        });

        setStompClient(client);

        // return () => {
        //     client.disconnect();
        // }
    }, []);

    const sendMove = () => {
        const moveData = {
            userId: 87,
            spaceNumber: 99
        }
        stompClient.send("/app/move", {} ,JSON.stringify(moveData));
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
                        console.log(resData);
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
                        console.log(resData);
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
            <h1>Player that moved: {displayMessage.userId} </h1>
            <h1>Space moved to: {displayMessage.spaceNumber}</h1>
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
                <button onClick={sendMove}>Send Move</button>
            </div>
        </div>
    );
}

export default ViewMessageComponent;