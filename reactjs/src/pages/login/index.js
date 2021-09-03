import { Container } from './styled'
import { ChatButton, ChatInput } from '../../components/outros/inputs'

import {useState} from 'react';
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'

import Api from '../../service/api'
const api = new Api();


export default function Login() {

    const [user, setUser] = useState('')
    const [senha, setSenha] = useState('')

    let nav = useHistory()
    
    if (Cookies.get('user-log') != null ){
        nav.push('/chat')
        return null
    }


    const Logar = async () => {
        let r = await api.login(senha, user)

        if (r.erro){
            alert(`${r.erro}`)
        }else {
            Cookies.set('user-log', JSON.stringify(r))
            nav.push('/chat')
        }
    } 


    return (
        <Container>
            <div className="box">
                <div className="titulo">
                    <img src="/assets/images/logo-monkchat.png" alt="" />
                    <br />
                    MonkChat
                </div>
            </div>

            <div className="login">
                <div className="container-form">
                    <div className="form-row">
                        <div className="title">Faça seu Login</div>
                    </div>

                    <div className="form-row">
                        <div>
                            <div className="label">Login </div>
                            <ChatInput
                                style={{ border: '1px solid gray', fontSize: '1.5em' }}
                                    value={user}
                                        onChange={(e) => {
                                            setUser(e.target.value)
                                        }}
                            />

                        </div>
                        <div>
                            <div className="label">Senha </div>
                            <ChatInput
                                type="password"
                                    style={{ border: '1px solid gray', fontSize: '1.5em' }}
                                        value={senha}
                                            onChange={(e) => {
                                                setSenha(e.target.value)
                                            }}
                            />

                        </div>
                        <div>
                            <ChatButton
                                style={{ fontSize: '1.2em'}}
                                onClick={Logar}> Login </ChatButton>
                        </div>
                    </div>
                </div>

            </div>
        </Container>
    )
}
