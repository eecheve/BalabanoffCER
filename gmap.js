function initMap(){
    const chemBuilding = {
        lat: 38.214003523921754, 
        lng: -85.7575823000552};

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: chemBuilding,
    });

    const marker = new google.maps.Marker({
        position: chemBuilding,
        map: map,
    });
}

window.initMap = initMap;

