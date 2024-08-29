//@ts-check
'use strict'

class UnauthorizedError extends Error {
  status = 401
  constructor(message = '액세스 권한이 없습니다. 로그인을 해주십시오.') {
      super(message)
      this.name = 'unauthorized'
  }
}
module.exports = UnauthorizedError