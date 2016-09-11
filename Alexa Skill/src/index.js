'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');

var APP_ID = 'arn:aws:lambda:us-east-1:352543826386:function:momFunction';
var SKILL_NAME = 'MOM: Mind Over Matter';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var review = []


var material = [
{ key: "renaissance", spokenContent: "Renaissance, literally meaning rebirth, was the period in European civilization immediately following the Middle Ages and conventionally characterized by a surge of interest in Classical scholarship and values", cardContent: "The Renaissance is a period in Europe, from the 14th to the 17th century, regarded as the cultural bridge between the Middle Ages and modern history. It started as a cultural movement in Italy in the Late Medieval period and later spread to the rest of Europe, marking the beginning of the Early Modern Age. The intellectual basis of the Renaissance was its own invented version of humanism, derived from the rediscovery of classical Greek philosophy.", image: "https://s3.amazonaws.com/mommindovermatter/ren.jpg" },
{ key: "gothic", spokenContent: "Gothic art was a style of Medieval art that developed in Northern France out of Romanesque art in the 12th century. Primary media in the Gothic period included sculpture, panel painting, stained glass, fresco and illuminated manuscripts.", cardContent: "Gothic art was a style of Medieval art that developed in Northern France out of Romanesque art in the 12th century AD, led by the concurrent development of Gothic architecture. It spread to all of Western Europe, never quite effacing more classical styles in Italy. Primary media in the Gothic period included sculpture, panel painting, stained glass, fresco and illuminated manuscripts. The easily recognizable shifts in architecture from Romanesque to Gothic, and Gothic to Renaissance styles, are typically used to define the periods in art in all media, although in many ways figurative art developed at a different pace.", image: "https://s3.amazonaws.com/mommindovermatter/goth.jpg" }
]

var topics = [
{ key: "film", spokenContent: "A film is a series of still images which, when shown on a screen, creates the illusion of moving images due to the phi phenomenon. Some topics in film include Auteur Theory, what makes a genre a genre?, and religion in film. What would you like to hear more about?", cardContent: "A film is a series of still images which, when shown on a screen, creates the illusion of moving images due to the phi phenomenon. Topics: Autuer Theory, Genre, Religion in film, War films. You can also compare and contrast a single element (say lighting) within a film or between several films.", image: "https://s3.amazonaws.com/mommindovermatter/film.jpg" },
{ key: "art", spokenContent: "Art is a diverse range of human activities in creating visual, auditory or performing artifacts. Some topics in art include the Renaissance, the Gothic Period, Symbolism, Art Nouveau, and Impressionism. What would you like to hear more about?", cardContent: "Art is a diverse range of human activities in creating visual, auditory or performing artifacts, expressing the author's imaginative or technical skill, intended to be appreciated for their beauty or emotional power. Topics: the Renaissance, the Gothic Period, Symbolism, Art Nouveau, and Impressionism.", image: "https://s3.amazonaws.com/mommindovermatter/art.jpg" },
{ key: "history", spokenContent: "History is an umbrella term that relates to past events as well as the discovery, organization, and interpretation of information about these events. Some topics in history include the Civil War, Henry David Thoreau, the Bronze Age, Bubonic Plague, and Presidential Elections. What would you like to hear more about?", cardContent: "History is an umbrella term that relates to past events as well as the memory, discovery, collection, organization, presentation, and interpretation of information about these events. Topics: Civil War, Henry David Thoreau, the Bronze Age, Bubonic Plague, and Presidential Elections.", image: "https://s3.amazonaws.com/mommindovermatter/declaration-of-independence.png" },
]


var handlers = {
    'LaunchRequest': function () {
        review = [];
        var speechOutput = "Welcome to Mind Over Matter. What are you working on?";
        var reprompt = "What are you working on?";
        this.emit(':ask', speechOutput, reprompt)
    },
    'StartProjectIntent': function() {
        var speechOutput = "What subject are you interested in?";
         var reprompt = "What subject are you interested in learning about?";
        this.emit(':ask', speechOutput, reprompt)
    },
    'TopicsIntent': function() {
        if (this.event.request.intent.slots.S.value) {
            var slotValue = this.event.request.intent.slots.S.value;
            if (review.indexOf(slotValue) == -1) {
                review.push(slotValue)
            }

        // initialize the output text to an error message
        var speechOutput = "";
        var cardTitle = "";
        var cardContent = "";
        var largeImage = "";
        var smallImage = "";

        for (var i = 0; i < topics.length; i++) {
            if (topics[i].key == slotValue) {
                // When we have found the piece we are looking for,
                // set the output text to the value field of the found object.
                speechOutput = topics[i].spokenContent;

                cardTitle = topics[i].key.charAt(0).toUpperCase() + topics[i].key.slice(1);
                cardContent = topics[i].cardContent;

                // Set image URL 
                smallImage = topics[i].image;
                largeImage = topics[i].image;
            }
        }

         // Create image object for home card
         var imageObj = {
            smallImageUrl: smallImage,
            largeImageUrl: largeImage
        };

       this.emit(':askWithCard', speechOutput, "What would you like to hear more about?", cardTitle, cardContent, imageObj)
    } else {
     this.emit(':tell', "I do not know")
    }
    },
    'MoreContentIntent': function() {
        var slotValue = this.event.request.intent.slots.T.value;

        if (review.indexOf(slotValue) == -1) {
                review.push(slotValue)
            }

        // initialize the output text to an error message
        var speechOutput = "";
        var cardTitle = "";
        var cardContent = "";
        var largeImage = "";
        var smallImage = "";

        for (var i = 0; i < material.length; i++) {
            if (material[i].key == slotValue) {
                // When we have found the piece we are looking for,
                // set the output text to the value field of the found object.
                speechOutput = material[i].spokenContent;

                cardTitle = material[i].key.charAt(0).toUpperCase() + material[i].key.slice(1);
                cardContent = material[i].cardContent;

                // Set image URL 
                smallImage = material[i].image;
                largeImage = material[i].image;
            }
        }

         // Create image object for home card
         var imageObj = {
            smallImageUrl: smallImage,
            largeImageUrl: largeImage
        };

        // getJsonFromWiki("history", function(result) {

        // })

        this.emit(':askWithCard', speechOutput, "What would you like to go into next?", cardTitle, cardContent, imageObj)

},
'ReviewIntent': function() {
    var speechOutput = "Let's review! In this session, we've brainstormed ";
    if (review.length == 0) {
        speechOutput += "nothing."
    } else if (review.length == 1) {
        speechOutput += review[0] + "."
        speechOutput += " Go to your dashboard for more details."
    } else if (review.length == 2) {
        speechOutput += review[0] + " and " + review[1] + "."
        speechOutput += " Go to your dashboard for more details."
    } else {
        for (var i = 0; i < review.length - 1; i++) { 
            speechOutput += review[i] + ", ";
        }
        speechOutput += " and " + review[review.length - 1] + ". "
        speechOutput += " Go to your dashboard for more details."
    }
    // write it out to database
    this.emit(':askWithCard', speechOutput, "What would you like to go into next?", "Review Brainstorm", speechOutput)
},

    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say what you'd like to brainstorm, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        sendData(data);
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};


// var url = function(content){
//   return "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&indexpageids=1&exintro=&explaintext=&titles=history"
// };

// var getJsonFromWiki= function(content, callback){
//   return http.get(url(content), function(res){
//     var body = '';

//     res.on('data', function(data){
//       body += data;
//     });

//     res.on('end', function(){
//       var result = JSON.parse(body);
//         // var pageID = result.
//         // return result.query.pages.pageID.extract;
//         callback(result)
//     });

//   }).on('error', function(e){
//     console.log('Error: ' + e);
//   });
// };