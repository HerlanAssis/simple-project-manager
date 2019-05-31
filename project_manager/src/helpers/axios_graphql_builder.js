const OPERATIONS_TYPES = {
    query: 'query',
    mutation: 'mutation',
}

const create_valid_query = (params) => {
    let variable_definitions = [];

    Object.entries(params).forEach(([key, value]) => {
        if (key && value) {
            switch (typeof value) {
                case typeof String():
                    variable_definitions.push(`${key}:"${value}"`);
                    break;
                case typeof {}:
                    variable_definitions.push(`${key}:{${create_valid_query(value)}}`)
                    break;
                default:
                    variable_definitions.push(`${key}:${value}`)
            }
        }
    });

    return variable_definitions.join(',');
}

const format_variable_definitions = (params) => {
    if (typeof params === typeof {} && Object.keys(params).length > 0) {
        let variable_definitions = `(${create_valid_query(params)})`;

        return variable_definitions;
    }

    return '';
}

export const query = ({ operation_name, variable_definitions, selection_set_query }) => {

    return {
        [OPERATIONS_TYPES.query]: `{${operation_name}${format_variable_definitions(variable_definitions)}${selection_set_query}}`
    }
}

export const mutation = ({ operation_name, variable_definitions, selection_set_query }) => {
    return {
        [OPERATIONS_TYPES.query]: `${OPERATIONS_TYPES.mutation} {${operation_name}${format_variable_definitions(variable_definitions)}${selection_set_query}}`
    }
}