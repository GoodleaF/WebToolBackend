'use strict'

const xlsx = require('xlsx')
const path = require('path')

class Exl {
  constructor () {
    if (!Exl.instance) {
      console.log('~~load exel data~~')
      Exl.instance = this

      //read excel file
      //this.digimons = this.convertToMap(this.load('Digimon'), 'Digimon_ID')
      //this.items = this.convertToMap(this.load('Item'), 'Item_ID')
      //this.quests = this.convertToMap(this.load('Quest'), 'Quest_ID')
      //this.questTask = this.convertToMap(this.load('QuestTask'), 'Task_ID')
      //this.cashShop = this.convertToMap(this.load('CashShop'), 'Shop_ItemID')
      // this.limitedShop = this.convertToMap(this.load('Limited_Sale'), 'Shop_ItemID')
      console.log('~~~~~~~~~~~~~~~~~~')
    }
    return Exl.instance
  }

  load(filename) {
    const dir = path.normalize(__dirname + '../../../bin/Data/DataTable/' + filename + '.csv')
    console.log('[load data file] ' + dir)
    return xlsx.readFile(dir)
  }

  convertToMap(workbook, keyColumnName) {
    let arr = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]])
    return arr.reduce((map, obj) => { 
      map[obj[keyColumnName]] = obj
      return map
    }, new Map)
  }
}

const exl = new Exl()
Object.freeze(exl)

module.exports = exl