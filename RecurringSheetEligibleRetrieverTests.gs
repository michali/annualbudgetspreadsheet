function RecurringSheetEligibleRetrieverTests() {
  QUnit.test("When weekly transaction is due today and is new addition, process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["Monday", "300.00", "category", "E", "", ""]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,1); // Monday
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 1);
  });  
  
   QUnit.test("When weekly transaction is to occur next week and is new addition, do not process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["Monday", "300.00", "category", "E", "", ""]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,2); // Tuesday
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 0);
  });  
  
  QUnit.test("When weekly transaction occured within last week, don't process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["Monday", "300.00", "category", "E", "", new Date(2018, 0, 1)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,4); // Thursday
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 0);
  });  
  
  QUnit.test("When weekly transaction occurred exactly a week ago, process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["Monday", "300.00", "category", "E", "", new Date(2018, 0, 1)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,8); // Next Monday
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 1);
  }); 
   
  QUnit.test("When monthly transaction is due today and is new addition, process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["2", "300.00", "category", "E", "", ""]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,2);
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 1);
  });  
  
   QUnit.test("When monthly transaction is to occur next month and is new addition, do not process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["2", "300.00", "category", "E", "", ""]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,3); 
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 0);
  });  
  
  QUnit.test("When monthly transaction occured within this month, don't process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["6", "300.00", "category", "E", "", new Date(2018, 0, 6)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,14); 
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 0);
  });  

  QUnit.test("When monthly transaction occurred last month, process it", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["2", "300.00", "category", "E", "", new Date(2018, 0, 2)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,1,2); // February
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 1);
  }); 
  
  QUnit.test("When monthly transaction occurred in December, process it in January", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["2", "300.00", "category", "E", "", new Date(2017, 11, 2)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,2); // January
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions.length, 1);
  }); 
  
  QUnit.test("When monthly transaction is eligible, return transaction with correct date", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["2", "300.00", "category", "E", "", new Date(2017, 11, 2)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,2); // January
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions[0].transaction.date.getDate(), dateServiceMock.getCurrentDate().getDate());
    assert.equal(transactions[0].transaction.date.getMonth(), dateServiceMock.getCurrentDate().getMonth());
    assert.equal(transactions[0].transaction.date.getYear(), dateServiceMock.getCurrentDate().getYear());
  });
  
  QUnit.test("When weekly transaction is eligible, return transaction with correct date", function(assert){
    var recurringSheetMock = {
      getAllRecurringValues: function(){
        return [
          ["Tuesday", "300.00", "category", "E", "", new Date(2017, 11, 26)]
        ];
      }
    }
    
    var dateServiceMock = {
      getCurrentDate: function() {
        return new Date(2018,0,2); // Tuesday
      }
    }
    
    var transactions = act(dateServiceMock, recurringSheetMock);
    
    assert.equal(transactions[0].transaction.date.getDate(), dateServiceMock.getCurrentDate().getDate());
    assert.equal(transactions[0].transaction.date.getMonth(), dateServiceMock.getCurrentDate().getMonth());
    assert.equal(transactions[0].transaction.date.getYear(), dateServiceMock.getCurrentDate().getYear());
  });
}

function act(dateServiceMock, recurringSheetMock){
    var retriever = new RecurringSheetEligibleRetriever(dateServiceMock, recurringSheetMock);    
    return retriever.getEligibleTransactions();
}

QUnit.helpers( this );
 
function doGet( e ) {
     QUnit.urlParams( e.parameter );
     QUnit.config({
          title: "RecurringSheetEligibleRetriever Tests" // Sets the title of the test page.
     });
     QUnit.load( RecurringSheetEligibleRetrieverTests );
 
     return QUnit.getHtml();
};