function IncomeSheet() {
  this._templateSheet = new TemplateSheet();
  Worksheet.call(this,'Income');
  this._insertOnRowIndex = 3;
  this._expensesMaxColumnLength = 18;
}

inheritsFrom(IncomeSheet, Worksheet);

IncomeSheet.prototype.clearPayslips = function(){
  var content = this._sheet.getRange("D4:O4");
  content.clear();
}

IncomeSheet.prototype._updateCategoryAndMonthValues = function(rangeValues, incomeTransactions){
  incomeTransactions.forEach(function(transaction){
    var columnIndex = transaction.date.getMonth();
    var value = parseFloat(rangeValues[0][columnIndex]) || 0;
    rangeValues[0][columnIndex] = value + transaction.amount;
  });
}

IncomeSheet.prototype.populatePayslips = function(transactions){
  var range = this._sheet.getRange("D4:O4");
  var values = range.getValues();
  this._updateCategoryAndMonthValues(values, transactions);    
  range.setValues(values);
}