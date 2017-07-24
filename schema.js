const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')
const fetch = require('node-fetch')

const BASE_URL = 'https://swapi.co/api'

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: 'character in the movies',
  fields: () => ({
    name: {type: GraphQLString},
    birth_year: {type: GraphQLString},
    gender: {type: GraphQLString},
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'my optional description',
  fields: () => ({
    person: {
      type: PersonType,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/people/${args.id}/`)
          .then(res => res.json())
      )
    }
  })
})

const schema = new GraphQLSchema({
  query: QueryType,
})

module.exports = schema
