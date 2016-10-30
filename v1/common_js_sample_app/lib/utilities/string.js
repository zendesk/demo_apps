module.exports = {
  interpolate: function(input) {
    var args = arguments;
    return input.replace(/%@/g, function(match, index) {
      var position = index + 1;
      return args[position] !== undefined ? args[position] : match;
    });
  }
};
