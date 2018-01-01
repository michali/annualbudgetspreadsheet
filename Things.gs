function inheritsFrom(child, parent) {
  child.prototype = Object.create(parent.prototype);
}

function Worksheet(workSheetName){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  this._sheet = ss.getSheetByName(workSheetName);
}

var expensesMaxColumnIndex = 17;