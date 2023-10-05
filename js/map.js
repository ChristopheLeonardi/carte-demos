
$(document).ready(function() {

    window["config"] = {
        "cartouche": {
            "cartouche_title": "Déploiement en octobre 2023",
            "access_icon": "/ui/plug-in/integration/carte-demos/img/accessibility_icon.svg",
            "access_alt": "Voir la version accessible de la carte sous forme de tableau"
        },
        "orchestre": [{
                "type": "Orchestre Démos",
                "color": "#f39a89",
                "legend": "34 orchestres Démos",
                "icon": "/ui/plug-in/integration/carte-demos/img/Orchestre_Demos.svg",
            },
            {
                "type": "Orchestre Démos avancé",
                "color": "#a82b39",
                "legend": "11 orchestres Démos avancés",
                "icon": "/ui/plug-in/integration/carte-demos/img/Orchestre_Avance.svg",
            },
            {
                "type": "Orchestre labellisé Réseau Démos",
                "color": "#8d71aa",
                "legend": "3 orchestres labellisés Réseau Démos",
                "icon": "/ui/plug-in/integration/carte-demos/img/Orchestre_labellise_reseau_Demos.svg",
            }

        ],
        "label": {
            "bouton_region": "Aller sur la page de la région",
            "table_title": "Liste des orchestres Démos",
            "table_header": ["Région", "Nom de l'orchestre", "Type d'acteur", "Opérateur", "Présentation", "Lien"],
            "table_button": "Page de la région",
            "operateur_name": "Opérateur",
            "operateur_image": "https://demos.philharmoniedeparis.fr/ui/skins/CIMUD/images/operateur.svg"
        },
        "widgets": [{
                "name": "Île-de-France",
                "icon": "/ui/plug-in/integration/carte-demos/img/IDF.svg",
                "icon_hover": "/ui/plug-in/integration/carte-demos/img/IDF_hover.svg",
                "alt_text": "Carte de la présence des orchestres Démos en Île-de-France"
            },
            {
                "name": "Outre-Mer",
                "icon": "/ui/plug-in/integration/carte-demos/img/OM.svg",
                "icon_hover": "/ui/plug-in/integration/carte-demos/img/OM_hover.svg",
                "alt_text": "Carte de la présence des orchestres Démos en Outre-Mer"
            }
        ]
    }

    $("#cartouche-container").load("/ui/plug-in/integration/carte-demos/cartouche-template.html")

    $("#cartouche-container").hide()
    
    let splash_container = document.createElement("div")
    let splash = document.createElement("img")
    splash.setAttribute("id", "carte-demos-splash")
    splash.setAttribute("src", "/ui/plug-in/integration/carte-demos/img/splash.gif")

    splash_container.appendChild(splash)
    $("#map_demos").append(splash_container)
    
    const promises = []
    const get_data = promises => {

        const controller = new AbortController();

        try {
            promises.push((d3.json("/ui/plug-in/integration/carte-demos/dataset/fr_regions.txt")))
            promises.push((d3.csv("/ui/plug-in/integration/carte-demos/dataset/orchestresData.csv")))
            promises.push((d3.csv("/ui/plug-in/integration/carte-demos/dataset/regionsData.csv")))
            setTimeout(() => controller.abort(), 1000);
            Promise.all(promises, {signal: controller.signal})
                    .then(data => {
                        window["data"] = data
                        $("#cartouche-container").show()
                        $("#carte-demos-splash").remove()
                    })
        }
        catch(err){
            console.log(err)
        }
    }
    const wait_for_data = () => {
        get_data(promises)
        typeof window["data"] !== "undefined" ? construct_page(window["data"]) : setTimeout(wait_for_data, 250);   

    }
    wait_for_data()


})

const construct_page = data => {
    const geojson = data[0]
    window["orchestres"] = data[1]
    window["regions"] = data[2]
    create_map(geojson)
    create_cartouche_legend()
    create_map_widgets()

    window.onresize = e => { create_map(geojson) }

    $(window).keyup(e => {
        if (($("#popup").length) && e.keyCode === 27) {
            $("#popup").remove()
        }
    })
    $("#popup").remove()
}

const create_map = (geojson) => {

    // Reset Map
    $("#svg_container").remove()


    let container_width = $("#map_demos").width()
    if (container_width < 725) {
        $("#map-container").width($("#map_demos").width())
        var width = $("#map-container").width()
    } else {
        $("#map-container").width($("#map_demos").width() * 0.6)
        var width = $("#map-container").width()
        if (width > 600) { width = 600 }
    }
    var height = width

    const path = d3.geoPath();

    const projection = d3.geoConicConformal()
        .center([2.454071, 46.279229])
        .scale(width * 5)
        .translate([width / 2, height / 2]);

    path.projection(projection);

    let svg_container = document.createElement("div")
    svg_container.setAttribute("id", "svg_container")
    $('#map-container').append(svg_container)

    const svg = d3.select('#svg_container').append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewbox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", `xMinYMin meet`)
        .attr("aria-labelledby", "map_title")

    svg.append("title")
        .attr("id", "map_title")
        .text("carte des orchestres Démos")

    d3.select("#map-container").append("div")
        .attr("class", "map-tooltip")
        .style("opacity", 0);

    svg.append("g").attr("class", "regions")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", e => { return normalize_string(e.properties.nom) })
        .attr("data-name", e => { return e.properties.nom })
        .on("mouseover", function(event, d) {
            if ($(event.target).attr("data-name") == "Île-de-France") {
                return
            }
            create_tooltip(d, event)
        })
        .on("mouseout", function(event, d) { $("#tooltip").remove() })
        .on("click", function(event, d) { create_popup(event.target) })


    svg.append("g").attr("class", "orchestres")
        .selectAll("circle")
        .data(window["orchestres"].filter(item => item.region != "Île-de-France"))
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", e => { return projection(e.geolocalisation.split(",").reverse())[0] })
        .attr("cy", e => { return projection(e.geolocalisation.split(",").reverse())[1] })
        .attr("fill", e => { return define_color(e) })

}

const create_tooltip = (elt, event) => {

    let container = document.createElement("div")
    container.setAttribute("id", "tooltip")

    let title = document.createElement("h4")
    title.textContent = elt.properties.nom
    container.appendChild(title)
    $(document).on("mousemove", e => {
        var y = window.scrollY
        $(container).css("left", `${e.clientX + 30}px`)
        $(container).css("top", `${e.pageY - y + 30}px`)
    })

    document.getElementById("map-container").appendChild(container)
}

const create_popup = elt => {

    // Filter data by region
    var filtered_orchestres = window["orchestres"].filter(orchestre => (orchestre.region == $(elt).attr("data-name")))

    let is_IDF_map = ((elt.nodeName == "path") && ($(elt).attr("data-name") == "Île-de-France"))
    if (is_IDF_map || (!filtered_orchestres.length)) { return }

    // Reset container
    $("#popup").remove()
    $("#tooltip").remove()

    // Set container and name
    var container = document.createElement("section")
    container.setAttribute("id", "popup")


    let popup_container = document.createElement("div")
    popup_container.setAttribute("id", "popup_container")

    let container_title = document.createElement("h3")
    container_title.textContent = $(elt).attr("data-name")

    create_close_popup(container, popup_container)

    popup_container.appendChild(container_title)

    // legend
    let legend = document.createElement("ul")
    legend.setAttribute("class", "legend")

    var types = [...new Set(filtered_orchestres.map(t => { return t.type_acteur }))]
    types.map(item => {
        let li = document.createElement("li")

        let img = document.createElement("img")
        img.setAttribute("src", `/ui/plug-in/integration/carte-demos/img/${normalize_string(item)}.svg`)
        li.appendChild(img)

        let p = document.createElement("p")
        p.textContent = item
        li.appendChild(p)

        legend.appendChild(li)
    })

    var operateur_legend = document.createElement("li")

    let operateur_legend_img = document.createElement("img")
    operateur_legend_img.setAttribute("src", window.config.label.operateur_image)
    operateur_legend.appendChild(operateur_legend_img)

    let operateur_legend_name = document.createElement("p")
    operateur_legend_name.textContent = window.config.label.operateur_name
    operateur_legend.appendChild(operateur_legend_name)

    legend.appendChild(operateur_legend)

    popup_container.appendChild(legend)
    container.appendChild(popup_container)

    // Upload template
    var template = document.querySelector(`#cartouche-template`)

    var operateurs_container = document.createElement("div")
    operateurs_container.setAttribute("class", "operateur-container")

    // Create list of operateur
    var operateurs = [...new Set(filtered_orchestres.map(o => { return o.operateur }))]

    operateurs.forEach(operateur => {

        let single_operateur_container = document.createElement("div")
        single_operateur_container.setAttribute("class", "operateur")

        // Create orchestre card
        filtered_orchestres.map(item => {
            if (item.operateur != operateur) {
                return
            }
            var clone = document.importNode(template.content, true)

            let img = clone.querySelector("#vignette_orchestre")
            img.setAttribute("src", `/ui/plug-in/integration/carte-demos/img/${normalize_string(item.type_acteur)}.svg`)
            img.removeAttribute('id')

            let nom_orchestre = clone.querySelector("#nom_orchestre")
            nom_orchestre.textContent = item.nom_orchestre
            nom_orchestre.removeAttribute('id')

            single_operateur_container.appendChild(clone)

        })

        // Add operator name
        let operateur_name = document.createElement("p")
        operateur_name.setAttribute("class", "operateur_name")
        operateur_name.textContent = operateur
        single_operateur_container.appendChild(operateur_name)

        operateurs_container.appendChild(single_operateur_container)
        popup_container.appendChild(operateurs_container)
    })

    let region = window["regions"].filter(item => { return item.regions == $(elt).attr("data-name") })
    let weblink = document.createElement("a")
    weblink.setAttribute("href", region[0].link_url)
    weblink.setAttribute("title", region[0].link_title)
    weblink.setAttribute("class", "weblink")
    weblink.textContent = config.label.bouton_region

    popup_container.appendChild(weblink)

    $("#map_demos").append(container)
}

const create_close_popup = (container, container_button) => {
    var close_overlay = document.createElement("div")
    close_overlay.setAttribute("id", "popupClose")
    $(close_overlay).on("click", e => { container.remove() })
    container.appendChild(close_overlay)

    var close_button = document.createElement("button")
    close_button.setAttribute("id", "buttonClose")
    close_button.setAttribute("title", "Fermer la popup")
    close_button.textContent = "X"
    $(close_button).on("click", e => { container.remove() })
    container_button.appendChild(close_button)
}

const create_access_table = () => {

    // Reset container
    $("#popup").remove()
    $("#tooltip").remove()

    // Set container and name
    var container = document.createElement("section")
    container.setAttribute("id", "popup")

    var table = document.createElement("table")
    table.setAttribute("id", "popup_container")
    var caption = document.createElement("caption")
    caption.textContent = window["config"].label.table_title

    create_close_popup(container, table)

    table.appendChild(caption)

    // Header
    var header = document.createElement("thead")
    var colNames = window["config"].label.table_header
    var template = document.querySelector(`#accessHeader-template`)

    colNames.map(col => {
        // Upload template
        var clone = document.importNode(template.content, true)
        let name = clone.querySelector("th")
        name.textContent = col
        header.appendChild(name)

    })
    table.appendChild(header)

    // body
    var body = document.createElement("tbody")
    var regions = [...new Set(window["orchestres"].map(item => { return item.region }))]

    regions.map(region => {

        var filtered_orchestres = window["orchestres"].filter(orchestre => (orchestre.region == region))
        filtered_orchestres.map(item => {

            var tr = document.createElement("tr")
            tr.setAttribute("scope", "row")

            const create_td = data => {
                let td = document.createElement("td")
                td.textContent = data
                tr.appendChild(td)
            }

            create_td(item.region)
            create_td(item.nom_orchestre)
            create_td(item.type_acteur)
            create_td(item.operateur)
            create_td(item.presentation)

            const getRegionLink = region => {
                let selectRegion = window["regions"].filter(region_data => region_data.regions === region)
                return selectRegion[0].link_url
            }

            var lien = document.createElement("td")
            var webButton = document.createElement("a")
            webButton.setAttribute("class", "weblink")
            webButton.setAttribute("alt", "Aller sur la page de la région dans un nouvel onglet")
            webButton.setAttribute("href", getRegionLink(region))
            webButton.setAttribute("target", "_blank")
            webButton.textContent = window["config"].label.table_button

            lien.appendChild(webButton)
            tr.appendChild(lien)

            body.appendChild(tr)

        })

    })

    table.appendChild(body)
    container.appendChild(table)
    $("#map_demos").append(container)

}
const create_cartouche_legend = () => {

    // Set title
    $("#cartouche-container h3")[0].textContent = window.config.cartouche.cartouche_title

    // Set Orchestre Legend
    var ul = $("#cartouche-container ul")[0]
    window.config.orchestre.map(orchestre => {
        let li = document.createElement("li")

        let img = document.createElement("img")
        img.setAttribute("src", orchestre.icon)
        img.setAttribute("alt", "")
        li.appendChild(img)

        let p = document.createElement("p")
        p.textContent = orchestre.legend
        li.appendChild(p)

        ul.appendChild(li)
    })

    // Set access icon
    $("#access_button").attr("src", window.config.cartouche.access_icon)
    $("#access_button").attr("alt", window.config.cartouche.access_alt)

    $("#access_button").click(e => {
        create_access_table()
    })
}

const create_map_widgets = () => {
    window.config.widgets.map(w_data => {
        let widget = document.createElement("div")
        widget.setAttribute("class", "widget")
        widget.setAttribute("data-name", w_data.name)

        let img = document.createElement("img")
        img.setAttribute("src", w_data.icon)
        img.setAttribute("alt", w_data.alt_text)
        $(img).on("mouseover", e => {
            img.setAttribute("src", w_data.icon_hover)
        })
        $(img).on("mouseout", e => {
            img.setAttribute("src", w_data.icon)
        })
        widget.appendChild(img)

        let h3 = document.createElement("h3")
        h3.textContent = w_data.name
        widget.appendChild(h3)

        document.getElementById("map-widget").appendChild(widget)
    })

    Array.from($(".widget")).map(widget => {
        $(widget).click(e => { create_popup($(e.target).parent()[0]) })
    })
}

const normalize_string = str => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/gm, "_")
}

const define_color = (elt) => {
    if (!elt.type_acteur) {
        return
    }
    let filtered = window["config"].orchestre.filter(item => { if (elt.type_acteur == item.type) { return item } })
    return filtered[0].color
}