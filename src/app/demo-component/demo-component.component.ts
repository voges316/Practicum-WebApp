import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { EmployeeService } from '../employee-data/employee.service';
import { Employee } from '../employee-data/employee.model';

/**
* Provides a person class
*/
class Person {
	constructor(
		public name: string) {
	}
}

@Component({
	selector: 'demo-component',
	templateUrl: './demo-component.component.html',
  	styleUrls: ['./demo-component.component.css']
})
export class DemoComponent implements OnInit {
	person: Person;
	data: Object;
	loading: boolean;
	loadingApi: boolean;

	employees: Employee[] = [];

	constructor(
		private http: Http,
		private employeeService: EmployeeService
		) {
		let newPerson = new Person('Zorro!');
		this.person = newPerson;
	}

	ngOnInit(): void {
		/*
		this.employeeService
			.getAll()
			.subscribe(e => this.employees = e);
			*/
	}

	// It works!!!
	testing() : void {
		// this.employeeService.svcTest();
		this.employeeService.getAll()
			.then(employees => this.employees = employees)
			.catch(this.handleError);
	}


	/*
	updateEmployees(): void {
		this.getEmployees().
			then(employees => {
				console.log(employees);
				this.employees = employees;
			});
	}

	
	makeRequest(): void {
		this.updateEmployees();
	}

  getEmployees(): Promise<Employee[]> {
  	this.loadingApi = true;
    return this.http.get('http://localhost:8080/Airlink-Web/api/employees/')
    	.toPromise()
        .then(response => {response.json().data as Employee[];})
        .catch(this.handleError);
  }
  */

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }


}