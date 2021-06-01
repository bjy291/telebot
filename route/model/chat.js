var db=require('../../db')
var promise=require('promise')
//const OpenKoreanText = require('open-korean-text-node').default;
    var mod = require('korean-text-analytics');
    var task = new mod.TaskQueue();
exports.main=(req,res)=>{
        res.render('main')
}
exports.chat=async (req,res)=>{
        userText=req.body.userText
        if(userText.length<2){
                res.send({dataNone:true})
        }
        flag=req.body.flag
        data=await extraction(userText)
        console.log("data : ",data)
        sql=await setSql(data)
        console.log(sql)
        result=await getContent(sql,flag).then((result)=>{
                return result
        }).catch((err)=>{
                return null
        })
        if(result){
                res.send({data:result,dataNone:false})
        //         sumD=sumData(data)
        //         inQuiry(userText,sumD)
        //         data.map(counter)
        }else{
                res.send({dataNone:true})
        }
}
function counter(data){
        sql="select idx,count(*) as cnt from log_counter where keyword = ?"
        db.query(sql,data,(err,result)=>{
                if(err) console.log(err)
                else{
                        if(result[0].cnt){
                                sql="update log_counter set count=count+1 where idx=?"
                                db.query(sql,result[0].idx,(err,result)=>{
                                        if(err) console.log(err)
                                        else{
                                                if(result.affectedRows){
                                                        return
                                                }
                                                else{
                                                        console.log(result)
                                                        return
                                                }
                                        }
                                })
                        }else{
                                sql="insert into log_counter(keyword) values(?)"
                                db.query(sql,data,(err,result)=>{
                                        if(err) console.log(err)
                                        else{
                                                if(result.affectedRows){
                                                        return
                                                }else{
                                                        console.log(result)
                                                        return
                                                }
                                        }
                                })
                        }
                }
        })
}
function sumData(data){
        text=""
        for(i=0;i<data.length;i++){
                if(i!=data.length-1)
                        text+=data[i]+"^"
                else
                        text+=data[i]
        }
        return text
}
function inQuiry(userText,sumD){
        sql="insert into log_inquiry(sentence,keyword) values(?,?)"
        db.query(sql,[userText,sumD],(err,result)=>{
                if(err) console.log(err)
                else{
                        if(result.affectedRows){
                                return
                        }else{
                                console.log(result)
                                return
                        }
                }
        })
}
// async function setSql(data){
//         if(data){
//                 sql="select idx, group_title, Data_idx from Number_dictionary where doc_class=? and ("
//                 data.map( (token,index) => {
//                         if(index == 0) sql += "chapter_title like '%"+token+"%' or group_title like '%"+token+"%' "
//                         else sql +="or chapter_title like '%"+token+"%' or group_title like '%"+token+"%' "
//                 })
//                 sql+=")"
//                 return sql
//         }else{
//                 return null
//         }
// }
async function setSql(data){
        if(data){
                sql="select numberData.* from Number_dictionary join numberData using(Data_idx) where ("
                data.map( (token,index) => {
                        console.log(token)
                        if(index == 0) sql += "chapter_title like '%"+token+"%' "
                        else sql +="or chapter_title like '%"+token+"%'  "
                })
                sql+=")"
                return sql
        }else{
                return null
        }
}
async function getContent(sql,flag){
        return new Promise((resolve,reject)=>{
                if(sql){
                        db.query(sql,flag,(err,result)=>{
                                if(err) reject(err)
                                else{
                                        console.log("sql : ", result[0])
                                        resolve(result)
                                }
                        })
                }else{
                        reject('키워드 없음')
                }
        })
}
// async function extraction(userText){
//         data=OpenKoreanText.tokenizeSync(userText).toJSON()
//         result=[]
//         for(text of data){
//                 if(text['pos']=='Noun' && text['text'].length>1){
//                         result.push(text['text'])
//                 }
//         }
//         return result
// }
async function extraction(userText){
        return new promise( (resolve, reject) => {
                resultData=[]
                mod.ExecuteMorphModule(userText, function(err, rep){
                        if(err) reject(err)
                        data = rep
                        for(text of data['morphed']){
                                if(text['word'].length>1){
                                        resultData.push(text['word'])
                                }
                        }
                        resolve(resultData)
                })
        })
        // mod.ExecuteMorphModule(userText, function(err, rep){
        //         data=rep
        //         console.log("extr1 : ",JSON.stringify(data['morphed'][0]['word']))

        //         for(text of data['morphed']){
        //                 if(text['word'].length>1){
        //                         resultData.push(text['word'])
        //                 }
        //         }
               
        //         console.log("reet:",resultData)
        //         return resultData   
        // })

        // mod.ExecuteMorphModule('테스트', function(err, rep){
        //         console.log(err, rep);
        // })
        //return resultData
}
function parse(str){
        return new promise( (resolve, reject) => {
                mod.ExecuteMorphModule(str, function(err, rep){
                        if(err) reject(err)
                        resolve(rep)
                })
        })
}
async function initialize(){
        // OpenKoreanText.normalizeSync('테스트')
        // OpenKoreanText.tokenizeSync('테스트').toJSON()
        let str = "테스트"
        let parseData = await parse(str)
        console.log(parseData)
        // task.addSteamTask('동해물과 백두산이 마르고 닳도록', {Comment : '추가정보'})
        // task.addSteamTask('하나님이 보우하사 우리나라만세', {Comment : '추가정보'})
        // task.exec(function(err, rep){
        //         var tags = mod.ResultOnlyTags(rep)
        //         console.log(tags)
        // })
}
initialize().then(
        () => console.log('Initialized Finished'),
        (error) => console.error('Error',error)
)

//https://www.npmjs.com/package/korean-text-analytics