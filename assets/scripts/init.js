(function() {

  function init() {
    initializeModel();
    initializeView();
    initializeController();
  }

  function initializeController() {
    window.app.settingsController = new window.app.SettingsController(
      window.app.view.footer.settings
    );
    window.app.timesListController = new window.app.TimesListController(
      window.app.view.footer.stats.timesList
    );
    window.app.headerController = new window.app.HeaderController(
      window.app.view.header
    );
    window.app.graphController = new window.app.GraphController(
      window.app.view.footer.stats.graph
    );
    window.app.viewEvents.on('app.load', function() {
      window.app.timerController = new window.app.TimerController();
      showDisclaimerPopup();
    });
  }

  function initializeModel() {
    window.app.store = new window.app.LocalStore();
    window.app.timer = new window.app.Timer();
  }

  function initializeView() {
    window.app.windowSize = new window.app.WindowSize();
    window.app.fonts = new window.app.Fonts();
    window.app.flavors = new window.app.Flavors();
    window.app.view = new window.app.AppView();
    window.app.favicon = new window.app.Favicon();
    window.app.title = new window.app.Title();
  }

  function showDisclaimerPopup() {
    if (localStorage.dontShowDisclaimer !== 'true') {
      setTimeout(function() {
        new window.app.DisclaimerPopup().show();
      }, 200);
    }
  }

  $(init);

})();
