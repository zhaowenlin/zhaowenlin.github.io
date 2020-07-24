# vue nextTick 源码分析

最近在阅读vue的源码，虽然网上已经有很多关于vue的源码解析，但是每个人表达和理解的侧重点都不太一样，所以有错误的地方欢迎大家多多指教~~
## 什么是nextTick

使用vue的小伙伴都对这个不陌生吧，this.$nextTick()通常是我们想将逻辑放在浏览器下一个任务队列里去执行，比如：我们在页面里想在一个弹框里去获取里面某个dom实例的时候我们必须保证弹窗渲染完成过后才能去执行这个获取逻辑，所以我们会把逻辑写在nextTick 的回调里或者用await this.$nextTick。

## nextTick都做了什么
打开vue源码next-tick.js

```javascript
// 任务队列
const callbacks = []
// 任务状态
let pending = false

// 批量执行任务并清空队列
function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
    }
 ```

首先看一下这段逻辑，这段逻辑是立即执行的，也就是引用这个文件的时候就会执行，先申明一个任务队列callbacks和任务状态pending，这个pending状态是用来保证每一批任务队列能够有序执行，后面还会进行讲解；flushCallbacks这个函数就是将任务队列里的callback依次执行一遍，接着往下看

 ```javascript
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // 官方的解释是在在ios环境下callbacks已经被push到微任务队列里执行，
    // 但是队列不会执行直到浏览器需要做一些其他工作的时候才会被执行，例如执行一个timer
    // 所以执行了一个空的timer来强制微任务执行（意思理解了，不知道怎么表达，就将就看吧，嘿嘿~）
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // MutationObserver 也是微任务的一种，可以上MDN上了解详情
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // setImmediate是node独有的任务队列，属于宏任务了
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 宏任务
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

这段代码也是立即执行的，进到这个js逻辑的时候会先判断当前环境是否支持promise，不支持就用MutationObserver，node环境用setImmediate，最后兜底的是setTimeout。所以下次面试官问你nextTick原理的时候不要只说利用浏览器的微任务了，也有可能是宏任务。


 ```javascript
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    // 一旦调用了一次该函数则pending会变成true，这里是为了避免在同一个同步任务里多次调用nextTick
    // 如果第二次调用这段逻辑就不会执行了，也就是不会再去开一个微任务，同一个同步任务的nextTick
    // 只能共用一个promise(微任务)
    pending = true
    timerFunc()
  }
  
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
 ```

 next-tick.js真正export出去的函数就是nextTick，也就是我们通过this.$nextTick()调用的函数，可以看到每调用一次nextTick就会往callbacks里push一个匿名函数，函数里就是要执行的任务，如果nextTick里传入的是一个函数，就会在flushCallbacks的时候立即执行否则执行一次空的promise；也就是将当前状态机保存起来，在p.then(微任务队列)里去resolved，这样就能继续使用.then()即返回了一个promise；这里可以看到在微任务队里去执行的flushCallback，所以只要在当前同步任务完成之前也就是微任务开始之前调用的this.$nextTick()都会在微任务队列中全部执行完；

  ```javascript
  function a () {console.log(1)}
function b () {console.log(2)}
function c()  {console.log(3)}
function test(){
  this.$nextTick(a)
  
  Promise.resolve().then(c)

  this.$nextTick(b)
}
 ```

这里连续调用了两次nextTick，但是他们是在同一个宏任务里调用的
所以a和b这两个回调会在同一个任务里执行，然而c会在另一个任务里执行
微任务队列：[promiseB,promiseA]，所以按照先进先出的顺序，promiseA会先执行，然后才是promiseB
promiseA里就有a和b回调逻辑


看到这里下次面试官问你如果我依次调用多次this.$nextTick，会不会触发多个微任务的时候就不要回答是了，其实他们都只会在同一个微任务里执行~