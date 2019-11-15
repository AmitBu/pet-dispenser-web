import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from './firebase'

function App() {
  const [feed, setFeed] = useState(null);
  const [feedAmount, setFeedAmount] = useState(0);

  // On Load
  useEffect(() => {
    firebase.getDispenserData((snap) => {
      const data = snap.val();
      console.log('data', data);
      setFeed(data.feed);
      setFeedAmount(data.feedAmount);
    })
  }, []);

  // When firebase vars change - send update
  useEffect(() => {
    firebase.setDispenserData(feed, feedAmount);
  }, [feed, feedAmount])

  function handleFeedClick() {
    setFeed(true);
  }

  function handleFeedAmountChange({ target }) {
    const amount = parseInt(target.value);

    !isNaN(amount) && setFeedAmount(amount);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dispenser</h1>
        <div>
          <label htmlFor="btnFeed">Feed</label>
          <button id="btnFeed" onClick={handleFeedClick} disabled={feed}>Feed!</button>
          <span>{feed ? 'on' : 'off'}</span>
        </div>
        <div>
          <label htmlFor="feedAmount">Feed amount (MS)</label>
          <input
            type="range"
            min={500}
            max={20000}
            step={500}
            id={'feedAmount'}
            name={'feedAmount'}
            value={feedAmount}
            onChange={handleFeedAmountChange}
          />
          <span>{feedAmount}</span>
        </div>


      </header>
    </div>
  );
}

export default App;
