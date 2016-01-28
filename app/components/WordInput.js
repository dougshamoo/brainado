var React = require('react');
var {
  TextField,
  RaisedButton,
} = require('material-ui');

var WordInput = React.createClass({
  getInitialState: function() {
    return {
      sourceWord: this.props.sourceWord,
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      sourceWord: newProps.sourceWord,
    });
  },

  handleChange: function(e) {
    this.setState({sourceWord: e.target.value});
  },

  handleSubmit: function(word, e) {
    e.preventDefault();
    this.props.submitWord(word);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit.bind(this, this.state.sourceWord)}>
        <TextField
          hintText="Pick a word to start with..."
          floatingLabelText="Source word"
          value={this.state.sourceWord}
          onChange={this.handleChange} />
        <RaisedButton 
          primary={true}
          type="submit"
          label="Submit" />
      </form>
    );
  },
});

module.exports = WordInput;
