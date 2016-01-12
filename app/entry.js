var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');


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

var color = d3.scale.category20();

var Node = React.createClass({
  render: function () {
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
  render: function () {
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
  componentDidMount: function () {
    var self = this;
    // refactor entire graph into sub component - force layout shouldn't be
    // manipulating props, though this works
    this.state.force
              .nodes(this.props.wordData.nodes)
              .links(this.props.wordData.links)
              .start();
    this.state.force.on("tick", function (tick, b, c) {
      self.forceUpdate();
    });
  },
  drawLinks: function () {
    var links = this.props.wordData.links.map(function (link, index) {
      return (<Link datum={link} key={index} />)
    });
    return (
      <g> 
        {links}
      </g>
    );
  },
  drawNodes: function () {
    var nodes = this.props.wordData.nodes.map(function (node, index) {
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
      words: [],
      wordData: this.props.wordData,
    }
  },
  submitWord: function (word) {
    // post word to server
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
        <Graph wordData={this.state.wordData}/>
      </div>
    );
  },
});


ReactDOM.render(<App wordData={TEST_DATA}/>, document.getElementById('app'));
