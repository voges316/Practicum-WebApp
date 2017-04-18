import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {MdSnackBar} from '@angular/material';
import { 
  CovalentCoreModule,
  CovalentDataTableModule,
  TdDataTableService, 
  TdDataTableSortingOrder, 
  ITdDataTableSortChangeEvent,
  ITdDataTableSelectEvent,
  ITdDataTableColumn, 
  IPageChangeEvent,
  CovalentSearchModule 
} from '@covalent/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';

import { Job } from '../job-data/job.model';
import { JobService } from '../job-data/job.service';
import { ChangeDetectorRef } from '@angular/core';

// Taken from 
// https://github.com/Teradata/covalent/blob/develop/src/app/components/components/data-table/data-table.component.ts
const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'job-data',
  templateUrl: './job-data.component.html',
  styleUrls: ['./job-data.component.css']
})
export class JobDataComponent implements OnInit {
  loading: boolean;
  jobForm: FormGroup;

  constructor(
  	private jobSvc: JobService,
  	private _dataTableService: TdDataTableService,
  	public snackBar: MdSnackBar,
  	fb: FormBuilder,
  	private _changeDetectionRef : ChangeDetectorRef
  	) {
  		this.jobForm = fb.group({
  			'id' : '',
  			'name' : ['', Validators.compose([Validators.required, Validators.minLength(2)])],
  			'description' : '',
  			'numberNeeded' : ''
  		})
  }

  ngOnInit() {
  	this.apiGetJobs();
  }

  isNewJob(): boolean {
  	var id = this.jobForm.controls['id'].value;
  	if (id === null || id === '') return true;
    else return false;
  }

  formReset() {
  	this.jobForm.reset();
  }

  formDelete() {
  	this.apiDeleteJob();
  }

  formUpdate(job: Job): void {
  	this.jobForm.setValue({
  		id: job.id,
  		name: job.name,
  		description: job.description,
  		numberNeeded: job.numberNeeded
  	});
  }

  openSnackBar() {
    this.snackBar.open('Success', 'Dismiss', {
     	duration: 3000,
    });
  }

  errorSnackBar() {
  	this.snackBar.open('There was an error', 'Dismiss', {
      	duration: 3000,
    });
  }

  onSubmit(): void {
  	if (this.jobForm.valid && this.isNewJob()) {
  		this.apiCreateJob();
  	} else if (this.jobForm.valid && !this.isNewJob()) {
  		this.apiUpdateJob();
  	} else {
  		console.log('Invalid Job');
  	}
  }

  apiCreateJob(): void {
  	this.loading = true;

  	let job = new Job();
  	job.id = this.jobForm.get('id').value;
  	job.name = this.jobForm.get('name').value;
  	job.description = this.jobForm.get('description').value;
  	job.numberNeeded = this.jobForm.get('numberNeeded').value;

  	this.jobSvc.createJob(job)
  		.then(job => {
  			this.apiGetJobs();
  			this.formReset();
  			this.openSnackBar();
  			this.loading = false;
  		})
  		.catch(error => {
  			this.handlePromiseError;
  			this.errorSnackBar();
  			this.loading = false;
  		})
  }

  apiUpdateJob(): void {
  	this.loading = true;

  	let job = new Job();
  	job.id = this.jobForm.get('id').value;
  	job.name = this.jobForm.get('name').value;
  	job.description = this.jobForm.get('description').value;
  	job.numberNeeded = this.jobForm.get('numberNeeded').value;

  	this.jobSvc.updateJob(job)
  		.then(job => {
  			this.apiGetJobs();
  			this.openSnackBar();
  			this.loading = false;
  		})
  		.catch(error => {
  			this.handlePromiseError;
  			this.errorSnackBar();
  			this.loading = false;
  		})
  }

  apiDeleteJob(): void {
  	this.loading = true;

  	let job = new Job();
  	job.id = this.jobForm.get('id').value;
  	job.name = this.jobForm.get('name').value;
  	job.description = this.jobForm.get('description').value;
  	job.numberNeeded = this.jobForm.get('numberNeeded').value;

  	this.jobSvc.deleteJob(job)
  		.then(job => {
  			this.apiGetJobs();
  			this.formReset();
  			this.openSnackBar();
        	this.loading = false;
  		})
  		.catch(error => {
  			this.handlePromiseError;
  			this.errorSnackBar();
  			this.loading = false;
  		})

  }

  apiGetJobs() {
  	this.loading = true;

  	this.jobSvc.getAll()
  		.then(jobs => {
  			console.log('Assigning jobs');
  			this.data = jobs;
  			this.filter();
  			this.loading = false;
  			// this._changeDetectionRef.detectChanges();
  		})
  		.catch(error => {
  			this.handlePromiseError;
  			this.errorSnackBar();
  			this.loading = false;
  		})
  }

  test(): void {
  	this.jobSvc.svcTest();
  }  

  private handlePromiseError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  // Datatable stuff
  data: any[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: 'ID #' },
    { name: 'name', label: 'Job' },
    { name: 'description', label: 'Description' },
    { name: 'numberNeeded', label: '# Needed', numeric: true, format: NUMBER_FORMAT }
  ];  

  selectable: boolean = true;
  multiple: boolean = false;

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  selectedRows: any[] = [];

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'id';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }  

  selectEvent(selectEvent: ITdDataTableSelectEvent): void {
    console.log('selectEvent is firing')
    //console.log(selectEvent.row);
    // Only show if selecting, and not deselecting
    if (selectEvent.selected) {
     this.formUpdate(selectEvent.row as Job); 
    } else {
      this.formReset();
    }
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }  

  filter(): void {
    let newData: any[] = this.data;
    newData = this._dataTableService.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;

    // Hack for allowing changes to be detected
    this._changeDetectionRef.detectChanges();
  }

  toggleSelectable(): void {
    this.selectable = !this.selectable;
  }

  toggleMultiple(): void {
    this.multiple = !this.multiple;
  } 
  
  areTooltipsOn(): boolean {
    return this.columns[0].hasOwnProperty('tooltip');
  }

  toggleTooltips(): void {
    if (this.columns[0].tooltip) {
      this.columns.forEach((c: any) => delete c.tooltip);
    } else {
      this.columns.forEach((c: any) => c.tooltip = `This is ${c.label}!`);
    }
  } 
}
