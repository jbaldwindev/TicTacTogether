import {useNavigate} from 'react-router-dom';

const RoomSelectComponent = (props) => {
    const navigate = useNavigate();
    const joinRoomClick = (e) => {
        //e.target.id for getting the button ID
        navigate('/room');
    }
    return (
        <div>
            <button onClick={(e) => joinRoomClick(e)}>Join Room 1</button>
        </div>
    );
}
export default RoomSelectComponent;