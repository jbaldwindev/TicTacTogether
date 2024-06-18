import CustomNav from './CustomNav';
import "./styles/Info.css";
import createRoom from "./imgs/createRoom.png";
import joinRoom from "./imgs/JoinRoom.jpg";
import enterName from "./imgs/enterName.jpg";
import enterName2 from "./imgs/enterName2.jpg";
import down from "./imgs/down.jpg";
import awaitPlayer2 from "./imgs/awaitPlayer2.jpg";
import awaitPlayer22 from "./imgs/AwaitPlayer22.jpg";
import start from "./imgs/start.jpg";
const InfoComponent = (props) => {
    return (
        <div class="center-center">
            <CustomNav></CustomNav>
            <h2>Welcome to Tic-Tac-Together!</h2>
            <p>Play Tic-Tac-Toe online with a friend!</p>
            <h6>Step 1:</h6>
            <p>Create a room</p>
            <img src={createRoom} class="img-resize bottom-pad"></img>
            <h6>Step 2:</h6>
            <p>Join the room</p>
            <img src={joinRoom} class="img-resize bottom-pad"></img>
            <h6>Step 3:</h6>
            <p>Enter username</p>
            <img src={enterName} class="img-resize"></img>
            <img src={down} class="img-resize-sml"></img>
            <img src={enterName2} class="img-resize bottom-pad"></img>
            <h6>Step 4:</h6>
            <p>Wait for friend to join and enter their username</p>
            <img src={awaitPlayer2} class="img-resize"></img>
            <img src={down} class="img-resize-sml"></img>
            <img src={awaitPlayer22} class="img-resize bottom-pad"></img>
            <h6>Step 5:</h6>
            <p>Click start and enjoy the game!</p>
            <img src={start} class="img-resize bottom-pad"></img>
        </div>
    );
}
export default InfoComponent;