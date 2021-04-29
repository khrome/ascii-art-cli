module.exports = function(options, cb){
    var exec = require('child_process').exec;
    exec('open "http://www.figlet.org/fontdb_example.cgi?font='+options.target.toLowerCase()+'.flf"')
    cb();
}
