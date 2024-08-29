'use strict'
const app = require('express')()
const dbManager = require(appRoot + '/sql/db-manager')

async function selectSurvivalRateReturn(req, res) {
  const { start, end } = req.query

  const query = `
  WITH UserActivity AS (
    SELECT 
        uid,
        login_time,
        LAG(login_time) OVER (PARTITION BY uid ORDER BY login_time) AS prev_login_time    
    FROM 
        [base_global].[dbo].[User_Connect_Log]
  ),
  ReturnUsers AS (
    SELECT
        uid,
        CONVERT(VARCHAR, login_time, 23) AS return_date,
        prev_login_time
    FROM
        UserActivity
    WHERE
      DATEDIFF(DAY, prev_login_time, login_time) >= 30
  ),
  RetentionData AS (
    SELECT 
        R.uid,
        R.return_date,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 1 THEN 1 ELSE 0 END) AS D1,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 2 THEN 1 ELSE 0 END) AS D2,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 3 THEN 1 ELSE 0 END) AS D3,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 7 THEN 1 ELSE 0 END) AS D7,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 14 THEN 1 ELSE 0 END) AS D14,
        MAX(CASE WHEN DATEDIFF(DAY, R.return_date, U.login_time) = 30 THEN 1 ELSE 0 END) AS D30
    FROM 
      ReturnUsers R
    LEFT JOIN User_Connect_Log U ON R.uid = U.uid
      AND U.login_time >= R.return_date
      AND U.login_time < DATEADD(DAY, 31, R.return_date)
    GROUP BY R.uid, R.return_date
  )
  SELECT 
    return_date,
    COUNT(DISTINCT uid) AS total_return_users,
    SUM(D1) AS D1_users,
    SUM(D2) AS D2_users,
    SUM(D3) AS D3_users,
    SUM(D7) AS D7_users,
    SUM(D14) AS D14_users,
    SUM(D30) AS D30_users
  FROM 
    RetentionData
  WHERE 
    return_date BETWEEN '${start}' AND '${end}'
  GROUP BY 
    return_date
  ORDER BY 
    return_date;
  `;

  const result = await req.app.get('database').execute('base_global', query)

  if (result.recordset.length === 0) {
    return res.status(404).send({ message: "No data found for the given date." });
  }
 
  result.recordset.forEach(row => {
    row.D1_percentage = (row.D1_users / row.total_return_users *100).toFixed(2);
    row.D2_percentage = (row.D2_users / row.total_return_users *100).toFixed(2);
    row.D3_percentage = (row.D3_users / row.total_return_users *100).toFixed(2);
    row.D7_percentage = (row.D7_users / row.total_return_users *100).toFixed(2);
    row.D14_percentage = (row.D14_users / row.total_return_users *100).toFixed(2);
    row.D30_percentage = (row.D30_users / row.total_return_users *100).toFixed(2);
  });
  
  res.status(200).send({ data: result.recordset });
}


module.exports = {selectSurvivalRateReturn}