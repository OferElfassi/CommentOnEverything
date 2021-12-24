const momentTz = require('moment-timezone');

const getFormatedDate = (date, timeZoneOffset = null) => {
  const defaultTimeZone = 'israel';
  if (timeZoneOffset) {
    return momentTz(date).utcOffset(userTZoffset);
  } else {
    return momentTz(date).tz(defaultTimeZone);
  }
};

module.exports = getFormatedDate;
