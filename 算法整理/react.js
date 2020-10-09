//请回答按钮点击前后，代码中的两个console.log在浏览器控制台的输出信息
//并解释现象背后的原因
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




点击前的执行结果：
结果：console里依次输出2、3、4，DOM里的counter由2变为4；
原因：componentWillMount这个函数只在组件初始化的时候执行，并且在render函数之前只执行一次，此时如果通过setState修改状态值，DOM只更新一次，如果修改的是同一个状态的值则以最后一个状态值为准，
所以DOM第一次渲染出来的count是2，随后timer的执行也会引发状态值得改变，此时DOM也只会渲染一次；

点击后的执行结果：
结果：console依次输出《"原生浏览器事件"->5->6>"React事件"->8》，DOM的count值由4变为8
原因：componentDidMount这个函数是在组件挂载完成后执行的，此时节点树已经绘制完成并挂载到了DOM上，所以此处使用原生的方式给button绑定了点击事件，事件在捕获或者冒泡在document之前的阶段就可以执行，
但是React并不是将click事件绑在该div的真实DOM上，而是统一代理到document上处理，然后react将事件内容封装并交由指定的事件处理程序处理，所以react点击事件后执行；
原生方式执行setState修改状态值然后渲染DOM，这个过程是同步的，而react事件修改状态值是先将state值放入到队列里，然后再一次执行渲染；






