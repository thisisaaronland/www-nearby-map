var MM = com.modestmaps;
var provider = new MM.TemplatedMapProvider('https://vector.mapzen.com/osm/all/{Z}/{X}/{Y}.json?api_key=' + mapzen_apikey);	// see also: config.js

var last_url = undefined;	// please don't make me a global... maybe... does it really matter?

function init(){

	if (! "geolocation" in navigator){
		return;
	}

	var geo_options = {
		enableHighAccuracy: true, 
		maximumAge        : 30000, 
		timeout           : 27000
	};

	var wpid = navigator.geolocation.watchPosition(on_location, on_not_location, geo_options);
}

function on_location(position){

	console.log(position.coords.latitude, position.coords.longitude);

	var loc = new MM.Location(position.coords.latitude, position.coords.longitude);

	var coord = provider.locationCoordinate(loc);
	coord = coord.zoomTo(mapzen_zoom_level);
	
	var url = provider.getTileUrl(coord);
	fetch_data(url);
}

function on_not_location(){
	console.log("SAD");
}

function fetch_data(url){

	if (url == last_url){
		console.log("I haven't moved!");
		return;
	}

	var req = new XMLHttpRequest();
	req.onload = on_data;
	req.open("get", url, true);
	req.send();
}

function on_data(){

	last_url = this.responseURL;

	data = JSON.parse(this.responseText);

	var html = "";
	html += "<ul>";
	
	for (k in data){
		
		var features = data[k]['features'];
		var count = features.length;
		
		if (count > 1){
			html += "<li>" + count + " " + k + "</li>";
		}
		
		else if (count == 1){
			html += "<li>one " + k + "</li>";
		}
		
		else {
			html += "<li>no " + k + "</li>";
		}
	}
	
	var n = document.getElementById("nearby");
	n.innerHTML = html;
}