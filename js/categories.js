
// Manage the catégories.

/*-------------------------------- Detect MouseDown ------------------------------------*/

var down = false;
$(document).mousedown(function() {
    down = true;

		 if(document.getElementById('selectid').value == "1") { colorClass = "coursCat"}
	else if(document.getElementById('selectid').value == "2") { colorClass = "projetTutCoursCat"}
	else if(document.getElementById('selectid').value == "3") { colorClass = "examenCat "}
	else if(document.getElementById('selectid').value == "4") { colorClass = "entrepriseCat"}
	else if(document.getElementById('selectid').value == "5") { colorClass = "projetTutEntrepriseCat"}
	else if(document.getElementById('selectid').value == "6") { colorClass = "vacanceCat"}
	else if(document.getElementById('selectid').value == "7") { colorClass = "ferieCat"}
	else{ colorClass = "libreCat"}

}).mouseup(function() {
    down = false;
});

/*----------------------------------- Fill Categories ----------------------------*/

function fillCat (select){
	$(select).removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
	$(select).addClass(colorClass);
}

function eventCategories(){

	$('.day').click(function() {
		fillCat(this);
		schedulesEvent();
 	});

	$('.day').hover(function() {
    	if( (down && colorClass == "libreCat") || (down && $(this).hasClass("libreCat") ) ){
    		fillCat(this);
    	}
    	schedulesEvent();
	});
}
