import { GraphQLClient, gql } from 'graphql-request'

import * as GET_VALUES from '../queries/get_values'
import * as CREATE_VALUE from '../mutations/create_value'

const endpoint = '/api/graph'

const client = new GraphQLClient(endpoint)

const getAll = () => client.request<GET_VALUES.Type>(GET_VALUES.query)

const create = (value: string) =>
  client.request<CREATE_VALUE.Type>(CREATE_VALUE.mutation(value))

const todos = {
  getAll,
  create,
}

export default todos
