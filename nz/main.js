
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
    fullscreenControl: true,
    center: [ stop.lat, stop.lng ], 
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let nav = document.querySelector('#navigation');
console.log('Navigation HTML Element: ', nav);
// console.log(ROUTE);
ROUTE.sort((stop1, stop2) => {
    if (stop1.nr > stop2.nr) {
        return 1;
      } else {
        return -1;
      }
});
for (let entry of ROUTE) {
  // console.log(entry);

    nav.innerHTML += `
        <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>`;
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
nav.options.selectedIndex = 22 - 1;
nav.onchange = (evt) => {
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username =options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`;
    console.log(username, link);

    window.location.href = link;
};



//WMTS-Services werden für die Kacheln verwendet
//consle.log(document,querySelector("#map")); um die Konsole zu checken
console.log(document.querySelector("#map"));
// <option value="Silja18">Omarama</option>



// Minimap
var miniMap = new L.Control.MiniMap(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"), {
        toggleDisplay: true,
        minimized: false
    }
).addTo(map);