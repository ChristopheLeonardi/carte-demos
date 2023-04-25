const normalize_string = str => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/gm, "_")
}

const define_color = (elt, config) => {
    if (!elt.type_acteur) {
        return
    }
    let filtered = config.orchestre.filter(item => { if (elt.type_acteur == item.type) { return item } })
    return filtered[0].color
}