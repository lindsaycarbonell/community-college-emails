var request = require("request"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    json2csv = require("json2csv"),
    rl = require('readline-sync')
    url = "https://www.waynecc.edu/faculty-staff/?search=";



// var rl = readline.createInterface({
//     input: process.stdin, 
//     output: process.stdout
// });

// for (var c = 1; c<12; c++){
//     console.log(c)
// }  

var alpha = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    ];   

    

var all_emails = [],
first_names = [],
last_names = [], 
counter = 0;

var everything = {
    content: []
};

for (i in alpha){
    // console.log(url + c)
    request(url + alpha[i] + "&site_section=profiles-a-z-search", function(error, res, body){
        //console.log(url + alpha[i] + "&site_section=profiles-a-z-search")
   
        if (!error){
            counter++;
            var $ = cheerio.load(body);

            getAll();

            function getAll(){

                var names = $('.fullname a')
                //console.log(names.length)
                var emails = $('[href^="mailto:"]');

                emails.each(function(i, email){

                    if (emails[i] !== undefined && names[i] !== undefined){
                        var thisHref = email.attribs.href;
                        var thisEmail = thisHref.substring(7);
                        var thisName = names[i].children[0].data;
                        console.log(thisEmail + " " + thisName);
                        everything.content.push({fullname: thisName, email: thisEmail});
                    }
                    
                    
                
                })

            } //getAll

        if (counter == alpha.length){
            console.log("last")
            var json = JSON.stringify(everything);

            fs.writeFile('output/json/wayne.json', json, 'utf8');
        
            var fields = ['fullname', 'email']
            try {
                var result = json2csv({data: everything["content"], fields: fields})
                fs.writeFile('output/csv/wayne.csv', result, 'utf8')
            } catch (err) {
                console.error(err)
            }
        }

        }

    })
}

