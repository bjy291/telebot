var db=require('../../db')
var promise=require('promise')
//const OpenKoreanText = require('open-korean-text-node').default;
exports.main=(req,res)=>{
        res.render('main')
}
// exports.chat=async (req,res)=>{
//         userText=req.body.userText
//         if(userText.length<2){
//                 res.send({dataNone:true})
//         }
//         flag=req.body.flag
//         data=await extraction(userText)
//         sql=await setSql(data)
//         result=await getContent(sql,flag).then((result)=>{
//                 return result
//         }).catch((err)=>{
//                 return null
//         })
//         if(result){
//                 res.send({data:result,dataNone:false})
//                 sumD=sumData(data)
//                 inQuiry(userText,sumD)
//                 data.map(counter)
//         }else{
//                 res.send({dataNone:true})
//         }
// }
// function counter(data){
//         sql="select idx,count(*) as cnt from log_counter where keyword = ?"
//         db.query(sql,data,(err,result)=>{
//                 if(err) console.log(err)
//                 else{
//                         if(result[0].cnt){
//                                 sql="update log_counter set count=count+1 where idx=?"
//                                 db.query(sql,result[0].idx,(err,result)=>{
//                                         if(err) console.log(err)
//                                         else{
//                                                 if(result.affectedRows){
//                                                         return
//                                                 }
//                                                 else{
//                                                         console.log(result)
//                                                         return
//                                                 }
//                                         }
//                                 })
//                         }else{
//                                 sql="insert into log_counter(keyword) values(?)"
//                                 db.query(sql,data,(err,result)=>{
//                                         if(err) console.log(err)
//                                         else{
//                                                 if(result.affectedRows){
//                                                         return
//                                                 }else{
//                                                         console.log(result)
//                                                         return
//                                                 }
//                                         }
//                                 })
//                         }
//                 }
//         })
// }
// function sumData(data){
//         text=""
//         for(i=0;i<data.length;i++){
//                 if(i!=data.length-1)
//                         text+=data[i]+"^"
//                 else
//                         text+=data[i]
//         }
//         return text
// }
// function inQuiry(userText,sumD){
//         sql="insert into log_inquiry(sentence,keyword) values(?,?)"
//         db.query(sql,[userText,sumD],(err,result)=>{
//                 if(err) console.log(err)
//                 else{
//                         if(result.affectedRows){
//                                 return
//                         }else{
//                                 console.log(result)
//                                 return
//                         }
//                 }
//         })
// }
// async function setSql(data){
//         if(data){
//                 sql="select idx,group_no,group_title,content from data_dictionary where doc_class=? and ("
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
// async function getContent(sql,flag){
//         return new Promise((resolve,reject)=>{
//                 if(sql){
//                         db.query(sql,flag,(err,result)=>{
//                                 if(err) reject(err)
//                                 else{
//                                         // console.log(result)
//                                         resolve(result)
//                                 }
//                         })
//                 }else{
//                         reject('키워드 없음')
//                 }
//         })
// }
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
// async function initialize(){
//         OpenKoreanText.normalizeSync('테스트')
//         OpenKoreanText.tokenizeSync('테스트').toJSON()
// }
// initialize().then(
//         () => console.log('Initialized Finished'),
//         (error) => console.error('Error',error)
// )