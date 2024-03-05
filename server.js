const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { connectToDb, employeeList, employeeAdd, employeeDetail, employeeEdit, employeeDelete } = require('./query');

const resolvers = {
	Query: {
		employeeList,
		employeeDetail,
	},
	Mutation: {
		employeeAdd,
		employeeEdit,
		employeeDelete,
	},
};

const server = new ApolloServer({
	typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
	resolvers,
	formatError: (error) => {
		console.log(error);
		return error;
	},
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
	try {
		await connectToDb();
		app.listen(3000, function () {
			console.log('API started on port 3000');
		});
	} catch (err) {
		console.log('ERROR:', err);
	}
})();
