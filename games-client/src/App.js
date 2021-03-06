import React from 'react'
import './App.css';

import GamesPage from './pages/GamesPage/GamesPage'
import GamePage from './pages/GamePage/GamePage'
import Weather from './components/Weather/Weather'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

export default function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Weather />
        <Router>
          <Link className="link-style" to="/">
            Home
          </Link>
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
