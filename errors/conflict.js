//@ts-check
'use strict'

class ConflictError extends Error {
  status = 409
  constructor(message = '요청을 수행 하는 중에 충돌이 생겼습니다.') {
      super(message)
      this.name = 'Conflict'
  }
}

module.exports = ConflictError