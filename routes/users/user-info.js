//@ts-check
'use strict'

const app = require('express')()

async function getUserInfo(req, res, next) {
  const {server, userName, searchOption} = req.query
  const optionList = searchOption.split(',');
  const patternMatching = optionList.includes('0');
  const ignoreCase = optionList.includes('1');

  if (userName === '') throw new global.ErrorTypes.BadRequestError()
  
  let query =
  `SELECT 
    charId AS characterId,
    uId AS userId,
    name AS userName,
    charState,
    level AS userLv,
    exp AS userExp,
    lastZoneId,
    lastPositionX,
    lastPositionZ,
    regDate AS createDate,
    updateDate
  FROM character_info`


  if(ignoreCase)
    query += ' WHERE name'
  else
    query += ' WHERE name COLLATE Korean_Wansung_CS_AS'

  let tagetUserName = userName;
  //패턴매칭 사용시
  if(patternMatching)
  {
    //LIKE 절에서 특수문자로 사용되는 문자들은 ESCAPE처리를 위해 앞에 '\'를 붙임
    tagetUserName = tagetUserName.replaceAll(/\[|\]|\^|%|_/g, (match) => `\\${match}`);

    if(tagetUserName.includes('\\'))
      query += ` LIKE '%${tagetUserName}%' ESCAPE '\\'`
    else
      query += ` LIKE '%${tagetUserName}%'`
  }
  else
  {
      query += ` = '${tagetUserName}'`
  }

  const result = await req.app.get('database').execute(server, query)

  console.log(result)
  res.status(200).send({data: result.recordset})
}

module.exports = { getUserInfo }