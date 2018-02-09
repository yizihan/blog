import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { StockManageComponent } from './stock/stock-manage/stock-manage.component';
import { StarsComponent } from './stars/stars.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockFormComponent } from './stock/stock-form/stock-form.component';

const routeConfig: Routes = [
	{path: '', redirectTo:'/dashboard', pathMatch: 'full'},
	{path: 'dashboard', component: DashboardComponent},
	{path: 'stock', component: StockManageComponent},
  {path: 'stock/:id', component: StockFormComponent}
]

// 模块装饰器
@NgModule({
  // 程序运行要用到的其他组件
  imports: [
    BrowserModule,
    // FormsModule,
    // HttpModule,
    RouterModule.forRoot(routeConfig)
  ],
	// 声明要用到的组件
	declarations: [
    HeaderComponent,
    MenuComponent,
    SidebarComponent,
    FooterComponent,
    ContentComponent,
    StarsComponent,
    DashboardComponent,
    StockFormComponent,
    StockManageComponent,
    AppComponent
  ],
  // 模块提供的服务
  providers: [],
  // 模块的主组件
  bootstrap: [AppComponent]
})
export class AppModule { }
