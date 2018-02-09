import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stock-manage',
  templateUrl: './stock-manage.component.html',
  styleUrls: ['./stock-manage.component.css']
})
export class StockManageComponent implements OnInit {

	// 定义stocks是一个数组
	private stocks: Array<Stock>;

  constructor(public router: Router) {

  }

  // 初始化应用数据
  ngOnInit() {
  	// 实例化并传参
  	this.stocks = [
  		new Stock(1, 'first stock', 1.99, 3.5, 'my first stock 2018-2-1', ["IT","互联网"]),
  		new Stock(2, 'second stock', 1.99, 3.5, 'my first stock 2018-2-1', ["IT","互联网"])
  	];
  }

  create () {
    this.router.navigateByUrl('/stock/0');
  }

  update(stock: Stock) {
    this.router.navigateByUrl('/stock/' + stock.id)
  }

}

// 声明Stock类
export class Stock {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array < string >
  ) {}
}
