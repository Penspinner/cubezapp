(function() {

  var MIN_GRAPH_WIDTH = 300;
  var PANE_SPACING = 3;

  var PUZZLE_LABEL_SIZE = 0.12;
  var PUZZLE_ICON_SIZE = 0.7;

  function Stats() {
    this._$movingPane = $('#stats-contents-contents');
    this._$empty = $('#stats-empty');
    this._$icon = this._$empty.find('.icon');
    this._$name = this._$empty.find('label');
    this._$panes = $('#stats-panes');

    this._empty = (window.app.store.getSolveCount() === 0);
    this._movingPaneTop = 0;

    this.averages = new window.app.Averages();
    this.graph = new window.app.Graph();
    this.timesList = new window.app.TimesList();

    this._registerModelEvents();
    this._registerUIEvents();
    this._updatePuzzleInformation();
    this.layout();
  }

  Stats.prototype.layout = function(animate) {
    this._layoutEmpty();
    this._layoutPanes();
    this._layoutMovingPane(animate || false);
  };

  Stats.prototype._handleEmptyChanged = function() {
    var newEmpty = (window.app.store.getSolveCount() === 0);
    if (newEmpty === this._empty) {
      return;
    }
    this._empty = newEmpty;
    this.layout(window.app.view.footer.isFullyVisible());
  };

  Stats.prototype._handlePuzzleChanged = function() {
    this._updatePuzzleInformation();
  };

  Stats.prototype._layoutEmpty = function() {
    var viewHeight = this._$empty.height();
    var padding = Math.floor(viewHeight * (1 - PUZZLE_LABEL_SIZE -
      PUZZLE_ICON_SIZE) / 2);
    var iconSize = Math.floor(PUZZLE_ICON_SIZE * viewHeight);
    this._$icon.css({
      top: padding,
      height: iconSize
    });
    var nameHeight = Math.floor(PUZZLE_LABEL_SIZE * viewHeight)
    this._$name.css({
      fontSize: nameHeight,
      lineHeight: nameHeight + 'px',
      height: nameHeight,
      bottom: Math.round(padding / 2)
    });
  };

  Stats.prototype._layoutMovingPane = function(animate) {
    var top = 0;
    if (this._empty) {
      top = -this._$panes.height();
    }

    if (top === this._movingPaneTop) {
      return;
    }
    this._movingPaneTop = top;

    if (animate) {
      this._$movingPane.animate({top: top}, 'fast');
    } else {
      this._$movingPane.stop(true, true).css({top: top});
    }
  };

  Stats.prototype._layoutPanes = function() {
    var totalWidth = this._$panes.width();

    this.averages.setVisible(true);

    this.averages.layout();
    this.timesList.layout();

    var averagesWidth = this.averages.width();
    var timesWidth = this.timesList.width();

    if (averagesWidth + timesWidth + PANE_SPACING > totalWidth) {
      this.averages.setVisible(false);
      this.graph.setVisible(false);
      this.timesList.layout(totalWidth);
    } else if (averagesWidth + timesWidth + MIN_GRAPH_WIDTH > totalWidth) {
      this.graph.setVisible(false);
      this.averages.layout(totalWidth - timesWidth - PANE_SPACING);
    } else {
      this.graph.setVisible(true);
      this.graph.layout(timesWidth + PANE_SPACING,
        totalWidth - averagesWidth - timesWidth - PANE_SPACING*2);
    }
  };

  Stats.prototype._registerModelEvents = function() {
    window.app.observe.activePuzzle(['icon', 'name'],
      this._handlePuzzleChanged.bind(this));
    window.app.observe.latestSolve('id', this._handleEmptyChanged.bind(this));
  };

  Stats.prototype._registerUIEvents = function() {
    this.averages.on('needsLayout', this.layout.bind(this));
    this.timesList.on('needsLayout', this.layout.bind(this));
  };

  Stats.prototype._updatePuzzleInformation = function() {
    var puzzle = window.app.store.getActivePuzzle();
    this._$name.text(puzzle.name);
    var iconPath = 'images/gray_puzzles/' + puzzle.icon + '.svg';
    this._$icon.css({backgroundImage: 'url(' + iconPath + ')'});
  };

  window.app.Stats = Stats;

})();
