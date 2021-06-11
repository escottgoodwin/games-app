import './App.css';
import Games from './components/Games1'
import Weather from './components/Weather'

export default function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Weather />
        <Games />
      </header>
    </div>
  );
}
