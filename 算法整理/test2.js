function uniqueInOrder(data) {
	if (!typeof data === "string" && !data instanceof Array) {
		return;
	}

	var result = [];
	for (var i = 0; i < data.length; i++) {
		result.push(data[i]);
		if (i && data[i] === data[i - 1]) {
			result.pop();
		}

	}

	return result;
}
console.log(uniqueInOrder('AAAABBBCCDAABBB'), "======")
console.log(uniqueInOrder('ABBCcAD'), "-------");
console.log(uniqueInOrder([1, 2, 2, 3, 3]), "******")