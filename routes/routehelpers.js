// fs to grab the physical file
var fs = require("fs"); // for handlebars loading templates

// handlebars for templating
var Handlebars = require("handlebars"); // for templating
Handlebars.registerHelper('json', JSON.stringify);

//************************************
// PROMISE FUNCTIONS
//get view from filename, inject the model (data)
module.exports.LoadTemplatePromise = function (model, view){ // promise
    console.log(new Date().getTime() + " LoadTemplatePromise() CALLED");
    return new Promise((resolve, reject)=>{
        fs.readFile('./views/' + view, function (err, data) {
            if (!err) {
                var viewFromfile = String(data);
                var template = Handlebars.compile(viewFromfile);
                var output = template(model);
                //SUCCESS       
                console.log(data);  
                //cb(null,templates);
                resolve(output);
            } else {
                //FAILURE
                console.log(err);       
                //cb(err);
                reject(err)
            }
        });
    });
}




//get view from filename, inject the model (data)
module.exports.LoadFilePromise = function (file){ // promise//'./views/' 
    console.log(new Date().getTime() + " LoadFilePromise() CALLED: " + file);
    return new Promise((resolve, reject)=>{
        fs.readFile(file, function (err, data) {
            if (!err) {
                var dataFromfile = String(data);
                //SUCCESS       
                console.log(dataFromfile);  
                //cb(null,templates);
                resolve(dataFromfile);
            } else {
                //FAILURE
                console.log(err);       
                //cb(err);
                reject(err)
            }
        });
    });
}