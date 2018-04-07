import React, { Component } from 'react';
import './App.scss';
import FancyMusicPlayer from "./FancyMusicPlayer";

class App extends Component {
  render() {
    return (
      <div className="App">
          <FancyMusicPlayer/>
      </div>
    );
  }
}

export default App;
