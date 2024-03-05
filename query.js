const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb+srv://patelumang858:aryastark9@test123.e7vnwjd.mongodb.net/issuetracker?retryWrites=true';

let db;

// Function to connect the database
async function connectToDb() {
	const client = new MongoClient(url, { useNewUrlParser: true });
	await client.connect();
	console.log('Connected to MongoDB at', url);
	db = client.db();
}

// Function to get the list of all employees
async function employeeList() {
	const _employees = await db.collection('employees').find({}).toArray();
	const employees = [];
	for (let i = 0; i < _employees.length; i++) {
		const employee = _employees[i];

		// inserting date related information into the employee object
		const dateOfJoining = new Date(employee.dateOfJoining);
		const ageMS = employee.age * 365 * 24 * 60 * 60 * 1000; // year to MS conversion
		const retirementMS = 65 * 365; // days for 65 years

		// birth date = date of joining - age at joining
		const birthDate = new Date(dateOfJoining - ageMS);

		// retirement date = birth date + 65 years
		const retirementDate = new Date(birthDate);
		retirementDate.setDate(retirementDate.getDate() + retirementMS);

		// time till retirement = (retirement date - today) then convert it into days
		const today = new Date();
		const monthsTillRetirement = Math.floor((retirementDate - today) / 1000 / 60 / 60 / 24 / 30); // ms to months
		console.log(monthsTillRetirement);

		employee['retirementDate'] = retirementDate;
		employee['monthsTillRetirement'] = monthsTillRetirement;

		employees.push(employee);
	}
	return employees;
}

// Function to add a new employee into the database
async function employeeAdd(_, { employee }) {
	const result = await db.collection('employees').insertOne(employee);
	return result;
}

// Function to get only one employee by id
async function employeeDetail(_, { _id }) {
	const result = await db.collection('employees').findOne({ _id: new ObjectId(_id) });
	return result;
}

// Function to update the employee details
async function employeeEdit(_, { employee }) {
	const result = await db
		.collection('employees')
		.updateOne({ _id: new ObjectId(employee._id) }, { $set: { ...employee, _id: new ObjectId(employee._id) } });
	return result;
}

// Function to delete an employee
async function employeeDelete(_, { employee }) {
	const result = await db
		.collection('employees')
		.deleteOne({ _id: new ObjectId(employee._id) }, { $set: { ...employee, _id: new ObjectId(employee._id) } });
	return result;
}

module.exports = { connectToDb, employeeList, employeeAdd, employeeDetail, employeeEdit, employeeDelete };
