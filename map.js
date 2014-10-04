var map;
var layer;
window.onload = function() {
    map = L.map('map', {
        center: [-6.075,35.442],
        zoom: 6});
     var sql = new cartodb.SQL({ user: 'svasdev' });   
     
     sql.getBounds("SELECT * FROM districts_1").done(function(b) {
        map.fitBounds(b) })
     L.tileLayer("http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png").addTo(map);
     var sh=cartodb.createLayer(map, {
            user_name: 'svasdev',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM districts_1",
                cartocss: '#districts_1 {  polygon-fill: #FF6600;'+
                              ' polygon-opacity: 0.0; '+
                              ' line-color: #ada7a7;'+
                              ' line-width: 1;'+
                              ' line-opacity: .8;'+
                              ' line-dasharray: 2; }'
    }]
    })
    .addTo(map);
    

    var createSchools = function(map,query) {
        query = "SELECT * FROM schools_merged_2013_correct_ratio_only " + (query || "")
        cartodb.createLayer(map, {
                user_name: 'svasdev',
                type: 'cartodb',
                sublayers: [{
                    sql: query,
                    cartocss: '#schools_merged_2013_correct {'+
                               '   marker-fill-opacity: 0.9;'+
                                '   marker-line-color: #FFF;'+
                             '  marker-line-width: 1.5;'+
    '   marker-line-opacity: .8;'+
    '   marker-placement: point; '+
    '   marker-type: ellipse;'+
    '   marker-width: 7; '+
    '   marker-allow-overlap: true;'+
    '} '+
    '#schools_merged_2013_correct_ratio_only[percentage_pass < 40] { '+
    '   marker-fill: #F84F40;'+
    '} '+
    '#schools_merged_2013_correct_ratio_only[percentage_pass >= 40] { '+
    '   marker-fill: #FFCC00; '+
    '} '+
    '#schools_merged_2013_correct_ratio_only[percentage_pass > 60] {'+
    '   marker-fill: #229A00;'+
    '}'+
    '#schools_merged_2013_correct_ratio_only[ratio < 35] { '+
    '  marker-width: 5;'+
    '}'+
    '#schools_merged_2013_correct_ratio_only[ratio >= 35] {'+
    '  marker-width: 10;'+
    '}'+
    '#schools_merged_2013_correct_ratio_only[ratio >= 50] { '+
    '  marker-width: 15;'+
    '}'

    }]
    })
    .addTo(map)
    .on('done', function(l) {
        if (layer) {
            setTimeout(function(l) {
                return function() {l.remove()}}(layer),2000);
            layer.remove(); }
        layer = l });
    }
   createSchools(map,"");     
   
   document.getElementById("ranger").onchange=function() {
            var v = this.value
            var query = "WHERE percentage_pass >= " +v 
            createSchools(map,query);
            document.getElementById("rangedisplay").innerHTML=v;
            };
}
