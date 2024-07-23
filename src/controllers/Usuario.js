const db = require('../database/dbConnection')
const { UsuarioRepository, Usuario } = require('../models/Usuario') 
const { TelefoneRepository, Telefone } = require('../models/Telefone') 
const { EmailRepository, Email } = require('../models/Email')
const { inspect } = require('util')

class UsuarioController {

    constructor(){
        this.usuarioRepository = new UsuarioRepository(db)
        this.telefoneRepository = new TelefoneRepository(db)
        this.emailRepository = new EmailRepository(db)
    }

    listar(req, res) {
        console.log('entrou aqui')
        let usuarios = this.usuarioRepository.buscaTodos()
        
        for(let usuario of usuarios){
            //adicionando telefone principal
            const telefone = this.telefoneRepository.buscarTelefonePrincipal(usuario.id)
            if(telefone) usuario.telefonePrincipal = telefone.numero

            //adicionando email principal
            const email = this.emailRepository.buscarEmailPrincipal(usuario.id)
            if(email) usuario.emailPrincipal = email.email
        }
        res.render('usuario', { usuarios })
    }

    carregaTelaCadastro(req, res) {
        res.render('add-usuario')
    }

    buscarPorId(req, res){
        const id = req.params.id
        const usuario = this.usuarioRepository.buscaPorId(id)
        
        //adicionando lista de telefones
        const telefones = this.telefoneRepository.buscarPorUsuario(usuario.id)
        usuario.telefones = telefones

        //adicionando lista emails
        const emails = this.emailRepository.buscarPorUsuario(usuario.id)
        usuario.emails = emails

        res.json(usuario)
    }

    cadastrar(req, res){
        const { nome, cpf, tipo, telefones, emails } = req.body
        const usuario = new Usuario(null, nome, cpf, tipo)
        let retornoUsuarioInserido = this.usuarioRepository.inserir(usuario)
        
        const idUsuario = retornoUsuarioInserido?.lastInsertRowid
        if (idUsuario) {
            //Insere telefone
            for(let telefone of telefones) {
                const objetoTelefone = new Telefone(null, telefone.numero, telefone.ehPrincipal)
                this.telefoneRepository.inserir(idUsuario, objetoTelefone)
            }

            //Insere email
            for(let email of emails){
                const objetoEmail = new Email(email.email, email.ehPrincipal)
                this.emailRepository.inserir(idUsuario, objetoEmail)
            }
        }

        res.sendStatus(201)
    }

    atualizar(req, res){
        const { nome, cpf, tipo, telefones, emails } = req.body
        const { id } = req.params
        const usuario = new Usuario(id, nome, cpf, tipo)

        //Verifica se o usuario pode ser atualizado
        if(usuario.tipo == 'cliente') this.usuarioRepository.atualizar(usuario)

        //Verifica se existe apenas um telefone principal
        let contadorPrincipal = 0
        console.log(inspect(telefones))
        for(let telefone of telefones) if(telefone.ehPrincipal == 1) contadorPrincipal++
        if(contadorPrincipal > 1) return res.status(400).send('Só é possível ter um Telefone principal')
        else if(contadorPrincipal == 0 && telefones.length == 0) return res.status(400).send('É necessário ao menos um Telefone principal')
        //Verifica se existe apenas um email principal
        contadorPrincipal = 0
        for(let email of emails) if(email.ehPrincipal == 1) contadorPrincipal++
        if(contadorPrincipal > 1) return res.status(400).send('Só é possível ter um Email principal')
        else if(contadorPrincipal == 0 && emails.length > 0) return res.status(400).send('É necessário ao menos um Email principal')
        
        
        //Atualiza telefone
        let telefonesAntigos = this.telefoneRepository.buscarPorUsuario(usuario.id)

        let telefonesInserir = telefones.filter((telefone) => { if(telefonesAntigos.findIndex((telefoneAntigo) => telefoneAntigo.id == telefone.id) == -1) return telefone })
        let telefonesDeletar = telefonesAntigos.filter((telefoneAntigo) => { if(telefones.findIndex((telefone) => telefoneAntigo.id == telefone.id) == -1) return telefoneAntigo })
        let telefonesAtualizar = telefones.filter((telefone) => { if(telefonesAntigos.findIndex((telefoneAntigo) => telefoneAntigo.id == telefone.id) != -1) return telefone })

        for(let telefone of telefonesInserir){
            let telefoneObjeto = new Telefone(null, telefone.numero, telefone.ehPrincipal)
            this.telefoneRepository.inserir(id, telefoneObjeto)
        }

        for(let telefone of telefonesDeletar){
            this.telefoneRepository.deletar(telefone.id)
        }

        for(let telefone of telefonesAtualizar){
            let telefoneObjeto = new Telefone(telefone.id, telefone.numero, telefone.ehPrincipal)
            this.telefoneRepository.atualizar(telefoneObjeto)
        }
        
        //Atualiza email
        let emailsAntigos = this.emailRepository.buscarPorUsuario(usuario.id)

        let emailsInserir = emails.filter((email) => { if(emailsAntigos.findIndex((emailAntigo) => emailAntigo.email === email.email) == -1) return email })
        let emailsDeletar = emailsAntigos.filter((emailAntigo) => { if(emails.findIndex((email) => emailAntigo.email === email.email) == -1) return emailAntigo })
        let emailsAtualizar = emails.filter((email) => { if(emailsAntigos.findIndex((emailAntigo) => emailAntigo.email === email.email) != -1) return email })

        for(let email of emailsInserir){
            let emailbjeto = new Email(email.email, email.ehPrincipal)
            this.emailRepository.inserir(id, emailbjeto)
        }

        for(let email of emailsDeletar){
            this.emailRepository.deletar(email.email)
        }

        for(let email of emailsAtualizar){
            let emailObjeto = new Email(email.email, email.ehPrincipal)
            this.emailRepository.atualizar(emailObjeto)
        }
        
        res.sendStatus(200)
    }

    deletar(req, res){
        const id = req.params.id

        //Verifica se o usuario é admin
        const usuario = this.usuarioRepository.buscaPorId(id)
        if(usuario.tipo == 'admin') return res.status(403 ).send('Usuário admin não pode ser removido')

        this.telefoneRepository.deletarPorUsuario(id)
        this.emailRepository.deletarPorUsuario(id)
        this.usuarioRepository.deletar(id)
        res.sendStatus(200)
    }
}

module.exports = { UsuarioController }