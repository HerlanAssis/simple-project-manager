const OPERATIONS_TYPES = {
    query: 'query',
    mutation: 'mutation',
}

const format_variable_definitions = (parmas) => {
    if (typeof parmas != typeof {}) {
        let variable_definitions = '(';

        Object.entries(parmas).forEach(([key, value]) => variable_definitions = `${variable_definitions}${key}:${value},`);

        variable_definitions = `${variable_definitions})`;
    }

    return '';
}

const graphql = ({ operation_type, operation_name, variable_definitions, selection_set_query }) => {
    return {
        [operation_type]: `{${operation_name}${variable_definitions}${selection_set_query}}`
    }
}

export const query = ({ operation_name, variable_definitions, selection_set_query }) => {
    return graphql({
        operation_type: OPERATIONS_TYPES.query,
        operation_name,
        variable_definitions: format_variable_definitions(variable_definitions),
        selection_set_query
    });
}

export const mutation = ({ operation_name, variable_definitions, selection_set_query }) => {
    return graphql({
        operation_type: OPERATIONS_TYPES.mutation,
        operation_name,
        variable_definitions: format_variable_definitions(variable_definitions),
        selection_set_query
    });
}