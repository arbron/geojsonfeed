/**
 * Create a feed object using the provided URL.
 */
var Feed = function(url) {
  this.posts_area = document.getElementById('posts');

  this.getJsonFromUri(url, response => {
    for (item of response['items']) {
      this.renderItem(item);
    }
  });
};

Feed.prototype.getJsonFromUri = function(uri, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (xhr.status == 200) {
      callback(xhr.response);
    }
  };
  xhr.send();
};

Feed.prototype.renderItem = function(item) {
  this.posts_area.innerHTML += item['title'] + '<br>';
};
