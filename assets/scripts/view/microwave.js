(function() {
  
  function Microwave() {
    this.element = $('#microwave');
    this.onInput = null;
    
    this.element.on('input', this._change.bind(this));
    this.element.keypress(function(e) {
      var keyCode = e.charCode || e.keyCode;
      if (keyCode == 13) {
        this._submit();
      }
    }.bind(this));
  }
  
  Microwave.prototype.blur = function() {
    this.element.blur();
  };
  
  Microwave.prototype.disable = function() {
    this.element.prop('disabled', true);
    this.element.blur();
  };
  
  Microwave.prototype.enable = function() {
    this.element.prop('disabled', false);
    this.element.blur();
  };
  
  Microwave.prototype.focus = function() {
    this.element.focus();
  };
  
  Microwave.prototype.show = function(time) {
    this.element.val(window.app.timeToString(time));
  };
  
  Microwave.prototype._change = function() {
    // Add colons and periods where necessary.
    var digits = window.app.filterDigits(this.element.val());
    var newTimeString = '';
    if (digits.length > 6) {
      newTimeString = digits.substring(0, digits.length-6) + ':' +
        digits.substring(digits.length-6, digits.length-4) + ':' +
        digits.substring(digits.length-4, digits.length-2) + '.' +
        digits.substring(digits.length-2);
    } else if (digits.length > 4) {
      newTimeString = digits.substring(0, digits.length-4) + ':' +
        digits.substring(digits.length-4, digits.length-2) + '.' +
        digits.substring(digits.length-2);
    } else if (digits.length >= 3) {
      newTimeString = digits.substring(0, digits.length - 2) + '.' +
        digits.substring(digits.length-2);
    } else if (digits.length == 2) {
      newTimeString = '0.' + digits;
    } else if (digits.length == 1) {
      newTimeString = '0.0' + digits;
    } else {
      newTimeString = '0.00';
    }
    this.element.val(newTimeString);
  };
  
  Microwave.prototype._submit = function() {
    if (this.onInput) {
      this.onInput(window.app.parseTime(this.element.val()));
    }
  };
  
  if (!window.app) {
    window.app = {};
  }
  window.app.Microwave = Microwave;
  
})();