let basemapGray = L.tileLayer.provider('BasemapAT.grau');
// https://leafletjs.com/reference-1.7.1.html#tilelayer
let map = L.map("map", {
    // https://leafletjs.com/reference-1.7.1.html#map-example
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let overlays = {
stations: L.featureGroup(),
temperature: L.featureGroup(),
snowheight: L.featureGroup(),
windspeed: L.featureGroup(),
winddirection: L.featureGroup(),
};
console.log(overlays.stations)

let layerControl = L.control.layers({
    // https://leafletjs.com/reference-1.7.1.html#control-layers
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
     // https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.overlay+ortho": L.layerGroup([
        // https://leafletjs.com/reference-1.7.1.html#layergroup
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
        // https://leafletjs.com/reference-1.7.1.html#tilelayer
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)":overlays.temperature,
    "Schneehöhe (cm)":overlays.snowheight,
    "Windgeschwindigkeit (km/h)":overlays.windspeed,
    "Windrichtung":overlays.winddirection,
}).addTo(map);
overlays.temperature.addTo(map);

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';

fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            // console.log('Station: ', station);
            let marker = L.marker([
                // https://leafletjs.com/reference-1.7.1.html#marker
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
              <li>Datum: ${formattedDate.toLocaleString("de")}</li>
              <li>Seehöhe: ${station.geometry.coordinates[2]} m</li>
              <li>Temperatur: ${station.properties.LT} C</li>
              <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
              <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
              <li>Windgeschwindrichtung: ${station.properties.WR || '?'}</li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
            marker.addTo(overlays.stations);
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                let snowIcon = L.divIcon({
                    // https://leafletjs.com/reference-1.7.1.html#divicon
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                let snowMarker = L.marker([
                    // https://leafletjs.com/reference-1.7.1.html#marker
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(overlays.snowheight);
            }
            // Hier soll die Lufttemperatur eingefügt werden
            //if (station.properties.LT) {
              //  let highlightClass = '';
                //if (station.properties.LT >= 0) {
                  //  highlightClass = 'temp-positive';
              //  //}
                //if (station, properties.LT < 0) {
                    highlightClass = 'temp-negative';
                //}
                //let tempIcon = L.divIcon({
                    // https://leafletjs.com/reference-1.7.1.html#divicon
                    html: `<div class="temp-label ${highlightClass}">${station.properties.LT}</div>`
                //})
                //let tempMarker = L.marker([
                    // https://leafletjs.com/reference-1.7.1.html#marker
                  //  station.geometry.coordinates[1],
                    // station.geometry.coordinates[0]
                //], {
                    icon: tempIcon
                //});
                // tempMarker.addTo(overlays.temperature); 
            //}
            if (station.properties.WG) {
                let windHighlightClass = '';
                if (station.properties.WG > 10) {
                    windHighlightClass = 'wind-10';
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = 'wind-20';
                }
                let windIcon = L.divIcon({
                    // https://leafletjs.com/reference-1.7.1.html#divicon
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`,
                });
                let windMarker = L.marker([
                    // https://leafletjs.com/reference-1.7.1.html#marker
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(overlays.windspeed);
            }
        }
        // set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });