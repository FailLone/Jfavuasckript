function longestCommonSubstring(str1, str2) {
    var length1 = str1.length
    var length2 = str2.length

    if (length1 === 0 || length2 === 0) {
        return 0
    }
    var first = -1
    var first2 = -1
    var longest = 0

    for (var i = 0; i < length1; i++) {
        for (var j = 0; j < length2; j++) {
            var length = 0
            var m = i
            var n = j
            while (m < length1 && n < length2) {
                if (str1[m] !== str2[n]) {
                    break
                }
                length++
                m++
                n++
            }
            if (longest < length) {
                longest = length
                first = i
                first2 = j
            }
        }
    }
    return longest
}
