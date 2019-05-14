import React from 'react';
import { LocaleProvider } from 'antd';
import ptBR from 'antd/lib/locale-provider/pt_BR';

// moment configuration
require('moment/locale/pt-br.js');

export default ((props) => <LocaleProvider locale={ptBR}>{props.children}</LocaleProvider>)