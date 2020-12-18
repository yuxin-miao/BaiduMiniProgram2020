const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  };

  const formatDay = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-');
  };

  const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
  };

  const chatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    var weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const wd = weekDay[date.getDay()];
    const hour = date.getHours();
    const minute = date.getMinutes();
    return wd + ' '+ [month, day].map(formatNumber).join('.')  + ' ' + [hour, minute].map(formatNumber).join(':');
  }

  const dictDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {year: year, month: month, day: day}
  }
  module.exports = {
    formatTime: formatTime,
    formatDay: formatDay,
    chatTime: chatTime,
    dictDate: dictDate,
  };
