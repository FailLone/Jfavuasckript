/*只要我们能找到比原问题规模小却同质的问题，都可以用递归解决。
比如要求{1, 2, 3}的所有子集，可以先求{2, 3}的所有子集，{2, 3}的子集同时也是{1, 2, 3} 的子集，然后我们把{2, 3}的所有子集都加上元素1后（注意排序），又得到同样数量的子集,
它们也是{1, 2, 3}的子集。这样一来，我们就可以通过求{2, 3}的所有子集来求 {1, 2, 3}的所有子集了。
即为求1,2,3的子集，要先求2,3的子集，然后再把1加入到2,3的子集中去，典型的递归思路。*/
function subsets(S, idx, n) {
  let result = []
  if (idx === n) {
    let temp = []
    result.push(temp)
  } else {
    let vec = subsets(S, idx + 1, n)
    let a = S[idx]
    for (let i = 0; i < vec.length; i++) {
      let v = vec[i]
      result.push(v.slice(0))
      v.push(a)
      result.push(v)
    }
  }
  return result
}
