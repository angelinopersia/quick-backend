// function delayt() {
// 	return new Promise((resolve) => setTimeout(resolve, 150));
// }

// async function delaytedLog(item) {
// 	// notice that we can await a function
// 	// that returns a promise
// 	await delayt();
// 	console.log(item);
// }
// async function processArray(array) {
// 	for (const item of array) {
// 		await delaytedLog(item);
// 	}
// 	console.log("Done!");
// }

// async function delaytedLog2(item) {
// 	// notice that we can await a function
// 	// that returns a promise
// 	await delayt();
// 	console.log(item);
// }
// async function processArray2(array) {
// 	for (const item of array) {
// 		await delaytedLog2(item);
// 	}
// 	console.log("Done!2");
// }

// async function delaytedLog3(item) {
// 	// notice that we can await a function
// 	// that returns a promise
// 	await delayt();
// 	console.log(item);
// }
// async function processArray3(array) {
// 	for (const item of array) {
// 		await delaytedLog3(item);
// 	}
// 	console.log("Done!3");
// }

// async function SerialFlow() {
// 	await processArray([1, 2, 3, 4, 5]);
// 	await processArray2(["a", "b", "c"]);
// }

// SerialFlow();

const insert = (main_string, ins_string, pos) => {
	const result =
		main_string.slice(0, pos) + ins_string + main_string.slice(pos);
	return result;
};
let arr = ["username:string"];
let typePos = arr[0].search(":");
let one = arr[0].split("");

one.splice(typePos + 1, 1, arr[0][typePos + 1].toUpperCase());

let two = one.join("");

let newItem = insert(two, " { type: ", typePos + 1);

console.log(newItem);
