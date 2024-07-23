class Usuario {
    constructor(id, nome, cpf, tipo, telefonePrincipal, telefones = null, emailPrincipal, emails = null){
        this.id = id
        this.nome = nome
        this.cpf = cpf
        this.tipo = tipo
        this.telefonePrincipal = telefonePrincipal
        this.telefones = telefones
        this.emailPrincipal = emailPrincipal
        this.emails = emails
    }
}

class UsuarioRepository {
    constructor(db){
        this.db = db
    }

    buscaTodos(){
        const stmt = this.db.prepare('SELECT * FROM usuario')
        return stmt.all()
    }

    buscaPorId(id){
        console.log(id)
        const stmt = this.db.prepare(`SELECT * FROM usuario WHERE id = ?`)
        return stmt.get(id)
    }

    inserir(usuario){
        const stmt = this.db.prepare(` INSERT INTO 
        usuario (nome, cpf, tipo) 
        VALUES (?, ?, ?)`)
        return stmt.run(usuario.nome, usuario.cpf, usuario.tipo)
    }

    atualizar(usuario){
        const stmt = this.db.prepare(`UPDATE usuario SET nome = ?, cpf = ?, tipo = ? WHERE id = ?`)
        return stmt.run(usuario.nome, usuario.cpf, usuario.tipo, usuario.id)
    }

    deletar(id){
        const stmt = this.db.prepare(`DELETE FROM usuario WHERE id = ?`)
        return stmt.run(id)
    }
}

module.exports = { UsuarioRepository, Usuario }