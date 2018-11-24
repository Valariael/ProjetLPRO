<!DOCTYPE html>

<?php

require_once 'php/config.php';
require_once $phpcas_path . '/CAS.php';
phpCAS::setDebug();
phpCAS::setVerbose(true);
phpCAS::client(CAS_VERSION_2_0, $cas_host, $cas_port, $cas_context);
phpCAS::setNoCasServerValidation();
phpCAS::forceAuthentication();
if (isset($_REQUEST['logout'])) {
	phpCAS::logout();
}

?>

<html lang="fr">
	<head>

		<link rel="shortcut icon" href="content/favicon.ico" type="image/x-icon">
		<meta name="Language" content="fr">
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<title>Calendrier</title>

		<!-- Stylesheets -->

		<link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>
		<link rel="stylesheet" href="css/bootstrap-select.min.css">
		
		<link rel="stylesheet" type="text/css" href="css/normalize.css" title="style" />
	  	<link rel="stylesheet" type="text/css" href="css/style.css" title="style" />

	  	<!-- Google's fonts -->

		<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
		
	</head>
	<body>
	<header>
		<div class="row">
			<div class="col-sm-12 outils">
				<div class="categories">
					<label class="lblCat"> Sélectionner, créer ou supprimer un calendrier</label>	
					<div class="CalendarParam">
						<div class="styled-select">
							<select id="selectCal" onchange="displayData(event)">
							</select>
						</div>						
							<a href="javascript:addCalendarBtn()" ><img src="content/file.png" alt="Ajouter" id="addCal" class="btnCal" title="Ajouter le calendrier"></a> &nbsp;
							<a href="javascript:saveCalendarBtn()" ><img src="content/save.png" alt="Sauvegarder"  id="saveCal" class="btnCal" title="Enregistrer le calendrier"></a>
							<a href="javascript:delCalendarBtn()" ><img src="content/dustbin.png" alt="Supprimer"  id="delCal" class="btnCal" title="Supprimer le calendrier"></a>
					</div>		
				</div>						
				<div class="categories ">
						<label class="lblCat"> Sélectionner une catégorie</label>
					<select id="selectid" class="selectpicker">
						<option class="c1" value="1" id="1">Cours</option>
						<option class="c2" value="2" id="2">Projet tut. Cours</option>
						<option class="c3" value="3" id="3">Examen</option>
						<option class="c4" value="4" id="4">Entreprise</option>
						<option class="c5" value="5" id="5">Projet tut. Entreprise</option>
						<option class="c6" value="6" id="6">Vacances</option>
						<option class="c7" value="7" id="7">Libre</option>
					</select>
				</div>										 
				<div class="categories">
					<label class="lblCat"> Générer un PDF du calendrier</label>
					<div id="editor"></div>
					<a class="btn btn-danger btn-lg btnCategorie" href="javascript:genPDF()" >PDF</a>
				</div>						
				<div class="categories">
					<label class="lblCat"> Aller directement au résumé</label>
					<a class="btn btn-info btn-lg glyphicon glyphicon-arrow-down btnCategorie" href="#calculPart" ></a>
				</div>					
			</div>
		</div>			
	</header>
	
		<main>
			<div id="cal">
				<div class="row">
					<div class=" nomCalendrier">
						<div class="col-xs-2 col-sm-offset-1">
							<img src="content/logo-UFC-transparent.png" alt="Logo UFC" class="imgUFC">					
						</div>	
						<div class="col-sm-4 col-sm-offset-1">
						<center>
								<h2 id="mainTitle"> Calendrier prévisionnel</h2>
								<input type="text" id="nomForm" class="nomFormation" placeholder="Nom de la formation" size="40" value="" />						
								<input type="text" id="compoAndPlace" class="nomFormation" placeholder="Composante et lieu de formation" size="40" />
						</center>		
						</div>					
					</div>	
				</div>
				<div class="row">
					<h4 class="MsgPrecaution" > Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.</h4>		
				</div>
				<div class="row">
					<div class="col-lg-12 ">
						<div id="calendar"></div>
					</div>	
				</div>	
				<div class="row" >
					<div id="calculPart">
						<div class=" col-sm-10 col-sm-offset-1">		
							<table class="resume">
								<tr>
									<td class="tdLabel"><label>Catégories</label></td>
									<td class="tdLabel"><label>Nombre de demi-journées totales</label></td>
									<td class="tdLabel"><label>Nombre d'heures totales</label></td>
									<td class="tdDesc"></td>
								</tr>
								<tr>
									<td class="tdLabel c1"><label>Cours<br>+<br>Projets tutorés</label></td>
									<td class="tdInput"><input type="text" id="demiJourneeCoursProjet" size="3" value="0"/></td>
									<td class="tdInput"><input type="text" id="heureCoursProjet" size="3" value="0"/></td>
									<td class="tdDesc"><p>Cours répartis sur <input type="text" id="semaineCours" size="3" value="0"/> semaines.</p><p>Projets tutorés répartis sur <input type="text" id="semaineCoursProjet" size="3" value="0"/> semaines.</p></td>
								</tr>										
								<tr>
									<td class="tdLabel c3"><label>Examen </label></td>
									<td class="tdInput"><input type="text" id="demiJourneeExamen" size="3" value="0"/></td>
									<td class="tdInput"><input type="text" id="heureExamen" size="3" value="0"/></td>
									<td class="tdDesc"><p>Contrôle continu de formation et/ou examens ponctuels répartis sur <input type="text" id="semaineExamen" size="3" value="0"/> semaines.</p><p>La soutenance de validation de l'UE "Stage" aura lieu le <input type="text" id="semaineDate" size="15" value="00 / 00 / 0000"/> ou selon la date de fin du contrat.</p></td>
								</tr>
								<tr>
									<td class="tdLabel c4"><label>Entreprise<br>+<br>Projets tutorés</label></td>
									<td class="tdInput"><input type="text" id="demiJourneeEntrepriseProjet" size="3" value="0"/></td>
									<td class="tdInput"><input type="text" id="heureEntrepriseProjet" size="3" value="0"/></td>
									<td class="tdDesc"><p><span class="glyphicon glyphicon-alert"></span><strong> Si contrat de professionnalisation</strong>: le contrat de travail peut démarrer au plus tôt 2 mois avant le début de la formation et prendre fin au plus tard 2 mois après le dernier jour en centre (cours ou examen).</p><p>Projet tutorés répartis sur <input type="text" id="semaineEntrepriseProjet" size="3" value="0"/> semaines.</p></td>
								</tr>		
								<tr> 
									<td class="tdLabel c6"><label>Vacances universitaires</label></td>
									<td class="tdInput"><input type="text" id="demiJourneeVacance" size="3" value="0"/></td>
									<td class="tdInput"><input type="text" id="heureVacance" size="3" value="0"/></td>
									<td class="tdDesc"><p>Les salariés en <strong>contrat de professionnalisation </strong> sont en entreprise ou en congés payés durant ces périodes (à définir avec l'employeur).</p></td>
								</tr>
							</table>	
						</div>	
					</div>	
				</div>
				<div class="row " >
					<div class="col-sm-6 col-sm-offset-3 adresse">																
						<h3>Université de Franche-Comté - Service Formation Continue</h3><br>																		
						<p>Maison des étudiants - 36 A avenue de l’Observatoire - 25030 BESANCON Cedex </p>
						<p> Tél: 03 81 66 61 21 - Fax: 03 81 66 61 02 </p>										
						<a href="mailto:formation-continue@univ-fcomte.fr">formation-continue@univ-fcomte.fr</a> - <a href="http://formation-continue.univ-fcomte.fr">http://formation-continue.univ-fcomte.fr</a>									
					</div>
					<div class=" col-sm-1 ">										
						<img src="content/qualite.png" alt="Logo Qualtié" class="imgQualite">																
					</div>
				</div>
			</div>	
		</main>
		
		<footer>
		    <p><a href="?logout=" class="btn btn-primary  btnHeures" >Déconnexion</a></p>
		</footer>
		
		<!-- Scripts -->
		
		<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
		<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js'></script>
		<script src="js/jspdf.min.js" ></script>
		<script src="js/html2canvas.js" ></script>
		<script src="js/bootstrap-select.min.js"></script>
		<script src="js/scroll.js"></script>

		<script src="js/gridCalendar.js"></script>		
		<script src="js/calendars.js"></script>
		<script src="js/categories.js"></script>
		<script src="js/pdf.js"></script>
	</body>
</html>