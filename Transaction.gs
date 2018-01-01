function Transaction(date, amountString, category, type) {
  this.date = date;
  this.amount = parseFloat(amountString);
  this.category = category;
  this.type = type;
}