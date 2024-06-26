import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import ReactDOM from 'react-dom';
import HelloWorldService from '../services/HelloWorldService'
import GameService from '../services/GameService'
import { useParams } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './styles/Board.css'
import RoomService from '../services/RoomService';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CustomNav from './CustomNav';

const ViewMessageComponent = (props) => {
    const navigate = useNavigate();
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
    const [sendMoveCounter, setSendMoveCounter] = useState(0);
    const [roomValid, setRoomValid] = useState(false);
    const [disconnectMessage, setDisconnectMessage] = useState();

    const startResetClick = () => {
        let startButton = document.getElementById("StartReset");
        if (startButton.variant == "success") {
            startButton.variant = "danger";
        } else {
            startButton = "success";
        }
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
                console.log("move is being received");
                const receivedMessage = JSON.parse(message.body);
                setMoveList((prevMoveList) => [...prevMoveList, receivedMessage]);
                setDisplayMessage(receivedMessage);
                console.log("Space number received is: " + receivedMessage.spaceNumber.toString());
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
                setSpaceClicked(-99);
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
        let startButton = document.getElementById("StartReset");
        if (buttonText == "Start Game") {
            startButton = "success";
        } else if (buttonText == "Reset") {
            startButton.variant = "danger";
        }
          
    }, [buttonText]);

    useEffect(() => {
        if (playerTurn == 1) {
            console.log("Changing to p2");
            setPlayerTurnText("Player 2's Turn");
            setPlayerTurn(2);
        } else if (playerTurn == 2) {
            console.log("Changing to p1");
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
        RoomService.GetRoomValidity(Number(componentParams.roomId)).then((response) => {
            var respBool = response.data;
            console.log("response boolean:");
            console.log(response.data);
            var isTrueSet = (respBool === true);
            if (isTrueSet) {
                setRoomValid(true);
            } else {
                navigate('/invalid-room');
            }
        });
    }, [stompClient]);

    useEffect(() => {
        setSendMoveCounter(t => t + 1);
        sendMove();
    }, [spaceClicked]);

    const assignPlayerID = () => {
        stompClient?.send("/app/addplayer/" + componentParams.roomId);
    }

    const sendMove = () => {
        
        const moveData = {
            userId: playerID,
            spaceNumber: spaceClicked,
            sendMoveIncrement: sendMoveCounter
        }
        console.log("making it to the beginning of sendMove");
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
        console.log("Gamestatus is: " + gameStatus);
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
            let pnum = Number(message.body);
            setReceivedPlayerID(pnum);
        });

        stompClient?.subscribe('/topic/playerdisconnected/' + submittedUserName, (message) => {
            setDisconnectMessage("Player has disconnnected");
        });

        stompClient?.send("/app/addplayer/" + componentParams.roomId + "/" + submittedUserName);
    }, [submittedUserName]);

    return (

        <div>
            {componentParams.roomId ? <h1 class="pad-left"> Room ID: {componentParams.roomId}</h1> : <h1>This room has no ID</h1>}
            <div className="center-content">
                {submittedUserName ? <div></div> : (
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p id="username">Name:</p>
                            <input type="text" value={userName} onChange={handleChange} />
                        </label>
                        <Button id="form-submit" type="submit" value="Submit">Submit</Button>
                    </form>  
                )}
            </div>
            {submittedUserName ? (
                <h3 class="pad-left">Your username is: {submittedUserName}</h3>
            ) : <div></div>}
            {disconnectMessage ? (
                <h1>{disconnectMessage}</h1>
            ) : (
                <div className="Board">
                {playerID > 0 ? <h3 class="pad-left">You are player: {playerID}</h3> : <p></p>}
                
                <div className="playerTurnDisplay">
                    {playerID > 0 ? <h1>{playerTurnText}</h1> : <p></p>}
                    
                </div>
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
                    {playerID > 0 ? <Button id="StartReset" variant="success" onClick={startResetClick}>{buttonText}</Button> : <p></p>}
                    
                </div>
            )}
        </div>
    );
}

export default ViewMessageComponent;