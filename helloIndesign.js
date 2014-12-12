/*!
 *
 * Reads the contents of a text file and adds that content to an
 * open InDesign document.
 *
 * Author: Amha Mogus
 * Date: 12/11/2014
 */
try {

  // Resize layout window.
  // app.layoutWindows[0].zoomPercentage = 40;

  // Load text file.
  // TODO: Change to open file dialog.
  var myDocument = new File("/Volumes/Amha's Thumb/Indesign-Text-Entry/sample.csv");

  if (myDocument.open("r")){

    do{
    var csvRow =  myDocument.readln();

    var csvArray = [];
    csvArray = parseCSV(csvRow);

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
      LocationOptions.AFTER, app.layoutWindows[0].activePage)
    }
    while(!myDocument.eof);
    // Close file once all of the data has been read.
    myDocument.close();


    //doc.pages.add();
  }
}
catch (e) {
  // Do nothing for now.
  alert("e = "+ e.toString());
};


function parseCSV(str) {
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
