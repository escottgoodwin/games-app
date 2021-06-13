import './App.css';
import GamesPage from './pages/GamesPage'
import GamePage from './pages/GamePage'
import Weather from './components/Weather'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Weather />
        <Router>
          <Switch>
              <Route path="/game/:gameId/">
                <GamePage />
              </Route>
              <Route path="/">
                <GamesPage  />
              </Route>
            </Switch>
        </Router>
      </header>
    </div>
  );
}
