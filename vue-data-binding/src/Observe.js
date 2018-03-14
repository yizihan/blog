function observe (obj, vm) {	// obj => data   vm => this(实例)此时的this也包含data数据
	// 普通遍历obj，得到所有key和value(obj[key])
	Object.keys(obj).forEach(function(key) {	// key => data的每个属性
		defineReactive(vm, key, obj[key]);			// obj[key] => data对应的每个属性值
	})
}

function defineReactive(obj, key, val) {		// obj => this(包含data)
	var dep = new Dep();			// new出的实例包含一个数组和两个方法
	Object.defineProperty(obj, key, {
		get: function () {
			// 添加订阅者watcher到主题对象Dep
			if(Dep.target) {
				// JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function (newVal) {
			if(newVal === val) return;
			// 从input输入的新值
			val = newVal;
			// 作为发布者发出通知
			dep.notify();
		}
	})
}