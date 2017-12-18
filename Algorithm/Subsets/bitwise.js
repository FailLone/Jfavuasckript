/** 求子集问题就是求组合问题。数组中的n个数可以用n个二进制位表示，当某一位为1表示选择对应的数，为0表示不选择对应的数。 */
function subsets(S, n) {
  // n个数有0~max-1即2^n中组合，1<<n表示2^n
  let max = 1 << n
  let result = []
  for (let i = 0; i < max; i++) {
    let temp = []
    let idx = 0
    let j = i
    while (j > 0) {
      // 判断最后一位是否为1，若为1则将对应数加入到当前组合中
      if (j & 1) {
        temp.push(S[idx])
      }
      idx++
      // 判断了这一位是否为1后要右移
      j = j >> 1
    }
      // 判断完了一种组合，加入到结果集中
    result.push(temp)
  }
  return result
}
