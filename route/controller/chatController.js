const router = require('express').Router()
const chat = require('../model/chat')
const multer = require("multer")
var db=require('../../db')
router.get('/', chat.main)
router.post('/chat',chat.chat)
router.get('/upload', chat.upload);

// let upload = multer({
//     dest: './csv/'
// })

let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './csv/')
    },
    filename: function(req,file, callback){
        callback(null, file.originalname);
    }
})

let upload = multer({
    storage: storage
})

router.post('/upload', upload.single("csvfile"), function(req, res, next){
    let file = req.file

    let result={
        originalName :file.originalname,
        dname: file.fieldname,
        size : file.size
    }
    
    sql="insert into csvfile(csv_name, csv_filedname, csv_size) values(?, ?, ?)"
    db.query(sql, [result.originalName, result.dname, result.size], (err, result) =>{
        if(err){
            console.log("csv File insert Err!!!!")
        }else{
            console.log(result)
        }
    })

    res.json(result);
});

module.exports = router