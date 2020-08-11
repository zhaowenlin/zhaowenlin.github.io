<!--
 * @Descripttion: helloword
 * @Author: zhaowenlin
-->
#初始化
引入vue.js的时候从入口文件开始执行，初始化一些全局属性和方法（directives,components等），原型上挂载$mount方法等操作，然后再我们new Vue({…})的时候会执行之前initMixin的时候对Vue的原型上挂载的_init函数Vue.prototype._init，此时才正式开始vue实例化，初始话的过程去initProp initMethods,initData等操作进行一系列依赖收集等


#watcher
每个组件会new一个wather实例,将vm._update(vm._render(), hydrating)也就是updateComponent作为expression

init data的时候会给它下面的所有属性，observe一次，每个属性都会new Dep用来收集该属性的依赖，只要用到这个属性的表达式或者模板就会被添加依赖到deps数组，deps里面都是存的某个vm实例的watcher，在get函数里会使用到这个Dep实例；如果遇到对象就继续observe，遇到数组就特殊处理，对数组的原型(push pop 等函数)进行了重写，所以只有被重写的这些操作才会被监听到数据的变化；


compute属性会new Watcher()将noop作为this.cb且触发该vue实例的watchs.push【vm._watchers.push(this)】，此时的this就是vue实例，初始化该wather实例的deps、newDeps、newDepIds、depIds等参数，方便收集依赖, this.expression = 计算属性函数体的toString，this.lazy = true


wather 属性也会触发new Watcher() 将watcher回调函数也就是(newVal, odlVale)=>{}作为this.cb 且触发该vue实例的watchs.push【vm._watchers.push(this)】，此时的this就是vue实例，watcher属性的lazy为false，所以会触发this.value = this.get()

watcher 属性也还会触发new Watcher() 区别于computed属性的wather有以下几点差别
1、回调函数也就是this.cb = (newVal, odlVale)=>{}
2、this.lazy = false 所以 会触发this.value = this.get(),也就是被wather的那个属性之前初始化时候Object.defineProperty的get函数，
```javascript
 Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
            dep.depend();
            if (childOb) {
                childOb.dep.depend();
                if (Array.isArray(value)) {
                    dependArray(value);
                }
            }
        }
        return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
 }
```


#update

触发update的方式一般是click等UI交互方式，所以对浏览器对应的UI事件有一个监听事件，触发事件的时候会执行相应的回调函数，函数里如果对vm实例下面的observe属性进行了一系列操作的时候会触发之前初始化的defineProperty对属性get和set重写的函数执行，如果是读属性，且Dep.target为wather的时候会触发依赖收集，为啥需要这个Dep.target，其实它的值不是undefined就是wather，wather就是我们在初始化的时候对以上几种情况属性做的一个new watcher()操作，每个vue实例都有一个Watcher实例，这实例的有一个_wather和一个wathers，_watcher主要是为了更新vue实例，此watcher的expression属性就是vm._update(vm._render(), hydrating)；wathers就相当于一个watcherList,记录着当前vue实例的所有watcher（包括以上几种会被new watcher()的属性：watcher、data、computed、template等）

为什么需要Dep.target，它是一个全局属性，主要在触发一个observe属性的get操作的时候会根据这个Dep.target来判断是否进行依赖收集，也就是只有在触发Watcher.prototype.get这个函数的时候Dep.target才会指向该wather，其他情况都是undefined，都不需要在触发get操作的时候触发依赖收集，什么时候会触发Watcher.prototype.get呢，在new Watcher()[初始化属性]/watcher.run()[flushSchedulerQueue]/watcher.evaluate()[createComputedGetter]时候


之前讲到了Dep.target是一个全局属性，它指向正在执行的watcher，

一旦watcherlist的watcher中的一个在执行的时候会触发watcher的cb函数里用到的observe属性的get操作，get操作里就会判断当前Dep.target是否有值，如果有值才会在该属性对应的dep实例里的subs push该watcher(Dep.target所值的watcher实例)


#父子组件渲染顺序
父create->子create->子mounted->父mounted
父组件渲染流程：始化init->解析模板->生成语法树->生成vnode->createElm

一开始初始化是从父组件开始初始化，在父组件的createElm的时候根据生成的render()语法树执行过程中会有一个_c({...})里面的tag为子组件的标签名，程序会查找该标签是否在原始html标签里，如果不在，就说明是组件标签，这个时候会去createComponent,也就是重新走一次初始化init->根据父组件解析后的语法树(带with(this)的render函数)->生成vnode->createElm

每个组件的$mount函数里都会执行一个mountComponent的函数，这个函数里就会为该组件初始化一个watcher，该watcher会在该实例的watcher属性和computed属性（称为user watcher）后初始化且触发watcher.get(),也就是
```javascript
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      // this.getter在new watcher的时候被该expression赋值，render watcher的expression是vm._update(vm._render(), hydrating)，所以会触发render函数的执行，也就是更新dom节点，render函数会跟进with(this){_c({...})}这种根据语法树生成的render function去重新计算{}里的表达式
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };
```

#生成语法树（ast）
语法树的生成是通过获取根节点dom节点innerHtml的方式获取template字符串，然后while逐步解析字符串，通过对字符串的操作(substring截取，index移位)来生成语法树，该语法树会直接通过with(this){return _c('div',[_v(_s(modalTest + b))])}的方式将语法树整理后(根据节点类型来判断该用什么函数包裹起来)保存到render函数里，在render watcher执行的时候会执行该render函数


#组件update
当我们修改属性的时候会触发defineProperty里属性的setter函数的dep.notify()
notify也就是将该属性收集的watcher push到一个queue队列里，在第一次push的时候就通过nextTick开启一个微任务，我的上一篇文章讲了nextTick的原理，这里就不多讲了，也就是该watcher队列会在下一个微任务执行的时候被flush
```javascript
 Dep.prototype.notify = function notify () {
    // subs就是初始化的时候为该属性的Dep实例收集的订阅watcher，收集watcher的时候也还会将该Dep的Id push到该watcher的depIds属性
    var subs = this.subs.slice();
    if ( !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      // 当属性setter函数被触发的时候回会依次执行该属性订阅的watcher的update函数
      subs[i].update();
    }
  };

  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  function queueWatcher (watcher: Watcher) {
    const id = watcher.id
    if (has[id] == null) {
      has[id] = true
      if (!flushing) {
        queue.push(watcher)
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        let i = queue.length - 1
        while (i > index && queue[i].id > watcher.id) {
          i--
        }
        queue.splice(i + 1, 0, watcher)
      }
      // queue the flush
      if (!waiting) {
        waiting = true

        if (process.env.NODE_ENV !== 'production' && !config.async) {
          flushSchedulerQueue()
          return
        }
        nextTick(flushSchedulerQueue)
      }
    }
  }


    /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow()
    flushing = true
    let watcher, id

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id)

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index]
      if (watcher.before) {
        watcher.before()
      }
      id = watcher.id
      has[id] = null
      watcher.run()
      // in dev build, check and stop circular updates.
      if (process.env.NODE_ENV !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? `in watcher with expression "${watcher.expression}"`
                : `in a component render function.`
            ),
            watcher.vm
          )
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    const activatedQueue = activatedChildren.slice()
    const updatedQueue = queue.slice()

    resetSchedulerState()

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue)
    callUpdatedHooks(updatedQueue)

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush')
    }
  }
```



depId:
data->2
text-> 3
a->4
c->5
d->6
{xx:1}->7
xx->8

watcherId
computed   e-> id:1  expOrFn: a(newVal, oldVal) {this.d.xx = newVal} cb= noop

wather a->id:2 expOrFn: 'a' 

