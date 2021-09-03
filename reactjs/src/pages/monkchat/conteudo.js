import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingBar from 'react-top-loading-bar'
 
import { ContainerConteudo } from './conteudo.styled'
import { ChatButton, ChatInput, ChatTextArea } from '../../components/outros/inputs'

import { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import {useHistory} from 'react-router-dom'

import Api from '../../service/api';
const api = new Api();


function usuarioLogado(nav) {

    let log = Cookies.get('user-log');
    if (log == null){
        nav.push('/');
        return null
    }

    let usuariolog = JSON.parse(log);
    return usuariolog;
}


export default function Conteudo() {
    const nav = useHistory();

    let Logado = usuarioLogado(nav) || {};

    const [idMensagem, setIdMensagem] = useState(0);
    const [chat, setChat] = useState([]);
    const [sala, setSala] = useState('teste²');
    const [usu, setUsu] = useState(Logado.nm_usuario);
    const [msg, setMsg] = useState('')

    const loading = useRef(null);



    const validarResposta = (resp) => {
        console.log(resp);

        if (!resp.erro)
            return true;
        toast.error(`${resp.erro}`);
        return false;
    }

    const carregarMensagens = async () => {
        loading.current.continuousStart();

        const mensagens = await api.listarMensagens(sala);
        if (validarResposta(mensagens))
            setChat(mensagens);

        loading.current.complete();
    }

    const enviarMensagem = async ( event ) => {

        if (!(event && event.ctrlKey && event.charCode === 13)){
            return
        }

        if(idMensagem > 0){
            const resp = await api.alterarMensagem(idMensagem, msg)
            if (!validarResposta(resp)) 
                return;

                toast.dark('💕 Mensagem alterada com sucesso!');
            
        }else{
            const resp = await api.inserirMensagem(sala, usu, msg);
            if (!validarResposta(resp)) 
                return;
            
            toast.dark('💕 Mensagem enviada com sucesso!');
        }

        await carregarMensagens();
    }

    const inserirUsuario = async () => {
        const resp = await api.inserirUsuario(usu);
        if (!validarResposta(resp)) 
            return;
        
        toast.dark('💕 Usuário cadastrado!');
        await carregarMensagens();
    }

    const inserirSala = async () => {
        const resp = await api.inserirSala(sala);
        if (!validarResposta(resp)) 
            return;
        
        toast.dark('💕 Sala cadastrada!');
        await carregarMensagens();
    }

    const deletarMensagem = async (idMensagem) => {
        await api.deletarMensagem(idMensagem)
        await carregarMensagens();
        toast.dark('💕 Mensagem Deletada!');
    }

    const alterarMensagem = async(idMensagem ,msg) => {
        setIdMensagem(idMensagem)
        setMsg(msg)
    } 
    
    return (
        <ContainerConteudo>
            <ToastContainer />
            <LoadingBar color="red" ref={loading} />
            <div className="container-form">
                <div className="box-sala">
                    <div>
                        <div className="label">Sala</div>
                        <ChatInput value={sala} onChange={e => setSala(e.target.value)} />
                    </div>
                    <div>
                        <div className="label">Nick</div>
                        <ChatInput value={usu} readOnly={true} />
                    </div>
                    <div>
                        <ChatButton onClick={inserirSala}> Criar </ChatButton>
                        <ChatButton onClick={inserirUsuario}> Entrar </ChatButton>
                    </div>
                </div>
                <div className="box-mensagem">
                    <div className="label">Mensagem</div>
                    <ChatTextArea value={msg} onChange={e => setMsg(e.target.value)} onKeyPress={enviarMensagem} />
                    <ChatButton onClick={enviarMensagem} className="btn-enviar"> Enviar </ChatButton>
                </div>
            </div>
            
            <div className="container-chat">
                
                <img onClick={carregarMensagens}
                   className="chat-atualizar"
                         src="/assets/images/atualizar.png" alt="" />
                
                <div className="chat">
                    {chat.map(x =>
                        <div key={x.id_chat}>
                            <div className="chat-message">
                                <div> <img onClick={() => alterarMensagem(x.id_chat, x.ds_mensagem) } src="/assets/images/edit.svg" alt="" /> </div>
                                <div> <img onClick={() => deletarMensagem(x.id_chat) }  src="/assets/images/delete.svg" alt="" style={{cursor: "pointer"}} /> </div>
                                <div>({new Date(x.dt_mensagem.replace('Z', '')).toLocaleTimeString()})</div>
                                <div><b>{x.tb_usuario.nm_usuario}</b> fala para <b>Todos</b>:</div>
                                <div> {x.ds_mensagem} </div>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </ContainerConteudo>
    )
}