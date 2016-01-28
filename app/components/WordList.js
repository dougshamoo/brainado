var React = require('react');
var {RaisedButton} = require('material-ui');

const style = {
  margin: 4,
};

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

  handleClick: function(word) {
    // TODO: pass new word up to App state
    console.log(word);
    this.props.submitWord(word);
  },

  renderWords: function() {
    var self = this;
    return this.state.associatedWords.map(function(word) {
      return (
        <RaisedButton
          key={word}
          label={word}
          style={style}
          onClick={self.handleClick.bind(null, word)} />
      );
    });
  },

  render: function() {
    return (
      <div>
        {this.renderWords()}
      </div>
    );
  },
});

module.exports = WordList;
