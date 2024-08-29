'use strict'
const app = require('express')()
const dbManager = require(appRoot + '/sql/db-manager')

async function selectSurvivalRateNew(req, res) {
  const { start, end } = req.query

  //신규 유저 검색
  const userQuery = `
    SELECT uId
    FROM [base_global].[dbo].[account]
    WHERE CAST(regTime AS DATE) BETWEEN '${start}' AND DATEADD(ms, -3, DATEADD(day, 1, CAST('${end}' AS DATETIME)));
  `;

  const usersResult = await req.app.get('database').execute('base_global', userQuery)

  //신규 유저 없으면 리턴
  if (usersResult.recordset.length === 0) {
    return res.status(404).send({ message: "No new users found for the given date." });
  }

  const userIds = Array.isArray(usersResult.recordset) ?
    usersResult.recordset.map(user => `'${user.uId}'`).join(',') :
    '';

  //신규 유저 잔존율 조회
  const retentionQuery = `
  WITH NewUserActivity AS (
    SELECT 
      uid,
      CAST(login_time AS DATE) AS login_date
    FROM 
      [base_global].[dbo].[User_Connect_Log]
    WHERE
      uid IN (${userIds})
      AND CAST(login_time AS DATE) BETWEEN '${start}' AND '${end}'
  ),
  FirstLogin AS (
    SELECT 
      uid,
      MIN(login_date) AS first_login_date
    FROM 
      NewUserActivity
    GROUP BY 
      uid
  ),
  RetentionData AS (
    SELECT 
      F.uid,
      F.first_login_date,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 1 THEN 1 ELSE 0 END) AS D1,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 2 THEN 1 ELSE 0 END) AS D2,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 3 THEN 1 ELSE 0 END) AS D3,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 7 THEN 1 ELSE 0 END) AS D7,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 14 THEN 1 ELSE 0 END) AS D14,
      MAX(CASE WHEN DATEDIFF(DAY, F.first_login_date, A.login_date) = 30 THEN 1 ELSE 0 END) AS D30
    FROM 
      FirstLogin F
    LEFT JOIN NewUserActivity A ON F.uid = A.uid
    GROUP BY 
      F.uid, F.first_login_date
  )
    SELECT 
    CONVERT(VARCHAR, first_login_date, 23) AS regdate,
      COUNT(uid) AS total_new_users,
      SUM(D1) AS D1_users,
      SUM(D2) AS D2_users,
      SUM(D3) AS D3_users,
      SUM(D7) AS D7_users,
      SUM(D14) AS D14_users,
      SUM(D30) AS D30_users
    FROM 
      RetentionData
    GROUP BY 
      first_login_date
    ORDER BY 
      first_login_date;
  `;

  const retentionResult = await req.app.get('database').execute('base_global', retentionQuery)

  if (retentionResult.recordset.length === 0) {
    return res.status(404).send({ message: "No retention data found for the new users." });
  }
 
  retentionResult.recordset.forEach(row => {
    row.D1_percentage = (row.D1_users / row.total_new_users *100).toFixed(2);
    row.D2_percentage = (row.D2_users / row.total_new_users *100).toFixed(2);
    row.D3_percentage = (row.D3_users / row.total_new_users *100).toFixed(2);
    row.D7_percentage = (row.D7_users / row.total_new_users *100).toFixed(2);
    row.D14_percentage = (row.D14_users / row.total_new_users *100).toFixed(2);
    row.D30_percentage = (row.D30_users / row.total_new_users *100).toFixed(2);
  });

  res.status(200).send({ data: retentionResult.recordset });
}


module.exports = {selectSurvivalRateNew}