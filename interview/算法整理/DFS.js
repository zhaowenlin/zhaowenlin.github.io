// 实现一个深度优先搜索算法（非递归）
	
function dfs(tree, name){
	// 请在这里实现
	
	if (!tree || (tree.children && !tree.children.length)) return;

	var nodeList = []

	nodeList = nodeList.concat(tree);
	var currentNode = null;


	while(nodeList.length > 0) {
		currentNode = nodeList.pop();
		if (currentNode.name !== name) {
			nodeList = nodeList.concat(currentNode.children || []);
		} else {
			break;
		}
	}

	return currentNode

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
					name : '嘉兴市',
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