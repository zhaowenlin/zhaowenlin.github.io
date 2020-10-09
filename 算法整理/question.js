<div id="container" style="border:1px solid red; position: absolute; width:100px; height: 100px">something</div>
 <script>
 // 请用原生 JS 实现 DOM 拖动效果，尽量多考虑兼容以及其他可能的情况
 // 请在这里编码，如果需要调试可以复制代码出去调试
 // code here








// throttle的简单实现

function throttle(func, duration) {
		// 在这里编写具体实现
}

window.addEventListener('scroll', throttle(func, 50), false);





// 实现一个深度优先搜索算法（非递归）
	
function dfs(tree, name){
	// 请在这里实现
}

var tree = {
	name : '中国',
	children : [
		{
			name : '北京',
			children : [
				{
					name : '朝阳群众'
				},
				{
					name : '海淀区'
				},
                {
					name : '昌平区'
				}
			]
		},
		{
			name : '浙江省',
			children : [
				{
					name : '杭州市',
					code : 0571,
				},
				{
					name : '嘉兴市'
				},
				{
					name : '绍兴市'
				},
				{
					name : '宁波市'
				}
			]
		}
	]
};

var node = dfs(tree, '杭州市');
console.log(node);    // { name: '杭州市', code: 0571 }





请回答按钮点击前后，代码中的两个console.log在浏览器控制台的输出信息
并解释现象背后的原因
let count = 0;

class MyComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      count : count
    };
  }
  
  componentWillMount(){
    this.setState({
      count : ++count
    });
    
    this.setState({
      count : ++count
    });
    
    setTimeout(() => {
      this.setState({
        count : ++count
      });

      this.setState({
        count : ++count
      });
    }, 1000);
  }
  
  componentDidMount(){
    this.button.addEventListener('click', this.onClick.bind(this, '原生浏览器事件'), false);
  }
  
  onClick(info) {
    console.log(info);
    
    this.setState({
      count : ++count
    });
    
    this.setState({
      count : ++count
    });
  }
  
  render() {
    console.log(this.state.count);
    return (
      <div>
        <button type="button" ref={node => this.button = node} onClick={this.onClick.bind(this, 'React事件')}>生成新计数</button>
        <div>Count : {this.state.count}</div>
      </div>
    );
  }
}

ReactDOM.render(<MyComponent />, mountNode);






// 编写一个简单的自定义事件处理器
// 1. 具备 on 方法绑定事件
// 2. 具备 off 方法解绑事件

function EventEmitter () {
	// TODO

}

var emitter = EventEmitter();

emitter.on('foo', function(e){
	console.log('listening foo event 1', e);
});

emitter.on('foo', function(e){
	console.log('listening foo event 2', e);
});

emitter.on('bar', function(e){
	console.log('listening bar event', e);
});

// 监听全部事件
emitter.on('*', function(e){
	console.log('listening all events');
});

emitter.trigger('foo', {name : 'John'});
emitter.trigger('bar', {name : 'Sun'});
emitter.trigger('*', {name : 'Sun'});
emitter.off('foo');