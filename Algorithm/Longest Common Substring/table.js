/**
 * 	 a b e e d g
 * c 0 0 0 0 0 0
 * e 0 0 1 1 0 0
 * f 0 0 0 0 0 0
 * m 0 0 0 0 0 0
 * d 0 0 0 0 1 0 
 * g 0 0 0 0 0 1
 * 
 * 找对角线
**/
function longestCommonSubstring(str1, str2) {
	var length1 = str1.length
	var length2 = str2.length

	if (length1 === 0 || length2 === 0) {
			return 0
	}
	var first = -1
	var first2 = -1
	var longest = 0

	for (var i = 0; i <length1; i++) {
		var m = i
		var n = 0
		var length = 0
		while(m < length1 && n < length2) {
			if (str1[m] !== str2[n]) {
				length = 0
			} else {
				length++
				if (longest < length) {
					longest = length
					first = m - longest + 1
					first2 = n - longest + 1
				}
			}
			m++
			n++
		}
	}
	for (var j = 1; j <length2; j++) {
		var m = 0
		var n = j
		var length = 0
		while(m < length1 && n < length2) {
			if (str1[m] !== str2[n]) {
				length = 0
			} else {
				length++
				if (longest < length) {
					longest = length
					first = m - longest + 1
					first2 = n - longest + 1
				}
			}
			m++
			n++
		}
	}
}
