(function() {

  function GraphSettings() {
    window.app.EventEmitter.call(this);
    new window.app.GraphStandardViewMode().on('change', function(type) {
      this.emit('settingChanged', 'graphStandardType', type);
    }.bind(this));
    new window.app.GraphModeDropdown().on('change', function(mode) {
      this.emit('settingChanged', 'graphMode', mode);
    }.bind(this));

    this._views = [
      $('#graph-settings-standard'),
      $('#graph-settings-mean'),
      $('#graph-settings-histogram'),
      $('#graph-settings-streak')
    ];
    
    this._populateHistogram();
    this._populateMean();
    this._populateStandard();
    this._populateStreak();

    this._updateFromModel();
    this._registerEvents();
  }

  GraphSettings.prototype = Object.create(window.app.EventEmitter.prototype);

  GraphSettings.prototype._createSlider = function(min, max, name, modelKey) {
    var slider = new window.app.GraphSlider();
    slider.setMin(min);
    slider.setMax(max);
    var managed = new window.app.GraphSliderManager(slider, modelKey, this);
    return new window.app.LabeledGraphSlider(managed, name);
  };

  GraphSettings.prototype._populateHistogram = function() {
    var scale = this._createSlider(5, 100, 'Scale', 'graphHistogramScale');

    var $fields = $('#graph-settings-histogram .graph-settings-page-fields');
    $fields.append(scale.element());
  };

  GraphSettings.prototype._populateMean = function() {
    var scale = this._createSlider(5, 100, 'Scale', 'graphMeanScale');
    var meanSize = this._createSlider(3, 15, 'Mean of', 'graphMeanCount');
    meanSize.setLabelFunc(function(c) {
      return Math.round(c) + ' solves';
    });

    var $fields = $('#graph-settings-mean .graph-settings-page-fields');
    $fields.append(scale.element(), meanSize.element());
  };

  GraphSettings.prototype._populateStandard = function() {
    var scale = this._createSlider(5, 100, 'Scale', 'graphStandardScale');

    var $fields = $('#graph-settings-standard .graph-settings-page-fields');
    $fields.append(scale.element());
  };

  GraphSettings.prototype._populateStreak = function() {
    var scale = this._createSlider(5, 100, 'Scale', 'graphStreakScale');

    var $fields = $('#graph-settings-streak .graph-settings-page-fields');
    $fields.append(scale.element());
  };

  GraphSettings.prototype._registerEvents = function() {
    window.app.observe.activePuzzle('graphMode',
      this._updateFromModel.bind(this));
  };

  GraphSettings.prototype._updateFromModel = function() {
    var view = window.app.store.getActivePuzzle().graphMode;
    for (var i = 0; i < this._views.length; ++i) {
      if (i === view) {
        this._views[i].css({display: 'block'});
      } else {
        this._views[i].css({display: 'none'});
      }
    }
  };

  window.app.GraphSettings = GraphSettings;

})();