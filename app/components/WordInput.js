var React = require('react');
var {
  TextField,
  RaisedButton,
} = require('material-ui');

var WordInput = React.createClass({
  getInitialState: function() {
    return {
      value: '',
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
        <TextField
          hintText="Pick a word to start with..."
          floatingLabelText="Source word"
          value={this.state.value}
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
