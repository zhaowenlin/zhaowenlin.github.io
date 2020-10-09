/*
 * @Descripttion: helloword
 * @Author: zhaowenlin
 */
// throttle的简单实现

function throttle(func, duration) {
		var timer = null;
		return function () {
			var context = this;
			var args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				func.apply(context, args);
			},duration)
		}
}

window.addEventListener('scroll', throttle(func, 50), false);

function m(fn, ms) {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }
  function  throttle(fn, wait) {
    let updateTime = Date.now()
    return (...args) => {
      const now = Date.now()
      if (now - updateTime > wait) {
        fn.apply(this, args)
        updateTime = now
      }
    }
  }