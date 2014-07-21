var rssLoaded = false;
var playerShown = false;

$(document).ready(function(){
	window.onerror = onError;
});

var parseRSS = function(url, container) {
	$(loading).text('DESCARGANDO PODCAST...');
	$(loading).show("normal");
  $.ajax({
    url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=10&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function(data) {
    	var xml = data.responseData.xmlString;
//      console.log(xml);
      var xmlDoc = $.parseXML(xml);
      
      $(xmlDoc).find("item").each(
      function(i,e){
//      	console.log("Audio: " + $(e).find("enclosure").attr('url'));
      	var color = ""
      	var thehtml = "<li><div onclick='playShow(this)' class='link' value='" + $(e).find("enclosure").attr('url') + "'>" +
      					$(e).find("title").text() + '</div></li>';
		console.log("Agregado capítulo: " + thehtml);        
        $(container).append(thehtml);
        rssLoaded = true;
		$(loading).fadeOut("slow");
      }
      );
    }
  });
};

var switchTab = function( idTab, idTabHide ){

    console.log("switch tab!");
    document.getElementById(idTab).style.zIndex='1';
    document.getElementById(idTabHide).style.zIndex='2';
    
    if (!rssLoaded)
		parseRSS("http://radioela.org/spip.php?page=backend&id_rubrique=5","#episodes");
};

var playShow = function (link){
	
	var loading = document.getElementById("loading");
	
	if(!playerShown){
		// Mostramos mensaje de "Cargando..."
//		$(document.getElementById("loading")).animate({top:'-=15%'}, 1000);
		$(loading).text('CARGANDO...');
		$(loading).show("normal");
	}
	
	var audio = document.getElementById('audio_player');
	
	audio.addEventListener("playing", function() {
					console.log("playing - hide loading");
					if(playerShown){ 
						$(loading).hide("slow");
//						$(document.getElementById("loading")).animate({top:'+=15%'}, 1000);
					}
				}, true);
	
	audio.addEventListener('error', onError, true);
	
	switch (link){
		case "radio_sq":
			audio.src = "http://radio.nodo50.org:8001/radioela.mp3";
		break;
		case "radio_hq":
			audio.src = "http://radio.nodo50.org:8001/radioela.mp3";
		break;
		case "previous":
		break;
		case "stop":
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
	audio.play();

	console.log("Show player!");
	if (!playerShown){
		$('#player').animate({top:'-=15%'}, 1000);
		playerShown = true;
	}
};

var onError = function(e) {
	console.log("ERROR AL REPRODUCIR: " + e.target.error.code + " - Audio: " + e.target.src);

	switch (e.target.error.code) {
		case e.target.error.MEDIA_ERR_ABORTED:
			$(loading).text('Error: Reproducción abortada');
		break;
		case e.target.error.MEDIA_ERR_NETWORK:
		   $(loading).text('Error al dercargar');
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
	$('#player').animate({top:'+=15%'}, 1000);
	playerShown = false;
	$(loading).delay(5000).fadeOut("normal");	

};
