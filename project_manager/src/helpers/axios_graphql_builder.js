const OPERATIONS_TYPES = {
    query: 'query',
    mutation: 'mutation',
}

const format_variable_definitions = (params) => {
    if (typeof params === typeof {}) {
        let variable_definitions = '(';

        Object.entries(params).forEach(([key, value]) => {
            if (key && value) {
                switch (typeof value) {
                    case typeof String():
                        variable_definitions = `${variable_definitions}${key}:"${value}",`
                        break;
                    default:
                        variable_definitions = `${variable_definitions}${key}:${value},`

                }
            }
        });

        variable_definitions = `${variable_definitions})`;

        return variable_definitions;
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