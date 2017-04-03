import { Injectable } from '@angular/core';
import { Job } from './job.model';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

//const JOBS : Job[] = 
//	[{"id":3152,"name":"Scheduling","description":null,"numberNeeded":4,"employees":[]},{"id":3153,"name":"Staff","description":null,"numberNeeded":2,"employees":[]},{"id":3151,"name":"Training","description":"The training army","numberNeeded":17,"employees":[]}];

const BASE_URL: string = 'http://localhost:8080/Airlink-Web/api/jobs';

@Injectable()
export class JobService{

	constructor(private http : Http) {}

	svcTest() : void {
		console.log('This is a test from job service');
	}

  createJob(job: Job): Promise<Job> {
    let body = JSON.stringify(job);

    return this.http
      .post(`${BASE_URL}`, body, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Job;
      })
      .catch(this.handleError);
  }

  updateJob(job: Job): Promise<Job> {
    let id: string = job.id;
    let body = JSON.stringify(job);

    return this.http
      .post(`${BASE_URL}/${id}`, body, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Job;
      })
      .catch(this.handleError);

  }

  deleteJob(job: Job): Promise<Job> {
    let id: string = job.id;
    return this.http
      .delete(`${BASE_URL}/${id}`, {headers: this.getHeaders()})
      .toPromise()
      .then(response => {
        // console.log("Raw json: ", response.json());
        return response.json() as Job;
      })
      .catch(this.handleError);
  }

	getAll() : Promise<Job[]> {
		return this.http
			.get(`${BASE_URL}/`, {headers: this.getHeaders()})
			.toPromise()
			.then(response => {
        //console.log("Raw json: ", response.json());
        return <Job[]>response.json();
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