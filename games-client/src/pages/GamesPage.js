import '../App.css';
import Games from '../components/Games1'
import { Link } from "react-router-dom";

export default function GamesPage() {

  const gameid = '8484'
  const link = `/game/${gameid}`
  return (
    <div className="App">
      <header className="App-header">
        <Link className="link-style" to={link}>
          Game Page
        </Link>
        <Games />
      </header>
    </div>
  );
}