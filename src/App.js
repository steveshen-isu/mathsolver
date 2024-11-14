import logo from './logo.svg';
import './App.css';
import TopicSelector from './components/TopicSelector';
import PlotGenerator from './components/PlotGenerator';
/* import chatbox from './components/chatbox'
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TopicSelector />

        <div>
        <PlotGenerator />
        </div>
        

      </header>

    </div>
  );
}

export default App;
