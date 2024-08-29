//@ts-check
'use strict'

const arrDef = require('../../utils/str-def')


const app = require('express')()

module.exports = {
  selectElectronJumpLog : async (req, res) => {
    //http요청 데이터확인
    const { server, rankType, start, end, charName } = req.query
    const serverNames = server.split(',');
    const validRankTypes = rankType ?? false; //유효한 랭크타입이 지정됐는지 //!Number.isNaN(rankType);
    const specificUser = charName ?? false; //특정 유저대상으로 검색하는지

    const db = req.app.get('database')
    const sqlQueryData = [];

    if(validRankTypes)
    {
      for (const serverName of serverNames)
      {
          if(!serverName)
            continue;
    
          // 여러 db에서 가져오므로 구별이 가능하게 각 db이름 컬럼을 추가해주도록한다
          let query = 
          `SELECT
            '${serverName}' AS serverName
            ,(select top 1 [name] from character_info AS charInfo where charInfo.charId = jumpLog.charId) AS charName
            ,rankType
            ,score
            ,startDate
            ,endDate
            ,playTime
          FROM game_electronic_jump_log AS jumpLog
          WHERE rankType in (${rankType}) AND
          endDate BETWEEN '${start}' AND DATEADD(DAY, 1, '${end}')` //끝난 시각기준...

          if(specificUser)
          {
            query += `AND charId = (SELECT TOP 1 charId FROM  character_info WHERE [name] = '${charName}')`;
          }

          const result = await db.execute(serverName, query)
          sqlQueryData.push(result.recordset) 
      }
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