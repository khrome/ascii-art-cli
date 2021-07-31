var art = require('ascii-art');
module.exports = function(options, cb){
    var output = function(err, result){ console.log(result) };
    if(options.font){
        if(options.style) art.font(options.target, options.font, options.style, output);
        else art.font(options.target, options.font, output);
    }else{
        console.log(art.style(options.target, options.style||'', true));
    }
}
