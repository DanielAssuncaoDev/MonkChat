import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:3030'
})

export default class Api {
    async listarMensagens(idSala) {
        let r = await api.get(`/chat/${idSala}`);
        return r.data;
    }

    async inserirMensagem(nomeSala, nomeUsuario, mensagem) {
        let chat = {
            sala: {
                nome: nomeSala
            },
            usuario: {
                nome: nomeUsuario
            },
            mensagem: mensagem
        }
        let r = await api.post(`/chat`, chat);
        return r.data;
    }

    async inserirSala(sala) {
        let r = await api.post(`/sala/`, { nome: sala });
        return r.data;
    }

    async inserirUsuario(usuario) {
        let r = await api.post(`/usuario/`, { nome: usuario });
        return r.data;
    }

    async login(senha, user) {
        let l = {
            user: user,
            senha: senha
        } 

        let r = await api.post(`/login/`, l)
        return r.data
    }


    async deletarMensagem(idMensagem) {
        let r = await api.delete(`/chat/${idMensagem}`)
        return r.data        
    }

    async alterarMensagem(idMensagem, mensagem){
        let r = await api.put(`/chat/${idMensagem}`, {mensagem})
        return r.data
    }
}