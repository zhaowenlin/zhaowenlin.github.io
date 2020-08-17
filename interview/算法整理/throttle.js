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