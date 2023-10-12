/**
 * Prefixes a message with a prefix
 * @param {String} prefix
 * @param {String} text
 * @returns {String}
 */
function prefixMsg(text, prefix) {
  return `${prefix} => ${text}`;
}

module.exports = { prefixMsg };
