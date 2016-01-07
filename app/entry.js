var React = require('react');
var ReactDOM = require('react-dom');


var WordInput = React.createClass({
  getInitialState: function() {
    return {
      value: 'Hello!',
    }
  },
  handleChange: function(e) {
    this.setState(e.target.value);
  },
  handleSubmit: function(e) {
    // api call
  },
  render: function() {
    return (
      <input type="text" 
        value={this.state.value} 
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}/>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <WordInput/>
    );
  },
});

ReactDOM.render(<App/>, document.getElementById('app'));
