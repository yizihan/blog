class UserService {
	constructor () {

	}
	get(id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('From UserService' + id)
			}, 1000)
		});
	}
}

export default UserService;