
### Carte des orchestres Démos

#### Description Globale

Le projet utilise les bibliothèques d3js et jQuery pour créer une carte SVG interactive des orchestres Démos.

La variable globale `window.config` contient différents paramètres de la carte et des orchestres. 

##### Données géographiques
Les données géographiques sont chargées à partir du fichier `fr_regions.txt`
Le fichier regionsData.csv quant à lui contient les informations de chaque régions.

##### Données des orchestres
Les données des orchestres sont complétées dans le fichier `donnees_demos.xlsm` et exporté à l'aide de VBA au format csv. 

Le csv `orchestresData.csv` est un export 


##### 1. `create_map(geojson)`
   - **Paramètre :**
       - `geojson` (objet) : Les données géospatiales utilisées pour dessiner la carte.
   - **Description :**
       - Cette fonction efface toute carte existante et crée une nouvelle carte SVG basée sur les données géospatiales fournies.

##### 2. `create_tooltip(elt, event)`
   - **Paramètres :**
       - `elt` (élément DOM) : L'élément sur lequel la tooltip sera affichée.
       - `event` (événement) : L'événement qui déclenche l'affichage de la tooltip.
   - **Description :**
       - Affiche une infobulle sur un élément spécifique lorsqu'un événement donné se produit, fournissant des informations supplémentaires à l'utilisateur.

##### 3. `create_close_popup(container, container_button)`
   - **Paramètres :**
       - `container` (élément DOM) : Le conteneur de la popup.
       - `container_button` (élément DOM) : Le bouton pour fermer la popup.
   - **Description :**
       - Ajoute la fonctionnalité pour fermer la popup lorsqu'un utilisateur clique sur le bouton de fermeture.

##### 4. `create_access_table()`
   - **Paramètres :** Aucun.
   - **Description :**
       - Crée une version accessible de la carte sous forme de tableau, permettant une navigation et une interaction facilitées pour les utilisateurs ayant des besoins d'accessibilité.

##### 5. `create_cartouche_legend()`
   - **Paramètres :** Aucun.
   - **Description :**
       - Crée la légende de la carte, aidant les utilisateurs à interpréter les données visuelles affichées sur la carte.

##### 6. `create_map_widgets()`
   - **Paramètres :** Aucun.
   - **Description :**
       - Ajoute des widgets à la carte, offrant des fonctionnalités supplémentaires et des interactions pour améliorer l'expérience utilisateur.

##### 7. `define_color(elt)`
   - **Paramètre :**
       - `elt` (élément DOM) : L'élément pour lequel la couleur est définie.
   - **Description :**
       - Définit la couleur d'un élément spécifique sur la carte en fonction des données ou des paramètres associés.

#### Fichier `loadData.js`

Ce fichier est responsable du chargement des données et de la configuration initiale de la carte. Il contient la fonction suivante :

##### 8. `wait_for_data()`
   - **Paramètres :** Aucun.
   - **Description :**
       - Cette fonction attend que toutes les données nécessaires soient chargées avant de procéder à l'initialisation et à la création de la carte. Elle assure que toutes les informations sont disponibles pour une construction correcte de la carte.
