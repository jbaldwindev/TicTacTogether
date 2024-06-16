import RoomSelectComponent from './components/RoomSelectComponent';
import ViewMessageComponent from './components/ViewMessageComponent';
import InvalidRoomComponent from './components/InvalidRoomComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<RoomSelectComponent/>}/>
          <Route exact path="/Home" element={<RoomSelectComponent/>}/>
          <Route exact path="/room" element={<ViewMessageComponent/>}/>
          <Route exact path="/room/:roomId" element={<ViewMessageComponent/>}/>
          <Route exact path="invalid-room" element={<InvalidRoomComponent/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;