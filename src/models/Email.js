class Email {
    constructor(email, ehPrincipal){
        this.email = email
        this.ehPrincipal = ehPrincipal
    }
}
const { inspect } = require('util')
class EmailRepository {

    constructor(db){
        this.db = db
    }

    buscarPorUsuario(idUsuario){
        const stmt = this.db.prepare('SELECT * FROM email WHERE id_usuario = ?')
        return stmt.all(idUsuario)
    }

    buscarEmailPrincipal(idUsuario){
        const stmt = this.db.prepare(`SELECT * FROM email WHERE id_usuario = ? and eh_principal = true`)
        return stmt.get(idUsuario)
    }

    inserir(idUsuario, email) {
        console.log('idUsuario ' + idUsuario)
        console.log('email ' + inspect(email))
        const stmt = this.db.prepare(`INSERT INTO 
        email (email, id_usuario, eh_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(email.email, idUsuario, email.ehPrincipal)
    }

    atualizar(email){
        const stmt = this.db.prepare(`UPDATE email SET email = ?, eh_principal = ? WHERE email = ?`)
        return stmt.run(email.email, email.ehPrincipal, email.email)
    }

    deletar(email){
        const stmt = this.db.prepare(`DELETE FROM email WHERE email = ?`)
        return stmt.run(email)
    }

    deletarPorUsuario(idUsuario){
        const stmt = this.db.prepare(`DELETE FROM email WHERE id_usuario = ?`)
        return stmt.run(idUsuario)
    }
}

module.exports = { Email, EmailRepository }