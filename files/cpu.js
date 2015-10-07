var cpu = {
  year: 0,
  month: 0,
  date: 0,
  _calendarType: undefined,
  _calendarKey: undefined,
  setType: function(calendarType, key) {
    this._calendarType = calendarType;
    this._calendarKey = key;
  },
  getType: function() {
    return this._calendarType;
  },
  getKey: function() {
    return this._calendarKey;
  },
  selected: null, // prop: month, & date
  run: function() {
    this._setToday();
    stor.addCal( new Calendar(this.year), "default" , 68);
    this.setType("default", 68);
    this.makeTable();
  },
  reset() {
    this.removeMenu();
    this.selected = null;
  },
  changeMonth(year, month) {
    if (month > 11) {
      this.changeMonth(year + 1, month - 12);
    } else if (month < 0) {
      this.changeMonth(year - 1, 12 + month);
    } else {
      this.month = month;
      this.year = year;
    }
  },
  increaseMonth(value) {
  // Works the same for negative or positive value.
    var month = this.month + value;
    this.changeMonth(this.year, month);
  },
  makeTable() {
    var calObj = stor.getCalObj( this.getType() );
    var calendarArray = calObj["calendar"].makeCalendarArray(this.year, this.month);
    var table = tableMaker.createTable(calendarArray);
    display.displayMonth(this.month, table, ui.removeTableHandler);
    ui.addTableHandler();
  },
  _setToday() {
  // Sets cpu to today's date but doesn't make calendar.
    var today = new Date();

    this.year = today.getFullYear();
    this.month = today.getMonth();
    this.date = today.getDate();
  },
  nextMonth() {
    this.increaseMonth(1); 
    this.makeTable();
  },
  prevMonth() {
    this.increaseMonth(-1); 
    this.makeTable();
  },
  today() {
    this._setToday();
    this.makeTable();
  },
  processInput(inputType, month, date, e) {
    switch(inputType) {
      case "clickedTable":
        this.select(month, date, this.removeMenu, this.addMenu);
        break;
    }
  },
  select(month, date, sameFunct, diffFunct) {
  // Input: Obj with prop: month & date
  // sameFunct is run if previously selected is same as current.
  // Otherwise, diffFunct is run.
    var selected = this.selected;

    this.selected = {
      month: month,
      date: date
    };
    if (selected !== null && selected.month == month && selected.date == date) {
      // This is for user has clicked on same date twice (for now, to remove menu)
      display.select(month, date, false);
      sameFunct();
      this.selected = null;
    } else {
      if (selected !== null) {
        // deselect on calendar
        display.select(selected.month, selected.date, false);
      }
      display.select(month, date, true);
      diffFunct();
    }
  },
  addMenu() {
    display.createInfoMenu("Testing");
  },
  removeMenu() {
    display.removeMenu();
  }
};