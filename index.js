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

module.exports = {
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

        var getCharFor = function(cmd){
            var chars = cmd.split('');
            var chr;
            for(var lcv=0; lcv < chars.length; lcv++){
                chr = chars[lcv];
                chr = chr.toLowerCase();
                if(!fwd[chr]){
                    fwd[chr] = cmd;
                    rvs[cmd] = chr;
                    return chr;
                }
                chr = chr.toUpperCase();
                if(!fwd[chr]){
                    fwd[chr] = cmd;
                    rvs[cmd] = chr;
                    return chr;
                }
            }
        }

        var defineCommand = function(name, description, examples){
            var coloredName = module.exports.style(name, 'blue');
            var rgx = new RegExp(' '+name+' ', 'g');
            var styleThings = function(str){
                return str
                    .replace( rgx, ' '+coloredName+' ' )
                    .replace( /(".*?")/g, function(i, match){
                        return module.exports.style(match, 'yellow');
                    }).replace( /(-.(?: |$))/g, function(i, match){
                        return module.exports.style(match, 'cyan');
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

        var defineArgument = function(name, type, description, num, choices){
            var chr = getCharFor(name);
            if(!yargs[type]) throw new Error('Unsupported type: '+type);
            if(type !== 'string'){
                yargs[type](chr);
            }
            yargs.alias(chr, name)
            yargs.nargs(chr, num)
            if(choices) yargs.choices(chr, choices)
            yargs.describe(chr, description)
        }
        return {
            defineCommand, defineArgument
        }
    }
}
