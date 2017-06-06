var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 7.321, lng: 20.123},
    zoom: 4
  });
}

/**
 * Create a feed object using the provided URL.
 */
var Feed = function(url) {
  this.posts_area = document.querySelector('nav');
  this.posts = [];

  this.getJsonFromUri(url, response => {
    this.posts = response['items'];
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < this.posts.length; i++) {
      let item_bit = this.renderItem(this.posts[i]);
      item_bit.querySelector('article').setAttribute('index', i);
      fragment.appendChild(item_bit);
    }
    this.posts_area.appendChild(fragment);

    let links = Array.from(document.querySelectorAll('nav article'));
    for (let link of links) {
      let index = link.getAttribute('index');
      link.addEventListener('click', event => {
        this.showItem(this.posts[index], event);
      });
    }

    this.showItem(this.posts[0]);
  });
};

/**
 * Load JSON from a remote location.
 */
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

/**
 * Render a single feed item on the page.
 */
Feed.prototype.renderItem = function(item) {
  let template = document.querySelector('nav > template').content;
  template.querySelector('h4').textContent = item.title;
  // template.querySelector('p').textContent = item.content_html;
  return document.importNode(template, true);
};

/**
 * Show the marker for an item on the map.
 */
Feed.prototype.showItem = function(item, event) {
  if (event !== undefined) {
    event.preventDefault();
  }
  if (!item) {
    return false
  }

  document.querySelector('#post h3').textContent = item.title ? item.title : "";
  let content = "";
  if (item.content_html) {
    content = item.content_html;
  } else if (item.content_text) {
    content = item.content_text;
  }
  document.querySelector('#post p').innerHTML = content;

  if (this.current_data) {
    this.current_data.setMap(null);
  }
  if (!('_geo' in item)) {
    return false
  }
  if (item.__data) {
    item.__data.setMap(map);
  } else {
    item.__data = new google.maps.Data({ map: map });
    item.__data.addGeoJson(item._geo);
  }
  this.current_data = item.__data;
};
