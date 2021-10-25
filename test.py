##
##2021.03.27 #백재원
##

import pandas as pd #campus_tel_20210310
import numpy as np
import pymysql
import logging
import sys
#import matplotlib
from matplotlib import font_manager

font_location  = "C:/Windows/Fonts/malgun.ttf"
font_name = font_manager.FontProperties(fname = font_location).get_name()
logger = logging.getLogger()

conn = pymysql.connect(
    host='114.71.137.109',
    user='202147018',
    password='bjy969920',
    database='Numberbot',
    charset='utf8'
)
cur = conn.cursor()

def cut(Data):
    rows = int(Data.shape[1] / 2)
    name = '성명'
    number = '번호'
    TotalData = pd.DataFrame({'성명' : Data[name], '번호' : Data[number]})
    for i in np.arange(1,rows):
        name = name + '.' + str(i)
        number = number + '.' + str(i)
        Temp = pd.DataFrame({'성명' : Data[name], '번호' : Data[number]})
        TotalData = TotalData.append(Temp)
        name = '성명'
        number = '번호'    
    return TotalData

#데이터 처리 메소드
def SumData(Data):
    name = '성명'     
    number = '번호'
    
    in_name = ""      #이름
    in_position = ""  #직책
    in_job = ""       #업무
    
    in_group = ""     #그룹
    in_bulid = ""     #위치
    
    sub_num = ""      #번호 2개 저장
    
    TotalData = pd.DataFrame()
    
    ckcnt = 0
    
    #직책과 업무를 구분하기 위해 Check_position
    ck_position = ['총장','비서','처장','부처장','팀장','센터장','단장','부단장','관장','원장','대대장']

    for name, number in zip(Data['성명'], Data['번호']): #한 행씩 읽어서 체크.  
    #이름 " "이 아닌 이름(ㅁㅁ) 붙이있는 애들 수정 필요.... <<<<<<06.15. 문제 인식 추가. 해결해야함.
        if(name == ""):
            continue
        
        if(type(name) == str):
            nmcnt = name.count(" ")
            #sp = Data[name][i].split(" ")
            sp = name.split(" ")
        
        #부서(위치)로 입력되있는 문자열을 부서와 위치로 따로 분리하기 위함.
        if(type(number) == float and type(name)  == str):
                col = name.split("(")
                gpcnt = name.count("(")
                continue
        
        #부서, 위치 입력 
        if(gpcnt > 0 or type(gpcnt) != int):
            in_group = col[0]
            in_bulid = col[1]
        elif(gpcnt < 1):
            in_group = col[0]
            in_bulid = ""
        in_bulid = in_bulid.replace(')','') #괄호 제거.

        if(nmcnt > 0 or type(nmcnt) != int):
            in_name = sp[1]
            in_job = sp[0]
        elif(nmcnt < 1):
            in_name = sp[0]
            in_job = ""
        
        #특별 case 수동 수정 -> 추후 방법 생각
        if(in_name.count("김지훈") >= 1):
            in_name = '김지훈'
            in_job = '기획,발전계획'
        elif (in_name.count("정헌만") >= 1):
            in_name = '정헌만'
            in_job = '공용S/W'
        elif(in_name.count("(사감)") >= 1):
            in_name = '노창희,이복선'
            in_job = '사감'
        elif(in_name.count("사무실") >= 1):
            in_name = in_name[4:7]
            in_job = '사무실'
        elif(in_job.count('사무실') >= 1):
            in_name = in_name.replace('(','')
            in_name = in_name.replace(')','')
        elif(in_name.count('학과장') >= 1): #이름() 붙어있는애들 해결해야함 임시 방편 if
            in_name = in_name.replace('(','')
            in_name = in_name.replace(')','')
            in_name = in_name.replace('학과장','')
            in_name = in_name.replace('학부','')
            in_job = '학과장'
            
        in_job = in_job.replace('(','') #괄호 제거.
        in_job = in_job.replace(')','')
        in_name = in_name.replace('(직통)','직통') #(직통)괄호제거.
        in_name = in_name.replace('예산)','예산') #(직통)괄호제거.
        
        #이름("") 괄호가 바로 붙어 있는 것들 처리.
        #if(in_name.count("(")):
        #    wh_tr = True
        #    wh_num = 0
        #    while(wh_tr):
        #        if(in_name.count(str(wh_num)) >= 1):
        #            wh_tr = False
        #        if(wh_num > 10):
        #            wh_tr = False
        #            
        #        wh_num = wh_num + 1
        #    sp = in_name.split("(")
        #    in_job = sp[1]
        #    in_name = sp[0]
        #    print(in_job)
        #    print(in_name)
        
        in_sub_num = ""
        #서브번호 추출
        if(type(number) == str):
            if(number.count("/") >= 1):
                sub_num = number.split("/")
                number = sub_num[0]
                in_sub_num = sub_num[1]
        
        #직책과 업무를 분리.
        in_position = "" #직책 null
        for j in ck_position:
            if(in_job == j):
                in_position = in_job
                in_job = ""
        
        #DataFrame append
        TotalData = TotalData.append({'성명' : in_name, '번호' : number, '서브번호' : in_sub_num ,'그룹' : in_group,
                                      '위치' : in_bulid, '직책' : in_position, '업무' : in_job}, ignore_index=True)
    return TotalData

def SQLINSERT(Data):
    #title = Data['그룹'][0]
    #chapter_no = 1
    #group_no = 1
    
    #Chapter 이름 
    Data_idx = 258 #numberData와 dict index num 
    for name, group in zip(Data['성명'], Data['그룹']):
        # 챕터번호 추후에 필요하면 사용
        #if(title != Data['그룹'][i]):
        #    title = Data['그룹'][i]
        #    chapter_no = chapter_no + 1
        #    group_no = 1
        
        sql = 'insert into Number_dictionary(chapter_title, group_title, Data_idx) values(%s, %s, %s)'
        cur.execute(sql,(name, group , Data_idx))
        Data_idx = Data_idx + 1
    
    #Chapter 그룹
    Data_idx = 258
    for name, group in zip(Data['성명'], Data['그룹']):
        # 챕터번호 추후에 필요하면 사용
        #if(title != Data['그룹'][i]):
        #    title = Data['그룹'][i]
        #    chapter_no = chapter_no + 1
        #    group_no = 1
        
        sql = 'insert into dictionary_backup(chapter_title, group_title, Data_idx) values(%s, %s, %s)'
        cur.execute(sql,(group, name, Data_idx))
        Data_idx = Data_idx + 1
    
    #NumberData 삽입.
    #for group, name, number, sub_num, job, bulid, position in zip(Data['그룹'], Data['성명'], Data['번호'], Data['서브번호'], Data['업무'], Data['위치'], Data['직책']):
    #    number = str(number)
    #    sub_num = str(sub_num)
    #    sql = 'insert into numberData(num_group, num_number, num_sub_num, num_name, num_job, num_location, num_position) values(%s, %s, %s, %s, %s, %s, %s)'
    #    cur.execute(sql,(group, number, sub_num, name, job, bulid, position))

Data = pd.read_excel(str(sys.argv[1]),  skiprows=2, index_col=False, sheet_name=str(sys.argv[2]), encoding = 'UTF-8', engine = 'openpyxl')
Data = cut(Data)
Data = Data.reset_index()
Data = Data.drop("index", axis=1)

TotalData = SumData(Data)

#TotalData.loc['총장실', '그룹'] = "뭐야"

try:
    SQLINSERT(TotalData)
except Exception as e:
    logger.error(e)
    logger.exception(e)
    raise
finally:
    conn.commit()
    cur.close()
    conn.close()


#excel_writer = pd.ExcelWriter('C:\\Temp\\tel_output.xlsx', engine='xlsxwriter')
#TotalData.to_excel(excel_writer, index = False)
#excel_writer.save()


print(str(sys.argv[2]) 등록완료.)