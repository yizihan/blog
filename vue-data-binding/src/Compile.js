function Compile(node, vm) {	// node => id节点   vm => this实例
	if (node) {
		this.$frag = this.nodeToFragment(node, vm);
		return this.$frag;
	}
}

Compile.prototype = {
	nodeToFragment: function (node, vm) {
		var self = this;		// 缓存this
		var frag = document.createDocumentFragment();
		var child;

		while(child = node.firstChild) {	// 循环 尾递归
			// 当前元素的子节点
			self.compileElement(child, vm);
			frag.append(child);			// 将所有子节点添加到fragment中
		}
		return frag;
	},
	compileElement: function (node, vm) {
		var reg = /\{\{(.*)\}\}/;		// 找到所有的 {{ }}

		// 节点类型为元素
		if(node.nodeType === 1) {
			var attr = node.attributes;	// 找到所有绑定在节点上的属性
			// 解析属性
			for(var i = 0; i < attr.length; i++) {
				if (attr[i].nodeName == 'v-model') {
					var name = attr[i].nodeValue;		// 获取v-model绑定的属性名
					// 监听input输入事件
					node.addEventListener('input', function(e) {
						// 给相应的data属性赋值，进而触发该属性的set方法 => Dep.notify() => Watcher.update()
						vm[name] = e.target.value;
					});
					// node.value = vm[name];		// 将data的值赋给该node
					new Watcher(vm, node, name, 'value');
				}
			}
		}
		// 节点类型为text
		if(node.nodeType === 3) {
			if(reg.test(node.nodeValue)) {
				var name = RegExp.$1;			// 获取匹配到的字符串
				name = name.trim();
				// node.value = vm[name];		// 将data的值赋给该node
				new Watcher(vm, node, name, 'nodeValue');
			}
		}
	}
}