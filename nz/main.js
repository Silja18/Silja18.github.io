
const map = L.map("map", {
    center: [ -44.483333, 169.966667 ], 
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});
//WMTS-Services werden für die Kacheln verwendet
console.log(document.querySelector("#map"));
