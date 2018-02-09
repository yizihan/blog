import { Component, OnInit } from '@angular/core';
import { Stock } from '../stock-manage/stock-manage.component'


@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {

	stock: Stock


  constructor() { }

  ngOnInit() {
  	this.stock = new Stock(1, 'firstss stock', 1.99, 3.5, 'my first stock 2018-2-1', ["IT","互联网"])
  }

}
