import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {

	@Input()		// 说明rating数据是从外部注入进来的
	rating: number = 0;		// 初始默认值 0

	stars: boolean[];

  constructor() { }

  ngOnInit() {
  	this.stars = [];
  	for (let i = 1; i<=5; i++) {
  		this.stars.push(i > this.rating);
  	}
  }

}
