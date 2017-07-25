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
    manufacturer: {type: GraphQLString},
    cost_in_credits: {type: GraphQLString},
    length: {type: GraphQLString},
    crew: {type: GraphQLString},
    passengers: {type: GraphQLString},
    max_atmospheric_speed: {type: GraphQLString},
    hyperdrive_rating: {type: GraphQLString},
    MGLT: {type: GraphQLString},
    cargo_capacity: {type: GraphQLString},
    consumables: {type: GraphQLString},
    // films
    // pilots
  })
})

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: 'A People resource is an individual person or character within the Star Wars universe.',
  fields: () => ({
    name: {type: GraphQLString},
    birth_year: {type: GraphQLString},
    gender: {type: GraphQLString},
    eye_color: {type: GraphQLString},
    hair_color: {type: GraphQLString},
    height: {type: GraphQLString},
    mass: {type: GraphQLString},
    starships: {
      type: new GraphQLList(StarshipType),
      resolve: (person) => person.starships.map((ship) => (
        fetch(ship).then(res => res.json())
      ))
    }
    // homeworld
    // films
    // species
    // vehicles
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'my optional description',
  fields: () => ({
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => (
        fetch(`${BASE_URL}/people/`)
          .then(res => res.json())
          .then(json => json.results)
      )
    },
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
    },
    starships: {
      type: new GraphQLList(StarshipType),
      resolve: () => (
        fetch(`${BASE_URL}/starships/`)
          .then(res => res.json())
          .then(json => json.results)
      )
    },
  })
})

const schema = new GraphQLSchema({
  query: QueryType,
})

module.exports = schema
