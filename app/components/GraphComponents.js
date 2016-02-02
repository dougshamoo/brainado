var React = require('react');

var color = d3.scale.category20();
var linkScale = d3.scale.linear();

var Node = React.createClass({
  render: function() {
    return (
      <circle
        r={5}
        cx={this.props.x}
        cy={this.props.y}
        style={{
          fill: color(this.props.group),
          stroke:'#fff',
          strokeWidth:'1.5px',
        }}/>
    );
  },
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
          stroke:'#999',
          strokeOpacity:'.6',
          strokeWidth: '2',
        }}/>
    );
  },
});

var NodeLabel = React.createClass({
  render: function() {
    return (
      <text
        x={this.props.x}
        y={this.props.y}>
        {this.props.text}
      </text>
    );
  },
});

var Graph = React.createClass({
  // mixins: [Radium.StyleResolverMixin, Radium.BrowserStateMixin],
  getInitialState: function() {
    var svgWidth = this.props.vizWidth;
    var svgHeight = this.props.vizHeight;

    var force = d3.layout.force()
      .charge(-1500)
      .gravity(.2)
      .linkDistance(function(d) {
        // Distance is inversely proportional to the association score,
        // multiplied by a scaling value to spread everything out.
        return d.distance;
      })
      .size([svgWidth, svgHeight]);

    return {
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      force: force,
      nodes: null,
      links: null,
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
    this.state.force.on('tick', function(tick, b, c) {
      self.forceUpdate();
    });
  },

  componentWillReceiveProps: function(nextProps) {
    var self = this;
    this.state.force
              .nodes(nextProps.graphData.nodes)
              .links(nextProps.graphData.links)
              .start();
    this.state.force.on('tick', function(tick, b, c) {
      self.forceUpdate();
    });
  },

  drawLinks: function() {
    var links = this.props.graphData.links.map(function(link, index) {
      return (<Link datum={link} key={index} />);
    });

    return (
      <g>
        {links}
      </g>
    );
  },

  drawNodes: function() {
    var nodes = this.props.graphData.nodes.map(function(node, index) {
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

  drawLabels: function() {
    var labels = this.props.graphData.nodes.map(function(node, index) {
      return (
        <NodeLabel
          key={index}
          x={node.x + 10}
          y={node.y - 10}
          text={node.name}/>
      );
    });

    return labels;
  },

  render: function() {
    return (
      <div>
        <div style={{marginLeft: '20px', fontFamily: 'Helvetica'}}>
        </div>
        <svg
          style={{border: '2px solid black', margin: '20px'}}
          width={this.state.svgWidth}
          height={this.state.svgHeight}>
          {this.drawLinks()}
          {this.drawNodes()}
          {this.drawLabels()}
        </svg>
      </div>
    );
  },
});

module.exports = {
  Node: Node,
  Link: Link,
  NodeLabel: NodeLabel,
  Graph: Graph,
};
