var React = require('react');

var WordList = React.createClass({
  getInitialState: function() {
    return {
      associatedWords: this.props.associatedWords,
    };
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

module.exports = WordList;
