export const OPERATIONS_TYPES = {
    query: 'query',
    mutation: 'mutation',
}

const graphql = ({ operation_type, operation_name, variable_definitions, selection_set_query }) => {
    return {
        query: `${operation_type} ${operation_name} ${variable_definitions} ${selection_set_query}`
    }
}

export const query = ({ operation_name, selection_set_query }) => {
    return graphql({ operation_type: OPERATIONS_TYPES.query, operation_name, selection_set_query });
}

export const mutation = ({ operation_name, selection_set_query }) => {
    return graphql({ operation_type: OPERATIONS_TYPES.mutation, operation_name, selection_set_query });
}