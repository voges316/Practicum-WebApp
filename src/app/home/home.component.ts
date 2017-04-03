import { Component, OnInit } from '@angular/core';

// Taken from 
// https://github.com/Teradata/covalent/blob/develop/src/app/components/components/data-table/data-table.component.ts
const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
