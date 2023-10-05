
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