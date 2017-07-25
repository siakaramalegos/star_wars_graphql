const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')
const fetch = require('node-fetch')

const BASE_URL = 'https://swapi.co/api'

const StarshipType = new GraphQLObjectType({
  name: 'Starship',
  description: 'A Starship resource is a single transport craft that has hyperdrive capability.',
  fields: () => ({
    name: {type: GraphQLString},
    model: {type: GraphQLString},
    starship_class: {type: GraphQLString},
  })
})

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: 'A People resource is an individual person or character within the Star Wars universe.',
  fields: () => ({
    name: {type: GraphQLString},
    birth_year: {type: GraphQLString},
    gender: {type: GraphQLString},
    starships: {
      type: new GraphQLList(StarshipType),
      resolve: (person) => person.starships.map((ship) => (
        fetch(ship).then(res => res.json())
      ))
    }
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
    },
    starship: {
      type: StarshipType,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/starships/${args.id}/`)
          .then(res => res.json())
      )
    }
  })
})

const schema = new GraphQLSchema({
  query: QueryType,
})

module.exports = schema
