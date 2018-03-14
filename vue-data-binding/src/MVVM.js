function Vue (options) {
	// this => new Vue的实例
	// 保证了不同实例之间的数据
	this.data = options.data;		// 每个实例的data=new时传入的data
	// data = {text: 'hello world'}
	var data = this.data;
	// 为data内的"text"添加get()/set()
	observe(data, this);
	var id = options.el;
	// 执行编译
	var dom = new Compile(document.getElementById(id), this);
	document.getElementById(id).appendChild(dom);
}