import { gql } from 'graphql-request'

type Type = {
  values: {
    id: string
    value: string
  }[]
}

const query = gql`
  query {
    values {
      id
      value
    }
  }
`

export { query, Type }
