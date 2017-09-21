const express = require('express')
// Import the GraphQL HTTP server
const graphqlHTTP = require('express-graphql')
// Import our schema
const schema = require('./schema')

const app = express()

app.use(graphqlHTTP({
  // Declare the schema
  schema,
  // Show the handy GraphiQL thing in the browser
  graphiql: true,
}))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000')
