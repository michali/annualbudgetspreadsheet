function TemplateSheet() {
  Worksheet.call(this,'Template');
  this.templateHeader = this._sheet.getRange(1,1,1,expensesMaxColumnIndex);
  this.templateContent = this._sheet.getRange(2,1,1,expensesMaxColumnIndex);
  this.blankLine = this._sheet.getRange(3,1,1,expensesMaxColumnIndex);
}

inheritsFrom(TemplateSheet, Worksheet);
