var fs = require('fs');
var ftp;
var request;
module.exports = function(options, cb){
    var JSFtp = ftp || (ftp = require('jsftp'));
    var ftp = new JSFtp({
        host: "ftp.figlet.org"
    });
    var subdir = 'contributed'
    //var url = 'pub/figlet/fonts/'+subdir+'/'+target.toLowerCase()+'.flf';
    var makeURLForDirectory = function(dir){
        return 'pub/figlet/fonts/'+dir+'/'+options.target.toLowerCase()+'.flf';
    }
    var handle = function(sock){
        var str = '';
        sock.on("data", function(d) { str += d.toString(); })
        sock.on("close", function(err) {
            if (err){
                console.error('There was an error retrieving the font '+target);
            }else{
                var dir = options.g?process.cwd()+'/Fonts/':__dirname+'/../Fonts/';
                fs.writeFile(dir+options.target.toLowerCase()+'.flf', str, function(err){
                    ftp.raw("quit", function(err, data) {
                        if (err) return console.error(err);
                        console.log(options.target+' written');
                        cb();
                    });
                });
            }

        });
        sock.resume();
    }
    switch(options.subaction){
        case 'install':
            ftp.get(makeURLForDirectory('contributed'), function(err, socket){
                //console.log('ERR', err);
                if (err) return ftp.get(makeURLForDirectory('international'), function(err2, socket){
                    if (err2) return ftp.get(makeURLForDirectory('ours'), function(err3, socket){
                        if(err3) return;
                        handle(socket)
                    });
                    handle(socket)
                });
                handle(socket);
            });
            break;
        default: throw new Error('Unknow subaction:'+options.subaction)
    }
}
