import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

	pageTitle = ''
	pageDesc = ''

  constructor(public router: Router) {
  	// 利用router事件进行全局管理
  	router.events
  		.filter(event => event instanceof NavigationEnd)  // 路由结束的事件
  		.subscribe((event: NavigationEnd) => {
  			if(event.url == '/dashboard') {
  				this.pageTitle = '这里是首页'
  				this.pageDesc = ''
  			} else if (event.url.startsWith('/stock')) {
  				this.pageTitle = '股票信息管理'
  				this.pageDesc = '进行股票增删改查'	
  			}
  		})
  }

  ngOnInit() {
  }

}
