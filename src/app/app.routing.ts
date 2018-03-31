import { NgModule, Component } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MapsComponent } from './maps/maps.component';
import { LoginComponent } from './login/login.component';

// const routes: Routes =[
//     { path: 'maps',  component: MapsComponent},
//     { path: 'login', component: LoginComponent},
//     { path: '', redirectTo: 'login', pathMatch: 'full'}
// ];
const routes: Routes =[
  {
    path: 'maps',
    children: [
      { path: 'maps',  component: MapsComponent},
    ],
    component: MapsComponent
  },
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
]
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule {
  timeout(): void {
    setTimeout(() => {
        this.timeout();
    }, 72000000);
  }
}
