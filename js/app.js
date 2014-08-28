var PODCAST_URL = "http://radioela.org/spip.php?page=backend&id_rubrique=5";
var STREAMING_HQ = "http://radio.nodo50.org:8001/radioela.mp3";
var STREAMING_SQ = "https://streaming.nodo50.org:2199/tunein/radioelastream.asx";

var rssLoaded = false;
var playerShown = false;

$(document).ready(function(){
//	window.onerror = onError;
	var streaming_button = document.getElementById('streaming_button');
	streaming_button.addEventListener("click", function(){switchTab('streaming_tab','podcast_tab');}, false);	
	
	var podcast_button = document.getElementById("podcast_button");
	podcast_button.addEventListener("click", function(){switchTab('podcast_tab','streaming_tab');}, false);

		
	var player_hq = document.getElementById("player_hq");
	player_hq.addEventListener("click", function(){playShow('radio_hq');}, false);
	
	
	var player_sq = document.getElementById("player_sq");
	player_sq.addEventListener("click", function(){playShow('radio_sq');}, false);
	
	var details = document.getElementById("details");
	details.addEventListener("click", hideDescription, false);
	
	var stop = document.getElementById("stop");
	stop.addEventListener("click", function(){playShow('stop');}, false);
	
	var mute = document.getElementById("mute");
	mute.addEventListener("click", function(){playShow('mute');}, false);
	
	var volumedown = document.getElementById("volumedown");
	volumedown.addEventListener("click", function(){playShow('volumedown');}, false);
	
	var volumeup = document.getElementById("volumeup");
	volumeup.addEventListener("click", function(){playShow('volumeup');}, false);
});


var parseRSS = function() {
	$(loading).text('Descargando podcast...');
	$(loading).fadeIn("normal");
	$.ajax({
		url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=15&callback=?&q=' + encodeURIComponent(PODCAST_URL),
		dataType: 'json',
		success: function(data) {
			var xml = data.responseData.xmlString;
			var rss = data.responseData.feed;
		
			var items = rss.entries || [];
	// 		console.log(items);
	  		for (var i = 0; i < items.length; i++) {
				var entry = items[i];
				var content = $(items[i].content).text();
	//    		console.log(content);
			}
	//      console.log(xml);
		  	var xmlDoc = $.parseXML(xml);
		  	var thehtml = "";
			$(xmlDoc).find("item").each(
				function(i,e){
				//      	console.log("Audio: " + $(e).find("enclosure").attr('url'));

				thehtml += "<li class='item_list' ><div onclick='showDescription(this)' class='link' >" +
								$(e).find("title").text() + "<div class='description'>" + $(items[i].content).text() + 
								"</div></div><div onclick='playShow(this)' class='play_episode' value='" + 
								$(e).find("enclosure").attr('url') + "'><img class='play_icon' src='img/play.png' /></div>" + 
				//      					"<div onclick='downloadShow(this)' value='" + $(e).find("enclosure").attr('url') + "' class='download' >" +
								"<div class='download' onclick='downloadShow(this)' value='"+ $(e).find("enclosure").attr('url') + 
								"'>" + //<a href='" + $(e).find("enclosure").attr('url') + "' download>" +
								"<img class='download_icon' src='img/download.png' /></div></li>";
				
				//		console.log("Agregado capítulo: " + thehtml);
				//		console.log("Descripción: " + items[i].content);                
				}
			);
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

var switchTab = function( idTab, idTabHide ){

    console.log("switch tab: " + idTabHide + " --> " + idTab);
    document.getElementById(idTab).style.zIndex='2';
    document.getElementById(idTabHide).style.zIndex='1';
    
    if ((!rssLoaded) && (idTab == "podcast_tab"))
		parseRSS();
};

var showDescription = function(link){
//	console.log($($(link).html()).text());
	console.log($(link.querySelectorAll(".description")));
	var description = $(link.querySelectorAll(".description")).text();
	var details = document.getElementById("details");
	console.log(description);
	details.innerHTML = description;
	
	$("#details").fadeIn("slow");
	$("#play_episode").fadeIn("slow");
	$("#download").fadeIn("slow");
	
}

var hideDescription = function(){
	$("#details").fadeOut("slow");
}

var playShow = function (link){
	
	console.log("playShow: " + link);
	var loading = document.getElementById("loading");
	
	if(!playerShown){
		// Mostramos mensaje de "Cargando..."
//		$(document.getElementById("loading")).animate({top:'-=15%'}, 1000);
		$(loading).text('Cargando audio...');
		$(loading).fadeIn("normal");
	}
	
	var audio = document.getElementById('audio_player');
	
	console.log("audio.paused = " + audio.paused);
	audio.addEventListener("playing", function(){
					console.log("playing - hide loading");
					if(playerShown){
						$(loading).hide("slow");
//						$(document.getElementById("loading")).animate({top:'+=15%'}, 1000);
					}
				}, true);
	
	audio.addEventListener('error', onError, true);
	
	switch (link){
		case "radio_sq":
			if(audio.paused){
				document.getElementById("play_sq").src = "img/pause.png";
				audio.src = STREAMING_SQ;
			}
			else{
				document.getElementById("play_sq").src = "img/play.png";
				audio.pause();
				$(loading).hide("slow");
				$('#player').hide('slow');
				playerShown = false;
				return;
			}
		break;
		case "radio_hq":
			if(audio.paused){
				document.getElementById("play_hq").src = "img/pause.png";
				audio.src = STREAMING_HQ;
			}		
			else{
				audio.pause();
				document.getElementById("play_hq").src = "img/play.png";
				$(loading).hide("slow");
				$('#player').hide('slow');
				playerShown = false;
				return;
			}
		break;
		case "mute":
		break;
		case "stop":
			document.getElementById("play_sq").src = "img/play.png";
			document.getElementById("play_hq").src = "img/play.png";
			audio.pause();
			$('#player').animate({top:'+=15%'}, "slow");
//			$('#loading').animate({top:'+=15%'}, 1000);
			playerShown = false;
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
			audio.src = $(link).attr('value');
			
	}
	console.log("PLAY!!!! " + audio.src);
	audio.mozAudioChannelType = 'content';
	audio.play();

	console.log("Show player!");
	if (!playerShown){
		$('#player').animate({top:'-=15%'}, 1000);
		playerShown = true;
	}
};

var downloadShow = function(link){

// No hay de momento una solución standar que sea multiplataforma para la descarga y almacenamiento de ficheros


// ** OPCION 1: FIREFOX OS ** Necesitamos que la app sea privilegiada para acceder a la tarjeta sd
//	console.log("Carpeta de música: " + cordova.file.externalApplicationStorageDirectory);
	var fileURL = navigator.getDeviceStorage("sdcard");//.storageName + "temp.mp3";
	console.log(fileURL);
	

// ** OPCION 2: File System API ** Intenta ser un standar pero no lo implementa más que Chrome de momento
//	function onInitFs(fs) {
//	  console.log('Opened file system: ' + fs.name);
//	}

//	console.log("window.requestFileSystem: " + window.requestFileSystem);
//	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, onError);



// 	** OPCION 3: org.apache.cordova.file-transfer ** No soportado aún en Firefox OS, pero es la que mejor pinta tiene
/*
	var fileTransfer = new FileTransfer();

	var uri = encodeURI($(link).attr('value'));
	var fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);

	console.log("fileUrl: " + fileURL + " fileName; " + fileName);

	fileTransfer.download(
		uri,
		fileURL,
		function(entry) {
		    console.log("download complete: " + entry.toURL());
		},
		function(error) {
		    console.log("download error source " + error.source);
		    console.log("download error target " + error.target);
		    console.log("upload error code" + error.code);
		},
		false,
		{
		    headers: {
		        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
		    }
		}
	);
	*/
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
		   $(loading).text('Error: formato no soportado');
		break;
		default:
		   $(loading).text('Se ha producido un error');
		break;
	}
	
	var audio = document.getElementById('audio_player');
	audio.pause();
	
	$('#player').animate({top:'+=15%'}, 1000);
	playerShown = false;
	$(loading).delay(5000).fadeOut("normal");	
	document.getElementById("play_sq").src = "img/play.png";	
	document.getElementById("play_hq").src = "img/play.png";	
};

