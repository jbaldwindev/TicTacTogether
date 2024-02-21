import RoomSelectComponent from './components/RoomSelectComponent';
import ViewMessageComponent from './components/ViewMessageComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<RoomSelectComponent/>}/>
          <Route exact path="/room" element={<ViewMessageComponent/>}/>
          <Route exact path="/room/:roomId" element={<ViewMessageComponent/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;