var map
var mapDiv
var results
var zip
var markers=[]


function initMap() {
        mapDiv = document.getElementById('map');
        map = new google.maps.Map(mapDiv, {
            center: {
            	lat: 37.773, lng: -122.431},
            zoom: 8,
        });
      }


$(function(){
	$("#sub").on("click",function(e){
		e.preventDefault();
		deleteMarker();
		meetupData();
		zip==$('#zip').val("");
	})
	function meetupData(){
		zip=$('#zip').val();
		var url="https://api.meetup.com/2/open_events?callback=?"
		var param={
			key:'742104225795b17715d16c3866306d',
			country: 'us',
			zip: zip,
			topic: 'javascript',
			//can't get specific meetups according to zip, maybe get wrong prama
			sign:'true',
		}

		$.getJSON(url,param,function(data){
			//get lat and lng data
		    results = data.results;
			getPosition(results);
		})
	}
//set lat and lng as pins on google map	
	function getPosition(results){
		console.log(results.length)
		
		var lat1
		var lng1
		results.map(function(result){

			if(result.venue&&result.venue.lat &&result.venue.lon){
				var lat=result.venue.lat;
				var lng= result.venue.lon;

				if(typeof lat1 === "undefined"){
					lat1=lat 
					lng1=lng
					var centerPosition = {
						lat:lat1,
						lng:lng1
					}
					map.setCenter(centerPosition)
				}


				//console.log(moment(result.time)._d)
				var contentString = '<div id="content"><p>Event name: '+result.name+'</p>'+'<p>Address: '+result.venue.address_1+', '+result.venue.city+'</p>'+'<p>'+result.description+'</p>'+'<a href='+result.event_url+'>Links</a></div>'
				var LatLng = {
					lat:lat,
					lng:lng,
				}
				var img = "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Marker-Outside-Chartreuse-icon.png"
				marker = new google.maps.Marker({
					position:LatLng,
					map:map,
					icon:img,
					animation: google.maps.Animation.DROP
				})
				markers.push(marker)
			
				var information = new google.maps.InfoWindow({
					content:contentString
				})
				//can't get information of all the markers
				marker.addListener('click',function(){
					information.open(map,marker);
					//clear search history 

				})
			}
			
			
		})
		
		if(results.length==0){	
			alert("No Pokemon meetup around")			
		}
		//clear search history 
			

	}

	function setMapOnAll(map){
		for(var i=0; i<markers.length; i++){
			markers[i].setMap(map);
		}
	}

	function deleteMarker(){
		setMapOnAll(null);
	}

})