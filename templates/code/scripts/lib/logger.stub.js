/** Minimal structured-ish logger for scripts starter */
function prefix(level) {
  return `[scripts:${level}]`;
}

module.exports = {
  info: (...args) => console.log(prefix("info"), ...args),
  warn: (...args) => console.warn(prefix("warn"), ...args),
  error: (...args) => console.error(prefix("error"), ...args),
};
