var moment = require("moment");
moment().format();

var mydate = new Date();
var myCoolDate = moment(mydate).format("LL");

console.log(myCoolDate);