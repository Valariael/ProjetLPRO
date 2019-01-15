
// Generate a PDF.

function genPDF() {
	//peut etre stocker le calendrier avant de le modifier
	var calculPart = document.getElementById("calculPart");
	calculPart.style.display = "none";

	var calendar = document.getElementById("calendar");
	calendar.style.paddingRight = "40px";

	let divCal = document.getElementById("div_calendar");
	divCal.className = "col-sm-11 col-xs-11";

	let topdf = document.getElementById("to_pdf");
	var div = document.createElement("div");
	let nCoursCat = $('.coursCat').length;
	let nProjetTutCoursCat = $('.projetTutCoursCat').length;
	let nExamenCat = $('.examenCat').length;
	let nEntrepriseCat = $('.entrepriseCat').length;
	let nProjetTutEntrepriseCat = $('.projetTutEntrepriseCat').length;
	let nVacanceCat = $('.vacanceCat').length;
	div.className = "col-sm-1 col-1";
	div.innerHTML = "<div id=\"resume\">"
		+"<table class=\"table\">"
		+	"<tbody>"
		+		"<tr>"
		+			"<td id=\"labelJCours\">Cours</td>"
		+		 	"<td id=\"joursCours\">" + nCoursCat + "</td>"
		+		"</tr>"
		+		"<tr>"
		+			"<td id=\"labelJProjetTutUniv\">PT Univ</td>"
		+			"<td id=\"joursProjetTutUniv\">" + nProjetTutCoursCat + "</td>"
		+		"</tr>"
		+		"<tr>"
		+			"<td id=\"labelJExamen\">Examen</td>"
		+			"<td id=\"joursExamen\">" + nExamenCat + "</td>"
		+		"</tr>"
		+		"<tr>"
		+			"<td id=\"labelJEntreprise\">Entreprise</td>"
		+			"<td id=\"joursEntreprise\">" + nEntrepriseCat + "</td>"
		+		"</tr>"
		+		"<tr>"
		+			"<td id=\"labelJProjetTutEts\">PT Ets</td>"
		+			"<td id=\"joursProjetTutEts\">" + nProjetTutEntrepriseCat + "</td>"
		+		"</tr>"
		+		"<tr>"
		+			"<td id=\"labelJVacances\">Vacances</td>"
		+			"<td id=\"joursVacances\">" + nVacanceCat + "</td>"
		+		"</tr>"
		+	"</tbody>"
		+"</table>"
		+"</div>";
	topdf.appendChild(div);


	html2canvas(document.querySelector('#to_pdf')).then(function(canvas) {
		let title = document.getElementById('nomForm').value;

    let src = canvas.getAttribute('src');
		canvas.src = src;

		let doc = new jsPDF('l', 'mm', "a4"); // using defaults: orientation=portrait, unit=mm, size=A4

//ajout annee
		doc.text(title, (doc.internal.pageSize.width/2 - (((title.length-1)*1.333*0.264583)/2)), 8);
		doc.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 4, 8, canvas.width*0.264583*0.54, canvas.height*0.264583*0.43);
		doc.output("save", "Calendrier "+title+".pdf"); // date ?

		calendar.style.paddingRight = "0px";
		calculPart.style.display = "block";
		div.remove();
		divCal.className = "col";
	});
}
