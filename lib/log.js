const logTypes = {
  err: console.error,
  info: console.log,
  warn: console.warn,
};

function log(logtype, tolog) {
  logTypes[logtype](tolog);
}

export default log;
