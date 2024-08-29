//@ts-check
'use strict'

const {servers} = require('../../utils/str-def')

const app = require('express')()

module.exports = {
 getAccountUsers : async (req, res) => {
    const {accountId, searchOption} = req.query

    //수신 데이터 유효성 검사 및 확인
    const specificAccount = accountId ?? false; //특정 계정을 대상으로 검색하는지
    //if (accountId === '') throw new global.ErrorTypes.BadRequestError()
    const optionList = searchOption.split(',');
    const patternMatching = optionList.includes('0');
    const ignoreCase = optionList.includes('1');


   
    const db = req.app.get('database')
    let query = 
    `SELECT
      uId,
      loginId AS userId,
      regTime AS regTime,
      updateTime AS updateTime
    FROM account`

    if(specificAccount)
    {
      if(ignoreCase)
        query += ' WHERE loginId'
      else
        query += ' WHERE loginId COLLATE Korean_Wansung_CS_AS'

      let tagetAccountId = accountId;
      //패턴매칭 사용시
      if(patternMatching)
      {
        //LIKE 절에서 특수문자로 사용되는 문자들은 ESCAPE처리를 위해 앞에 '\'를 붙임
        tagetAccountId = accountId.replaceAll(/\[|\]|\^|%|_/g, (match) => `\\${match}`);

        if(tagetAccountId.includes('\\'))
          query += ` LIKE '%${tagetAccountId}%' ESCAPE '\\'`
        else
          query += ` LIKE '%${tagetAccountId}%'`
      }
      else
      {
          query += ` = '${tagetAccountId}'`
      }

    }



      

    const result = await db.execute('base_global', query)
  
    res.status(200).send({data: result.recordset})
  },

  //계정의 캐릭터정보를 확인
  getAccountCharacters : async (req, res) => {
    const {uId} = req.query

    //수신 데이터 유효성 검사 및 확인
    if (uId === '') throw new global.ErrorTypes.BadRequestError()


    //게임db 전체에서 조회
    const db = req.app.get('database');
    const sqlQueryData = [];

    for (let server of servers)
    {
      let query = 
      `SELECT
        '${server}' AS serverName,
        uId AS userId,
        charId AS characterId,
        name AS charName
      FROM character_info
      WHERE uId = ${uId}`
      const result = await db.execute(server, query)

      sqlQueryData.push(result.recordset);

    }

    
    //각 db에서 select된 recordset 을 합침
    const sendData = [];
    for (const temp of sqlQueryData)
    {
      sendData.push(...temp);
    }
    

    res.status(200).send({data: sendData})
  }



}