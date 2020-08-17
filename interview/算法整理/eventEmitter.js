// 编写一个简单的自定义事件处理器
// 1. 具备 on 方法绑定事件
// 2. 具备 off 方法解绑事件

function EventEmitter (target) {




   return {
        handlers:{},

        on: function (name, fn) {
            var me = this;

            if (typeof name !== 'string') {
                return;
            }

            if (!me.handlers[name] && name !== '*') {
                me.handlers[name] = {
                    type: name,
                    data: null,
                    handlerFuns: []
                };
            }




            if (name === '*') {
                // 如果是监听所有事件，则需要把该handler push到所有事件的事件处理程序队列里去
                for (var key in me.handlers) {
                    if (!!key) {
                        me.handlers[key].handlerFuns.push(function () {
                            fn(me.handlers[key])
                        });
                    }
                }
            } else {
                // 否则就只push到当前事件的事件处理程序队列里
                me.handlers[name].handlerFuns.push(function () {
                    fn(me.handlers[name])
                });
            }


        },
        trigger: function(name, data) {
            var me = this;

            
            if (name === "*") {
                // 如果是触发所有事件则需要执行每个事件的下面所有的事件处理程序
                for (var key in me.handlers) {
                    if (!!key) {
                        me.triggerOneEvent(key, data)
                    }
                }
            } else {
                // 否则只执行当前事件下的所有事件处理程序
                me.triggerOneEvent(name, data);
            }

            
        },
        triggerOneEvent: function (name, data) {
            var me = this;
            
            if (typeof name !== 'string') {
                return;
            }

            if(me.handlers[name] && me.handlers[name].handlerFuns &&  me.handlers[name].handlerFuns instanceof Array){
                var handlerFuns = me.handlers[name].handlerFuns;

                for(var i=0, len=handlerFuns.length; i < len; i++){
                   me.handlers[name].data = data;
                   handlerFuns[i]();
                }
            }

        },
        off: function (name) {
            var me = this;
            if (typeof name === 'string' && me.handlers[name]) {
                me.handlers[name].handlerFuns = [];
            }
        }


   };

}
function _getEvtName( name ){
    return 'on' + name.replace(/^on/i,'').toLowerCase();
}


var emitter = EventEmitter({});

emitter.on('foo', function(e){
    console.log('listening foo event 1', e, e.data);
});

emitter.on('foo', function(e){
    console.log('listening foo event 2', e, e.data);
});

emitter.on('bar', function(e){
    console.log('listening bar event', e, e.data);
});

// // 监听全部事件
emitter.on('*', function(e){
    console.log('listening all events');
});

emitter.trigger('foo', {name : 'John'});
emitter.trigger('foo', {name : 'John-1'});
emitter.trigger('bar', {name : 'Sun'});
emitter.trigger('*', {name : 'Sun'});
emitter.off('foo');