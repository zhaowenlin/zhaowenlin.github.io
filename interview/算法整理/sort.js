// 冒泡排序 时间复制度o(n2)
// 从0~n-1开始，相邻两个值相比较，右边比边小就交换位置,范围缩小到0~n-2,依次执行，直到范围缩小为0
function bubble(data) {
    var temp = null;
    if (data.length) {
        for(var i=0; i< data.length ;i++) {
            for(var j=0; j< data.length-i-1 ;j++) {
                if (data[j] > data[j+1]) {
                    
                    temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
        return data;
    }
}
console.log("冒泡排序：",bubble([0,3,4,2,7,5,1]));

// 选择排序 时间复杂度为o(n2)
// 从0~n-1开始遍历，找到最小值的放在0的位置上，缩小查找范围为1~n-1依次下去
function changeSort(data) {
    var temp = null;
    for (let i = 0; i < data.length; i++) {
        tempIndex = i;
        for (let j=i; j< data.length ;j++) {
            if (data[j] < data[tempIndex]) {
                tempIndex = j
            }
            
        }
        if (tempIndex != i) {
            temp = data[i]
            data[i] = data[tempIndex];
            data[tempIndex] = temp; 
        }
        
    }
    
    return data
}
console.log("选择排序:",changeSort([0,3,4,2,7,5,1]));
// 插入排序 时间复杂度为o(n2)
// 位置1上的数和位置0上的数比较，如果小则和位置0上的数交换；位置2上的数字和位置1上的数字比较，如果小就和位置1交换，再和位置0上比较，如果小就交换；依次类推
function insertSort(data) {
    
    for (let i = 1; i < data.length; i++) {
        var temp = data[i];
        var j = i -1
        while (j >= 0 && temp<data[j]) {
            data[j + 1] = data[j];
            j--;
        }
        data[j + 1] = temp;
        
    }
    return data
}
console.log("插入排序:",insertSort([0,3,4,2,7,5,1]));


// 归并排序
// 让数组中的元素单独成为长度为1的有序区间；然后把相邻为1的两个数进行排序后合并成长度为2的有序区间，以此内推，直到将所有数合并到有个有序区间
function mergeSort(arr){
    // 设置终止的条件，
    if (arr.length < 2) {
      return arr;
    }
    //设立中间值
    var middle = parseInt(arr.length / 2);
    //第1个和middle个之间为左子列
    var left = arr.slice(0, middle);
    //第middle+1到最后为右子列
    var right = arr.slice(middle);
    if(left=="undefined"&&right=="undefined"){
       return false;
    }
    return merge(mergeSort(left), mergeSort(right));
  }
  
  function merge(left, right){
    var result = [];
  
    while (left.length && right.length) {
      if(left[0] <= right[0]){
        //把left的左子树推出一个，然后push进result数组里
         result.push(left.shift());
      }else{
        //把right的右子树推出一个，然后push进result数组里
       result.push(right.shift());
      }
    }
    //经过上面一次循环，只能左子列或右子列一个不为空，或者都为空
    while (left.length){
      result.push(left.shift());
    } 
    while (right.length){
      result.push(right.shift());
    }
    return result;
  }
  // 测试数据
  var nums=[6,10,1,9,4,8,2,7,3,5];
  console.log("归并排序：",mergeSort(nums));

  // 快速排序
  // 随机选取一个数q，然后遍历数组，如果大于这个数的放在左边，小于这个数的放在右边，然后依次递归执行同样的操作
  function quickSort(arr) {

    if(arr.length<=1) {
        return arr;
    }

    let leftArr = [];
    let rightArr = [];
    let q = arr[0];
    for(let i = 1,l=arr.length; i<l; i++) {
        if(arr[i]>q) {
            rightArr.push(arr[i]);
        }else{
            leftArr.push(arr[i]);
        }
    }

    return [].concat(quickSort(leftArr),[q],quickSort(rightArr));
}