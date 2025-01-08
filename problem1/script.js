//Please read the attached README.md for my notes

var sum_to_n_a = function (n) {
	// your code here
	if (n < 0) {
		return (n * (n - 1)) / -2;
	}
	return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
	// your code here
	if (n == 0) {
		return 0;
	}
	if (n < 0) {
		return n + sum_to_n_b(n + 1);
	} else {
		return n + sum_to_n_b(n - 1);
	}
};

var sum_to_n_c = function (n) {
	// your code here
	let adjustNum = n < 0 ? -1 : 1;
	let sum = 0;
	for (let i = 0; i <= Math.abs(n); i++) {
		sum += i * adjustNum;
	}
	return sum;
};
function runAll(n) {
	console.log("By math:");
	console.log(sum_to_n_a(n));
	console.log("By recursion:");
	console.log(sum_to_n_b(n));
	console.log("By loop:");
	console.log(sum_to_n_c(n));
}
