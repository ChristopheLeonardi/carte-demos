$(document).ready(function() {
    const map = mapMusique()
})

const mapMusique = () => {

    var map = L.map('map', { scrollWheelZoom: false, worldCopyJump: true }).setView([20, 0], 2.25);

    map.options.minZoom = 2.25;

    // Set the map style
    var tiles = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=YCEYIYWB5ZcUuCYc2XQe9fGjttHukDxdSd2wqzlA7mhBwMK8SXM9h3RGqxtZzuna', {}).addTo(map)
    map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors")

    // Load Data
    var promises = []
    promises.push(d3.json("/ui/skins/MEDIA/refonte-pad/carte-musique/output/map.txt"))
    promises.push(d3.csv("/ui/skins/MEDIA/refonte-pad/carte-musique/output/airesData.csv"))
    promises.push(d3.csv("/ui/skins/MEDIA/refonte-pad/carte-musique/output/paysData.csv"))

    Promise.all(promises).then(data => {

            const world = data[0]
            const abcArea = data[1]
            console.log(abcArea)
            console.log(data[1])
            const aires = Array.from(abcArea).sort((a, b) => { return a.name.localeCompare(b.name) })
            const pays = data[2]

            const createMap = (world, aires, pays) => {

                // Need to convert topojson in geojson > featureCollection
                var countries = topojson.feature(world, world.objects.world)

                // Get the name and the color of each area
                const getNameColor = properties => {

                    var z = pays.filter(d => { if (properties.ISO_A3 == d.CODE) return d })
                    var zone = "none"
                    if (z.length != 0) {
                        zone = z[0]["ZONE_CULTURELLE"].replace(/'/gm, "’")
                    }
                    var color = "transparent"
                    aires.map(a => { if (a.name == zone) { color = a.color } });
                    return { color: color, zone: zone }
                }

                // Param for style and class
                const style = feature => {
                    return {
                        fillColor: getNameColor(feature.properties).color,
                        weight: 2,
                        opacity: 0.2,
                        color: getNameColor(feature.properties).color,
                        fillOpacity: 0.5,
                        className: getNameColor(feature.properties).zone.replace(/\s+|’/gm, "")
                    };
                }

                // Create button on the map and their interactions 
                const createMapButton = (aire) => {
                    var content = L.DomUtil.create('p');
                    content.textContent = aire.name
                    content.setAttribute("class", aire.name.replace(/\s+|’/gm, ""))
                    let p = L.popup({ autoClose: false, closeButton: false, closeOnClick: false })
                        .setLatLng([aire.lat, aire.lon])
                        .setContent(content)
                        .openOn(map);

                    L.DomEvent.addListener(content, 'click', function(event) {
                        window.open(aire.url, "_self");
                    });

                    L.DomEvent.addListener(content, 'mouseover', e => {
                        var areaName = $(e.target).attr("class")
                        var hoveredArea = aires.filter(aire => { if (areaName == aire.name.replace(/\s+|’/gm, "")) return aire })
                        var hoveredClass = hoveredArea[0].name.replace(/\s+|’/gm, "")

                        $(`.${hoveredClass}`).css({
                            fillOpacity: 0.8
                        })
                        $(e.target).parent().parent().css({
                            border: `2px solid ${hoveredArea[0].color}`
                        })

                    });
                    L.DomEvent.addListener(content, 'mouseout', e => {
                        $(`.leaflet-interactive`).css({
                            fillOpacity: 0.5
                        })
                        $(`.leaflet-popup-content-wrapper`).css({
                            border: "1px solid #999"
                        })

                    });

                }

                // Create button for each area
                aires.forEach((aire, i) => {
                    createMapButton(aire)
                })

                function highlightFeature(e) {
                    var layer = e.target
                    var hoveredZone = e.target._path.className.baseVal
                    if (hoveredZone.search(/none/gm) == -1) {
                        var hoveredArea = aires.filter(aire => { if (hoveredZone.search(aire.name.replace(/\s+|’/gm, "")) != -1) return aire })
                        var hoveredClass = hoveredArea[0].name.replace(/\s+|’/gm, "")
                        $(`.${hoveredClass}`).css({
                            fillOpacity: 0.8
                        })
                        var mapButton = $(`p.${hoveredClass}`).parent().parent()
                        mapButton.css({
                            border: `2px solid ${hoveredArea[0].color}`
                        })
                        $(`.${hoveredZone.replace(" ", ".")}`).click(e => {
                            window.open(hoveredArea[0].url, "_self");
                        })
                    }
                    var layer = e.target;

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }

                }

                function resetHighlight() {
                    $(`.leaflet-interactive`).css({
                        fillOpacity: 0.5
                    })
                    $(`.leaflet-popup-content-wrapper`).css({
                        border: "1px solid #999"
                    })

                }

                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                    });
                }

                var geojson = L.geoJson(countries, { style: style, onEachFeature: onEachFeature }).addTo(map);
            }

            createMap(world, aires, pays)
            createListButton(aires)


        }) // END Promise
}

// Create List Button
const createListButton = (aires) => {
    aires.map(aire => {
        var link = document.createElement("a")
        $(link).attr('class', "btn btn-default ")
        $(link).attr('data-aire', aire.name.replace(/\s+|’/gm, "").toLowerCase())
            //$(link).attr('title', `Explorer les musiques de la zone : ${aire.name} (nouvel onglet)`)
        link.textContent = aire.name
        link.setAttribute('style', `border: 2px solid ${aire.color} !important; background-color: #fff !important`)
        link.setAttribute('href', aire.url)
        $(link).hover(
            () => {
                link.setAttribute('style', `border: 2px solid transparent !important; background-color: ${aire.color} !important`)
            },
            () => {
                link.setAttribute('style', `border: 2px solid ${aire.color} !important; background-color: #fff !important`)
            });

        $("#mapPopup").append(link)

    })

}