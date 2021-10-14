const router = require('express').Router()
const chat = require('../model/chat')
router.get('/', chat.main)
router.post('/chat',chat.chat)
// TODO : CSV파일 업로드하는 url 추가 get - window 사이즈로 
// TODO : post 
module.exports = router