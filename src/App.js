import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StreamVideo from './components/video';
import Username from './components/username';

function App() {

  return (
    <div className="App">
   <Router>
      <Routes>
        <Route path="/" element={<Username />} />
        <Route path="/lobby" element={<StreamVideo />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
