var React = require('react');

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
  },
});

module.exports = WordInput;
