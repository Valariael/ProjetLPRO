
// Generate a PDF.

var imgParts = [];

function genPDF() { // TODO ajout phrase en rouge au dessus calendrier :
  // Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.
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
  let nbAnnees = calendars[select.selectedIndex][4];

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
  var title = document.getElementById("nomForm");
  var compo = document.getElementById("compoAndPlace");
  title.style.fontSize = "14pt";
  compo.style.fontSize = "14pt";

  var calendar = document.getElementById('calendar');
  calendar.style.height = (nbAnnees*2000)+"px";
  calendar.style.width = "2000px";
  var top_pdf = document.getElementById("top_pdf");
  top_pdf.style.height = "1000px";
  top_pdf.style.width = "1000px";
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
  var imgDataTop = null;
  var imgDataBottom = null;

  if(nbAnnees == 1) {
    html2canvas(document.getElementById('calendar'), optionsCal)
    .then(function(canvas) {
      var title = document.getElementById('nomForm').value;

      let img = new Image();
      imgDataCalendrier = canvas.toDataURL('image/png', 1.0);
      img.src = imgDataCalendrier;
      var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4
      let width = doc.internal.pageSize.width;
      let height = doc.internal.pageSize.height;
      height = ratio * width;

      let divTopHeight = $('#top_pdf').height();
      let divTopWidth = $('#top_pdf').width();
      ratio = divTopHeight / divTopWidth;
      let optionsTop = {
        height: divTopHeight,
        width: divTopWidth,
      };

      html2canvas(document.getElementById('top_pdf'), optionsTop).then(function(canvasTop) {
        let imgTop = new Image();
        imgDataTop = canvasTop.toDataURL('image/png', 1.0);
        imgTop.src = imgDataTop;
        let widthTop = doc.internal.pageSize.width/2;
        let heightTop;// = doc.internal.pageSize.height/8
        heightTop = ratio * widthTop;

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
          doc.addImage(imgTop, 'PNG', 25, 4, widthTop, heightTop);
          doc.addImage(img, 'PNG', 5, 20, width-10, height);
          doc.addImage(imgBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+35, widthBottom, heightBottom);
          doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-20, 35, 15);
          doc.addImage(logoFC, 'PNG', doc.internal.pageSize.width/2+15, 4, 36, 18);


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
          btnResume.style.display = "block";

          calendar.style.height = "";
          calendar.style.width = "";
          top_pdf.style.height = "";
          top_pdf.style.width = "";
          bottom_pdf.style.height = "";
          bottom_pdf.style.width = "";

          let titleBis = document.getElementById("nomForm");
          let compoBis = document.getElementById("compoAndPlace");

          titleBis.style.fontSize = "";
          compoBis.style.fontSize = "";

          document.body.removeChild(spinner);

        });
      });
    });
  } else {

    //Création des logos
    let logosQualite = new Image();
    let logoFC = new Image();
    logosQualite.src = dataLogosQualite;
    logoFC.src = dataLogoFC;

    let divTopHeight = $('#top_pdf').height();
    let divTopWidth = $('#top_pdf').width();
    ratio = divTopHeight / divTopWidth;
    let optionsTop = {
      height: divTopHeight,
      width: divTopWidth,
    };

    var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4

    html2canvas(document.getElementById('top_pdf'), optionsTop).then(function(canvasTop) {
      let imgTop = new Image();
      imgDataTop = canvasTop.toDataURL('image/png', 1.0);
      imgTop.src = imgDataTop;
      let widthTop = doc.internal.pageSize.width/2;
      let heightTop;// = doc.internal.pageSize.height/8
      heightTop = ratio * widthTop;
      for(let i=0; i<nbAnnees; i++) {

        optionsCal = {
          height: $("#calendar"+i).height(),
          width: $("#calendar"+i).width(),
        };

        html2canvas(document.getElementById("calendar"+i), optionsCal)
        .then(function(canvas) {
          var title = document.getElementById('nomForm').value;

          let img = new Image();
          imgDataCalendrier = canvas.toDataURL('image/png', 1.0);
          img.src = imgDataCalendrier;
          let width = doc.internal.pageSize.width;
          let height = doc.internal.pageSize.height-10;
          height = ratio * width;



          doc.addImage(imgTop, 'PNG', 25, 3, widthTop+5, heightTop);
          doc.addImage(img, 'PNG', 5, 20, width-10, height);
          doc.addImage(logoFC, 'PNG', doc.internal.pageSize.width/2+15, 2, 36, 17);
          console.log("count:" + i + " annees:"+nbAnnees);
          if(i+1 == nbAnnees) {
            console.log("last page");
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
              doc.addImage(imgBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+50, widthBottom, heightBottom-5);
              doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-15, 35, 15);

              //appliquer le remplacement des cars TODO x2
              doc.output("save", "Calendrier_"+title+".pdf");
              console.log("saved");

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
              btnResume.style.display = "block";

              calendar.style.height = "";
              calendar.style.width = "";
              top_pdf.style.height = "";
              top_pdf.style.width = "";
              bottom_pdf.style.height = "";
              bottom_pdf.style.width = "";

              let titleBis = document.getElementById("nomForm");
              let compoBis = document.getElementById("compoAndPlace");

              titleBis.style.fontSize = "";
              compoBis.style.fontSize = "";

              document.body.removeChild(spinner);
              let anim = document.getElementById("loadingAnimation");
              anim.parentElement.removeChild(anim);
            });
          } else {
            doc.addImage(logosQualite, 'PNG', doc.internal.pageSize.width-40, doc.internal.pageSize.height-20, 35, 15);
            doc.addPage();
          }
        });
      }
    });
  }
}
