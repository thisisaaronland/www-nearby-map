var MM = com.modestmaps;
var data_provider = new MM.TemplatedMapProvider('https://vector.mapzen.com/osm/all/{Z}/{X}/{Y}.json?api_key=' + mapzen_apikey);	// see also: config.js

var raster_provider = new MM.TemplatedMapProvider('http://tile.stamen.com/toner-background/{Z}/{X}/{Y}.jpg');

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

	var coord = data_provider.locationCoordinate(loc);
	coord = coord.zoomTo(mapzen_zoom_level);
	
	var data_url = data_provider.getTileUrl(coord);
	var map_url = raster_provider.getTileUrl(coord);

	show_map(map_url);
	fetch_data(data_url);
}

function on_not_location(){
	console.log("SAD");
}

function show_map(url){

	 var m = document.getElementById("map");
	 m.setAttribute("src", url);
	 m.setAttribute("style", "display:inline");
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
	html += '<ul id="nearby-items">';
	
	for (k in data){
		
		var features = data[k]['features'];
		var count = features.length;
		
		if (count > 1){
			html += '<li><span class="count">' + count + '</span> ' + k + '</li>';
		}
		
		else if (count == 1){
			html += '<li><span class="count">one</span> ' + k + '</li>';
		}
		
		else {
			html += '<li><span class="no-count">no</span> ' + k + '</li>';
		}
	}
	
	html += '</ul>';

	var n = document.getElementById("nearby");
	n.innerHTML = html;
}
