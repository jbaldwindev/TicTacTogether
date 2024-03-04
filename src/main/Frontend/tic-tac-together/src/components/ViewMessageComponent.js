import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import HelloWorldService from '../services/HelloWorldService'
import GameService from '../services/GameService'
import { useParams } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './styles/Board.css'

const ViewMessageComponent = (props) => {
    const [buttonText, setButtonText] = useState("Start Game");
    const [playerTurnText, setPlayerTurnText] = useState("Player 2's Turn");
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
    const [triggerPlayerWin, setTriggerPlayerWin] = useState(0);
    const [userName, setUserName] = useState("");
    const [submittedUserName, setSubmittedUserName] = useState("");
    const componentParams = useParams();

    const startResetClick = () => {
        if (buttonText.toLowerCase() == "start game") {
            stompClient?.send("/app/startgame/" + componentParams.roomId);
        } else {
            stompClient?.send("/app/resetgame/" + componentParams.roomId);
        }
    }

    const resetBoard = () => {
        var spaces = document.getElementsByClassName('space');
        for (var i = 0; i < spaces.length; i++) {
            spaces[i].innerText = " ";
        }
    }

    useEffect(() => {
        const socket = new SockJS('http:/localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe('/topic/playermoved/' + componentParams.roomId, (message) => {
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

            // client.subscribe('/topic/playeradded/' + componentParams.roomId, (playerNum) => {
            //     const pnum = Number(playerNum.body);
            //     setReceivedPlayerID(pnum);
            // });

            client.subscribe("/topic/gamestarted/" + componentParams.roomId, () => {
                setGameStatus("started");
                setButtonText("Reset");
                setPlayerTurnText("Player 1's Turn");
                setPlayerTurn(1);
            });

            client.subscribe("/topic/gamereset/" + componentParams.roomId, () => {
                setGameStatus("reset");
                resetBoard();
                setPlayerTurnText("Player 1's Turn");
                setPlayerTurn(1);
                setButtonText("Start Game");
            });

            client.subscribe("/topic/turnchanged/" + componentParams.roomId, (message) => {
                console.log("Turn has changed");
                setReceivedTurnChange(Number(message.body));
            });

            client.subscribe("/topic/winstatus/" + componentParams.roomId, (message) => {
                console.log("received win message");
                const receivedMessage = JSON.parse(message.body);
                if (receivedMessage.winResponse == "win") {
                    console.log("The game should be over");
                    setTriggerPlayerWin(t => t + 1);
                } else if (receivedMessage.winResponse == "continue") {
                    console.log("win message was continue");
                    console.log(receivedMessage.winResponse + " " + receivedMessage.userId.toString() + receivedMessage.turnIncrement.toString());
                    setChangePlayerTurn(receivedMessage.winResponse + " " + receivedMessage.userId.toString() + receivedMessage.turnIncrement.toString());
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
        winGame();
    }, [triggerPlayerWin]);

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
        stompClient?.send("/app/addplayer/" + componentParams.roomId);
    }

    const sendMove = () => {
        const moveData = {
            userId: playerID,
            spaceNumber: spaceClicked
        }

        if (moveData.spaceNumber > 0) {
            stompClient.send("/app/move/" + componentParams.roomId, {} ,JSON.stringify(moveData));
        }
    }

    const checkWin = () => {
        const winResponseData = {
            userId: playerID,
            winResponse: "N/A",
            turnIncrement: 0
        }
        stompClient.send("/app/checkwin/" + componentParams.roomId, {}, JSON.stringify(winResponseData));
    }

    const winGame = () => {
        setPlayerTurnText("Player " + playerTurn.toString()  + " Won!");
        setGameStatus("over");
    }

    const changeTurn = () => {
        stompClient.send("/app/changeturn/" + componentParams.roomId);
    }

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

    const handleChange = (e) => {
        setUserName(e.target.value);
    }

    const handleSubmit = (e) => {
        e. preventDefault();
        console.log("this is the value: " + e.target.value);
        setSubmittedUserName(userName);
    }

    useEffect(() => {
        stompClient?.subscribe('/topic/playeradded/' + componentParams.roomId + "/" + submittedUserName, (message) => {
            const pnum = Number(message.body);
            setReceivedPlayerID(pnum);
        });

        stompClient?.send("/app/addplayer/" + componentParams.roomId + "/" + submittedUserName);
    }, [submittedUserName]);

    return (

        <div>
            {submittedUserName ? <div></div> : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={userName} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            )}
            {submittedUserName ? (
                <h3>You username is: {submittedUserName}</h3>
            ) : <div></div>}
            <h1>{playerTurnText}</h1>
            <div className="Board">
            <h1>Player that moved: {displayMessage.userId} </h1>
            <h1>Space moved to: {displayMessage.spaceNumber}</h1>
            {playerID ? <h3>You are player: {playerID}</h3> : <h3>Player number not yet assigned</h3>}
            {componentParams.roomId ? <h1> This rooms ID: {componentParams.roomId}</h1> : <h1>This room has no ID</h1>}
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