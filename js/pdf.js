
// Generate a PDF.

function genPDF() {
  let spinner = document.createElement("div");
  spinner.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
  spinner.className = "lds-roller";
  spinner.id = "loadingAnimation";
  spinner.style.position = "fixed";
  spinner.style.top = "50%";
  spinner.style.left = "50%";
  spinner.style.width = "100px";
  spinner.style.height = "100px";
  document.body.appendChild(spinner);

  // set size manually to mms for each element then html2canvas
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
  var calendar = document.getElementById('calendar');
  calendar.style.height = "2000px";
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

  html2canvas(document.getElementById('calendar'), optionsCal)
  .then(function(canvas) {
    var title = document.getElementById('nomForm').value;

    let img = new Image();
    // let src = canvas.getAttribute('src');
    // canvas.src = src;
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
      // let src = canvas.getAttribute('src');
      // canvas.src = src;
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
        // let src = canvas.getAttribute('src');
        // canvas.src = src;
        imgDataBottom = canvasBottom.toDataURL('image/png', 1.0);
        imgBottom.src = imgDataBottom;
        let widthBottom = doc.internal.pageSize.width+20;
        let heightBottom;// = doc.internal.pageSize.height
        heightBottom = ratio * widthBottom;

        //Ajout des éléments au PDF
        doc.addImage(imgDataTop, 'PNG', 30, 4, widthTop, heightTop);
        doc.addImage(imgDataCalendrier, 'PNG', 5, 20, width-10, height);
        doc.addImage(imgDataBottom, 'PNG', -10, doc.internal.pageSize.height-heightBottom+35, widthBottom, heightBottom);
        doc.output("save", "Calendrier "+title+".pdf");

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
        calendar.style.height = "";
        calendar.style.width = "";
        top_pdf.style.height = "";
        top_pdf.style.width = "";
        bottom_pdf.style.height = "";
        bottom_pdf.style.width = "";

        document.body.removeChild(spinner);
      });
    });
  });

  //peut etre stocker le calendrier avant de le modifier
  // var calculPart = document.getElementById("calculPart");
  // calculPart.style.display = "none";

  // var calendar = document.getElementById("calendar");
  // calendar.style.paddingRight = "40px";
  //
  // let divCal = document.getElementById("div_calendar");
  // divCal.className = "col-sm-11 col-xs-11";

  // let topdf = document.getElementById("to_pdf");
  // var div = document.createElement("div");
  // let nCoursCat = $('.coursCat').length;
  // let nProjetTutCoursCat = $('.projetTutCoursCat').length;
  // let nExamenCat = $('.examenCat').length;
  // let nEntrepriseCat = $('.entrepriseCat').length;
  // let nProjetTutEntrepriseCat = $('.projetTutEntrepriseCat').length;
  // let nVacanceCat = $('.vacanceCat').length;
  // div.className = "col-sm-1 col-1";
  // div.innerHTML = "<div id=\"resume\">"
  // 	+"<table class=\"table\">"
  // 	+	"<tbody>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJCours\">Cours</td>"
  // 	+		 	"<td id=\"joursCours\">" + nCoursCat + "</td>"
  // 	+		"</tr>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJProjetTutUniv\">PT Univ</td>"
  // 	+			"<td id=\"joursProjetTutUniv\">" + nProjetTutCoursCat + "</td>"
  // 	+		"</tr>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJExamen\">Examen</td>"
  // 	+			"<td id=\"joursExamen\">" + nExamenCat + "</td>"
  // 	+		"</tr>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJEntreprise\">Entreprise</td>"
  // 	+			"<td id=\"joursEntreprise\">" + nEntrepriseCat + "</td>"
  // 	+		"</tr>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJProjetTutEts\">PT Ets</td>"
  // 	+			"<td id=\"joursProjetTutEts\">" + nProjetTutEntrepriseCat + "</td>"
  // 	+		"</tr>"
  // 	+		"<tr>"
  // 	+			"<td id=\"labelJVacances\">Vacances</td>"
  // 	+			"<td id=\"joursVacances\">" + nVacanceCat + "</td>"
  // 	+		"</tr>"
  // 	+	"</tbody>"
  // 	+"</table>"
  // 	+"</div>";

  // let tab = html2canvas(document.querySelector("#calculPart")).then(function(canvas) {
  // 	let img = canvas.toDataURL('image/png');
  // 	window.open(img);
  // })
  //
  // let cals = [];
  // for(let cal of document.querySelectorAll(".calendar_wrapper")) {
  // 	let html2obj = html2canvas(cal).then();
  // 	let queue  = html2obj.parse();
  // 	let canvas = html2obj.render(queue);
  // 	let data = canvas.toDataURL('image/png'); // and resize + addpage
  // 	cals.push(data);
  // }

  // 	html2canvas(document.querySelector('#to_pdf')).then(function(canvas) {
  // 		let title = document.getElementById('nomForm').value;
  //
  //     let src = canvas.getAttribute('src');
  // 		canvas.src = src;
  //
  // 		let doc = new jsPDF('l', 'mm', "a4");
  //
  // 			let largeur = screen.width / doc.internal.pageSize.width;
  // 			let hauteur = screen.height / doc.internal.pageSize.height;
  // 				console.log("l : " + screen.width / doc.internal.pageSize.width);
  // 					console.log("h : " + screen.height / doc.internal.pageSize.height);
  //
  // //ajout annee
  // 		doc.text(title, (doc.internal.pageSize.width/2 - (((title.length-1)*1.333*0.264583)/2)), 8);
  // 		doc.addImage(canvas.toDataURL('image/png', 1.0 ), 'PNG', 4, 8, canvas.width*0.264583*1.3/largeur*2.3, canvas.height*0.264583*1.05/hauteur*2);
  // 		doc.output("save", "Calendrier "+title+".pdf"); // date ?
  // 		calendar.style.paddingRight = "0px";
  // 		calculPart.style.display = "block";
  // 		div.remove();
  // 		divCal.className = "col";
  // 	});
}
