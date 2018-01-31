function htmlAfterWebpackPlugin(options) {
	this.options = options;
}

function assetsHelp (arrs) {
	// arrs结构
	// arrs = {
	// 	js: ['...'],
	// 	css: ['...'] 
	// }
	let cssarr = [], jsarr = [];
	const adddir = {
		js: item => `<script src="${item}"></script>`,
		css: item => `<link rel="stylesheet" href="${item}" />`,
	}
	for (let jsitem of arrs.js) {
		// 遍历arr.js数组，给每个项添加包裹标签，再放入到jsarr数组
		jsarr.push(adddir.js(jsitem));
	}
	for (let cssitem of arrs.css) {
		cssarr.push(adddir.css(cssitem));
	}
	return {
		cssarr, jsarr
	}
}

htmlAfterWebpackPlugin.prototype.apply = function (complier) {
	// console.log(complier);
	complier.plugin('compilation', function(compilation) {
		// console.log(compilation);
		compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
			// console.log(htmlPluginData)
			let _html = htmlPluginData.html;	// 读取到pages/index.html文本内容
			const result = assetsHelp(htmlPluginData.assets);
			// console.log(result);
			// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
			// {
			//   css: ['<link rel="stylesheet" href="/styles/users-index-e1911.css" />'],
			//   js: ['<script src="/scripts/vendor-e1911.bundle.js"></script>',
			//     '<script src="/scripts/users-index-e1911.bundle.js"></script>']
			// }
			// console.log(_html);
			_html = _html.replace("<!--injectcss-->", result.cssarr.join(""));
			_html = _html.replace("<!--injectscript-->", result.jsarr.join(""));
			// /users/index.html里处理后的内容
			// {% block styles %}
			// 	<link rel="stylesheet" href="/styles/users-index-76f98.css" />
			// 	<!-- 上面要引入css替换的文本 -->
			// {% endblock %}
			
			// 处理后的css放回去
			htmlPluginData.html = _html;
			callback(null, htmlPluginData);
		})
	})
}

module.exports = htmlAfterWebpackPlugin;