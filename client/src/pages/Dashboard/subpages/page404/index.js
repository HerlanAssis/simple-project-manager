import React from 'react';
import { Exception } from 'ant-design-pro';

class Page404 extends React.Component {
    render() {
        return (
            <Exception
                type={'404'}
                title={'Página não encontrada!'}
                desc={'Desculpe, a página que você visitou não existe'}
                backText={'Voltar ao início'}
            />
        )
    }
}


export default Page404;
