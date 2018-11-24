
// Generate a pdf.

function genPDF() {	
	html2canvas(document.getElementById('cal')).then(function(canvas) {
				var title = document.getElementById('nomForm').value;

                var img = canvas.toDataURL('image/png');
                var doc = new jsPDF(); // using defaults: orientation=portrait, unit=mm, size=A4
				var width = doc.internal.pageSize.width;    
				var height = doc.internal.pageSize.height;
				
                doc.addImage(img, 'JPEG', 0,-10, width, height);
                doc.save("Calendrier "+title+".pdf");
            });
	
}