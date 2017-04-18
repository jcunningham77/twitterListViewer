
var i18n =   require('../i18n');



module.exports = function(app){

      app.get('/api/about-text/',function(req,res){

        console.log("in the i18nController server side  - ");

        

        i18n.getLocalizedAboutText("en");

        var acceptHeaders = req.get('accept-language');
        
        //seperate by , ; or -
        var separators = [',', ';','-'];
        // console.log(separators.join('|'));

        var requestedLanguages = acceptHeaders.split(new RegExp(separators.join('|'), 'g'));
        
        var requestedLanguagesLength = requestedLanguages.length;
        var aboutText = "";
        for (var i = 0; i < requestedLanguages.length; i++) {
            
            console.log(requestedLanguages[i]);
            aboutText = i18n.getLocalizedAboutText(requestedLanguages[i]);

            if (aboutText){
              console.log("translation found for " + (requestedLanguages[i]) + " breaking out");
              break;
            } else {
              console.log("no translation found for " + (requestedLanguages[i]));
            }
        }

        console.log("returning " + JSON.stringify(aboutText));
        res.send(aboutText);

        



        
      });



};