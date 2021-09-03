
import { Barra, ContainerCabecalho } from './styled'

import Cookies from 'js-cookie'
import {useHistory} from 'react-router-dom';

export default function Cabecalho() {

    const nav = useHistory();

    const logOff = () => {
        Cookies.remove('user-log');
        nav.goBack();
    }

    return (
        <ContainerCabecalho>
            <img src="/assets/images/logo-monkchat.png" alt="" />
            <Barra />
            <div className="titulo"> MonkChat </div>

            <span onClick={logOff}> Sair </span>
        </ContainerCabecalho>
    )
}
