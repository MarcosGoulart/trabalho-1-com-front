const { Router } = require('express')

const router = Router()
const { UsuarioController } = require('../controllers/Usuario')

const usuarioController = new UsuarioController()

router.get('', (req, res) => usuarioController.listar(req, res))
router.get('/adicionar', (req, res) => usuarioController.carregaTelaCadastro(req, res))
router.get('/buscar/:id', (req, res) => usuarioController.buscarPorId(req, res))
router.post('', (req, res) => usuarioController.cadastrar(req, res))
router.post('/editar/:id', (req, res) => usuarioController.atualizar(req, res))
router.delete('/deletar/:id', (req, res) => usuarioController.deletar(req, res))

module.exports = router
