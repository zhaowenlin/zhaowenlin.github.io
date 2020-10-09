<!--
 * @Descripttion: helloword
 * @Author: zhaowenlin
-->

## vue diff算法
1、先判断两个节点是否可比较，如果sameVnode(oldVnode, vnode)返回false，收说明两个节点不同，直接替换
```javascript
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
2、如果两个节点相同则patchVnode，在函数里比较两个节点如果oldVnode === vnode就直接返回
3、如果oldVnode跟vnode都是静态节点，且具有相同的key，当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上，也不用再有其他操作
```javascript
if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
) {
    vnode.componentInstance = oldVnode.componentInstance
    return
    }
```
4、 if (isUndef(vnode.text)){}如果节点的text为空，则说明该节点不表示文本节点或者注释节点，需要进一步比较，否则直接比较两个节点的文本内容，替换一下text就行了
5、在比较的的时候如果isDef(oldCh) && isDef(ch)为真，且oldCh !== ch就updateChildren
```javascript
// 0)将Vnode的头尾取出跟OldVnode的头尾取出进行四次比较，OldVnode的头尾os/oe，Vnode的头尾vs/ve
// 1）os=vs:说明两个node的头相同，那么将两者的头向后跳一格(即os原本是OlaVnode[0],变成OldVnode[1])
// 2)oe=ve:说明两个node的尾相同，那么将两者的尾向前跳一格(即oe原本是OldVnode[length-1],变 成OldVnode[length-2])
// 3）os=ve：说明OldVnode的尾应该是新的头，则将ve移到OldVnode的最前面
// 4) vs=oe：说明OldVnode的头应该是新的尾，则将ve移到OldVnode的最后面 }
// 5）都没有匹配成功的时候就根据OldVnode的key生成oldKeyToIdx(map结构{[key]:index}),
// 如果node没有key，那就需要findIdxInOld，该函数就是根据vs(newStartVnode)去oldNodes里去遍历查找，看是否能找到和自己相同的node

if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
idxInOld = isDef(newStartVnode.key) 
? oldKeyToIdx[newStartVnode.key] 
// 有key则直接在oldNode里跟进key值对应的map里查找index
: findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
// 如果vs没有key，则需要启动findIdxInOld, 从oldVnode里去匹配是否有和vs相同的节点，并返回在oldVnode里的index

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

 function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i]
      if (isDef(c) && sameVnode(node, c)) return i
    }
  }

// 6）如果idxInOld不为空，也就是说在oldVnode里找到了和Vnode相同索引的节点，此时需要比较这两个节点是否相同，如果不同就代表同一个key不同元素，则直接当成一个新的节点在oldStartVnode后面createElm；如果两个节点相同，则将找到的这个oldCh[idxInOld]移到此时的oldStartVnode前面
// 7）while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx)结束后如果oldStartIdx > oldEndIdx则说明需要新增节点，新增当前newEndIdx节点，否则移除 oldStartIdx到oldEndIdx之间的节点
```
6、如果只有ch则先去看oldCh有没有text，有的话就直接置空将当前ch addVnodes
7、如果只有oldCh则直接移除
8、oldVnode.text不为空则置空
(ch = Vnode.children, oldCh = Vnode.children)

### key值的作用
在进行比较的时候，如果头尾匹配不到，且没有key的话，则会遍历整个OldVnodes，用当前Vnode和遍历的OldVnodeItem进行比较，看是否有相同可以复用的节点，比较浪费时间