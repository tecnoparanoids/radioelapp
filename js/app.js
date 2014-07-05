$(document).ready(function(){
	var podcast = new PodcastPlayer("player_hq");
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
      	var thehtml = '<li><div class="link">"<a href="'+ $(e).find("enclosure").attr('url') +'" target="_blank">'+
      					$(e).find("title").text()+'</a></div></li>';
//		console.log("Agregado capítulo: " + thehtml);        
        $(container).append(thehtml);
      }
      );
      
//      console.log($(xmlDoc).find("enclosure").attr("url"));
//	var url =  $(xml.items[0]).find("enclosure").attr('url');

//      $(container).html('<h2>'+ data.responseData.feed.title +'</h2>');
//      console.log("Agregado título: " + data.responseData.feed);
    }
  });
}

var switchTab = function( idTab, idTabHide ){

    document.getElementById(idTab).style.zIndex='1';
    document.getElementById(idTabHide).style.zIndex='2';
    console.log("switch tab!");
    
	parseRSS("http://radioela.org/spip.php?page=backend&id_rubrique=5","#episodes");

    console.log("salgo de switchTab");	
}
