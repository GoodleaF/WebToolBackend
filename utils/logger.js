const winston = require('winston') //로그 처리 모듈
require('winston-daily-rotate-file') // 로그 일별 처리 모듈
const appRoot = require('app-root-path') //app root 경로를 가져오는 lib
const process = require('process')

const {combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`

const logFormat = printf((info) => {
    return `{${info.timestamp}}[${info.level}] ${info.message}` // 로그 출력 포맷 정의
})

// level ~ error: 0 , warn: 1 , info: 2 , http: 3 , verbose: 4 , debug: 5 , silly: 6
// frequency: 회전 빈도를 나타내는 문자열입니다. 이는 특정 시간에 발생하는 회전과 달리 시간이 지정된 회전을 원하는 경우에 유용합니다. 유효한 값은 '#m' 또는 '#h'(예: '5m' 또는 '3h')입니다. 이 null을 남겨두는 datePattern것은 회전 시간 에 의존합니다 . (기본값: null)
// datePattern: 회전에 사용할 moment.js 날짜 형식 을 나타내는 문자열 입니다. 이 문자열에 사용된 메타 문자는 파일 회전 빈도를 나타냅니다. 예를 들어, datePattern이 단순히 'HH'인 경우 매일 선택하여 추가되는 24개의 로그 파일로 끝납니다. (기본값: 'YYYY-MM-DD')
// zippedArchive: 아카이브된 로그 파일을 gzip으로 압축할지 여부를 정의하는 부울입니다. (기본값: '거짓')
// filename: 로그에 사용할 파일 이름입니다. 이 파일 이름은 파일 이름의 %DATE%해당 지점에 서식이 지정된 datePattern을 포함하는 자리 표시자를 포함할 수 있습니다 . (기본값: 'winston.log.%DATE%')
// dirname: 로그 파일을 저장할 디렉터리 이름입니다. (기본: '.')
// stream: 사용자 지정 스트림에 직접 쓰고 회전 기능을 우회합니다. (기본값: null)
// maxSize: 회전할 파일의 최대 크기입니다. 바이트 수 또는 kb, mb 및 GB 단위가 될 수 있습니다. 단위를 사용하는 경우 접미사로 'k', 'm' 또는 'g'를 추가합니다. 단위는 숫자를 직접 따라야 합니다. (기본값: null)
// maxFiles: 보관할 최대 로그 수입니다. 설정하지 않으면 로그가 제거되지 않습니다. 이는 파일 수 또는 일 수일 수 있습니다. 일을 사용하는 경우 접미사로 'd'를 추가합니다. (기본값: null)
// options: 파일 스트림에 전달되어야 하는 추가 옵션을 나타내는 'https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options' 와 유사한 객체 . (기본값: { flags: 'a' })
// auditFile : 감사 파일의 이름을 나타내는 문자열. 옵션 개체의 해시를 계산하여 생성된 기본 파일 이름을 재정의하는 데 사용할 수 있습니다. (기본값: '..json')
// utc : 파일 이름의 날짜에 UTC 시간을 사용합니다. (기본값: 거짓)
// extension : 파일 이름에 추가할 파일 확장자. (기본: '')
// createSymlink : 현재 활성 로그 파일에 대한 tailable symlink를 만듭니다. (기본값: 거짓)
// symlinkName : tailable symlink의 이름입니다. (기본값: 'current.log')

const logger = winston.createLogger({
    //로그 출력형식 정의
    format: combine(
        label({
            lable: 'System Name'
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        logFormat,
        //..
    ),
    //실제 로그를 어떻게 기록할 것인가
    transports: [
        new winston.transports.DailyRotateFile({
          level: 'info', // info 레벨에선
          datePattern: 'YYYY-MM-DD', // 날짜 형식
          dirname: logDir, // 파일 경로
          filename: `%DATE%.log`, // 파일이름
          maxFiles: 30 * 12, // 최근 1년치 파일을 남김
          zippedArchive: true
        }),
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.exception.log',
            maxFiles: 30 * 12,
            zippedArchive: true,
        }),
        new (winston.transports.Console)({
            level: 'debug',
            name: 'exception-console',
            colorize: true,
            showLevel: true,
            json: false,
            zippedArchive: true,
        })
    ]
})

//운영 환경이 아닌 경우 콘솔로도 로그 출력
if (process.env.NODE_ENV != 'production')
{
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), //log level별로 색상 적용
                winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 간단한 포맷으로 출력
            ),
        }),
    )
}

module.exports = logger