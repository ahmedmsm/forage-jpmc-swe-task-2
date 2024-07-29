import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  intervalId: NodeJS.Timeout | null,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
      intervalId: null,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      this.setState({
        data: [...this.state.data, ...serverResponds],
        showGraph: true,
      });
    });
  }

  /**
   * Start streaming data from server at a specified interval
   */
  startStreamingData() {
    if (!this.state.intervalId) {
      const intervalId = setInterval(() => {
        this.getDataFromServer();
      }, 100); // Fetch data every 100ms

      this.setState({ intervalId });
    }
  }

  /**
   * Stop streaming data from server
   */
  stopStreamingData() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: null });
    }
  }

  componentWillUnmount() {
    this.stopStreamingData();
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            Bank & Merge Co Task 2
          </header>
          <div className="App-content">
            <button className="btn btn-primary Stream-button"
                    onClick={() => { this.startStreamingData() }}>
              Start Streaming Data
            </button>
            <div className="Graph">
              {this.renderGraph()}
            </div>
          </div>
        </div>
    )
  }
}

export default App;
