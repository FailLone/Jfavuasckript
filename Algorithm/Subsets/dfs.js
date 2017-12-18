/* 原数组中每一个元素在子集中有两种状态：要么存在、要么不存在。
这样构造子集的过程中每个元素就有两种选择方法：选择、不选择，因此可以构造一颗二叉树来表示所有的选择状态：
二叉树中的第i+1层第0层无节点表示子集中加入或不加入第i个元素，左子树表示加入，右子树表示不加入。
所有叶节点即为所求子集。因此可以采用DFS的递归思想求得所有叶节点。*/
// S为原数组，temp为当前子集，level为原数组中的元素下标亦为二叉树的层数，result为所求子集集合
function subsets(S, temp, level, result) {
  // 如果是叶子节点则加入到result中
  if (level === S.length) {
    result.push(temp)
    return
  }
  // 对于非叶子节点，不将当前元素加入到temp中
  subsets(S, temp.slice(0), level + 1, result)
  // 将元素加入到temp中
  temp.push(S[level])
  subsets(S, temp.slice(0), level + 1, result)
}
