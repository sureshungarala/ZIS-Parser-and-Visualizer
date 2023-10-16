/**
 * Prefixes a message with a prefix
 * @param {string} prefix
 * @param {string} text
 * @returns {string}
 */
function prefixMsg(text, prefix) {
  return `${prefix} => ${text}`;
}

module.exports = { prefixMsg };
