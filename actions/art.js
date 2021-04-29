module.exports = function(options, cb){
    var parts = (options.target ||'').split('/');
    if(!request) request = require('request');

    function page2List(text, base, omit){
        var matches = text.match(/<A(.*?)<\/A>/g).filter(function(i){
            return i.indexOf('?') === -1;
        }).map(function(line){
            var name = line.match(/".*?"/)[0] || '';
            var file = line.match(/>.*?</)[0] || '';
            return{
                name: name.substring(1, name.length-1),
                file: base+
                    file.substring(1, file.length-1)
            }
        }).filter(function(i){
            return (omit || []).indexOf(i.name) === -1
            && i.name.indexOf('://') === -1
            && i.name.toUpperCase() !== i.name;
        });
        return matches;
    }

    var exclusions = [
        '/apple', '/bbs', 'LOGOS', 'SEQ',
        '../archives/asciiart.zip', 'NFOS', 'LOGOS',
        'RTTY', '/piracy'
    ]

    switch(parts[0]){
        case 'textfiles.com':
            if(parts[1]){
                var pre = '';
                var post = '';
                switch(parts[1]){
                    case 'NFOS':
                        post = 'asciiart/';
                    case 'asciiart':
                        pre = 'artscene.';
                        break;
                    case 'LOGOS':
                    case 'DECUS':
                        post = 'art/';
                        break;
                    case 'RAZOR':
                    case 'FAIRLIGHT':
                    case 'DREAMTEAM':
                    case 'HUMBLE':
                    case 'HYBRID':
                    case 'PRESTIGE':
                    case 'INC':
                    case 'TDUJAM':
                    case 'ANSI':
                        post = 'piracy/';
                        break;
                }
                if(parts[2]){
                    request('http://'+pre+'textfiles.com/'+post+parts[1]+'/'+parts[2],
                        function(err, req, data){
                            console.log(data);
                        }
                    );
                }else{
                    var base = 'http://'+pre+'textfiles.com/'+post+parts[1]+'/';
                    request(base,
                        function(err, req, data){
                            if(err) throw err;
                            var text = data.toString();
                            var matches = page2List(text, base, exclusions);
                            art.table({data:matches}, function(rendered){
                                console.log(rendered);
                            });
                        }
                    );
                }
            }else{
                art.table({
                    data:[
                        {name:'asciiart', detail :'community shared'},
                        {name:'art', detail :'classic files'},
                        {name:'RTTY', detail :'Teletype Art'},
                        {name:'LOGOS', detail :'Classic Logos'},
                        {name:'DECUS', detail :'Printer Art'},
                        {name:'RAZOR', detail :'Cracking Group'},
                        {name:'FAIRLIGHT', detail :'Cracking Group'},
                        {name:'DREAMTEAM', detail :'Cracking Group'},
                        {name:'HUMBLE', detail :'Cracking Group'},
                        {name:'HYBRID', detail :'Cracking Group'},
                        {name:'PRESTIGE', detail :'Cracking Group'},
                        {name:'INC', detail :'Cracking Group'},
                        {name:'TDUJAM', detail :'Cracking Group'},
                        {name:'ANSI', detail :'Misc ANSI Files'},
                        {name:'NFOS', detail :'Misc NFO Files'}
                    ]
                }, function(rendered){
                    console.log(rendered);
                });
            }
            break;
        case '':
            break;
        default : throw new Error('unknown art source:'+parts[0]);
    }
    var options = {
        filepath: target
    };
}
