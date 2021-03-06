function Month(year, month) {
  var date = new Date(year, month);
  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.days = {};
  this.makeDays();
}

Month.prototype.makeDays = function() {
  for (var date = 1 ; date <= 32 ; date++ ) {
    var day = new Day(this.year, this.month, date);
    if (day.month === this.month) {
      this.days[date] = (day); 
    } else {
      break;
    }
  }
};

Month.prototype.getMonth = function() {
  return map(this.days, function(_, date) {
    return this.getDay(date);
  }, this);
};

Month.prototype.getMonthList = function() {
  var monthList = [],
    length = this.getLength();
  run(function(i){
    monthList[i] = this.getDay(i +1);
  }, length, 0, 1, this);
  return monthList;
};

Month.prototype.getDay = function(date) {
  var monthLength = getLength(this.days);
  if (date <= 0) {
    date = monthLength - date - 1;
  } else if (date > monthLength) {
    date = date - monthLength;
  }
  return this.days[date].getContent();
};

Month.prototype.getLength = function() {
  return getLength(this.days);
};