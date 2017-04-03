export class Job {

	id: string;
    name: string;
    description: string;
    numberNeeded: number;

	constructor(obj?: any) {
		this.id				= obj && obj.id				|| null;
		this.name			= obj && obj.name			|| null;
		this.description	= obj && obj.description	|| null;
		this.numberNeeded	= obj && obj.numberNeeded	|| null;
	}
}
