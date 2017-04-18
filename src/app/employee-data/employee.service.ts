import { Injectable, Inject } from '@angular/core';
import { Employee } from './employee.model';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmployeeService{
  BASE_URL:string;
  LOCAL_URL:string = 'http://localhost:8080/Airlink-Web';
  PATH:string = '/api/employees'

	constructor(
    private http : Http,
    @Inject('locationObject') private locationObject: Location
  ) {  
    // Generate api url based on dev vs deployed environment
    if (environment.production) {
      /* /Airlink-Web/ -> /Airlink-Web */
      let pathName = location.pathname.substring(0, location.pathname.length - 1);
      this.BASE_URL = location.origin + pathName + this.PATH;
    } else {
      this.BASE_URL = this.LOCAL_URL + this.PATH;
    }
  }

	svcTest() : void {
		console.log('This is a test from employee service');
    console.log('location: ' + location.origin);
	}

  createEmp(employee: Employee): Promise<Employee> {
    let body = JSON.stringify(employee);

    return this.http
      .post(`${this.BASE_URL}`, body, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Employee;
      })
      .catch(this.handleError);
  }

  updateEmp(employee: Employee): Promise<Employee> {
    let id: string = employee.id;
    let body = JSON.stringify(employee);

    return this.http
      .post(`${this.BASE_URL}/${id}`, body, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Employee;
      })
      .catch(this.handleError);

  }

  deleteEmp(employee: Employee): Promise<Employee> {
    let id: string = employee.id;
    return this.http
      .delete(`${this.BASE_URL}/${id}`, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Employee;
      })
      .catch(this.handleError);
  }

	getAll() : Promise<Employee[]> {
		return this.http
			.get(`${this.BASE_URL}/`, {headers: this.getHeaders()})
			.toPromise()
			.then(response => {
        //console.log("Raw json: ", response.json());
        return <Employee[]>response.json();
      })
			.catch(this.handleError);
	}

	/*
	getAll() : Observable<Employee[]> {
		let employees$ = this.http
		  .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
		  .map(mapEmployees);
		  return employees$;
	}
	*/

	private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private handleError(error: any): Promise<any> {
  	console.error('An error occurred', error); // for demo purposes only
  return Promise.reject(error.message || error);
  }
}