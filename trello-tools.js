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
var SETTING = {
  items: [],
  isActive: function(position) {
    return this.getField(position, 'active', true);
  },
  setActive: function(position, active) {
    this.setField(position, 'active', active);
    saveSetting();
  },
  getWidth: function(position) {
    return this.getField(position, 'width', undefined);
  },
  setWidth: function(position, width) {
    this.setField(position, 'width', width);
    saveSetting();
  },
  getColor: function(position) {
    return this.getField(position, 'color', undefined);
  },
  setColor: function(position, color) {
    this.setField(position, 'color', color);
    saveSetting();
  },
  getField: function(position, field, defaultValue) {
    if (this.items.length > position
        && this.items[position]
        && typeof this.items[position][field] !== 'undefined') {
      return this.items[position][field];
    } else {
      return defaultValue;
    }
  },
  setField: function(position, field, value) {
    if (!this.items[position]) {
      this.items[position] = {};
    }
    this.items[position][field] = value;
  }
};

var loadSetting = function() {
  var setting = localStorage.getItem(getSettingKey());
  console.log('Loaded: ' + setting);
  if (setting) {
    SETTING.items = JSON.parse(setting);
  }
}
var saveSetting = function() {
  var setting = JSON.stringify(SETTING.items);
  console.log('Saving: ' + setting);
  localStorage.setItem(getSettingKey(), setting);
}

var getBoardId = function() {
  var rx = /^http[s]?\:\/\/(www\.)?trello\.com\/b\/([0-9a-zA-Z]*)\/.*$/gm;
  return rx.exec(window.location)[2];
}
var getSettingKey = function () {
  return "setting_" + getBoardId();
}



var toggle = function(position, list, button) {
  button.toggleClass('active');
  list.toggle().toggleClass('list invisible-list');

  SETTING.setActive(position, button.hasClass('active'));
  updateListAreaWidth();
};

var setWidth = function(position, width) {
  var list = $($('.list, .invisible-list').get(position));
  list.removeClass('list-300 list-400 list-500 list-600 list-700 list-800 list-900');
  list.css('width', width);
  list.addClass('list-' + width);
  SETTING.setWidth(position, width);
  updateListAreaWidth();
}

var setColor = function(position, div, color) {
  // div = $($('.toggler').get(position))
  div.find('input').css('background', color).val(color);
  $($('.list, .invisible-list').get(position)).css('background', color);
  SETTING.setColor(position, color);
}

var updateListAreaWidth = function() {
  var width = _.reduce($('.list, .invisible-list'),
    function(acc, list) {
      list = $(list);
      if (list.hasClass('invisible-list')) {
        return acc;
      } else {
        return acc + parseInt(list.css('width').replace('px', '')) + 16; // width + 2 x 5px margin + 2 x 3px padding
      }
    }, 10); // 10 for margin left and right
  $('.list-area').css('width', width);
}

var setup = function() {
  if ($(".list").size() > 0) {
    loadSetting();
    var notYetCreated = !$('.toggler').length;
    if (notYetCreated) {
      var boardHeader = $('#board-header');
      boardHeader.append($('<a class="board-header-btns left toggles-divider" />'));
      boardHeader.append($('.list, .invisible-list').map(function(position, list) {
        list = $(list);
        var listTitle = list.find('h2')[0];
        listTitle = listTitle ? listTitle.firstChild.textContent : "Add...";
        console.log(position + ': ' + listTitle);
        var div = $('<div>').addClass('toggler').addClass('active');
        var button = $('<a>').text(listTitle).addClass('quiet org-name');
        div.append(button);
        var settingsDiv = $("<div>");
        var widthSetting = $('<select />');
        widthSetting.append($('<option>300</option>'));
        widthSetting.append($('<option>400</option>'));
        widthSetting.append($('<option>500</option>'));
        widthSetting.append($('<option>600</option>'));
        widthSetting.append($('<option>700</option>'));
        widthSetting.append($('<option>800</option>'));
        widthSetting.append($('<option>900</option>'));
        widthSetting.change(function() {
          setWidth(position, widthSetting.val());
        });
        var colorPicker = $('<input type="text"/>');
        colorPicker.change(function() {
          var color = colorPicker.val();
          if (color.match(/^#[a-zA-Z0-9]{6}$/)) {
            setColor(position, div, color);
          }
        });
        settingsDiv.append($('<h1>List Settings</h1>'));
        settingsDiv.append($('<span>Width: </span>'));
        settingsDiv.append(widthSetting);
        settingsDiv.append($('<br />'));
        settingsDiv.append($('<span>Color: </span>'));
        settingsDiv.append(colorPicker);
        div.append(settingsDiv); // TODO the view that should show up when hovering over a
        button.click(function() {
          return toggle(position, list, div);
        });

        // Restoring from settings
        if (!SETTING.isActive(position)) {
          toggle(position, list, div, false);
        }
        if (SETTING.getWidth(position)) {
          setWidth(position, SETTING.getWidth(position));
          widthSetting.val(SETTING.getWidth(position));
        }
        if (SETTING.getColor(position)) {
          setColor(position, div, SETTING.getColor(position));
        }
        return div.get(0);
      }));
    }
    $('#board-header').css('overflow', 'visible');
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