## 双向绑定（响应式原理）所涉及到的技术

- Object.defineProperty
- Observer 观察者
- Watcher
- Dep
- Directive 指令

```
var obj = {};
var a;
Object.defineProperty(obj, 'a', {
	get: function() {
		console.log("get val");
		return a;
	},
	set: function (newVal) {
		console.log('set val:' + newVal);
		a = newVal;
	}
});
obj.a; 					// get val 			<span>{{ a }}</span>
obj.a = 'abc';	// set val: abc	<input v-model="a" />
```
