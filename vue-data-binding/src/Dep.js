function Dep () {
	this.subs = [];
}
Dep.prototype = {
	// 添加到依赖
	addSub: function (sub) {
		this.subs.push(sub);
	},
	// 通知更新
	notify: function () {
		// 通知对应的Watcher调用update()
		this.subs.forEach(sub => sub.update());
	}
}