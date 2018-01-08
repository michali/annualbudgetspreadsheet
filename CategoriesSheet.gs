function CategoriesSheet() {
  Worksheet.call(this,'Categories');
  this._startingCategoryTypeIndex = 2;
}

inheritsFrom(CategoriesSheet, Worksheet);

CategoriesSheet.prototype.getCategoryGroups = function(){  
  var range = this._sheet.getRange(this._startingCategoryTypeIndex, 1, this._sheet.getLastRow() - this._startingCategoryTypeIndex + 1, 2);
  var values = range.getValues();
  var categoryGroups = [];  
  var categoryGroup;
  
  for (i=0;i<values.length; i++)
  {
    if (values[i][0]) { 
      if (categoryGroup)
        categoryGroups.push(categoryGroup); 
      
      categoryGroup = {
        name: values[i][0],
        categories: []
      }
    }   
          
    categoryGroup.categories.push(values[i][1]);
  }
  
  categoryGroups.push(categoryGroup); // add last category group
  
  return categoryGroups;
}

