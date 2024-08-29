//@ts-check
'use strict'

class BadGatewayError extends Error {
  status = 400
  constructor(message = '불량 게이트웨이'){
      super(message)
      this.name = 'Bad Request'
  }
}

module.exports = BadGatewayError