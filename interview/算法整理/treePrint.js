// 先序遍历： 根->左->右
// 中序遍历: 左->根->右
// 后序遍历： 左->右->根
function main(node){
    // 记录正在访问的那一层的最右节点，当访问到的节点等于该节点的时候说明该换行了
    var last = node;
    // 寻找下一层最右节点
    var nlast = "";
    var nodelist = [];
    nodelist.push(node);
    while(nodelist.length > 0) {
        var currentNode = nodelist.shift();
        var childList = currentNode.children;
        console.log("name:", currentNode.name);
        if (childList && childList.length) {
            
            nodelist = nodelist.concat(childList || []);
            nlast = childList[childList.length-1];
        }
        if (currentNode === last && nodelist.length) {
            last = nlast;
            console.log("last:",last)
        }
        
    }
    
}
main({
	name : 'node1',
	children : [
		{
			name : 'node2',
			children : [
				{
					name : 'node4'
				}
			]
		},
		{
			name : 'node3',
			children : [
				{
                    name : 'node5',
                    children:[{
                        name: "node7"
                    },{
                        name: "node8"
                    }]
                },
                {
					name : 'node6'
				}
			]
		}
	]
})