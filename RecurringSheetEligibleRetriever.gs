function RecurringSheetEligibleRetriever(dateService, recurringSheet) {  
  this._daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  this._currentDate = dateService.getCurrentDate();
  this._recurringSheet = recurringSheet;
}

RecurringSheetEligibleRetriever.prototype._isItOverAWeekAfterLastOccurence = function(tranDayOfWeek, tran){
  return (!tran.lastUpdated && this._currentDate.getDay() == tranDayOfWeek) || 
    Math.round((this._currentDate - tran.lastUpdated)/(1000*60*60*24)) == 7;
}

RecurringSheetEligibleRetriever.prototype._wasLastOccurenceInPreviousMonthOrOlder = function(tranDayOfMonth, tran){
  return (!tran.lastUpdated && this._currentDate.getDate() == tranDayOfMonth) || 
    (tran.lastUpdated && this._currentDate.getMonth() > tran.lastUpdated.getMonth()) ||
    (tran.lastUpdated && this._currentDate.getYear() > tran.lastUpdated.getYear())  ;
}

RecurringSheetEligibleRetriever.prototype._eligible = function(tran){
  if (isNaN(tran.occursEvery)){ // a string is in that column so treat transaction as a weekly occurence
    var tranDayOfWeek = this._daysOfWeek.indexOf(tran.occursEvery.toLowerCase());
    if (tranDayOfWeek == -1) {
      throw new Error("Invalid occurrence for transaction " + tran.occursEvery + " " + tran.amount + " " + tran.category);
    }
    
    return this._isItOverAWeekAfterLastOccurence(tranDayOfWeek, tran);
  }
  else {
    var tranDayOfMonth = parseInt(tran.occursEvery);
    if (tranDayOfMonth == 0) {
      throw new Error("Invalid occurrence for transaction " + tran.occursEvery + " " + tran.amount + " " + tran.category);
    }
    
    return this._wasLastOccurenceInPreviousMonthOrOlder(tranDayOfMonth, tran);
  }
};

RecurringSheetEligibleRetriever.prototype.getEligibleTransactions = function(){
  var orderedTransactions = [];
  var rangeValues = this._recurringSheet.getAllRecurringValues();
  for (i = 0; i < rangeValues.length; i++){
    var occursEvery = rangeValues[i][0];
    var amount = rangeValues[i][1];
    var category = rangeValues[i][2];
    var type = rangeValues[i][3];
    var tran = {
      occursEvery : occursEvery,
      amount : amount,
      category : category,
      type : type,
      lastUpdated : rangeValues[i][5] ? rangeValues[i][5] : null
    };
    if (this._eligible(tran)){
      orderedTransactions.push({transaction: new Transaction(this._currentDate, tran.amount, tran.category, tran.type), order: i+1});
    }
  };
  return orderedTransactions;
};

RecurringSheetEligibleRetriever.prototype.markTransactionsAsAdded = function(orderedTransactions) {
  obj = this;
  orderedTransactions.forEach(function(orderedTransaction){
    Logger.log(obj._currentDate);
    obj._recurringSheet.updateTransactionWithDateAtRow(orderedTransaction.order, obj._currentDate);
  });
}