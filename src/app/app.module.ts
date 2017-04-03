/*
 * Angular Imports
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { CovalentCoreModule } from '@covalent/core';
import { CovalentDataTableModule } from '@covalent/core';

/*
 * Components
 */
import { AppComponent } from './app.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { DemoComponent } from './demo-component/demo-component.component';
import { HomeComponent } from './home/home.component';

import { JobDataComponent } from './job-data/job-data.component';

/*
 * Services
 */
import { EmployeeService } from './employee-data/employee.service';
import { JobService } from './job-data/job.service'; 

const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeeDataComponent },
  { path: 'jobs', component: JobDataComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    EmployeeDataComponent,
    DemoComponent,
    HomeComponent,
    JobDataComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // <-- routes
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    CovalentCoreModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    EmployeeService,
    JobService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppModule { }
