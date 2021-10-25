const { PythonShell } = require('python-shell');
const pythonPath = 'C:/Users/PC/AppData/Local/Programs/Python/Python36/python.exe';
const itnPath = './';
const itnFile = 'test.py';
const text = 'Page 2';
const text1 = './csv/campus_tel_20210310.xlsx'

let options = {
    mode : 'text',
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    scriptPath: itnPath,
    args: [text1,text],
    encoding: 'utf8'
}

PythonShell.run(itnFile, options, function(err, result){
    if(err) throw err;

    console.log('re : %j', result);
})
//pip install xlrd
//pip install openpyxl