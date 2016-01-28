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

  renderWords: function() {
    return this.state.associatedWords.map(function(word) {
      return (
        <RaisedButton
          id={word}
          label={word}
          style={style} />
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
