
// Generate a PDF.

var imgParts = [];

function genPDF() {
  var spinner = document.createElement("div");
  spinner.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
  spinner.className = "lds-roller";
  spinner.id = "loadingAnimation";
  spinner.style.position = "fixed";
  spinner.style.top = "50%";
  spinner.style.left = "50%";
  spinner.style.width = "100px";
  spinner.style.height = "100px";
  document.body.appendChild(spinner);

  let select = document.getElementById("selectCal");
  let nbAnnees = calendars[select.selectedIndex][5];
  let isPro = calendars[select.selectedIndex][6];
  let anneeDebut = parseInt(calendars[select.selectedIndex][7][0]);
  let strCal = "Calendrier prévisionnel " + anneeDebut + "-" + (anneeDebut+nbAnnees);

  var countPage;

  var descs = document.getElementsByClassName("tdDesc");
  for(let d of descs) {
    d.style.padding = "4px";
    let ps = d.getElementsByTagName("p");
    for(let p of ps) {
      p.style.padding = "4px";
      p.style.margin = "3px";
    }
  }
  var labels = document.getElementsByClassName("tdLabel");
  for(let l of labels) {
    l.style.padding = "4px";
  }
  var resume = document.getElementsByClassName("resume")[0];
  resume.style.marginBottom = "15px";
  var recaps = document.getElementsByClassName("recap");
  for(let r of recaps) {
    r.style.display = "none";
  }
  var secondTables = document.getElementsByClassName("secondTable");
  for(let s of secondTables) {
    s.style.marginTop = "20px";
  }
  var btnResume = document.getElementById("btnResume");
  btnResume.style.display = "none";
  var btnDateExamen = document.getElementById("btnDateExamen");
  btnDateExamen.style.display = "none";

  var calendar = document.getElementById('calendar');
  calendar.style.height = (nbAnnees*2000)+"px";
  calendar.style.width = "2000px";
  var bottom_pdf = document.getElementById("bottom_pdf");
  bottom_pdf.style.height = "1000px";
  bottom_pdf.style.width = "2000px";

  var divHeight = $('#calendar').height();
  var divWidth = $('#calendar').width();
  var ratio = divHeight / divWidth;

  document.querySelectorAll("#calendar table table").forEach(function(el) {
    el.style.fontSize = "13pt";
    el.style.fontWeight = "bold";
  });

  let optionsCal = {
    height: divHeight,
    width: divWidth,
  };
  var imgDataCalendrier = null;
  var imgDataBottom = null;

  if(nbAnnees == 1) {
    html2canvas(document.getElementById('calendar'), optionsCal)
    .then(function(canvas) {
      var title = document.getElementById('nomForm').value;

      let img = new Image();
      imgDataCalendrier = canvas.toDataURL('image/png', 1.0);
      img.src = imgDataCalendrier;
      var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4
      doc.setTextColor("#000000");
      doc.setFontSize(9);

      let width = doc.internal.pageSize.width;
      let height = doc.internal.pageSize.height;
      height = ratio * width;

      let divBottomHeight = $('#bottom_pdf').height();
      let divBottomWidth = $('#bottom_pdf').width();
      ratio = divBottomHeight / divBottomWidth;
      let optionsBottom = {
        height: divBottomHeight,
        width: divBottomWidth,
      };

      html2canvas(document.getElementById("bottom_pdf"), optionsBottom).then(function(canvasBottom) {
        let imgBottom = new Image();
        imgDataBottom = canvasBottom.toDataURL('image/png', 1.0);
        imgBottom.src = imgDataBottom;
        let widthBottom = doc.internal.pageSize.width+20;
        let heightBottom;// = doc.internal.pageSize.height
        heightBottom = ratio * widthBottom;

        //Création des logos
        let logosQualite = new Image();
        let logoFC = new Image();
        logosQualite.src = dataLogosQualite;
        logoFC.src = dataLogoFC;

        //Ajout des éléments au PDF
        doc.addImage(img, 'PNG', 5, 20, width-10, height);
        doc.addImage(imgBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+35, widthBottom, heightBottom);

        let complement = document.getElementById("compForm").value;
        let composante = document.getElementById("compoAndPlace").value;
        doc.text(title, getTitlePosition(title, doc), 10);
        if(complement != "") doc.text(complement, getTitlePosition(complement, doc), 14);
        doc.text(composante, getTitlePosition(composante, doc), 18);
        if(isPro) {
          let strPro = "Alternance (contrat de professionnalisation)";
          doc.setTextColor("#FF0000");
          doc.setFontSize(8);
          doc.text(strPro, getTitlePosition(strPro, doc), 22);
          doc.setFontSize(9);
        }

        doc.setTextColor("#FF0000");
        doc.text("Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.", 53, height+2);
        doc.text(strCal, getTitlePosition(strCal, doc), 5);

        doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-20, 35, 15);
        doc.addImage(logoFC, 'PNG', doc.internal.pageSize.width-40, 4, 36, 18);


        //appliquer le remplacement des cars TODO x2
        doc.output("save", "Calendrier_"+title+".pdf");

        //Réinitialisation du style
        document.querySelectorAll("#calendar table table").forEach(function(el) {
          el.style.fontSize = "";
          el.style.fontWeight = "";
        });
        for(let d of descs) {
          d.style.padding = "";
          let ps = d.getElementsByTagName("p");
          for(let p of ps) {
            p.style.padding = "";
            p.style.margin = "";
          }
        }
        var labels = document.getElementsByClassName("tdLabel");
        for(let l of labels) {
          l.style.padding = "";
        }
        resume.style.marginBottom = "";
        for(let r of recaps) {
          r.style.display = "table";
        }
        for(let s of secondTables) {
          s.style.marginTop = "";
        }
        btnResume.style.display = "";
        btnDateExamen.style.display = "";

        calendar.style.height = "";
        calendar.style.width = "";
        bottom_pdf.style.height = "";
        bottom_pdf.style.width = "";

        let titleBis = document.getElementById("nomForm");
        let compoBis = document.getElementById("compoAndPlace");

        titleBis.style.fontSize = "";
        compoBis.style.fontSize = "";

        document.body.removeChild(spinner);

      });
    });
  } else {

    //Création des logos
    let logosQualite = new Image();
    let logoFC = new Image();
    logosQualite.src = dataLogosQualite;
    logoFC.src = dataLogoFC;

    var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4
    doc.setTextColor("#000000");
    doc.setFontSize(9);

    for(let i=0; i<nbAnnees; i++) {
      optionsCal = {
        height: divHeight,
        width: divWidth,
      };

      html2canvas(document.getElementById("calendar"+i), optionsCal)
      .then(function(canvas) {
        var title = document.getElementById('nomForm').value;

        let img = new Image();
        imgDataCalendrier = canvas.toDataURL('image/png', 1.0);
        img.src = imgDataCalendrier;
        let width = doc.internal.pageSize.width;
        let height = doc.internal.pageSize.height;
        height = ratio * width;

        doc.addImage(img, 'PNG', 5, 25, width-10, height);

        let complement = document.getElementById("compForm").value;
        let composante = document.getElementById("compoAndPlace").value;
        doc.text(title, getTitlePosition(title, doc), 10);
        if(complement != "") doc.text(complement, getTitlePosition(complement, doc), 14);
        doc.text(composante, getTitlePosition(composante, doc), 18);
        if(isPro) {
          let strPro = "Alternance (contrat de professionnalisation)";
          doc.setTextColor("#FF0000");
          doc.setFontSize(8);
          doc.text(strPro, getTitlePosition(strPro, doc), 22);
          doc.setFontSize(9);
        }

        doc.setTextColor("#FF0000");
        doc.text(strCal, getTitlePosition(strCal, doc), 5);

        doc.addImage(logoFC, 'PNG', doc.internal.pageSize.width-40, 4, 36, 18);
        if(i+1 == nbAnnees) {
          let divBottomHeight = $('#bottom_pdf').height();
          let divBottomWidth = $('#bottom_pdf').width();
          ratio = divBottomHeight / divBottomWidth;
          let optionsBottom = {
            height: divBottomHeight,
            width: divBottomWidth,
          };

          html2canvas(document.getElementById("bottom_pdf"), optionsBottom).then(function(canvasBottom) {
            let imgBottom = new Image();
            imgDataBottom = canvasBottom.toDataURL('image/png', 1.0);
            imgBottom.src = imgDataBottom;
            let widthBottom = doc.internal.pageSize.width+20;
            let heightBottom;// = doc.internal.pageSize.height
            heightBottom = ratio * widthBottom;


            //Ajout des éléments au PDF
            //doc.addImage(imgBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+50, widthBottom, heightBottom-5);
            doc.addImage(imgBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+35, widthBottom, heightBottom);
            doc.text("Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.", 53, doc.internal.pageSize.height-85);
            doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-20, 35, 15);

            //appliquer le remplacement des cars TODO x2
            doc.output("save", "Calendrier_"+title+".pdf");

            //Réinitialisation du style
            document.querySelectorAll("#calendar table table").forEach(function(el) {
              el.style.fontSize = "";
              el.style.fontWeight = "";
            });
            for(let d of descs) {
              d.style.padding = "";
              let ps = d.getElementsByTagName("p");
              for(let p of ps) {
                p.style.padding = "";
                p.style.margin = "";
              }
            }
            var labels = document.getElementsByClassName("tdLabel");
            for(let l of labels) {
              l.style.padding = "";
            }
            resume.style.marginBottom = "";
            for(let r of recaps) {
              r.style.display = "table";
            }
            for(let s of secondTables) {
              s.style.marginTop = "";
            }
            btnResume.style.display = "";
            btnDateExamen.style.display = "";

            calendar.style.height = "";
            calendar.style.width = "";
            bottom_pdf.style.height = "";
            bottom_pdf.style.width = "";

            let titleBis = document.getElementById("nomForm");
            let compoBis = document.getElementById("compoAndPlace");

            titleBis.style.fontSize = "";
            compoBis.style.fontSize = "";

            document.body.removeChild(spinner);
          });
        } else {
          doc.setTextColor("#FF0000");
          doc.text("Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.", 53, doc.internal.pageSize.height-85);
          doc.setTextColor("#000000");
          doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-20, 35, 15);
          doc.addPage();
        }
      });
    }
  }
}

function getTitlePosition(str, pdf) {
  let fontSize = pdf.internal.getFontSize();
  let pageWidth = pdf.internal.pageSize.width;
  let txtWidth = pdf.getStringUnitWidth(str)*fontSize/pdf.internal.scaleFactor;
  console.log("fontS: " + fontSize + " pageW: " + pageWidth + " txtW: " + txtWidth);
  return ( pageWidth - txtWidth ) / 4;
}
