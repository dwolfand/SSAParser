var indexingFactors = require("scripts/indexingFactors");
var age = 28;
var salary = new BigNumber("100000");
var currency = require("scripts/currency");

PDFJS.disableWorker = true;
// console.log("blah",document.getElementsByTagName('head')[0]);
//PDFJS.workerSrc = 'pdf.worker.js';

function parseEarnings(textArray, index){
  var earnings = [];
  //Dont loop more than 100 times since if they ever change the pdf we dont want an infinite loop.
  for (var i = 0; i < 100; i++) {
    var tempIndex = index+(i*3);
    console.log("parsing item: ", textArray[tempIndex+1].str);
    //this is just for testing the sort
    if (textArray[tempIndex+1].str === "65,000"){
      textArray[tempIndex+1].str = "105,000";
      textArray[tempIndex+2].str = "105,000";
    }
    earnings.push({
      year: textArray[tempIndex].str,
      ssEarnings: new currency(textArray[tempIndex+1].str.replace(",","")),
      medEarnings: new currency(textArray[tempIndex+2].str.replace(",",""))
      // ssEarnings: textArray[tempIndex+1].str,
      // medEarnings: textArray[tempIndex+2].str
    });
    if (textArray[tempIndex+3].str === "You and your family may be eligible for valuable"){
      break;
    }
  }
  return earnings;
}

function printEarnings(earnings){
    $("#output").empty();
    for (var i = 0; i < earnings.length; i++) {
        var output = $("<tr></tr>");
        output.append($("<td></td>").text(earnings[i].year));
        output.append($("<td></td>").text(earnings[i].ssEarnings));
        output.append($("<td></td>").text(earnings[i].medEarnings));
        $("#output").append(output);
        $("table").removeClass("hide");
    }
}

function sortEarnings(earnings){
  return earnings.sort(function(a, b){
    return b.ssEarnings.cmp(a.ssEarnings);
  });
}

function projectEarnings(earnings){
  earnings.push({
    year: 2015,
    ssEarnings: new currency("117000"),
    medEarnings: new currency("117000")
  });
  return earnings;
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        PDFJS.getDocument(e.target.result).then(function getPdfHelloWorld(pdf) {
          console.log("test",pdf.get);
          
          //
          // Fetch the first page
          //
          pdf.getPage(3).then(function getPageHelloWorld(page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            page.getTextContent().then( function(textContent){
              console.log(textContent);
              var earnings = [];
              for (var j = 0; j <= textContent.items.length; j++) {
                var item = textContent.items[j];
                if (item.str === "Medicare" && textContent.items[j+1].str === "Earnings"){
                  console.log("found it!", indexingFactors);
                  earnings = parseEarnings(textContent.items, j+2);
                  projectEarnings(earnings);
                  sortEarnings(earnings);
                  console.log("earnings", earnings);
                  printEarnings(earnings);
                  break;
                }
              }
            });

            //
            // Prepare canvas using PDF page dimensions
            //
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            //
            // Render PDF page into canvas context
            //
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
          });
        });
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsArrayBuffer(f);
  }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);