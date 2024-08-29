const express = require('express')
const local_login = require('./local-login')

const loadPassport = (app, passport) => {
  passport.use('local', local_login)
  //req.session 객체는 express-session에서 생성하는 것이므로 express-session 미들웨어보다 뒤에 세팅해야 된다.
  app.use(passport.initialize()) // 요청 객체에 passport 설정을 심음
  app.use(passport.session()) //req.session 객제에 passport 인증완료 정보를 추가 저장 passport.session()이 실행되면 세션쿠키 정보를 바탕으로 deserializeUser()가 실행
  //app.use(flash())

  //사용자 인증 성공 시 호출
  //사용자 정보를 이용해 세션을 만듦
  //로그인 이후에 들어오는 요청은 deserializeUser 메소드 안에서 이 세션을 확인
  passport.serializeUser(function(user, done) {
    done(null, user) //session 저장, 앞으로 req.session으로 접근해서 확인가능
  })

  //사용자 인증 이후 사용자 요청시마다 호출
  // user -> 사용자 인증 성공시 serializeUser 메소드를 이용해 만들었던 세션 정보가 파라미터로 넘어옴
  passport.deserializeUser(function(user, done) { 
    done(null, user)
    //사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
    //두 번째 파라미터로 지정한 사용자 정보는 req.user 객체로 복원 됨
    //여기에서는 파라미터로 받은 user를 별도로 처리하지 않고 그대로 넘겨줌
  })
}

module.exports = loadPassport