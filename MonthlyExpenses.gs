function populateExpenseSheetFromCategories() {  
  var expensesSheet = new ExpensesSheet();
  expensesSheet.clearSheet();
  
  var categories = new CategoriesSheet();
  var categoryGroups = categories.getCategoryGroups();
  expensesSheet.addCategoryGroups(categoryGroups);
}

function populateTransactionValues(){
  var transactionsSheet = new TransactionsSheet();  
  var transactions = transactionsSheet.getTransactions();
  var expensesSheet = new ExpensesSheet();
  expensesSheet.populateTransactions(transactions.filter(function(item){ return item.type.toLowerCase() !== "i"; }));
  var incomeSheet = new IncomeSheet();
  incomeSheet.clearPayslips();
  incomeSheet.populatePayslips(transactions.filter(function(item){ return item.type.toLowerCase() === "i"; }));
}

function populateRecurringTransactions(){
  var recurring = new RecurringSheetEligibleRetriever(new DateService(), new RecurringSheet());
  var orderedTransactions = recurring.getEligibleTransactions();  
  var transactionsSheet = new TransactionsSheet();
  transactionsSheet.addTransactions(getTransactions(orderedTransactions));
  recurring.markTransactionsAsAdded(orderedTransactions);
}

function getTransactions(orderedTransactions) {
  var transactions = [];
  orderedTransactions.forEach(function(orderedTransaction){
    transactions.push(orderedTransaction.transaction);
  });
  
  return transactions;
}