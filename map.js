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
                    cartocss: $("#schoolcss").html()
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
    
   $("#toggle").on('click',function() {
        $("#controls").toggleClass("visible");
    })
    
   $("input,select").on('change',function() {
            var queries = [];
            $(".filter").each(function(n,l) {
                var e=$(l);
                var v = e.val();
                var what = e.attr("name");
                var op = e.attr("data-compare");
                $("label > span",e.parent()).html(v);
                if (parseInt(v)) {
                    v=v;}
                else {
                    v="'"+v+"'";
                    };
                var p=[what,op,v];
                queries.push(p.join(" "));
                });
            var query="WHERE "+queries.join(" AND ");
            console.log(query);
            createSchools(map,query);
            });
}
