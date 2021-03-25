
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

console.log (ROUTE);
for (let entry of ROUTE) {
    //console.log(entry);

    let mrk = L.marker([ entry.lat, entry.lng ]).addTo(map);
    mrk.bindPopup(`
<h4>Stop ${entry.nr}: ${entry.name}<h4>
<p><i class="fas fa-external-link-alt"></i><a href="${entry.wikipedia}">Read about stop in Wikipedia</a></p>
`);

if (entry.nr == 4) {
    map.setView ([entry.lat, entry.lng], 13);
    mrk.openPopup();
}
}



//WMTS-Services werden für die Kacheln verwendet
//consle.log(document,querySelector("#map")); um die Konsole zu checken
console.log(document.querySelector("#map"));
// <option value="Silja18">Omarama</option>