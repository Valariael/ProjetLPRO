
// Generate the grid of the calendar.

var days	 = new Array('Lun','Mar','Mer','Jeu','Ven','Sam','Dim');
var months	 = new Array('Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre');

function getCalendar(year, month){

	console.log("year colonne:" + year  + " year mois :" + month);
	// Process
	var date = new Date(year, month-1, 0);
	var nbDays = getNbJours(new Date(year, month, 0));
	var table = new Array();

	for (var i = 0; i < nbDays; i++) {
		table.push(date.getDay()+1); // day of the week
		date.setTime(date.getTime() + 24*3600*1000); // Day + 1
	}

	var lastDay = table[nbDays-1];

	// Display
	var result = "<table><thead><td colspan=\"4\" class=\"padding\">" + months[month-1] + "</td></thead><tbody>";

	for (var i = 0; i < nbDays; i++) {
		var current = new Date(year, month-1, i+1);
		var tab = JoursFeries(year);
		var publicHoliday = 0;

		for(var j in tab){
			if(tab[j].getTime() === current.getTime()){
				publicHoliday = 1;
				break;
			}
		}

		result	+= "<tr><td>" + days[table[i%7]-1] + "</td><td>" + (i+1) + "</td>";

		if(publicHoliday == 1){
			result += "<td class=\"day ferieCat\">Férié</td><td class=\"day ferieCat\"></td></tr>"
		}else if(table[i%7] == 7){
			result += "<td class=\"day ferieCat\"></td><td class=\"day ferieCat\"></td></tr>";
		}else{
			result += "<td class=\"day libreCat\"></td><td class=\"day libreCat\"></td></tr>";
		}

	}

	if(nbDays != 31){
		for (var i = 0; i < 31-nbDays; i++) {
			result	+= "<tr><td colspan=\"4\" class=\"padding\"></tr>";
		}
	}

	result += "</tbody></table>";

	result += "<table id=\"recapMonth" + (month-1) + "\" class=\"recap\"><tr><td class=\"recapCours\">0</td><td class=\"recapProjetTutUniv\">0</td><td class=\"recapProjetTutEts\">0</td><td class=\"recapEntreprise\">0</td></tr></table>";

	return result;
}

function displayCalendar(n, year, month){

	month = parseInt(month);
	year = parseInt(year);
	let displays = [];
	for(let j=0; j<n; j++) {
		// peut etre changer la valeur de month en fonction de j

		let display = "<div id=\"calendar" + j + "\"><table class=\"firstTable\"><thead><tr><th colspan=\"";
		if(~~((12-month)/7) >= 1) display += "7";
		else display += "" + (13-month);
		display += "\">" + (year) + "</th>";
		if(~~((12-month)/7) < 1 && (7-(13-month)) > 0) display += "<th colspan=\"" + (7-(13-month)) + "\">" + (year+1) + "</th>";
		display += "</tr></thead><tbody><tr>";
		if(~~((12-month)/7) >= 1) {
			for(let i = month; i < month+7; i++) {
				display += "<td>" + getCalendar(year, i) + "</td>";
			}
		} else {
			for(let i = month; i < 13; i++) {
				display += "<td>" + getCalendar(year, i) + "</td>";
			}
		}
		if(~~((12-month)/7) < 1) {
			for (var i = 1; i < 8 -(13 - month); i++)  {
				display += "<td>" + getCalendar((year+1), i) + "</td>";
			}
		}

		display += "</tr></tbody></table><table class=\"secondTable\"><thead><tr><th colspan=\"";
		if(12-month >= 7) display += "" + (13-month-7) + "\">" + (year) + "</th><th colspan=\"" + ((14-(13-month-7))%7) + "\">" + (year+1) + "</th>";
		else display += "" + (13-((month+7)%12)) + "\">" + (year+1) + "</th>";
		if(12-month == 0) display += "<th colspan=\"1\">" + (year+2) + "</th>";
		display += "</tr></thead><tbody><tr>";
		if(12-month >= 7) {
			for (let i = (month+7); i < 13; i++) {
				display += "<td>" + getCalendar((year), i) + "</td>";
			}
			for (let i = 1; i < ((14-(13-month-7))%7)+1; i++) {
				display += "<td>" + getCalendar((year+1), i) + "</td>";
			}
		} else {
			for (let i = (month+7)%12; i < 7+(month+7)%12; i++) {
				display += "<td>" + getCalendar((year+1), i) + "</td>";
			}
		}
		if(12-month == 0) {
			display += "<td>" + getCalendar((year+2), 1) + "</td>";
		}

		display += "</tr></tbody></table></div>";

		displays.push(display);

		year = year+1;
		month = (month+14)%12;
	}

	let calendar = document.getElementById("calendar");
	calendar.innerHTML = "";
	displays.forEach(function(element) {
		calendar.innerHTML += element;
	});
	// Call the categories script TODO remove, fonction inexistante
	eventCategories();
}

function getNbJours(date){
	return new Date(date.getFullYear(), date.getMonth()+1, -1).getDate()+1;
}

function JoursFeries(an){
	var JourAn = new Date(an, "00", "01")
	var FeteTravail = new Date(an, "04", "01")
	var Victoire1945 = new Date(an, "04", "08")
	var FeteNationale = new Date(an,"06", "14")
	var Assomption = new Date(an, "07", "15")
	var Toussaint = new Date(an, "10", "01")
	var Armistice = new Date(an, "10", "11")
	var Noel = new Date(an, "11", "25")

	var G = an%19
	var C = Math.floor(an/100)
	var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30
	var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11))
	var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7
	var L = I - J
	var MoisPaques = 3 + Math.floor((L + 40)/44)
	var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4)
	var Paques = new Date(an, MoisPaques-1, JourPaques)
	var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1)
	var Ascension = new Date(an, MoisPaques-1, JourPaques+39)
	var Pentecote = new Date(an, MoisPaques-1, JourPaques+49)
	var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50)

	return new Array(JourAn, LundiPaques, FeteTravail, Victoire1945, Ascension, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel);
}
