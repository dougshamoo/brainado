var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');

// TODO: remove test data
var TEST_DATA = {
  nodes: [
    {
      name: 'dog',
      group: 1,
    },
    {
      name: 'wolf',
      group: 2,
    },
    {
      name: 'fox',
      group: 3,
    },
    {
      name: 'hound',
      group: 4,
    },
  ],
  links: [
    {
      source: 0,
      target: 1,
      score: 50,
    },
    {
      source: 0,
      target: 2,
      score: 100,
    },
    {
      source: 0,
      target: 3,
      score: 150,
    },
  ]
};

var WordInput = React.createClass({
  getInitialState: function() {
    return {
      value: 'Hello!',
    };
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
      associatedWords: this.props.associatedWords,
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      associatedWords: nextProps.associatedWords,
    });
  },
  renderWords: function() {
    return this.state.associatedWords.map(function(word) {
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

var color = d3.scale.category20();

var Node = React.createClass({
  render: function() {
    return (
      <circle
        r={5}
        cx={this.props.x}
        cy={this.props.y}
        style={{
          "fill": color(this.props.group),
          "stroke":"#fff",
          "strokeWidth":"1.5px"
        }}/>
    );
  }
});

var Link = React.createClass({
  render: function() {
    return (
      <line
        x1={this.props.datum.source.x}
        y1={this.props.datum.source.y}
        x2={this.props.datum.target.x}
        y2={this.props.datum.target.y}
        style={{
          "stroke":"#999", 
          "strokeOpacity":".6",
          "strokeWidth": "2"  
        }}/>
    );
  }
})

var Graph = React.createClass({ 
  // mixins: [Radium.StyleResolverMixin, Radium.BrowserStateMixin],
  getInitialState: function() {
    
  var svgWidth = 900;
  var svgHeight = 900; 
  var force = d3.layout.force()
    .charge(-120)
    .linkDistance(function(d) {
      return d.score;
    })
    .size([svgWidth, svgHeight]);
    
    return {
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      force: force,
      nodes: null,
      links: null
    };
  },
  componentDidMount: function() {
    var self = this;
    // refactor entire graph into sub component - force layout shouldn't be
    // manipulating props, though this works
    this.state.force
              .nodes(this.props.graphData.nodes)
              .links(this.props.graphData.links)
              .start();
    this.state.force.on("tick", function (tick, b, c) {
      self.forceUpdate();
    });
  },
  componentWillReceiveProps: function(nextProps) {
    var self = this;
    this.state.force
              .nodes(nextProps.graphData.nodes)
              .links(nextProps.graphData.links)
              .start();
    this.state.force.on("tick", function (tick, b, c) {
      self.forceUpdate();
    });
  },
  drawLinks: function() {
    var links = this.props.graphData.links.map(function (link, index) {
      return (<Link datum={link} key={index} />)
    });
    return (
      <g> 
        {links}
      </g>
    );
  },
  drawNodes: function() {
    var nodes = this.props.graphData.nodes.map(function (node, index) {
      return (
        <Node 
          key={index}
          x={node.x}
          y={node.y}
          group={node.group}/>
      );
    });
    return nodes;
  },
  render: function() {
    return (
      <div>
        <div style={{"marginLeft": "20px", "fontFamily": "Helvetica"}}>
        </div>
        <svg
          style={{"border": "2px solid black", "margin": "20px"}}
          width={this.state.svgWidth}
          height={this.state.svgHeight}>
          {this.drawLinks()}
          {this.drawNodes()}
        </svg>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      associatedWords: [],
      graphData: TEST_DATA,
    }
  },
  submitWord: function (word) {
    // post word to server
    console.log('post ' + word + ' to server...');
    var self = this;

    request
      .post('/word')
      .send({word: word})
      .end(function(err, data) {
        if (err || !data.ok){
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
              score: associatedScores[associatedWords[i]] * 300,
            };

            vizData.nodes.push(node);
            vizData.links.push(link);
            // console.log('NODE:', node, 'LINK:', link);
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
