////////////// HEADER FOR RUNNING CODE IN SITE
(function() {
  var body;

  (function(fn) {
    var s;
    s = document.createElement('script');
    s.textContent = '(' + fn + ')()';
    return document.body.appendChild(s);
  })(body = function() {
////////////// END


//////////////
// CODE TO RUN
//////////////
var toggle = function(list, button, shouldSaveSetting) {
  if (typeof shouldSaveSetting === 'undefined') {
    shouldSaveSetting = true;
  }

  button.toggleClass('active');
  list.toggle().toggleClass('list invisible-list');

  if (shouldSaveSetting) {
    saveSetting();
  }
};

var loadSetting = function() {
  var setting = localStorage.getItem(getSettingKey());
  setting = setting ? setting.split(',') : [];
  return {
    isActive: function(position) {
      return setting.length > position && setting[position] === '1'
    }
  }
}
var saveSetting = function() {
  var setting = $('.toggler').map(function(pos, item) {
    return $(item).hasClass('active') ? 1 : 0;
  }).get().join(',');
  localStorage.setItem(getSettingKey(), setting);
}

var getBoardId = function() {
  var rx = /^http[s]?\:\/\/(www\.)?trello\.com\/b\/([0-9a-zA-Z]*)\/.*$/gm;
  return rx.exec(window.location)[2];
}
var getSettingKey = function () {
  return "setting_" + getBoardId();
}


var setup = function() {
  if ($(".list").size() > 0) {
    var setting = loadSetting();
    $('.list').each(function() {
      var notYetCreated = !$('.toggler').length;
      if (notYetCreated) {
        var boardHeader = $('#board-header');
        boardHeader.append($('<a class="board-header-btns left toggles-divider" />'));
        boardHeader.append($('.list, .invisible-list').map(function(position, list) {
          var button, listTitle, name;
          list = $(list);
          var listTitle = list.find('h2')[0];
          button = $('<a>').text(listTitle ? listTitle.firstChild.textContent : "Add...").addClass('quiet org-name toggler active');
          button.click(function() {
            return toggle(list, button);
          });
          if (!setting.isActive(position)) {
            toggle(list, button, false);
          }
          return button.get(0);
        }));
      }
    });
  } else {
    setTimeout(setup, 100);
  }
}

$(document).on('DOMNodeInserted', '.list', _.debounce(function() { // debounce because too many events, so they are only once executed
  setup();
}, 100));

setup();






////////////// BOTTOM PART OF HEADER
  });
}).call(this);