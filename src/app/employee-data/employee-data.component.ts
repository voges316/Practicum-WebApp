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
  IPageChangeEvent 
} from '@covalent/core';

import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';

import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';

import { ChangeDetectorRef } from '@angular/core';

// Complete hack taken from 
// https://github.com/Teradata/covalent/blob/develop/src/app/components/components/data-table/data-table.component.ts
const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.css']
})
export class EmployeeDataComponent implements OnInit {
  loading: boolean;
  employeeForm: FormGroup;

  constructor(
    private employeeSvc: EmployeeService,
    private _dataTableService: TdDataTableService,
	  fb: FormBuilder,
	  public snackBar: MdSnackBar,
    private _changeDetectionRef : ChangeDetectorRef
    ) { 
    	this.employeeForm = fb.group({
        'id' : '',
    		'first' : ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    		'middle' : '',
    		'last' : ['', Validators.required],
    		'email' : ['', Validators.required],
    		'phone' : ['', Validators.required]
    	})
  }

  ngOnInit() {
    this.apiGetEmployees();
  }

  isNewEmployee(): boolean {
    var id = this.employeeForm.controls['id'].value;
    if (id === null || id === '') return true;
    else return false;
  }

  formReset() {
  	this.employeeForm.reset();
  }

  formDelete() {
    this.apiDeleteEmployee();
  }

  formUpdate(emp: Employee): void {
    this.employeeForm.setValue({
      id: emp.id,
      first: emp.firstName,
      middle: emp.midName,
      last: emp.lastName,
      email: emp.email,
      phone: emp.phone
    });
  }

  openSnackBar() {
    this.snackBar.open('Success', 'Dismiss', {
       duration: 3000,
    });

    // this.snackBar.open('Created New Employee', 'Dismiss');
  }

  errorSnackBar() {
    this.snackBar.open('There was an error', 'Dismiss', {
        duration: 3000,
    });
  }  

  onSubmit(): void {
    // console.log(this.employeeForm.value, this.employeeForm.valid);
    if (this.employeeForm.valid && this.isNewEmployee()) {
      this.apiCreateEmployee();
    } else if (this.employeeForm.valid && !this.isNewEmployee()){
      console.log('Gonna update the employee')
      this.apiUpdateEmployee();
    }
    else {
      console.log('Invalid employee');
    }    
  }

  apiCreateEmployee(): void {
  	this.loading = true;

    let Emp = new Employee();
    Emp.id = this.employeeForm.get('id').value;
    Emp.firstName = this.employeeForm.get('first').value;
    Emp.midName = this.employeeForm.get('middle').value;
    Emp.lastName = this.employeeForm.get('last').value;
    Emp.email = this.employeeForm.get('email').value;
    Emp.phone = this.employeeForm.get('phone').value;

    this.employeeSvc.createEmp(Emp)
      .then(employee => {
        this.apiGetEmployees();
        this.formReset();
        this.openSnackBar();
        this.loading = false;
      })
      .catch(error => {
        this.handlePromiseError;
        this.errorSnackBar();
        this.loading = false;
      });
  }

  apiUpdateEmployee(): void {
    this.loading = true;

    let Emp = new Employee();
    Emp.id = this.employeeForm.get('id').value;
    Emp.firstName = this.employeeForm.get('first').value;
    Emp.midName = this.employeeForm.get('middle').value;
    Emp.lastName = this.employeeForm.get('last').value;
    Emp.email = this.employeeForm.get('email').value;
    Emp.phone = this.employeeForm.get('phone').value;

    this.employeeSvc.updateEmp(Emp)
      .then(employee => {
        this.apiGetEmployees();
        // this.formReset();
        this.openSnackBar();
        this.loading = false;
      })
      .catch(error => {
        this.handlePromiseError;
        this.errorSnackBar();
        this.loading = false;
      });

  }

  apiDeleteEmployee(): void {
    this.loading = true;

    let Emp = new Employee();
    Emp.id = this.employeeForm.get('id').value;
    Emp.firstName = this.employeeForm.get('first').value;
    Emp.midName = this.employeeForm.get('middle').value;
    Emp.lastName = this.employeeForm.get('last').value;
    Emp.email = this.employeeForm.get('email').value;
    Emp.phone = this.employeeForm.get('phone').value;

    this.employeeSvc.deleteEmp(Emp)
      .then(employee => {
        this.apiGetEmployees();
        this.formReset();
        this.openSnackBar();
        this.loading = false;
      })
      .catch(error => {
        this.handlePromiseError;
        this.errorSnackBar();
        this.loading = false;
      });
  }

  apiGetEmployees() {
    this.loading = true;

    this.employeeSvc.getAll()
      .then(employees => {
        this.data = employees;
        this.filter();
        this.loading = false;
      })
      .catch(error => {
        this.handlePromiseError;
        this.errorSnackBar();
        this.loading = false;
      });
        
  }

  test() {
    console.log(this.selectedRows);
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

  // All of this below is all DataTable stuff
  // data: any[] = [{"id":3002,"firstName":"Homer","midName":null,"lastName":"Simpson","email":"homer@duff.com","phone":"12345","rank":null,"gender":null,"address":null,"jobs":[]},{"id":3251,"firstName":"Frodo","midName":null,"lastName":"Baggins","email":"frodo@shire.com","phone":"12345","rank":null,"gender":null,"address":null,"jobs":[]},{"id":151,"firstName":"Lisa","midName":"Samsonite","lastName":"Simpson","email":"lisa@harvard.edu","phone":"2524155","rank":"OFFICER","gender":"FEMALE","address":null,"jobs":[]},{"id":2851,"firstName":"Homer","midName":null,"lastName":"Simpson","email":"homer@duff.com","phone":"12345","rank":null,"gender":null,"address":null,"jobs":[]},{"id":3751,"firstName":"charlie","midName":"","lastName":"brown","email":"ch@g.com","phone":"123","rank":null,"gender":null,"address":null,"jobs":[]},{"id":3801,"firstName":"snoopy","midName":null,"lastName":"dog","email":"snoopy@wh.gov","phone":"12345","rank":null,"gender":null,"address":null,"jobs":[]},{"id":3901,"firstName":"Homer","midName":"J","lastName":"Simpson","email":"home@duff.com","phone":"1234567","rank":null,"gender":null,"address":null,"jobs":[]}];
  data: any[] = [];

  columns: ITdDataTableColumn[] = [
    //{ name: 'id', label: 'ID #', numeric: true, format: NUMBER_FORMAT },
    { name: 'id', label: 'ID #' },
    { name: 'firstName', label: 'First' },
    { name: 'midName', label: 'Middle' },
    { name: 'lastName', label: 'Last' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' }
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
     this.formUpdate(selectEvent.row as Employee); 
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
