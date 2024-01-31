import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import HelloWorldService from '../services/HelloWorldService'
import GameService from '../services/GameService'
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './styles/Board.css'

const ViewMessageComponent = (props) => {
    const [buttonText, setButtonText] = useState("Start Game");
    const [playerTurnText, setPlayerTurnText] = useState("Player 2's Turn");
    //TODO make sure this gets set and changed
    const [playerTurn, setPlayerTurn] = useState(2);
    const [resetText] = useState("");
    const [moveList, setMoveList] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [displayMessage, setDisplayMessage] = useState("");
    //-2 is unassigned player, -1 spectator
    const [playerID, setPlayerID] = useState(-2);
    const [receivedPlayerID, setReceivedPlayerID] = useState(-2);
    const [spaceClicked, setSpaceClicked] = useState(0);
    const [gameStatus, setGameStatus] = useState("reset");
    const [checkForWin, setCheckForWin] = useState(true);
    const [changePlayerTurn, setChangePlayerTurn] = useState("");
    const [receivedTurnChange, setReceivedTurnChange] = useState(-1);

    const startResetClick = () => {
        if (buttonText.toLowerCase() == "start game") {
            stompClient?.send("/app/startgame");
        } else {
            stompClient?.send("/app/resetgame")
        }
    }

    const resetBoard = () => {
        var spaces = document.getElementsByClassName('space');
        for (var i = 0; i < spaces.length; i++) {
            spaces[i].innerText = " ";
        }
    }

    //TODO update move functions
    //TODO use changeturn function
    //TODO use checkwin function
    useEffect(() => {
        const socket = new SockJS('http:/localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {

            //TODO trigger next step (check win)
            client.subscribe('/topic/playermoved', (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMoveList((prevMoveList) => [...prevMoveList, receivedMessage]);
                setDisplayMessage(receivedMessage);
                console.log(receivedMessage.spaceNumber.toString());
                const space = document.getElementById(receivedMessage.spaceNumber.toString());
                if (receivedMessage.userId == 1) {
                    space.innerText = "X";
                } else if (receivedMessage.userId == 2) {
                    space.innerText = "O";
                }
            });

            client.subscribe('/topic/playeradded', (playerNum) => {
                const pnum = Number(playerNum.body);
                setReceivedPlayerID(pnum);
            });

            client.subscribe("/topic/gamestarted", () => {
                setGameStatus("started");
                setButtonText("Reset");
                setPlayerTurnText("Player 1's Turn");
                setPlayerTurn(1);
                setMoveList([]);
            });

            client.subscribe("/topic/gamereset", () => {
                setGameStatus("reset");
                resetBoard();
                setPlayerTurnText("Player 1's Turn");
                setButtonText("Start Game");
                setMoveList([]);
            });

            client.subscribe("/topic/turnchanged", (message) => {
                //TODO change this so it works
                setReceivedTurnChange(Number(message.body));
            });

            client.subscribe("/topic/winstatus", (message) => {
                console.log("received win message");
                const receivedMessage = JSON.parse(message.body);
                if (receivedMessage.winResponse == "win") {
                    console.log("The game should be over");
                    winGame();
                } else if (receivedMessage.winResponse == "continue") {
                    //TODO replace this with setting a variable based on something found in the message
                    //probably should make the message an object
                    console.log("win message was continue");
                    setChangePlayerTurn(receivedMessage.winResponse + " " + receivedMessage.userId.toString());
                }
            });
        });

        setStompClient(client);
    }, []);

    useEffect(() => {
        console.log("PLAYER TURN HERE IS: " + playerTurn);
        console.log("PLAYER ID HERE IS: " + playerID);
        if (playerTurn == playerID) {
            console.log("Checking for a win");
            checkWin();
        }
    }, [moveList]);

    useEffect(() => {
        if (playerID == -2 ) {
            setPlayerID(receivedPlayerID);
        }
    }, [receivedPlayerID]);

    useEffect(() => {
        if (playerTurn == 1) {
            setPlayerTurnText("Player 2's Turn");
            setPlayerTurn(2);
        } else if (playerTurn == 2) {
            setPlayerTurnText("Player 1's Turn");
            setPlayerTurn(1);
        }
    }, [receivedTurnChange]);

    useEffect(() => {
        console.log("game not over");
        if (playerID == playerTurn) {
            console.log("Turn being changed");
            changeTurn();
        }
    }, [changePlayerTurn]);

    useEffect(() => {
        console.log("THIS PLAYER'S ID:");
        console.log(playerID);
    }, [playerID]);

    useEffect(() => {
        if (stompClient != null) {
            setTimeout(assignPlayerID, 3000);
        }
    }, [stompClient]);

    useEffect(() => {
        sendMove();
    }, [spaceClicked]);

    const assignPlayerID = () => {
        stompClient?.send("/app/addplayer");
    }

    const sendMove = () => {
        const moveData = {
            userId: playerID,
            spaceNumber: spaceClicked
        }

        if (moveData.spaceNumber > 0) {
            stompClient.send("/app/move", {} ,JSON.stringify(moveData));
        }
    }

    const checkWin = () => {
        const winResponseData = {
            userId: playerID,
            winResponse: "N/A"
        }
        stompClient.send("/app/checkwin", {}, JSON.stringify(winResponseData));
    }

    //TODO flesh out
    const winGame = () => {
        setPlayerTurnText("Player " + playerTurn.toString()  + " Won!");
        setGameStatus("over");
    }

    const changeTurn = () => {
        stompClient.send("/app/changeturn");
    }

    //TODO only fill the space after the response is received
    //This function should send the message, another should do the actual filling depending on result
    //The other function should handle the filling, checking if won, changing of turn, etc
    const fillSpace = (e) => {
        if (gameStatus == "started") {
            if (playerTurn == playerID) {
                if (e.target.innerText == "") {
                    let newSpace = parseInt(e.target.id);
                    setSpaceClicked(newSpace);
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