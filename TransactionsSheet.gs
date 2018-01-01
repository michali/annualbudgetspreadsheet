function TransactionsSheet() {
  Worksheet.call(this,'Transactions');
}

inheritsFrom(TransactionsSheet, Worksheet);

TransactionsSheet.prototype.getTransactions = function(){
  var numRows = this._sheet.getLastRow();
  var startingIndex = 2;  
  var range = this._sheet.getRange(2, 1, numRows-(startingIndex-1), 4);
  var values = range.getValues();
  var transactions = [];
  for (i=0;i<range.getHeight(); i++)
  {
    transactions.push(new Transaction(values[i][0], values[i][1], values[i][2], values[i][3]));   
  }
                        
  return transactions;
}

TransactionsSheet.prototype.addTransactions = function(transactions) {
  var obj = this;
  transactions.forEach(function(transaction){
    obj._sheet.appendRow([transaction.date, transaction.amount, transaction.category, transaction.type]);
  });
}