var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');

// TODO: remove test data
var TEST_DATA = require('./testData.js');

// Components
var WordInput = require('./components/WordInput.js');
var WordList = require('./components/WordList.js');

var {
  Node,
  Link,
  NodeLabel,
  Graph,  
} = require('./components/GraphComponents.js');

var App = React.createClass({
  getInitialState: function() {
    return {
      associatedWords: [],
      graphData: {nodes: [], links:[]},
    };
  },

  componentDidMount: function() {
    this.setState({
      graphData: TEST_DATA,
    });
  },

  submitWord: function(word) {
    // post word to server
    console.log('post ' + word + ' to server...');
    var self = this;

    request
      .post('/word')
      .send({word: word})
      .end(function(err, data) {
        if (err || !data.ok) {
          console.log('post request for ' + word + ' failed');
        } else {
          console.log('post request successful: ' + JSON.stringify(data.body));
          var associatedWords = data.body.associations_array;
          var associatedScores = data.body.associations_scored;

          // init new graph data object with source word
          var vizData = {nodes:[{name: word, group: 0}], links:[]};

          // create a node and a link to source word for each associated word
          for (var i = 0; i < associatedWords.length; i++) {
            var node = {
              name: associatedWords[i],
              group: i + 1,
            };
            var link = {
              source: 0,
              target: i + 1,
              score: associatedScores[associatedWords[i]],
            };

            vizData.nodes.push(node);
            vizData.links.push(link);
          }

          self.setState({
            associatedWords: associatedWords,
            graphData: vizData,
          });
        }
      });
  },

  render: function() {
    return (
      <div>
        <WordInput
          submitWord={this.submitWord}/>
        <WordList
          associatedWords={this.state.associatedWords}/>
        <Graph graphData={this.state.graphData}/>
      </div>
    );
  },
});

ReactDOM.render(<App/>, document.getElementById('app'));
