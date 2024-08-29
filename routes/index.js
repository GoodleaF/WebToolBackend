//@ts-check
'use strict'

const { Router } = require('express');
const router = Router()
const configList = require('./route-config')
const {isLoggedIn, isNotLoggedIn, checkGrade0, checkGrade1, checkGrade2, checkGrade3, checkGrade4, checkGrade5} = require('./login-check')

// route_info에 정의된 라우팅 정보 처리
function registerRoutes() {
	var len = configList.length;
	console.log('~~~ routing modules number : %d ~~~', len);
 
	console.table(configList)
	for (var i = 0; i < len; i++) {
		var config = configList[i];
			
		// 모듈 파일에서 모듈 불러옴
		var routingModule = require(config.file);
		
		//  라우팅 처리
		if (config.type == 'get') {
			if (config.grade) {
				switch (config.grade) {
					case 0 :
						router.get(config.path, checkGrade0, routingModule[config.method]);
						continue;
					case 1 :
						router.get(config.path, checkGrade1, routingModule[config.method]);
						continue;
					case 2 :
						router.get(config.path, checkGrade2, routingModule[config.method]);
						continue;
					case 3 :
						router.get(config.path, checkGrade3, routingModule[config.method]);
						continue;
					case 4 :
						router.get(config.path, checkGrade4, routingModule[config.method]);
						continue;
					case 5 :
						router.get(config.path, checkGrade5, routingModule[config.method]);
						continue;
				}
			} else {
				router.get(config.path, routingModule[config.method]);
				continue;
			}
		} else if (config.type == 'post') {
			if (config.grade)
			{
				switch (config.grade) {
					case 0 :
						router.post(config.path, checkGrade0, routingModule[config.method]);
						continue;
					case 1 :
						router.post(config.path, checkGrade1, routingModule[config.method]);
						continue;
					case 2 :
						router.post(config.path, checkGrade2, routingModule[config.method]);
						continue;
					case 3 :
						router.post(config.path, checkGrade3, routingModule[config.method]);
						continue;
					case 4 :
						router.post(config.path, checkGrade4, routingModule[config.method]);
						continue;
					case 5 :
						router.post(config.path, checkGrade5, routingModule[config.method]);
						continue;
				}
			} else {
				router.post(config.path, routingModule[config.method]);
				continue;
			}
		}

		console.log(`route set err: ${config.file}.${config.method}의 라우팅이 잘못 설정됨`)
	}
}

// 라우터 객체 등록

module.exports = function route(app) {
    console.log('set routes')
	registerRoutes()
    app.use('/', router);
    //app.use(router)
}