export class Employee {

	id: string;
    firstName: string;
    midName: string;
    lastName: string;
    email: string;
    phone: string;

	constructor(obj?: any) {
		this.id			= obj && obj.id			|| null;
		this.firstName	= obj && obj.first		|| null;
		this.midName	= obj && obj.middle		|| null;
		this.lastName	= obj && obj.last		|| null;
		this.email		= obj && obj.email		|| null;
		this.phone		= obj && obj.phone		|| null;
	}
}
