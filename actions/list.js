var ftp;
var request;
module.exports = function(options, cb){
    var JSFtp = ftp || (ftp = require('jsftp'));
    var client = new JSFtp({
        host: "ftp.figlet.org"
    });
    var results = [];
    client.ls("pub/figlet/fonts/ours", function(err, res) {
        if(!err) results = results.concat(res.map(function(item){
            return "ours/"+item.name
        }));
        client.ls("pub/figlet/fonts/contributed", function(err, res) {
            if(!err) results = results.concat(res.map(function(item){
                return "contributed/"+item.name
            }));
            client.raw("quit", function(err, data) {
                if (err) return console.error(err);
                var names = results.map(function(path){
                    return path.split('/').pop().split('.').shift();
                })
                console.log(names);
            });
        });
    });
}
