import React from 'react';
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import './styles.css'

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 50; i += 1) {
    const random = Math.random();
    visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('DD/MM/YYYY'),
        y: Math.floor(random * 100) + 10,
    });
}
class ProjectList extends React.Component {
    render() {
        const { projects } = this.props;

        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                {projects.map(project => (
                    <div key={project.id} style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '200px', width: '100%', marginBottom: '30px' }}>
                        {/* Nome do projeto */}
                        <div className='project-head'>
                            <p>{project.name}</p>
                        </div>

                        {/* Dados de gráfico */}
                        <div style={{ flex: 8 }}>
                            <Charts.MiniArea                                
                                line
                                animate={true}
                                color="#cceafe"
                                height={60}
                                data={visitData}
                            />
                        </div>

                        {/* Rodapé */}
                        <div style={{ display: 'flex', flex: 2 }}>
                            <div style={{ position: 'relative', flex: 1, width: 'auto', height: 'auto', backgroundColor: 'green' }}></div>
                            <div style={{ position: 'relative', flex: 1, width: 'auto', height: 'auto', backgroundColor: 'blue' }}></div>
                        </div>

                    </div>
                ))}
            </div>
        )
    }
};

export default ProjectList;