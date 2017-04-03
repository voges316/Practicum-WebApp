import { Component, OnInit } from '@angular/core';
import { EmployeeDataComponent } from './employee-data/employee-data.component';

// Nav layout stuff
import { HostBinding, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // nav stuff
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

//  Nav stuff that doesn't work
//  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
//  @HostBinding('class.td-route-animation') classAnimation: boolean = true;

  constructor(
  	public media: TdMediaService,
  	private _changeDetectionRef : ChangeDetectorRef
  	) {}

  ngOnInit() {
  	// This also works, instead of in ngAfterViewInit
  	//this.media.broadcast();
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();

    // Hack for allowing changes to be detected, using ChangeDetectorRef
    // https://github.com/angular/angular/issues/6005
    this._changeDetectionRef.detectChanges();
  }

}

