## 安装插件
```bash
npm install --save-dev webpack webpack-dev-server babel-core babel-loader babel-preset-env babel-plugin-transform-runtime
```
## Run
```
npm run start
```

## 作用域
### let
```
if (true) {							// 大括号内部属于块级作用域
	let fruit = 'apple'		// 块级作用域内声明，外部访问不到
}
console.log(fruit)			// ReferenceError: fruit is not defined
```


### const-variable
```
const fruit = 'apple'
console.log(fruit)
const fruit = 'banana'	// Duplicate declaration "fruit"	重复定义
```

### const-object/array
```
const fruit = []
fruit.push('apple')		// const限制给恒量分配值这个动作，它并不限制恒量里面的值
fruit = {}							//  "fruit" is read-only
```

## 解构
### 解构数组 - Array Destructuring
```
function breakfast() {
	return ['milk', 'apple']
}
let [drink, eat] = breakfast()	// let声明的同时解构数组并赋值
console.log(drink, eat)				// milk apple
```

### 解构对象 - Object Destructuring
```
function breakfast () {
	return {drink: 'milk', eat: 'apple'}
}
let {drink: drinking, eat: eating} = breakfast()
// 第一个值是对象中的属性，第二个值是声明的变量
console.log(drinking, eating)		// milk apple
```

## 字符串模板
### 模板字符串 - Template Strings
```
let drink = 'milk',
		eat = 'apple'
let breakfast = `Today breakfast is ${drink} and ${eat}`
console.log(breakfast)						// Today breakfast is milk and apple
```

## 判断字符串包含的内容
```
let drink = 'milk',
		eat = 'apple'
let breakfast = `Today breakfast is ${drink} and ${eat} !`
console.log(breakfast.startsWith('Today'))	// true
console.log(breakfast.endsWith('!'))				// true
console.log(breakfast.includes('and'))			// true
```

## 函数
### 默认参数 - Default Parameter Values
```
function breakfast (drink='milk', eat='apple') {
	return `${drink} ${eat}`
}
console.log(breakfast())				// milk apple
```

### 展开操作符 - Spreat(...)
```
let fruit = ['apple', 'banana'],
		foods = ['bread', ...fruit]
console.log(fruit)			// ["apple", "banana"]
console.log(...fruit)		// apple banana		// 将数组元素单独展开
console.log(foods)			// ["bread", "apple", "banana"]
```

### 剩余操作符 - Rest(...)
```
function breakfast(drink, eat, ...fruit) {			// ...fruit将接受多余的参数
	console.log(drink, eat, fruit)
}
breakfast('milk', 'bread', 'apple', 'banana')	// milk bread (2) ["apple", "banana"]
```

### 解构参数 - Destructuring Parameters
```
function breakfast(drink, eat, {time, location} = {}) {
	console.log(drink, eat, time, location)
}
breakfast('milk', 'bread', {time: '9', location: 'china'})	// milk bread 9 china
```

### 箭头函数 - Arrow Function 
```
let breakfast = (drink, eat) => {
	drink + eat
}
==== Compiled ====
var breakfast = function breakfast(drink, eat) {
	return drink + eat;
}
```

### 对象
### 把对象的值复制到另一个对象里 - Object.assign()
```
let breakfast = {}
Object.assign(
	breakfast,
	{drink: 'milk'},
	{drink: 'tea'}						// 同属姓名会覆盖
)
console.log(breakfast)			// {drink: "tea"}
```

### 设置对象的prototype - setPrototypeOf()
```
let breakfast = {
	getDrink() {
		return 'tea'
	}
}
let dinner = {
	getDrink() {
		return 'beer'
	}
}
let sunday = Object.create(breakfast)
console.log(sunday.getDrink()) 					// tea
console.log(Object.getPrototypeOf(sunday) === breakfast)	// true
Object.setPrototypeOf(sunday, dinner)		// 更改Prototype
console.log(sunday.getDrink())					// beer
```

### super
```
let breakfast = {
	getDrink () {
		return 'milk'
	}
}
let sunday = {
	__proto__: breakfast,									// __protot__设置继承关系
	getDrink () {
		return super.getDrink() + ' tea'		// super引用父类
	}
}
console.log(sunday.getDrink())
```

## 生成器与迭代器
### 生成器
```
function * chef() {
	yield 'tomato',
	yield 'egg'
}
let person = chef()
console.log(person.next())	// {value: "tomato", done: false}
console.log(person.next())	// {value: "egg", done: false}
console.log(person.next())	// {value: undefined, done: true}
```

传参方式
```
let chef = function* (foods) {
	for (var i = foods.length - 1; i >= 0; i--) {
		yield foods[i]
	}
}
let person = chef(['tomato', 'egg'])
console.log(person.next())	// {value: "tomato", done: false}
console.log(person.next())	// {value: "egg", done: false}
console.log(person.next())	// {value: undefined, done: true}
```

### 迭代器
```
// 自定义迭代器
function chef(foods) {
	let i = 0;
	return {
		next () {
			let done = (i >= foods.length);  					// 当foods有值时为false
			let value = !done ? foods[i++] :undefined	// 当foods有值时，依次遍历输出值
			return {
				value: value,
				done: done
			}
		}
	}
}
let person = chef(['tomato', 'egg'])
console.log(person.next())	// {value: "tomato", done: false}
console.log(person.next())	// {value: "egg", done: false}
console.log(person.next())	// {value: undefined, done: true}
```

## 类 - Class
### 类
```
class Chef {
	constructor (food) {		// 构造器，实例化时接收的参数
		this.food = food
	}
	cook () {
		console.log(this.food)
	}
}
let person = new Chef('tomato')
person.cook()							// tomato
```

### set与get
```
class Chef {
	constructor(food) {
		this.food = food
		this.dish = []
	}
	get menu() {
		return this.dish
	}
	set menu(dish) {
		this.dish.push(dish)
	}
}
let person = new Chef()
console.log(person.menu = 'tomato')	// tomato
console.log(person.menu = 'egg')		// egg
console.log(person.menu)						// ["tomato", "egg"]
```

### 静态方法 - Static
```
class Chef {
	static cook (food) {			// 设置成静态方法
		console.log(food)
	}
}
Chef.cook('egg')			// egg	静态方法可以不用实例化，直接调用
```

### 继承
```
class Person {
	constructor (name, birthday) {
		this.name = name
		this.birthday = birthday
	}
	intro () {
		return `${this.name} ${this.birthday}`
	}
}

class Chef extends Person {
	constructor (name, birthday) {
		super(name, birthday)					// 子类的constructor中必须要有super接收父类的参数
	}
}

let one = new Chef('one', '2018')	// 实例化并传参
console.log(one.intro())					// 子类调用父类的方法
```

## 模块
### Modules
```
// chef.js
const drink = 'milk'
const eat = 'bread'
export {drink, eat} 								// 导出
```
```
// scripts.js
import {drink, eat} from './chef'	// 导入
console.log(drink, eat)
```