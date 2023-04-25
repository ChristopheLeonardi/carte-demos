<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
    <script src="js/map.js"></script>
    <script src="js/functions.js"></script>
    <title>carte demos</title>
    <link href="css/map.css" rel="stylesheet">
</head>
<body>
    <div id="map_demos">
        <section id="cartouche-container"></section>
        <section id="map-container"></section>
        <section id="map-widget">
            <div class="widget" data-name="Île-de-France">
                <img src="img/IDF.png" alt="Carte de la présence des orchestres Démos en Île-de-France"/>
                <h3>Île-de-France</h3>
            </div>
            <div class="widget" data-name="Outre Mer">
                <img src="img/OM.png" alt="Carte de la présence des orchestres Démos en Outre Mer"/>
                <h3>Outre Mer</h3>
            </div>
        </section>

    </div>
</body>
</html>