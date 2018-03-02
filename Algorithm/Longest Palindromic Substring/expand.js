var longestPalindrome = function(s) {
    var n = s.length
    var i, j, max,c,start;
    if (s == '' || n < 1)
        return '';
    max = '';

    for (i = 0; i < n; i++) { // i is the middle point of the palindrome  
        for (j = 0; (i - j >= 0) && (i + j < n); j++){ // if the length of the palindrome is odd  
            if (s[i - j] != s[i + j])
                break;
            c = j * 2 + 1;
            start = i - j
        }
        if (c > max.length) {
            max = s.substring(start, start + c)
        }
        for (j = 0; (i - j >= 0) && (i + j + 1 < n); j++){ // for the even case  
            if (s[i - j] != s[i + j + 1])
                break;
            c = j * 2 + 2;
            start = i - j
        }
        if (c > max.length) {
            max = s.substring(start, start + c)
        }
    }
    return max;
};