
let stop = {
    nr: 4,
    name: "Omarama",
    lat: -44.483333,
    lng: 169.966667,
    user: "Silja18",
    wikipedia: "https://en.wikipedia.org/wiki/Omarama"
};
/*console.log(stop);
console.log(stop.name);
console.log(stop.lat);
console.log(stop.lng);
console.log(wikipedia); */
const map = L.map("map", {
    center: [ stop.lat, stop.lng ], 
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([-44.483333, 169.966667]) .addTo(map);
mrk.bindPopup("Omarama").openPopup();

//WMTS-Services werden für die Kacheln verwendet
//consle.log(document,querySelector("#map")); um die Konsole zu checken
console.log(document.querySelector("#map"));
