#!/usr/bin/env node
var actions = {
    art : require('./actions/art'),
    image : require('./actions/image'),
    install : require('./actions/install'),
    list : require('./actions/list'),
    preview : require('./actions/preview'),
    text : require('./actions/text')
};
var Ansi = require('ascii-art-ansi');

var styles = {
    actionColor : 'blue',
    stringColor : 'yellow',
    flagColor : 'cyan',
    sigColor : 'magenta'
}

var art = require('ascii-art');

module.exports = {
    styles: styles,
    style: function(str, style){
        return Ansi.codes(str, style, true)
    },
    performAction : function(name, options, cb){
        var callback = cb;
        var error = function(err){ cb(err) };
        if(!callback){ //use promises
            var p = new Promise(function(resolve, reject){
                callback = resolve;
                error = reject;
            })
        }
        var action = actions[name];
        action(options, cb);
    },
    getDefinitionFns : function(yargs){
        var fwd = {};
        var rvs = {};

        var getCharFor = function(cmd, preferCaps){
            var chars = cmd.split('');
            var chr;
            for(var lcv=0; lcv < chars.length; lcv++){
                chr = chars[lcv];
                if(preferCaps){
                    chr = chr.toUpperCase();
                    if(!fwd[chr]){
                        fwd[chr] = cmd;
                        rvs[cmd] = chr;
                        return chr;
                    }
                }
                chr = chr.toLowerCase();
                if(!fwd[chr]){
                    fwd[chr] = cmd;
                    rvs[cmd] = chr;
                    return chr;
                }
                if(!preferCaps){
                    chr = chr.toUpperCase();
                    if(!fwd[chr]){
                        fwd[chr] = cmd;
                        rvs[cmd] = chr;
                        return chr;
                    }
                }
            }
        }

        var defineCommand = function(name, description, examples){
            var coloredName = module.exports.style(name, styles.actionColor);
            var rgx = new RegExp(' '+name+' ', 'g');
            var styleThings = function(str){
                return str
                    .replace( rgx, ' '+coloredName+' ' )
                    .replace( /(".*?")/g, function(i, match){
                        return module.exports.style(match, styles.stringColor);
                    }).replace( /(-.(?: |$))/g, function(i, match){
                        return module.exports.style(match, styles.flagColor);
                    })
            };
            yargs.command(coloredName, description);
            examples.forEach(function(example){
                if(Array.isArray(example)){
                    yargs.example(styleThings(example[0]), styleThings(example[1]));
                }else{
                    yargs.example(styleThings(example));
                }
            })
        }

        var padStart = function(s, diff, p){
            var pad = p || ' ';
            //var diff = n - Ansi.length(s);
            var padding = '';
            for(var lcv=0; lcv < diff; lcv++){
                padding += pad;
            }
            //console.log(s, n, diff, '|'+padding+'|')
            return padding+s;
        }

        var chunkLines = function(chunks, delimiter, length, flushTo, process, opts){
            var options = opts || {};
            var lines = [];
            var line = '';
            chunks.forEach(function(chunk){
                var lineLen = Ansi.length(line);
                var chunkLen = Ansi.length(chunk);
                if( (lineLen + chunkLen + delimiter.length) > length){
                    lines.push(line);
                    line = '';
                }
                line += (chunk + delimiter);
            });
            line = line.substring(0, line.length - (delimiter.length-1))
            lines.push(line);
            if(flushTo){
                lines.forEach(function(line, index){
                    var lineLen = Ansi.length(lines[index]);
                    var diff = flushTo - lineLen;
                    if(process === true){
                        diff = flushTo - length;
                    }
                    if(diff > 0){
                        lines[index] = padStart(lines[index], diff, "⠀");
                        if(options.preindent && index === 0){
                            var preindentOffset = diff - Ansi.length(options.preindent)-1;
                            lines[0] = Ansi.substring(lines[0], 0, preindentOffset)+
                                options.preindent+
                                Ansi.substring(lines[0], diff)

                        }
                    }
                });
            }
            return (process && process !== true)?process(lines).join("\n"):lines.join("\n");
        }

        var defineArgument = function(name, type, description, num, choices, forceChar){
            var chr = forceChar || getCharFor(name);
            if(!yargs[type]) throw new Error('Unsupported type: '+type);
            if(type !== 'string'){
                yargs[type](chr);
            }
            yargs.alias(chr, name);
            yargs.nargs(chr, num || (type === 'boolean'?0:1))
            var post = '';
            if(choices){
                //yargs.choices(chr, choices).skipValidation(chr);
                var chunked = chunkLines(choices.map(function(name){
                    return art.style(
                        ' '+name+' ',
                        'white_bg+black+encircled',
                        true
                    );
                }), ', ', 44, 55, true, {
                    preindent: art.style('Choices: ', 'yellow+bold', true)
                });
                post = "\n\n"+chunked+"\n";
                //console.log('|'+chunked+'|')
                /*
                post = "\n"+'[ '+choices.map(function(name){
                    return art.style(name, 'grey_bg+white+bold', true);
                }).join(', ')+' ]';
                //*/
            }
            yargs.describe(chr, description+(post?post:''))
        }
        return {
            defineCommand, defineArgument
        }
    }
}
