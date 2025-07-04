const currentTime = {
  utc: 0,

  // 객체의 메서드(함수)
  getUTC() {
    return currentTime.utc;
  },
  setUTC(value) {
    currentTime.utc = value;
  },
};

const utcInfo = {
  9: "seoul",
  8: "beijing",
  1: "london",
  "-4": "newYork",
};

// var defaultTime = new Date();
// const time = defaultTime.getTime() + (defaultTime.getTimezoneOffset() * 60 * 1000);
// var newtime = new Date(utc + (utcInfo["newYork"].utc * 60 * 60 * 1000));

function updateClock(value) {
  var liveTime = new Date();
  var now = new Date(liveTime.getTime() + value);

  var dname = now.getDay();
  var mo = now.getMonth();
  var dnum = now.getDate();
  var yr = now.getFullYear();
  var hou = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  pe = "AM";

  // if(hou == 0){
  //     hou = 12;
  // }
  // if(hou > 12){
  //     hou = hou - 12;
  //     pe = "PM";
  // }

  Number.prototype.pad = function (digits) {
    for (var n = this.toString(); n.length < digits; n = 0 + n);
    return n;
  };

  var months = ["January", "Febuary", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];
  var week = ["sunday", "monday", "tuseday", "wendsday", "Thursday", "Fridaty", "saturday"];
  // var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"];
  // var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2), pe];
  var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"];
  var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2), pe];

  var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds"];
  var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2)];

  for (var i = 0; i < ids.length; i++) document.getElementById(ids[i]).firstChild.nodeValue = values[i];
}

// function initClock() {
//   // updateClock();
//   // setInterval(() => updateClock(currentTime.utc), 100);
// }

function setTimezone(timezone) {
  var defaultTime = new Date();
  const res = getKeyByValue(utcInfo, timezone);
  const utcTime = defaultTime.getTimezoneOffset() * 60 * 1000;
  currentTime.setUTC(utcTime + res * 60 * 60 * 1000);
  console.log(timezone, new Date(defaultTime.getTime() + currentTime.utc));
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

if (typeof module === "object") {
  module.exports = { updateClock, setTimezone };
}
