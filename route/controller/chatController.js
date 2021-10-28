const router = require('express').Router()
const chat = require('../model/chat')
const multer = require("multer")
var promise=require('promise')
var db=require('../../db')
router.get('/', chat.main)
router.post('/chat',chat.chat)
router.get('/upload', chat.upload);

//python 관련
const { PythonShell } = require('python-shell');
const pythonPath = 'C:/Users/PC/AppData/Local/Programs/Python/Python36/python.exe';
const itnPath = './csv';
const itnFile = 'update.py';
const text2 = 'Page 1';
const text3 = 'Page 2';


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


    //TODO : 비동기 동작 중, 동기 동작으로 수정, function으로 빼기.

    console.log( '파일이름 : ' + result.originalName + " upload 완료.")

    datainsert(result.originalName)

    res.json(result);
});

async function datainsert(filename){

    const text1 = './csv/'+filename;

    sql="delete from Number_dictionary"
    db.query(sql);

    sql="delete from numberData"
    db.query(sql);

    let options = {
        mode : 'text',
        pythonPath: pythonPath,
        pythonOptions: ['-u'],
        scriptPath: itnPath,
        args: [text1,text2],
        encoding: 'utf8'
    }

    await pyinsert(options);
    console.log("페이지 1끝")
    // PythonShell.run(itnFile, options, function(err, result){
    //     if(err) throw err;
    
    //     console.log('re : %j', result);
    // })

    let options2 = {
        mode : 'text',
        pythonPath: pythonPath,
        pythonOptions: ['-u'],
        scriptPath: itnPath,
        args: [text1,text3],
        encoding: 'utf8'
    }
    console.log("페이지 2시작")
    await pyinsert(options2);
    // PythonShell.run(itnFile, options2, function(err, result){
    //     if(err) throw err;
    
    //     console.log('re : %j', result);
    // })
    console.log("2파이선 완료")
}
function pyinsert(options){
    return new promise( (resolve, reject) => {
        console.log(" 시작")
        PythonShell.run(itnFile, options, function(err, result){
            if(err) throw err;
        
            console.log('re : %j', result);
            resolve(result);
        })
    })
}

// function pythoninsert(quizDefalt, i) {return new Promise(function(resolve, reject){
//     PythonShell.run(itnFile, options, function(err, result){
//         if(err) throw err;
    
//         console.log('re : %j', result);
//     })
//     });
// }
module.exports = router