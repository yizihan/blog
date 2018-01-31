'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
let UserService = class UserService {
	constructor() {}
	get(id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('From UserService' + id);
			}, 1000);
		});
	}
};
exports.default = UserService;