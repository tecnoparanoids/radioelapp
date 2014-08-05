// Install app
if (navigator.mozApps) {
    var checkIfInstalled = navigator.mozApps.getSelf();
    checkIfInstalled.onsuccess = function () {
        if (checkIfInstalled.result) {
            // Already installed
        }
        else {
            var install = document.querySelector("#install"),
                manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
                console.log(manifestURL);
            
            /******
				To install a package instead, exchange the above line to this:
				manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/package.manifest";
			******/
    		$(install).show("normal");
//            install.parentNode.className = "show-install";
            install.onclick = function () {
                var installApp = navigator.mozApps.install(manifestURL);
            
	            /****
				To install a package instead, exchange the above line to this:
				var installApp = navigator.mozApps.installPackage(manifestURL);
				*****/
      
                installApp.onsuccess = function(data) {
                    install.style.display = "none";
                };
                installApp.onerror = function() {
                    alert("Fallo en la instalación:\n\n" + installApp.error.name);
                };
            };
        }
    };
}
else {
    console.log("Open Web Apps not supported");
}

