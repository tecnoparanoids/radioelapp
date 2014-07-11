var rssLoaded = false;

$(document).ready(function(){
});

function parseRSS(url, container) {
  $.ajax({
    url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=10&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function(data) {
    	var xml = data.responseData.xmlString;
//      console.log(xml);
      var xmlDoc = $.parseXML(xml);
      
      $(xmlDoc).find("item").each(
      function(i,e){
      	console.log("Audio: " + $(e).find("enclosure").attr('url'));
      	var color = ""
      	var thehtml = '<li><div class="link" value="' + $(e).find("enclosure").attr('url') + '">' +
      					$(e).find("title").text() + '</div></li>';
//		console.log("Agregado capítulo: " + thehtml);        
        $(container).append(thehtml);
        rssLoaded = true;
        
        $("#episodes li").click(function () {
            playShow(this);
        });
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

//    console.log("salgo de switchTab");	
}

var playShow = function (link){
	console.log("Programa clickado: " + link);//$($(link).html()).attr('value'));
	var audio = document.getElementById('audio_player');
	
	switch (link){
		case "radio_sq":
			audio.src = "http://radio.nodo50.org:8001/radioela.mp3";
		break;
		case "radio_hq":
			audio.src = "http://radio.nodo50.org:8001/radioela.mp3";
		break;
		default:
			audio.src = $($(link).html()).attr('value');
			
	}

	if(audio.paused){
		console.log("PLAY!!!! " + audio.src);
		audio.play();
	}
	else{
		console.log("STOP!!!! " + audio.src);
		audio.pause();
	}
}
