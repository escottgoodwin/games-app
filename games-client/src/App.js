import React from 'react'
import './App.css';
import { Link } from 'react-router-dom'

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
