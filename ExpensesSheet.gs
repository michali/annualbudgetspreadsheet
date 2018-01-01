function ExpensesSheet() {
  this._templateSheet = new TemplateSheet();
  Worksheet.call(this,'Expenses');
  this._insertOnRowIndex = 3;
  this._expensesMaxColumnLength = 18;
  this._monthColumnNames = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
}

inheritsFrom(ExpensesSheet, Worksheet);

ExpensesSheet.prototype.clearSheet = function(){
  var numRows = this._sheet.getMaxRows();    
  var content = this._sheet.getRange(this._insertOnRowIndex, 1, numRows-this._insertOnRowIndex+1 , this._expensesMaxColumnLength);
  content.clear();
}

ExpensesSheet.prototype._setSumExpenseHeaders = function(targetHeaderRange, noOfCategories){
  var rowNumber = parseInt(targetHeaderRange.getCell(1,1).getA1Notation().substr(1));  
  var januaryColumnIndex = 4;  
  for (i = januaryColumnIndex; i < januaryColumnIndex + 12; i++){ 
    targetHeaderRange.getCell(1,i).setValue("=sum(" + this._monthColumnNames[i-januaryColumnIndex] + (rowNumber + 1) + ":" + this._monthColumnNames[i-januaryColumnIndex] + (rowNumber + noOfCategories) + ")");
  }
}

ExpensesSheet.prototype._addCategoryGroupHeaderRow = function(categoryGroup){  
  var targetHeaderRange = this._sheet.getRange(this._insertOnRowIndex, 1, 1, this._expensesMaxColumnLength);
  this._templateSheet.templateHeader.copyTo(targetHeaderRange);
  var categoryGroupCell = this._sheet.getRange(this._insertOnRowIndex, 1);  
  categoryGroupCell.setValue(categoryGroup.name);
  this._setSumExpenseHeaders(targetHeaderRange, categoryGroup.categories.length);
  this._insertOnRowIndex++;
}

ExpensesSheet.prototype._addCategoryRows = function(categories){
  categories.forEach(function(element) {   
    var targetContentRange = this._sheet.getRange(this._insertOnRowIndex, 1, 1, this._expensesMaxColumnLength);
    this._templateSheet.templateContent.copyTo(targetContentRange);
    var categoryNameCell = this._sheet.getRange(this._insertOnRowIndex, 3);
    categoryNameCell.setValue(element);
    this._insertOnRowIndex++;
  }.bind(this));
}

ExpensesSheet.prototype._addBlankRow = function() {
  var targetHeaderRange = this._sheet.getRange(this._insertOnRowIndex, 1, 1, this._expensesMaxColumnLength);
  this._templateSheet.templateContent.copyTo(targetHeaderRange, {formatOnly:true});
  this._insertOnRowIndex++;
}

ExpensesSheet.prototype.addCategoryGroups = function(categoryGroups){
  var expenses = this;
  categoryGroups.forEach(function(categoryGroup) {  
    expenses._addCategoryGroupHeaderRow(categoryGroup);
    expenses._addCategoryRows(categoryGroup.categories);
    expenses._addBlankRow();
  });
}

ExpensesSheet.prototype._updateCategoryAndMonthValues = function(rangeValues, transactions){
  transactions.forEach(function(transaction){
    var rowIndex = 0;
    var columnIndex = 0;
    for (i=0;i < rangeValues.length; i++){
      if (rangeValues[i][0] === transaction.category){
        rowIndex = i;
        columnIndex = transaction.date.getMonth() + 1; // 1 is the offset for the category column on the left of the range
        break;
      }
    }
    
    if (rowIndex === 0 && columnIndex === 0)
      throw new Error("No row was found for category " + transaction.category);      
    
    var value = parseFloat(rangeValues[rowIndex][columnIndex]) || 0;
    rangeValues[rowIndex][columnIndex] = value + transaction.amount;
  });
}

ExpensesSheet.prototype.populateTransactions = function(transactions){
  var startingRowIndex = 4;
  var startingColumnIndex = 3;  
  var numRows = this._sheet.getMaxRows();
  var obj=this;
  transactions.forEach(function(transaction){
    var transactionAddedToSheet = false;
    for (i=1;i<=numRows; i++){
      var row = obj._sheet.getRange(i, 3, 1, 13);
      if (row.getCell(1,1).getValue() === transaction.category){ // must use the expensive Range.getValue() method instead of getting an array of values by range.getValues() and then manipulate the array because when we do range.setValues() to set the values afterwards, it swallows up the formulas in the category group headings.
        var cell = row.getCell(1, transaction.date.getMonth() +2); // add 2 because row.getCell indexes are one based whereas transaction.date.getMonth() is zero-based and alsobecause the first column is the category name
        var existingValue = parseFloat(cell.getValue()) || 0;
        cell.setValue(existingValue+transaction.amount);
        transactionAddedToSheet = true;
        break;
      }     
    }
    
    if (!transactionAddedToSheet)
      throw new Error("No row was found for category " + transaction.category); 
  });
}