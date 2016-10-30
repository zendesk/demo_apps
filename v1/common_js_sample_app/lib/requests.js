module.exports = {
  fetchBookmarks: function() {
    return {
      url:  '/api/v2/bookmarks.json',
      type: 'GET'
    };
  }
};
