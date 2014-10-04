var map;
var layer;

window.onload = function() {
    var interactivity=['name',
                        'code',
                        'district',
                        'national_rank',
                        'number_enrolled',
                        'number_pass',
                        'number_teaching_staff',
                        'ownership',
                        'percentage_pass_round',
                        'percentage_pass',
                        'ratio',
                        'region',
                        'school_type',
                        'ward'];


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
    
    cartodb.createLayer(map, {
                user_name: 'svasdev',
                type: 'cartodb',
                sublayers: [{
                    sql: "SELECT * FROM schools_merged_2013_correct_ratio_only",
                    interactivity: interactivity.join(","),
                    cartocss: $("#schoolcss").html(),
    }]
    })
    .addTo(map)
    .on('done', function(l) {
        console.log('done');
        l.getSubLayer(0).setInteraction(true);
        l.on('featureClick',function(e,ll, p, data, l) {
            console.log(data);
            $("#info").html(Mustache.render($("#infowindow").html(), data));
            })
        l.on('featureOver', function() {
            $(".leaflet-container").css("cursor","pointer");
            });
        l.on('featureOut', function() {
            $(".leaflet-container").css("cursor","");
            });
        layer = l });
    
    var createSchools = function(map,query) {
        query = "SELECT * FROM schools_merged_2013_correct_ratio_only " + (query || "")
        layer.getSubLayer(0).setSQL(query); }

   //createSchools(map,"");     
    
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
