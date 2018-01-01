function DateService() {
  
}

DateService.prototype.getCurrentDate = function(){
  var currentDate = new Date();
  return new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDate());
}