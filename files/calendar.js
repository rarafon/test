function Calendar(year) {
  this._years = {}; // object containing year instances
  this.init(year);
}

Calendar.prototype.getToday = function() {
  return copy(this._today);
};

Calendar.prototype.init = function(year) {
  this.makeYear(year);
};

Calendar.prototype.makeYear = function(year) {
  var yearArray = [];
  run(function(month){
    yearArray.push( this.makeMonth(year, month) );
  }, 12, 0, 1, this);
  this._years[year] = yearArray;
};

Calendar.prototype.makeMonth = function(year, month) {
  return new Month(year, month );
}
Calendar.prototype.getMonth = function(year, month) {
// Returns month instances. Uses makeYear because by
// adjusting for month, it might get a year that doesn't
// exist yet.
  if (!(year in this._years)) {
    this.makeYear(year);
  }
  if (month < 0) {
    return this.getMonth(year - 1, 12 + month);
  } else if (month > 11) {
    return this.getMonth(year + 1, month - 12);
  }
  return this._years[year][month];  
};

Calendar.prototype.getMonthList = function(year, month) {
// Returns array of objects of days containing values
// getsMonth gets the mon instance.
  return (this.getMonth(year, month)).getMonthList()
};

Calendar.prototype.getDay = function(year, month, date) {
  var length;
  if (date <= 0) {
    length = this.getMonthLength(year, --month);
    date = length + date;
    return this.getDay(year, month, date);
  } else if (date > 28) {
    length = this.getMonthLength(year, month);
    if (date > length) {
      date = date - length;
      month++;
      return this.getDay(year, month, date);
    }
  }
  return this.getMonth(year, month).getDay(date);
}

Calendar.prototype.makeCalendarArray = function(year, month) {
// Formats for use in the calendar table.

// Uses formatDaysList to the monthList that already contains obj containing
// the date info in obj to have arrays for a week that contains an array containing
// the date objects.
  var daysList = this.getMonthList(year, month);
  daysList = this.addPrevMonthDays(year, month, daysList);
  daysList = this.addNextMonthDays(year, month, daysList);
  return this.formatDaysList(daysList);
};

Calendar.prototype.formatDaysList = function(daysList) {
  var outerArray = range(daysList.length / 7);
  var innerArray = range(0, 7, 1);
  return outerArray.map(function(prevWeek) {
    return innerArray.map(function(day) {
      return daysList[prevWeek * 7 + day];
    });
  });
};

Calendar.prototype.addNextMonthDays = function(year, month, daysList) {
// Adds days to last week of month to make it 7 days
// Returns these days concated to daysList
  var remainingDays = 7 - daysList.length % 7; // gets amount of days left to make week == 7 days
  if (remainingDays == 7) {
    return daysList;
  }
  var nextMonthDays = this.remainingDaysOfWeek(year, month + 1, remainingDays);
  return daysList.concat(nextMonthDays);
};

Calendar.prototype.addPrevMonthDays = function(year, month, daysList) {
  var firstDayOfWeek = daysList[0].dayOfWeek;
  var prevMonthDays = this.prevDaysOfWeek(year, month, firstDayOfWeek);
  return prevMonthDays.concat(daysList);
};


Calendar.prototype.remainingDaysOfWeek = function(year, month, firstDayOfWeek) {
  var remainingDays = range (1, firstDayOfWeek + 1);
  return this.getDays(year, month + 1, remainingDays);
};

Calendar.prototype.prevDaysOfWeek = function(year, month, numDays) {
// firstDayOfWeek refers to the current month. Want to get the days before that
// date to complete the entire week.
  var negativeDayValues = range(numDays - 1, -1, -1).map(function(value){ return -value; });
  return this.getDays(year, month, negativeDayValues);
};

Calendar.prototype.getDays = function(year, month, datesArray) {
  datesArray = datesArray.map(function(date) {
    return this.getDay(year, month, date);
  }, this);
  return datesArray;
};

Calendar.prototype.getMonthLength = function(year, month) {
// Gets the length of the months list in a month instance.
  return this.getMonth(year, month).getLength();
};