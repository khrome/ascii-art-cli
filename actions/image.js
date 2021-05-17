var art = require('ascii-art');
var Color = require('ascii-art-ansi/color');
module.exports = function(opts, cb){
    var options = {
        filepath: opts.target,
        lineart: opts.l,
        stippled: opts.s,
        blended: opts.b,
        threshold: opts.t,
        floor: opts.f,
        //darken: opts.D,
        posterize: opts.p,
    };
    if(opts.a) options.alphabet = opts.a;
    if(opts.B){
        switch(opts.B+''){
            case '4':
            case '8':
            case '32':
                Color.depth(parseInt(opts.B));
                break;
            default: throw new Error('Unsupported Bit Depth: '+opts.B)
        }
    }
    if(opts.c){
        Color.useDistance(opts.c);
    }
    if(
        process &&
        process.stdout &&
        process.stdout.columns
    ){
        options.width = process.stdout.columns;
    }
    var image = new art.Image(options);
    if(options.posterize){
        if(!image.options.stroke) image.options.stroke = 'black';
        image.writePosterized(function(err, text){
            if(err) console.log(err);
            if(opts.o) fs.writeFile(opts.o, text);
            else console.log(text+"\033[39;49m");
        });
    }else{
        if(options.lineart){
            image.writeLineArt(function(err, text){
                if(opts.o) fs.writeFile(opts.o, text);
                else console.log(text+"\033[39;49m");
            });
        }else{
            if(options.stippled){
                image.writeStipple(function(err, text){
                    if(err) console.log(err);
                    if(opts.o) fs.writeFile(opts.o, text);
                    else console.log(text+"\033[39;49m");
                });
            }else{
                image.write(function(err, text){
                    if(opts.o) fs.writeFile(opts.o, text);
                    else console.log(text+"\033[39;49m");
                });
            }
        }
    }
}
