const numDef = require('./num-def')

function getServerName(serverNum) {
  // if (process.env.NODE_ENV === 'development') return 'koromon';
  // if (process.env.NODE_ENV === 'qa') return 'koromon';
  
  switch (serverNum) {
    case 1:
      return 'base_game01'
    case 2:
      return 'base_game02'
    //case 3:
    //  return 'motimon'
    //case 4:
    //  return 'dungsilmon'
    default:
      return 'base_game01'
  }
}

function getServerGroupId(serverName){
  switch(serverName){
    case 'base_game01':
      return 10
    case 'base_game02':
      return 20
    default:
      return 0
  }
}

function getServerGroupList()
{
  return [10, 20];
}

function getWorldNumber(serverName) {
  if (process.env.NODE_ENV === 'production') {
    return numDef[serverName]
  }
  if (process.env.NODE_ENV === 'qa') {
    return numDef.serverQA
  }
  return numDef.serverDev 
}

module.exports = { getServerName, getWorldNumber, getServerGroupId, getServerGroupList }