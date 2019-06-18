import React from 'react';
import { Exception } from '../../../../components';


class Page404 extends React.Component {
    render() {
        return (
            <Exception
                type={'404'}
                title={'Página não encontrada!'}
                description={'Desculpe, a página que você visitou não existe'}
                actions={{
                    name: 'Voltar a home',
                    path: '/',
                }}
            />
        )
    }
}


export default Page404;
