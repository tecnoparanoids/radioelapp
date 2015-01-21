var PODCAST_URL = "http://radioela.org/spip.php?page=backend&id_rubrique=5";
var STREAMING_HQ = "http://radio.nodo50.org:8001/radioela.mp3";
var STREAMING_SQ = "https://streaming.nodo50.org:2199/tunein/radioelastream.asx";

var rssLoaded = false;
var playerShown = false;
var podcast = new Array();

var parseRSS = function() {
//	$(loading).text('Descargando podcast...');
//	$(loading).fadeIn("normal");
	$.ajax({
		url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=15&callback=?&q=' + encodeURIComponent(PODCAST_URL),
		dataType: 'json',
		success: function(data) {
			var xml = data.responseData.xmlString;
			var rss = data.responseData.feed;
			var items = rss.entries || [];

			//	 		console.log(items);
//	  		for (var i = 0; i < items.length; i++) {
//				var entry = items[i];
//				var content = $(items[i].content).text();
//	    		console.log(content);
//			}
//	      		console.log(xml);

			var xmlDoc = $.parseXML(xml);
		  	var thehtml = "";
			$(xmlDoc).find("item").each(
				function(i,e){
//				console.log(e);
				var img = "";	
				var episode = new Episode();
				// miramos si el artículo lleva logo
				if(e.childNodes[5].firstChild){
					var data = e.childNodes[5].firstChild.data;

					var init = e.childNodes[5].firstChild.data.indexOf("src") + 5;
					var end = e.childNodes[5].firstChild.data.indexOf("width") - 2;

					if (init != 4){
						img = "<img src='" + data.substring(init,end) + "' class='episode_logo'>";
						episode.logo = data.substring(init,end);
					}
			  	}

				episode.title = $(e).find("title").text();
			  	episode.description = $(items[i].content).text();
				episode.audio = $(e).find("enclosure").attr('url');

				podcast[i] = episode;

				thehtml += "<li class='item_list' ><img src='" + episode.logo + "' class='episode_logo'>" +
					"<div onclick='showDescription(" + i + ")' class='link' >" +
					episode.title + "</div><div onclick='playShow(this)' class='play_episode' value='" +
					episode.audio + "'></div>" +
					"<div class='clear'></div></li>";
				}
			);
/*			for (i = 0; i < podcast.length; i++) {
				console.log("Episode: " + podcast[i].title);
			}

*/			
			$("#episodes").append(thehtml);	// TODO (puesto para probar): Optimizar esto, para que el append se haga solo una vez, no en cada ejecución del bucle
			rssLoaded = true;
			$(loading).fadeOut("slow");
    	},
    	error: function(){
			console.log("Error en la descarga del podcast");
			$(loading).text('Error en la descarga del podcast. Comprueba la conexión a internet');
			$(loading).delay(5000).fadeOut("normal");
    	}
  });
};


$(document).ready(function(){

	var streaming_button = document.getElementById('streaming_button');
	streaming_button.addEventListener("click", function(){switchTab('streaming_tab','podcast_tab', 'streaming_button', 'podcast_button');}, false);

	var podcast_button = document.getElementById('podcast_button');
	podcast_button.addEventListener("click", function(){switchTab('podcast_tab','streaming_tab', 'podcast_button', 'streaming_button');}, false);


	var player_hq = document.getElementById("player_hq");
	player_hq.addEventListener("click", function(){playShow('radio_hq');}, false);
 

//	var player_sq = document.getElementById("player_sq");
//	player_sq.addEventListener("click", function(){playShow('radio_sq');}, false);

	var details = document.getElementById("details");
	details.addEventListener("click", hideDescription, false);

	var stop = document.getElementById("stop");
	stop.addEventListener("click", function(){playShow('stop');}, false);

	var mute = document.getElementById("mute");
	mute.addEventListener("click", function(){playShow('mute');}, false);

	parseRSS();

//	var volumedown = document.getElementById("volumedown");
//	volumedown.addEventListener("click", function(){playShow('volumedown');}, false);
//
//	var volumeup = document.getElementById("volumeup");
//	volumeup.addEventListener("click", function(){playShow('volumeup');}, false);
});

function Episode () {
	this.title = "";
	this.logo = "img/dipolos.png"; 	// aquí irá la ruta para el logo por defecto de los episodios del podcast
	this.description = "";
	this.audio = "";
}


var switchTab = function( idTab, idTabHide, idButtonTab, idButtonTabHide){

    console.log("switch tab: " + idTabHide + " --> " + idTab);
    document.getElementById(idTab).className = "active";
    document.getElementById(idButtonTab).className = "activelink";
    document.getElementById(idTabHide).className = "inactive";
    document.getElementById(idButtonTabHide).className = "inactivelink";

    	if (idTab == "podcast_tab")
	    	document.getElementById("loading").className = "activelink";
	else
		document.getElementById("loading").className = "inactivelink";
};

var showDescription = function(indice){
	var description = podcast[indice].description;
	var details = document.getElementById("details");
//	console.log(description);
	details.innerHTML = description;

	$("#details").fadeIn("slow");
	$("#play_episode").fadeIn("slow");
	$("#download").fadeIn("slow");
	document.getElementById("podcast_tab").scrollTop = 0;
//	$("details").scrollTo(0,400);
}

var hideDescription = function(){
	$("#details").fadeOut("slow");
}

var playShow = function (link){

	console.log("playShow: " + link + " playerShown=" + playerShown);
	var loading = document.getElementById("loading");

	if(!playerShown){
		// Mostramos mensaje de "Cargando..."
//		$(document.getElementById("loading")).animate({top:'-=15%'}, 1000);
		$("#loading").text('Cargando audio...');
		$("#loading").slideUp();
	}

	var audio = document.getElementById('audio_player');

	console.log("audio.paused = " + audio.paused);
	audio.addEventListener("playing", function(){
		console.log("playing - hide loading: " + playerShown);
			if(!playerShown){
				console.log("Show player!");
				$("#player").fadeIn();
				playerShown = true;
			}
			$("#loading").fadeOut();							
		}, true);

	audio.addEventListener('error', onError, true);

	switch (link){
//		case "radio_sq":
//			if(audio.paused){
//				document.getElementById(element).className = "playing";
//				audio.src = STREAMING_SQ;
//			}
//			else{
//				stop(link);
//				return;
//			}
//		break;
		case "radio_hq":
			if(audio.paused){
				document.getElementById("player_hq").className = "playing";
				audio.src = STREAMING_HQ;
				$("#loading").fadeIn();
			}
			else{
				stop(link);
				return;
			}
		break;
		case "mute":
			console.log("Mute: " + audio.muted);
			audio.muted = !(audio.muted);
		break;
		case "stop":
			stop();
			return;
		break;
		case "volumeup":
			audio.volume += 0.1;
			return;
		break;
		case "volumedown":
			audio.volume -= 0.1;
			return;
		break;
		default:
			$("#loading").fadeIn();			
			audio.src = $(link).attr('value');

	}
	console.log("PLAY!!!! " + audio.src);
	audio.mozAudioChannelType = 'content';
	audio.play();
};

var stop = function(element){
		var audio = document.getElementById('audio_player');
		audio.pause();
		audio.src= "";
		document.getElementById("player_hq").className = "paused";
		$("#loading").fadeOut();	
		$('#player').slideDown();
		playerShown = false;

};


var onError = function(e) {

	console.log("ERROR AL REPRODUCIR: " + e.target.error.code + " - Audio: " + e.target.src);

	switch (e.target.error.code) {
		case e.target.error.MEDIA_ERR_ABORTED:
			$(loading).text('Error: Reproducción abortada');
		break;
		case e.target.error.MEDIA_ERR_NETWORK:
		   $(loading).text('Error de red. Comprueba la conexión a internet');
		break;
		case e.target.error.MEDIA_ERR_DECODE:
		   $(loading).text('Error de decodificación');
		break;
		case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
		   //$(loading).text('Error. Asegúrate de tener los datos activados');
		break;
		default:
		   $(loading).text('Se ha producido un error');
		break;
	}

	var audio = document.getElementById('audio_player');
	audio.pause();
	playerShown = false;
	$("#loading").fadeOut();
	$("#player").fadeOut();
	document.getElementById("player_hq").className = "paused";
};

