function RecurringSheet() {
  Worksheet.call(this,'Recurring');
}

inheritsFrom(RecurringSheet, Worksheet);

RecurringSheet.prototype.getAllRecurringValues = function(){
  return this._sheet.getRange(2,1,this._sheet.getLastRow() - 1, 6).getValues();
}

RecurringSheet.prototype.updateTransactionWithDateAtRow = function(transactionOrderInSheet, date){
  var lastUpdatedCell = this._sheet.getRange(transactionOrderInSheet + 1, 6); // 1 is the header offset
  lastUpdatedCell.setValue(date);
}