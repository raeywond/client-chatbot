import { useState } from 'react';
import './App.css';
import CustomChat from './components/CustomChat';

function App() {
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <div className="App">
      <h1>Demo V 4.11</h1>
      <p>Click here anytime you need help or a person to talk to</p>
      
      <div className="help-button" onClick={() => setChatOpen(true)}>
        Need Help? Click Here
      </div>

      <CustomChat 
        isOpen={isChatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </div>
  );
}

export default App;