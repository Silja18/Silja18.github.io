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
    "Relative Luftfeuchtigkeit (%)": overlays.humidity,
}, { 
    collapsed: false // Kontrolle ist immer ausgeklappt
}).addTo(map);
overlays.temperature.addTo(map);

// hier den Maßstab einbauen: 

L.control.scale({
    imperial: false
}).addTo(map); 

let getColor = (value, colorRamp) => {
 //console.log("Wert:", value, "Palette:", colorRamp);
 for (let rule of colorRamp) {
         if (value >= rule.min && value < rule.max) {
             return rule.col;
         }
     }
    return "black";
};

// Die new label Funktion holt sich die Koordinaten usw, definiert die Farbe, ...
// get Funktion holt sich die Farbe
let newLabel = (coords, options) => {
    let color = getColor(options.value, options.colors);
    // console.log("Wert", options.value, "bekommt Farbe", color);
    let label = L.divIcon({
        html: `<div style="background-color:${color}">${options.value}</div>`,
        className: "text-label" // mit der Klasse können wir das Format zuschreiben (div)
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    return marker;
};

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
              <li>Relative Luftfeuchtigkeit: ${station.properties.RH || '?'}</li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
           // hier haben wir die Market gestylt:
            marker.addTo(overlays.stations);
            if (typeof station.properties.HS == "number") {
                let marker = newLabel (station.geometry.coordinates, {
                    value: station.properties.HS.toFixed(0),
                    colors: COLORS.snowheight,
                    station: station.properties.name
                });
                marker.addTo(overlays.snowheight);
            }
         

            if (typeof station.properties.WG == "number") {
                let marker = newLabel (station.geometry.coordinates, {
                    value: station.properties.WG.toFixed(0),
                    colors: COLORS.windspeed,
                    station: station.properties.name
                });
                marker.addTo(overlays.windspeed);
            }

            if (typeof station.properties.LT == "number") {
                let marker = newLabel (station.geometry.coordinates, {
                    value: station.properties.LT.toFixed(1),
                    colors: COLORS.temperature,
                    station: station.properties.name
                });
                marker.addTo(overlays.temperature);
            }
            if (typeof station.properties.RH == "number") {
                let marker = newLabel (station.geometry.coordinates, {
                    value: station.properties.RH.toFixed(0),
                    colors: COLORS.humidity,
                    station: station.properties.name
                });
                marker.addTo(overlays.humidity);
            }
        }
        
        // set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });
    
    
   
    // newLabel(...,...).addTo(overlays.temperature)