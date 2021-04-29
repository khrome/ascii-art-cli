var art = require('ascii-art');
module.exports = function(options, cb){
    var output = function(err, result){ console.log(result) };
    if(options.F){
        if(options.s) art.font(target, options.F, options.s, output);
        else art.font(target, options.F, output);
    }else{
        console.log(art.style(target, options.s||'', true));
    }
}
