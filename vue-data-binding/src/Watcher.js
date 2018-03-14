function Watcher (vm, node, name, type) {
	Dep.target = this;
	this.name = name;
	this.node = node; 
	this.vm = vm;
	this.type = type;
	this.update();
	Dep.target = null;
}
Watcher.prototype = {
	update: function () {
		this.get();
		this.node[this.type] = this.value;	// 更新View
		// 订阅者执行相应操作
	},
	get: function () {
		// 调用this.value的同时，会调用Ojbect.defineProperty.get()，同时将Dep.target添加到dep
		this.value = this.vm[this.name];
		// 触发相应属性的get
	}
}