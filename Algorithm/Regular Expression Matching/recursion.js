/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
    if (!p.length) {
        return !s.length
    }
    var firstMatch = !!s.length && (s[0] === p[0] || p[0] === '.')
    
    if (p.length >= 2 && p[1] === '*') {
        return !firstMatch && isMatch(s, p.substring(2)) || firstMatch && isMatch(s.substring(1), p)
    } else {
        return firstMatch && isMatch(s.substring(1), p.substring(1))
    }
}
