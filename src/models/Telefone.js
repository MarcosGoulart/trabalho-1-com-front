class Telefone {
    constructor(id, numero, ehPrincipal){
        this.id = id
        this.numero = numero
        this.ehPrincipal = ehPrincipal
    }
}
const { inspect } = require('util')
class TelefoneRepository{
    constructor(db){
        this.db = db
    }

    buscarPorUsuario(idUsuario){
        const stmt = this.db.prepare('SELECT * FROM telefone WHERE id_usuario = ?')
        return stmt.all(idUsuario)
    }

    buscarTelefonePrincipal(idUsuario){
        const stmt = this.db.prepare(`SELECT * FROM telefone WHERE id_usuario = ? and eh_principal = true`)
        return stmt.get(idUsuario)
    }


    inserir(idUsuario, telefone) {
        const stmt = this.db.prepare(`INSERT INTO 
        telefone (numero, id_usuario, eh_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(telefone.numero, idUsuario, telefone.ehPrincipal)
    }

    atualizar(telefone){
        const stmt = this.db.prepare(`UPDATE telefone SET numero = ?, eh_principal = ? WHERE id = ?`)
        return stmt.run(telefone.numero, telefone.ehPrincipal, telefone.id)
    }

    deletar(id){
        const stmt = this.db.prepare(`DELETE FROM telefone WHERE id = ?`)
        return stmt.run(id)
    }

    deletarPorUsuario(idUsuario){
        const stmt = this.db.prepare(`DELETE FROM telefone WHERE id_usuario = ?`)
        return stmt.run(idUsuario)
    }
}

module.exports = { TelefoneRepository, Telefone }