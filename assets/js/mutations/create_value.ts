type Type = {
  createValue: {
    id: string
    value: string
  }
}

const mutation = (value: string) => `
mutation CreateValue {
  createValue(value: "${value}") {
    id
    value
  }
}
`
export { Type, mutation }
