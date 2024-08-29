//@ts-check
'use strict'

class InternalServerError extends Error {
  status = 500
  constructor(message = '서버 내부 오류') {
      super(message)
      this.name = 'Internal Server Error'
  }
}

module.exports = InternalServerError