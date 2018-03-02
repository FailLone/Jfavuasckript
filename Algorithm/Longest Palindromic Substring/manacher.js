/**
 * @param {string} s
 * @return {string}
 * https://articles.leetcode.com/longest-palindromic-substring-part-ii/
 */
var preProcess = function(s) {
    let n = s.length
  if (n == 0) return "^$"
  let ret = "^"
  for (let i = 0; i < n; i++)
    ret += "#" + s.substr(i, 1)
 
  ret += "#$"
  return ret
}
var longestPalindrome = function(s) {
  var T = preProcess(s)
  var n = T.length
  var P = []
  var C = 0, R = 0;
  for (var i = 1; i < n-1; i++) {
    var i_mirror = 2*C-i; // equals to i' = C - (i-C)
    
    P[i] = (R > i) ? Math.min(R-i, P[i_mirror]) : 0;
    
    // Attempt to expand palindrome centered at i
    while (T[i + 1 + P[i]] == T[i - 1 - P[i]])
      P[i]++;
 
    // If palindrome centered at i expand past R,
    // adjust center based on expanded palindrome.
    if (i + P[i] > R) {
      C = i;
      R = i + P[i];
    }
  }
 
  // Find the maximum element in P.
  var maxLen = 0;
  var centerIndex = 0;
  for (var i = 1; i < n-1; i++) {
    if (P[i] > maxLen) {
      maxLen = P[i];
      centerIndex = i;
    }
  }
  
  return s.substr((centerIndex - 1 - maxLen)/2, maxLen);
};