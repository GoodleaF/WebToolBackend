//@ts-check
'use strict'

/**
 * 라우터 설정 페이지 입니다.
 * file: 파일의 위치
 * path: 요청 페이지 주소
 * method: 실행 메소드
 * type: http 요청 타입,
 * grade: 요청 가능한 유저 등급(생략: all user, 0: 승인대기, 1: 일반 운영자, 2: 중간 관리자, 3: 결정권자, 4: Master, 5: developer)
 * 
 */

module.exports = [
    //===== User =====//
    {file:'./users/user-info', path:'/user', method:'getUserInfo', type:'get'}
    ,{file:'./admin/auth', path:'/auth/login', method:'login', type:'post',}
    ,{file:'./admin/auth', path:'/auth/logout', method:'logout', type:'post',}
    ,{file:'./admin/auth', path:'/auth/signup', method:'signup', type:'post'}
    ,{file:'./account/account-users', path:'/account/users', method:'getAccountUsers', type:'get'}
    ,{file:'./account/account-users', path:'/account/characters', method:'getAccountCharacters', type:'get'}
    ,{file:'./admin/manager', path:'/manager', method:'selectManager', type:'get'}
    ,{file:'./admin/manager', path:'/manager/grade', method:'changeGrade', type:'post'}
    ,{file:'./admin/manager', path:'/manager/del', method:'deleteManager', type:'post'}
    ,{file:'./logs/announce', path:'/announce', method:'selectAnnouncement', type:'get'}
    ,{file:'./logs/announce', path:'/announce', method:'insertAnnouncement', type:'post'}
    ,{file:'./statistics/concurrent_user', path:'/statistics/concurrent-user', method:'selectConcurrentUser', type:'get'}
    ,{file:'./statistics/survival_rate_new', path:'/statistics/survival-rate-new', method:'selectSurvivalRateNew', type:'get'}
    ,{file:'./statistics/survival_rate_return', path:'/statistics/survival-rate-return', method:'selectSurvivalRateReturn', type:'get'}
    ,{file:'./ai/dynamicskinscape', path:'/skinscape', method:'selectSkinscapeKey', type:'get'}
    ,{file:'./ai/dynamicskinscape', path:'/skinscape', method:'insertSkinscapeKey', type:'post'}
    ,{file:'./statistics/electron_jump_rank', path:'/statistics/electron-jump-rank', method:'selectElectronJumpRank', type:'get'}
    ,{file:'./statistics/electron_jump_log', path:'/statistics/electron-jump-log', method:'selectElectronJumpLog', type:'get'}
    ,{file:'./ai/chatgpt', path:'/chatgpt', method:'chat', type: 'post'}
]