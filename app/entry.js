var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');


var WordInput = React.createClass({
  getInitialState: function() {
    return {
      value: 'Hello!',
    }
  },
  handleChange: function(e) {
    this.setState({value: e.target.value});
  },
  handleSubmit: function(word, e) {
    e.preventDefault();
    this.props.submitWord(word);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit.bind(this, this.state.value)}>
        <input type="text" 
          value={this.state.value}
          onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

var WordList = React.createClass({
  getInitialState: function() {
    return {
      words: this.props.words,
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      words: nextProps.words,
    });
  },
  renderWords: function() {
    return this.state.words.map(function(word) {
      return (
        <li key={word}>{word}</li>
      );
    });
  },
  render: function() {
    return (
      <div>
        <ul>
          {this.renderWords()}
        </ul>
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState: function() {
    return {
      words: [],
    }
  },
  submitWord: function (word) {
    //post word to server
    console.log('post ' + word + ' to server');
    var self = this;
    request
      .post('/word')
      .send({word: word})
      .end(function(err, data) {
        if (err || !data.ok){
          console.log('post request for ' + word + ' failed');
        } else {
          console.log('post request successful: ' + data.body.associations_array);
          self.setState({words: data.body.associations_array});
        }
      });
  },
  render: function() {
    return (
      <div>
        <WordInput
          submitWord={this.submitWord}/>
        <WordList 
          words={this.state.words}/>
      </div>
    );
  },
});

ReactDOM.render(<App/>, document.getElementById('app'));
