//@ts-check
'use strict'

class LowGradeError extends Error {
  status = 403
  constructor(message = '액세스 권한이 없습니다. 등급이 낮습니다.') {
      super(message)
      this.name = 'Low Grade'
  }
}
module.exports = LowGradeError