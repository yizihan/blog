import { Component } from '@angular/core';

// 组件原数据装饰器
@Component({	
	// 元数据													
  selector: 'app-root',									
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// 控制器
export class AppComponent {
	// 将要输出在页面上的值
  title = 'app mmm';
}
