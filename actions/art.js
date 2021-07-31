var Artwork = require('ascii-art/artwork');
module.exports = function(opts, cb){
    switch(opts.target){
        case 'search' :
            var term = opts._.length?opts._.shift():'';
            Artwork.search(term, function(err, results){
                console.log(results);
            });
            break;
        case 'list' :
            var term = opts._.length?opts._.shift():'';
            throw new Error('listing not yet implemented!');
            /*
            if(term){

            }else{
                //console.log(Object.keys());
            } //*/
            break;
        case 'fetch' :
        case 'get' :
            var term = opts._.length?opts._.shift():'';
            var parts = term.split(':');
            var sourceName = parts[0];
            var path = parts[1];
            var file = parts[2];
            Artwork.get(sourceName, path, file, function(err, results){
                console.log(results);
            });
            break;
        default : throw new Error('Unsupported action: '+opts.target);
    }
}
