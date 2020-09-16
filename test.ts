const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");
const player = require("play-sound")((opts = {}));
const vorpal = require("vorpal")();

// Content of created files
const contentController = require("./content/src/controllers/controllerFile");
const contentIndex = require("./content/src/indexFile");
const contentMiddleware = require("./content/src/middlewares/middlewareFile");
const contentModel = require("./content/src/models/modelFile");
const contentRoute = require("./content/src/routes/routeFile");

// "Global" variables
let modelsList = [];
let collectionsList = [];
let appName = "";

// Delay
const delayF = (duration) => {
	return new Promise((resolve) => setTimeout(resolve, duration));
};

// Sounds
const ammo = () => {
	player.play("./sounds/9mmclip1.wav", function (err) {
		if (err) throw err;
	});
};
const armor = () => {
	player.play("./sounds/ammopickup2.wav", function (err) {
		if (err) throw err;
	});
};
const wep = () => {
	player.play("./sounds/gunpickup2.wav", function (err) {
		if (err) throw err;
	});
};

// BASE
vorpal
	.command("qb")
	.help(function () {
		console.log(
			`This command will begin the creation of a backend.
You will be asked to name your backend in order to complete the process.
If the name you've chosen is unique in the directory or a folder with the same name exists but is empty, it will be a success.
Otherwise, the backend will not be created so that it doesn't interfere with the existing directory of the same name.`
		);
	})

	.action(function (_, callback) {
		this.prompt([
			{
				type: "input",
				name: "appName",
				message: `Name of your backend:

> `,
			},
		]).then((result) => {
			const directoryPath = path.join(result.appName);
			const BackendCreation = (result) => {
				fs.mkdir(
					__dirname + "/" + result.appName + "/src",
					{ recursive: true },
					(err) => {
						if (err) throw err;

						const Begin = () => {
							console.log("Backend creation initiated...");
						};

						const Controllers = () =>
							fs.mkdir(
								__dirname +
									"/" +
									result.appName +
									"/src/controllers",
								{ recursive: true },
								(err) => {
									if (err) throw err;
									else
										console.log(
											chalk.green(
												"Successfully created "
											) +
												chalk.hex("#FFC700")(
													result.appName +
														"/src/controllers/"
												)
										);
								}
							);
						const Middlewares = () =>
							fs.mkdir(
								__dirname +
									"/" +
									result.appName +
									"/src/middlewares",
								{ recursive: true },
								(err) => {
									if (err) throw err;
									else
										console.log(
											chalk.green(
												"Successfully created "
											) +
												chalk.hex("#FFC700")(
													result.appName +
														"/src/middlewares/"
												)
										);
									fs.writeFile(
										result.appName +
											"/src/middlewares/yourMiddleware.js",
										contentMiddleware,
										(err) => {
											if (err) throw err;
										}
									);
								}
							);
						const Models = () =>
							fs.mkdir(
								__dirname +
									"/" +
									result.appName +
									"/src/models",
								{ recursive: true },
								(err) => {
									if (err) throw err;
									else {
										console.log(
											chalk.green(
												"Successfully created "
											) +
												chalk.hex("#FFC700")(
													result.appName +
														"/src/models/"
												)
										);
									}
								}
							);
						const Routes = () =>
							fs.mkdir(
								__dirname +
									"/" +
									result.appName +
									"/src/routes",
								{ recursive: true },
								(err) => {
									if (err) throw err;
									else
										console.log(
											chalk.green(
												"Successfully created "
											) +
												chalk.hex("#FFC700")(
													result.appName +
														"/src/routes/"
												)
										);
								}
							);
						const Index = () =>
							fs.writeFile(
								result.appName + "/src/index.js",
								contentIndex(result.appName),
								(err) => {
									if (err) throw err;
									else
										console.log(
											chalk.green(
												"Successfully created "
											) +
												chalk.hex("#FFC700")(
													result.appName +
														"/src/index.js"
												)
										);
								}
							);
						const End = () => {
							appName = result.appName;
							console.log(
								chalk.green(
									"\nBackend structure creation complete !"
								)
							);
							console.log(
								"\nEnter " +
									chalk.hex("#0099AA")("qb-mdl") +
									" to add your models."
							);
						};

						async function delayedLog(item) {
							await delayF(50);
							item();
						}
						async function processArray(array) {
							for (const item of array) {
								await delayedLog(item);
							}
						}

						processArray([
							Begin,
							Controllers,
							Middlewares,
							Models,
							Routes,
							Index,
							End,
						]);
					}
				);
			};

			if (result.appName !== "") {
				fs.readdir(directoryPath, function (err, files) {
					if (err) {
						BackendCreation(result);
						callback();
					} else {
						fs.readdir(directoryPath, function (err, files) {
							if (files[0] === undefined) {
								BackendCreation(result);
							} else {
								console.log(
									"\n" +
										chalk.cyan(result.appName) +
										" already contains the following files:"
								);
								files.forEach(function (file) {
									console.log("  " + file);
								});
								console.log(
									"\nYou must choose a different name or delete the content inside of " +
										chalk.cyan(result.appName) +
										".\n"
								);
							}
						});
					}
				});
			}
		});
	})
	.cancel(function () {
		console.log(
			chalk.yellow("An error has occured, exit the node and try again.")
		);
	});

// MODELS
vorpal
	.command("qb-mdl")
	.help(function () {
		console.log(
			`This command will begin the creation of the models of an existing 'qb' backend.
You will be asked to choose an existing backend. If the chosen existing backend exists and was created with the 'qb' command, it will be a success.
Otherwise, the models creation will fail.
It will not work with a backend modeled differently from qb's, especially regarding 'index.js'.
It is very highly advised to use 'qb-mdl' for a 'qb' backend only.
If the backend is valid, you will be asked to name your models and confirm their creation.
You will then be asked to create the keys of the models.
First letter uppercase pluralizing will be automatically applied throughout the process when necessary.`
		);
	})
	.action(function (_, callback) {
		let modelArr = [];
		let confirmedModelsArr = [];
		const backendName = appName;

		function upperFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		function lowerFirstLetter(string) {
			return string.charAt(0).toLowerCase() + string.slice(1);
		}

		const modelCreation = (backendName) => {
			// Does the backend exist ?

			if (fs.existsSync(backendName + "/src/models/")) {
				(async () => {
					const modelListing = await this.prompt([
						{
							type: "input",
							name: "modelNames",
							message:
								`
Type in the name of your models for '` +
								chalk.cyan(backendName) +
								`' and separate each model with a space.
Example:` +
								chalk.grey(`
> user category movie`) +
								`

> `,
						},
					]).then((result2) => {
						(async () => {
							// Model creation
							modelArr = result2.modelNames.split(" ");

							const confirmModels = async (model) => {
								const item = lowerFirstLetter(model);
								const ucItem = upperFirstLetter(item);
								await this.prompt([
									{
										type: "confirm",
										name: "modelNames",
										message:
											"Confirm the creation of " +
											ucItem +
											".js ?",
									},
								]).then((modelResult) => {
									// Confirm the models
									if (modelResult.modelNames === true) {
										confirmedModelsArr.push(item);
										console.log(
											chalk.green("Confirmed ") +
												"creation of " +
												chalk.hex("#FFC700")(
													ucItem + ".js"
												) +
												"\n"
										);
										wep();
									} else if (
										modelResult.modelNames === false
									) {
										// Cancel the models
										console.log(
											"Cancelled creation of " +
												chalk.hex("#FFC700")(
													ucItem + ".js"
												) +
												"\n"
										);
									} else {
										throw "An unexpected error occurred";
									}
								});
							};
							async function delayedModelLog(item) {
								if (item !== "") {
									await delayF(50);
									await confirmModels(item);
								}
							}
							async function processModels(array) {
								for (const item of array) {
									await delayedModelLog(item);
								}
								await processKeys(confirmedModelsArr);
							}
							await processModels(modelArr);
						})();
					});
				})();
			} else {
				console.log(
					chalk.red(
						'Error: Input "' +
							backendName +
							`" did not match any folder name in the current directory, 
or "/src/models/" doesn't exist in "` +
							backendName +
							`".`
					) +
						chalk.yellow(
							`
Make sure you've executed the ` +
								chalk.hex("#0099AA")("qb") +
								` command and created a backend directory,
before executing the ` +
								chalk.hex("#0099AA")("qb-mdl") +
								` command.
Make sure you execute the ` +
								chalk.hex("#0099AA")("qb-mdl") +
								` command in the directory preceding your
chosen backend directory.`
						) +
						"\nContent of current directory:\n"
				);
				const directoryPath = path.join(__dirname);
				fs.readdir(directoryPath, function (err, files) {
					if (err) {
						return console.log("Can't scan directory: " + err);
					} else {
						files.forEach(function (file) {
							console.log("  " + file);
						});
						console.log("\n");
						callback();
					}
				});
			}
		};

		if (backendName !== "") {
			modelCreation(backendName);
		} else {
			this.prompt([
				{
					type: "input",
					name: "backendName",
					message: `
Type in the name of the backend:
			
> `,
				},
			]).then((result) => {
				modelCreation(result.backendName);
			});
		}

		const keys = async (item) => {
			const ucItem = upperFirstLetter(item);
			const plurItem = pluralize(item, 0);

			await this.prompt([
				{
					type: "input",
					name: "keyNames",
					message:
						`
________________________________________

Type in the name of the keys for ` +
						chalk.hex("#FFC700")(ucItem + ".js") +
						`, followed by their type and
separate each key with a space.
Typing a key without a type will give it the string type by default.
Example:` +
						chalk.grey(`
> username:string age:number`) +
						`

> `,
				},
			]).then((keys) => {
				const keyArr = keys.keyNames.split(" ");
				let newKeyArr = [];
				let keyStr = "";
				let typelessArr = [];
				let typelessStr = "";

				const insert = (main_string, ins_string, pos) => {
					const result =
						main_string.slice(0, pos) +
						ins_string +
						main_string.slice(pos);
					return result;
				};

				async function addDefaultString(array) {
					for (const item of array) {
						if (item !== "") {
							let typePos = item.search(":");
							if (typePos === -1) {
								newKeyArr.push(item + ":String");
							} else {
								newKeyArr.push(item);
							}
						}
					}
				}
				addDefaultString(keyArr);

				async function buildKeyStrModel(array) {
					for (const item of array) {
						if (item !== "") {
							let typePos = item.search(":");

							let item2 = item.split("");

							item2.splice(
								typePos + 1,
								1,
								item[typePos + 1].toUpperCase()
							);

							let jointItem = item2.join("");

							let newItem = insert(
								jointItem,
								" { type: ",
								typePos + 1
							);

							keyStr = keyStr + "\n	" + newItem + " },";
						}
					}
				}
				buildKeyStrModel(newKeyArr);

				async function buildKeyStrController(array) {
					for (const item of array) {
						typelessArr = [];
						let removeType = item.split(":");

						removeType.pop();

						typelessArr.push(removeType[0]);

						typelessStr =
							typelessStr + "\n				" + typelessArr[0] + ': "?",';
					}
				}
				buildKeyStrController(newKeyArr);

				const CreateController = () => {
					const first = () => {
						fs.writeFile(
							backendName +
								"/src/controllers/" +
								plurItem +
								".js",
							contentController(item, ucItem, plurItem),
							(err) => {
								if (err) {
									console.log(
										chalk.yellow(
											"An error has occured. It is likely due to the designated directory being incompatible with " +
												chalk.cyan("qb-mdl") +
												"." +
												chalk.yellow(
													"\nCreate a backend with the "
												) +
												chalk.cyan("qb") +
												" command and then use the " +
												chalk.cyan("qb-mdl") +
												" command.\n"
										)
									);
									throw err;
								} else {
									second();
								}
							}
						);
					};

					const second = () => {
						const fileContents = fs
							.readFileSync(
								backendName +
									"/src/controllers/" +
									plurItem +
									".js"
							)
							.toString();
						const keysLine = fileContents.search("// Keys");
						const newContent = insert(
							contentController(item, ucItem, plurItem),
							typelessStr,
							keysLine + 7
						);
						fs.writeFile(
							backendName +
								"/src/controllers/" +
								plurItem +
								".js",
							newContent,
							(err) => {
								if (err) {
									console.log(
										chalk.yellow(
											"An error has occured. It is likely due to the designated directory being incompatible with " +
												chalk.cyan("qb-mdl") +
												"." +
												chalk.yellow(
													"\nCreate a backend with the "
												) +
												chalk.cyan("qb") +
												" command and then use the " +
												chalk.cyan("qb-mdl") +
												" command.\n"
										)
									);
									throw err;
								} else {
									console.log(
										chalk.green("Successfully created ") +
											chalk.grey(
												backendName +
													"/src/controllers/"
											) +
											chalk.hex("#FFC700")(
												plurItem + ".js"
											)
									);
									ammo();
								}
							}
						);
					};

					first();
				};
				const CreateModel = () => {
					const first = () => {
						fs.writeFile(
							backendName + "/src/models/" + ucItem + ".js",
							contentModel(ucItem),
							(err) => {
								if (err) {
									console.log(
										chalk.yellow(
											"An error has occured. It is likely due to the designated directory being incompatible with " +
												chalk.cyan("qb-mdl") +
												"." +
												chalk.yellow(
													"\nCreate a backend with the "
												) +
												chalk.cyan("qb") +
												" command and then use the " +
												chalk.cyan("qb-mdl") +
												" command.\n"
										)
									);
									throw err;
								} else {
									second();
								}
							}
						);
					};

					const second = () => {
						const fileContents = fs
							.readFileSync(
								backendName + "/src/models/" + ucItem + ".js"
							)
							.toString();
						const keysLine = fileContents.search(", {");
						const newContent = insert(
							contentModel(ucItem),
							keyStr,
							keysLine + 3
						);
						fs.writeFile(
							backendName + "/src/models/" + ucItem + ".js",
							newContent,
							(err) => {
								if (err) {
									console.log(
										chalk.yellow(
											"An error has occured. It is likely due to the designated directory being incompatible with " +
												chalk.cyan("qb-mdl") +
												"." +
												chalk.yellow(
													"\nCreate a backend with the "
												) +
												chalk.cyan("qb") +
												" command and then use the " +
												chalk.cyan("qb-mdl") +
												" command.\n"
										)
									);
									throw err;
								} else {
									console.log(
										chalk.green("Successfully created ") +
											chalk.grey(
												backendName + "/src/models/"
											) +
											chalk.hex("#FFC700")(ucItem + ".js")
									);
								}
							}
						);
					};

					first();
				};
				const CreateRoute = () => {
					fs.writeFile(
						backendName + "/src/routes/" + plurItem + "Route.js",
						contentRoute(plurItem),
						(err) => {
							if (err) throw err;
							else
								console.log(
									chalk.green("Successfully created ") +
										chalk.grey(
											backendName + "/src/routes/"
										) +
										chalk.hex("#FFC700")(
											plurItem + "Route.js"
										) +
										"\n"
								);
						}
					);
				};
				const UpdateIndex = () => {
					const currentIndex = fs
						.readFileSync(backendName + "/src/index.js")
						.toString();
					const modelExists = currentIndex.search(
						'("./models/' + ucItem + '.js")'
					);
					const routeExists = currentIndex.search(
						'("./routes/' + plurItem + 'Route.js")'
					);
					const useRouteExists = currentIndex.search(
						"(" + plurItem + "Route)"
					);

					const modelAddition = async () => {
						const fileContents = fs
							.readFileSync(backendName + "/src/index.js")
							.toString();
						const modelsLine = fileContents.search("// MODELS");
						const newContent = insert(
							fileContents,
							'\nrequire("./models/' + ucItem + '.js");',
							modelsLine + 9
						);
						if (modelExists === -1) {
							fs.writeFile(
								backendName + "/src/index.js",
								newContent,
								(err) => {
									if (err) throw err;
								}
							);
							await delayF(50);
						}
						routeAddition(newContent);
					};
					const routeAddition = async (updatedContent) => {
						const routesLine = updatedContent.search("// ROUTES");
						const newContent = insert(
							updatedContent,
							"\nconst " +
								plurItem +
								'Route = require("./routes/' +
								plurItem +
								'Route.js");',
							routesLine + 9
						);
						if (routeExists === -1) {
							fs.writeFile(
								backendName + "/src/index.js",
								newContent,
								(err) => {
									if (err) throw err;
								}
							);
							await delayF(50);
						}
						useRouteAddition(newContent);
					};
					const useRouteAddition = (updatedContent) => {
						const useRoutesLine = updatedContent.search(
							"// USE ROUTES"
						);
						const newContent = insert(
							updatedContent,
							"\napp.use(" + plurItem + "Route);",
							useRoutesLine + 13
						);
						if (useRouteExists === -1) {
							fs.writeFile(
								backendName + "/src/index.js",
								newContent,
								(err) => {
									if (err) throw err;
								}
							);
						}
					};

					modelAddition();
				};

				async function delayedLog(item) {
					await delayF(10);
					await item();
				}
				async function processArray(array) {
					for (const item of array) {
						await delayedLog(item);
					}
				}

				processArray([
					CreateController,
					CreateModel,
					CreateRoute,
					UpdateIndex,
				]);
			});
		};

		async function delayedKeysLog(item) {
			await delayF(200);
			await keys(item);
		}
		async function delayedEnd() {
			await delayF(250);
			console.log(chalk.green("\nModel creation process complete !\n"));
			armor();
		}
		async function processKeys(array) {
			for (const item of array) {
				await delayedKeysLog(item);
			}
			await delayedEnd();
		}
	})
	.cancel(function () {
		console.log(
			chalk.yellow("An error has occured, exit the node and try again.")
		);
	});

vorpal.delimiter(">").show();
