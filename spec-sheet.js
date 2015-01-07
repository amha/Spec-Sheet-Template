/*!
 *
 * Reads the contents of a text file and adds that content to an
 * open InDesign document.
 *
 * Author: Amha Mogus
 * Date: 12/11/2014
 */

 /*
  * json_parse.js
  * 2012-06-20
  * Public Domain.
  * https://github.com/douglascrockford/JSON-js
  */
var json_parse = (function () {
   "use strict";

   // This is a function that can parse a JSON text, producing a JavaScript
   // data structure. It is a simple, recursive descent parser. It does not use
   // eval or regular expressions, so it can be used as a model for implementing
   // a JSON parser in other languages.

   // We are defining the function inside of another function to avoid creating
   // global variables.

   var at,     // The index of the current character
   ch,     // The current character
   escapee = {
     '"':  '"',
     '\\': '\\',
     '/':  '/',
     b:    '\b',
     f:    '\f',
     n:    '\n',
     r:    '\r',
     t:    '\t'
   },
   text,

   error = function (m) {

     // Call error when something is wrong.

     throw {
       name:    'SyntaxError',
       message: m,
       at:      at,
       text:    text
     };
   },

   next = function (c) {

     // If a c parameter is provided, verify that it matches the current character.

     if (c && c !== ch) {
       error("Expected '" + c + "' instead of '" + ch + "'");
     }

     // Get the next character. When there are no more characters,
     // return the empty string.

     ch = text.charAt(at);
     at += 1;
     return ch;
   },

   number = function () {

     // Parse a number value.

     var number,
     string = '';

     if (ch === '-') {
       string = '-';
       next('-');
     }
     while (ch >= '0' && ch <= '9') {
       string += ch;
       next();
     }
     if (ch === '.') {
       string += '.';
       while (next() && ch >= '0' && ch <= '9') {
         string += ch;
       }
     }
     if (ch === 'e' || ch === 'E') {
       string += ch;
       next();
       if (ch === '-' || ch === '+') {
         string += ch;
         next();
       }
       while (ch >= '0' && ch <= '9') {
         string += ch;
         next();
       }
     }
     number = +string;
     if (!isFinite(number)) {
       error("Bad number");
     } else {
       return number;
     }
   },

   string = function () {

     // Parse a string value.

     var hex,
     i,
     string = '',
     uffff;

     // When parsing for string values, we must look for " and \ characters.

     if (ch === '"') {
       while (next()) {
         if (ch === '"') {
           next();
           return string;
         }
         if (ch === '\\') {
           next();
           if (ch === 'u') {
             uffff = 0;
             for (i = 0; i < 4; i += 1) {
               hex = parseInt(next(), 16);
               if (!isFinite(hex)) {
                 break;
               }
               uffff = uffff * 16 + hex;
             }
             string += String.fromCharCode(uffff);
           } else if (typeof escapee[ch] === 'string') {
             string += escapee[ch];
           } else {
             break;
           }
         } else {
           string += ch;
         }
       }
     }
     error("Bad string");
   },

   white = function () {

     // Skip whitespace.

     while (ch && ch <= ' ') {
       next();
     }
   },

   word = function () {

     // true, false, or null.

     switch (ch) {
       case 't':
         next('t');
         next('r');
         next('u');
         next('e');
         return true;
         case 'f':
           next('f');
           next('a');
           next('l');
           next('s');
           next('e');
           return false;
           case 'n':
             next('n');
             next('u');
             next('l');
             next('l');
             return null;
           }
           error("Unexpected '" + ch + "'");
         },

         value,  // Place holder for the value function.

         array = function () {

           // Parse an array value.

           var array = [];

           if (ch === '[') {
             next('[');
             white();
             if (ch === ']') {
               next(']');
               return array;   // empty array
             }
             while (ch) {
               array.push(value());
               white();
               if (ch === ']') {
                 next(']');
                 return array;
               }
               next(',');
               white();
             }
           }
           error("Bad array");
         },

         object = function () {

           // Parse an object value.

           var key,
           object = {};

           if (ch === '{') {
             next('{');
             white();
             if (ch === '}') {
               next('}');
               return object;   // empty object
             }
             while (ch) {
               key = string();
               white();
               next(':');
               if (Object.hasOwnProperty.call(object, key)) {
                 error('Duplicate key "' + key + '"');
               }
               object[key] = value();
               white();
               if (ch === '}') {
                 next('}');
                 return object;
               }
               next(',');
               white();
             }
           }
           error("Bad object");
         };

         value = function () {

           // Parse a JSON value. It could be an object, an array, a string, a number,
           // or a word.

           white();
           switch (ch) {
             case '{':
               return object();
               case '[':
                 return array();
                 case '"':
                   return string();
                   case '-':
                     return number();
                     default:
                       return ch >= '0' && ch <= '9' ? number() : word();
                     }
                   };

                   // Return the json_parse function. It will have access to all of the above
                   // functions and variables.

                   return function (source, reviver) {
                     var result;

                     text = source;
                     at = 0;
                     ch = ' ';
                     result = value();
                     white();
                     if (ch) {
                       error("Syntax error");
                     }

                     // If there is a reviver function, we recursively walk the new structure,
                     // passing each name/value pair to the reviver function for possible
                     // transformation, starting with a temporary root object that holds the result
                     // in an empty key. If there is not a reviver function, we simply return the
                     // result.

                     return typeof reviver === 'function'
                     ? (function walk(holder, key) {
                       var k, v, value = holder[key];
                       if (value && typeof value === 'object') {
                         for (k in value) {
                           if (Object.prototype.hasOwnProperty.call(value, k)) {
                             v = walk(value, k);
                             if (v !== undefined) {
                               value[k] = v;
                             } else {
                               delete value[k];
                             }
                           }
                         }
                       }
                       return reviver.call(holder, key, value);
                     }({'': result}, ''))
                     : result;
                   };
                 }());

try {


  // Prompt user to select input file.
  var newDoc = File.openDialog("Select a JSON or CSV File:");
  var fileName = newDoc.name;
  var fileTypeIndexPostion = fileName.lastIndexOf(".") + 1;
  var fileExtension = fileName.substring(fileTypeIndexPostion);

  // Handoff processing to the appropriate method based in file extension.
  switch(fileExtension){
    case "JSON": case "json":
      readJson(newDoc);
      break;
    case "csv": case "CSV":
      readCsv(newDoc);
      break;
    default:
      alert("That file format is not supported. :(");
      break;
  }
}
catch (e) {
  // Do nothing for now.
  alert("e = "+ e.toString());
};


/**
 * Read the contents of a json file.
 */
function readJson(file){

  var doc = app.activeDocument;
  var instructions;

  if(file.open('r')){

    var rawFile = file.read();
    var jsonData = json_parse(rawFile);

    // Retrieve active document.
    var doc = app.activeDocument;

    // Retrieve all text frames from active document.
    var docTextFrames = doc.textFrames;
    var androidInstructions;
    var iOSInstructions;

    for(var i = 0; i < jsonData["results"].length; i++){
      var os = jsonData["results"][i]["operatingSystem"];

      switch(os){
        case "Android":
          androidInstructions = docTextFrames.itemByName("android");
          androidInstructions.visible = true;
          createPage("android");
          break;
        case "iOS":
          iOSInstructions = docTextFrames.itemByName("ios");
          iOSInstructions.visible = true;
          createPage("ios");
          break;
        default:
          alert("Operating system not specified.");
      }
    }
  }
  file.close();
}

/**
 * Loop through the contents of the file, parse each row, and
 * create a new indesign page.
 * @param {File} Adobe Indesign File Object
 */
function readCsv(myDocument){

  if (myDocument.open("r") && myDocument instanceof File){
    do{
      var csvRow =  myDocument.readln();

      var csvArray = [];
      csvArray = parseCsvRow(csvRow);

      // Retrieve active document.
      var doc = app.activeDocument;

      // Retrieve all text frames from active document.
      var docTextFrames = doc.textFrames;

      // Map content from sample file to active document.
      var device = docTextFrames.itemByName("device_name");
      device.contents = csvArray[0][0];

      var os = docTextFrames.itemByName("platform");
      os.contents = csvArray[0][1] +" " + csvArray[0][2];

      var release = docTextFrames.itemByName("release_date");
      release.contents = csvArray[0][5];

      var viewPortWidth = docTextFrames.itemByName("viewport_width");
      viewPortWidth.contents = csvArray[0][3] + " px";

      var viewPortHieght = docTextFrames.itemByName("viewport_hieght");
      viewPortHieght.contents = csvArray[0][4] + " px";

      // Adding a new page.
      app.layoutWindows[0].activePage.duplicate(
        LocationOptions.AFTER, app.layoutWindows[0].activePage);
      }
      while(!myDocument.eof);
      // Close file once all of the data has been read.
      myDocument.close();
  }
  else{
    // Error condition.
    alert("I'm unable to read this CSV file. :(");
  }
}

/**
 * Reads a single row from a CSV File.
 * @param {String} str
 * @return {Array} arr
 */
function parseCsvRow(str) {
  var arr = [];
  var quote = false;  // true means we're inside a quoted field

  // iterate over each character, keep track of current row and column (of the returned array)
  for (var row = col = c = 0; c < str.length; c++) {
    var cc = str[c], nc = str[c+1];        // current character, next character
    arr[row] = arr[row] || [];             // create a new row if necessary
    arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

    // If the current character is a quotation mark, and we're inside a
    // quoted field, and the next character is also a quotation mark,
    // add a quotation mark to the current column and skip the next character
    if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

    // If it's just one quotation mark, begin/end quoted field
    if (cc == '"') { quote = !quote; continue; }

    // If it's a comma and we're not in a quoted field, move on to the next column
    if (cc == ',' && !quote) { ++col; continue; }

    // If it's a newline and we're not in a quoted field, move on to the next
    // row and move to column 0 of that new row
    if (cc == '\n' && !quote) { ++row; col = 0; continue; }

    // Otherwise, append the current character to the current column
    arr[row][col] += cc;
  }
  return arr;
}

/**
 * Create new indesign page for a device.
 * @platform {String} platform: determines the indesign layout that is used.
 */
function createPage(platform){
    // Adding a new page.
    app.layoutWindows[0].activePage.duplicate(
    LocationOptions.AFTER, app.layoutWindows[0].activePage);

    var instructions = app.activeDocument.textFrames.itemByName(platform);
    instructions.visible = false;
}
