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
  var myDocument = new File("/Users/amogus/Desktop/sample.txt");

  if (myDocument.open("r")){

    // Retrieve active document.
    var doc = app.activeDocument;

    // Retrieve all text frames from active document.
    var docTextFrames = doc.textFrames;

    // Map content from sample file to active document.
    var title = docTextFrames.itemByName("title");
    title.contents = myDocument.readln();

    var sub = docTextFrames.itemByName("subtitle");
    sub.contents = myDocument.readln();

    var desc = docTextFrames.itemByName("desc");
    desc.contents = myDocument.readln();

    // Close file once all of the data has been read.
    myDocument.close();

    // Adding a new page.
    // TODO: Copy contents of active document into the new page.
    doc.pages.add();
  }
}
catch (e) {
  // Do nothing for now.
  alert("e = "+ e.toString());
};
