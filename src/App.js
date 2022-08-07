import './App.css';
import Signup from './routes/signup/signup';
import Login from './routes/login/login';
import Home from './routes/home/home'
import Weather from './routes/weather/weather';
import {
  BrowserRouter as Router,
  Routes,
  Route, useParams
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/weatherinfo" element={<Weather />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
