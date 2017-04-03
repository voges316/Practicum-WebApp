import { Injectable } from '@angular/core';
import { Employee } from './employee.model';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

//const EMPLOYEES : Employee[] = 
//	[{"id":3002,"firstName":"Homer","midName":null,"lastName":"Simpson","email":"homer@duff.com","phone":"12345"},{"id":3251,"firstName":"Frodo","midName":null,"lastName":"Baggins","email":"frodo@shire.com","phone":"12345"},{"id":151,"firstName":"Lisa","midName":"Samsonite","lastName":"Simpson","email":"lisa@harvard.edu","phone":"2524155"}];

const BASE_URL: string = 'http://localhost:8080/Airlink-Web/api/employees';

@Injectable()
export class EmployeeService{

	constructor(private http : Http) {}

	svcTest() : void {
		console.log('This is a test from employee service');
	}

  createEmp(employee: Employee): Promise<Employee> {
    let body = JSON.stringify(employee);

    return this.http
      .post(`${BASE_URL}`, body, {headers: this.getHeaders()})
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
      .post(`${BASE_URL}/${id}`, body, {headers: this.getHeaders()})
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
      .delete(`${BASE_URL}/${id}`, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Employee;
      })
      .catch(this.handleError);
  }

	getAll() : Promise<Employee[]> {
		return this.http
			.get(`${BASE_URL}/`, {headers: this.getHeaders()})
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