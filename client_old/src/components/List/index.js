import React from 'react';
import './styles.css';

function createRows(list, columns) {
    // [0]
    const data = JSON.parse(JSON.stringify(list));

    const rows = Math.floor(data.length / columns); // [A]
    let lastRowElements = data.length - rows * columns; // [B]
    while (lastRowElements !== columns) { // [C]
        data.push({ // [D]
            id: `empty-${lastRowElements}`,
            name: `empty-${lastRowElements}`,
            empty: true
        });
        lastRowElements += 1; // [E]
    }
    return data; // [F]

    /**
     * [0]: Criando uma cópia da lista para não ter que alterar ela diretamente
     * [A]: Calculando o número base de linhas que teremos
     * [B]: Calculando a quantidade de itens que irá sobrar na última linha
     * [C]: Enquanto o número de itens na última linha não for igual ao número desejado de colunas
     * [D]: Iremos adicionar elementos vazios no array disponibilizado
     * [E]: Incrementamos o contador
     * [F]: Retornamos o novo array preenchido
     */
}

class List extends React.Component {
    static defaultProps = {
        items: [],
        columns: 3,
        renderItem: () => { },
        keyExtractor: () => { },
        horizontal: false,
    }

    render() {
        const { items, renderItem, keyExtractor, columns, horizontal } = this.props;

        return (
            <div className='list-content' style={{ flexWrap: horizontal ? 'nowrap' : 'wrap' }}>
                {createRows(items, columns).map((item, index) => {
                    if (item.empty) {
                        return (<div key={`${index}`} style={{ height: 0 }} className='list-items' />);
                    }

                    return (
                        <div key={keyExtractor(item)} style={{ minWidth: `${100 / columns}%` }} className='list-items'>
                            {renderItem(item)}
                        </div>
                    )
                })}
            </div>
        )
    }
};

export default List;
