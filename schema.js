const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql')
const fetch = require('node-fetch')

const BASE_URL = 'https://swapi.co/api'

const connectedItems = (arrayName, type) => {
  return {
  type: new GraphQLList(type),
  resolve: (object) => object[arrayName].map((singleItem) => (
    fetch(singleItem).then(res => res.json())
  ))
}}

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
    films: connectedItems('films', FilmType),
    pilots: connectedItems('pilots', PersonType),
  })
})

const PlanetType = new GraphQLObjectType({
  name: 'Planet',
  description: 'A Planet resource is a large mass, planet or planetoid in the Star Wars Universe, at the time of 0 ABY.',
  fields: () => ({
    climate: {type: GraphQLString},
    diameter: {type: GraphQLString},
    gravity: {type: GraphQLString},
    name: {type: GraphQLString},
    orbital_period: {type: GraphQLString},
    population: {type: GraphQLString},
    rotation_period: {type: GraphQLString},
    surface_water: {type: GraphQLString},
    terrain: {type: GraphQLString},
    residents: connectedItems('residents', PersonType),
    films: connectedItems('films', FilmType),
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
    starships: connectedItems('starships', StarshipType),
    homeworld: {
      type: PlanetType,
      resolve: (person) => (
        fetch(person.homeworld).then(res => res.json())
      )
    },
    films: connectedItems('films', FilmType),
    // species
    // vehicles
  })
})

const FilmType = new GraphQLObjectType({
  name: 'Film',
  description: 'A Film resource is a single film.',
  fields: () => ({
    characters: connectedItems('characters', PersonType),
    director: {type: GraphQLString},
    episode_id: {type: GraphQLInt},
    opening_crawl: {type: GraphQLString},
    planets: connectedItems('planets', PlanetType),
    producer: {type: GraphQLString},
    release_date: {type: GraphQLString},
    // species
    starships: connectedItems('starships', StarshipType),
    title: {type: GraphQLString},
    // vehicles
  })
})

const searchHelper = (searchString) => (
  searchString ? `?search=${searchString}` : ''
)

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'my optional description',
  fields: () => ({
    film: {
      type: FilmType,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/films/${args.id}/`)
          .then(res => res.json())
      )
    },
    films: {
      type: new GraphQLList(FilmType),
      args: {
        search: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/films/${searchHelper(args.search)}`)
          .then(res => res.json())
          .then(json => json.results)
      )
    },
    people: {
      type: new GraphQLList(PersonType),
      args: {
        search: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/people/${searchHelper(args.search)}`)
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
    planet: {
      type: PlanetType,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/planets/${args.id}/`)
          .then(res => res.json())
      )
    },
    planets: {
      type: new GraphQLList(PlanetType),
      args: {
        search: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/planets/${searchHelper(args.search)}`)
          .then(res => res.json())
          .then(json => json.results)
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
      args: {
        search: {type: GraphQLString}
      },
      resolve: (root, args) => (
        fetch(`${BASE_URL}/starships/${searchHelper(args.search)}`)
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
