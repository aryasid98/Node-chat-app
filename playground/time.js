var moment=require('moment');


var someTimestamp=moment().valueOf();
console.log(someTimestamp);

var createdAt=5555;
var date=moment(createdAt);
console.log(date.format('hh:mm a'));
