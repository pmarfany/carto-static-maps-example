function getCartoCss(id, rules) {
    return '#' + id + ' {\n\t' +
        rules.join('\n\t')
        + '\n}'
}

var examples = {
    bbox_torque: {
        name: 'Bounding box + centroid',
        sql: 'select ST_Transform(ST_MakeEnvelope(-5, 51, 2, 54, 4326), 3857) the_geom_webmercator',
        cartocss: getCartoCss('layer', [
            'polygon-fill: #FFF;',
            'polygon-opacity: 0.7;',
            'line-color: #333;',
            'line-width: 1;',
            'line-opacity: 1.0;'
        ]),
        center: [42, -2],
        bbox: {
            west: -8,
            south: 50,
            east: 3,
            north: 55
        },
        zoom: 1
    },
    bbox_centroid: {
        name: 'Bounding box + centroid',
        sql: 'select ST_Transform(ST_MakeEnvelope(6, 49, 9, 52, 4326), 3857) the_geom_webmercator',
        cartocss: getCartoCss('layer', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0.7;',
            'line-color: #333;',
            'line-width: 1;',
            'line-opacity: 0.2;'
        ]),
        center: [42, -2],
        bbox: {
            west: 6,
            south: 49,
            east: 9,
            north: 52
        },
        zoom: 1
    },
    bbox: {
        name: 'Bounding box',
        sql: 'select ST_Transform(ST_MakeEnvelope(-124.7625, 24.521, -66.9326, 49.3845, 4326), 3857) the_geom_webmercator',
        cartocss: getCartoCss('layer', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0.7;',
            'line-color: #333;',
            'line-width: 1;',
            'line-opacity: 0.2;'
        ]),
        center: [42, -2],
        bbox: {
            west: -124.7625,
            south: 24.5210,
            east: -66.9326,
            north: 49.3845
        },
        zoom: 1
    },
    world_borders: {
        name: 'World Borders Polygons',
        sql: 'select * from world_borders',
        cartocss: getCartoCss('world_borders', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0.7;',
            'line-color: #FFF;',
            'line-width: 0.3;',
            'line-opacity: 1;'
        ]),
        center: [42, -2],
        bbox: {
            west: -124.7625,
            south: 24.5210,
            east: -66.9326,
            north: 49.3845
        },
        zoom: 0
    },
    nurburgring_multipolygons: {
        name: 'Nürburgring Multipolygons',
        sql: 'select * from nurburgring_multipolygons',
        cartocss: getCartoCss('nurburgring_multipolygons', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0.7;',
            'line-color: #FFF;',
            'line-width: 0.3;',
            'line-opacity: 1;'
        ]),
        center: [50.4, 7],
        bbox: {
            west: -12,
            south: 36,
            east: 10,
            north: 52
        },
        zoom: 10
    },
    office_maps_nyc: {
        name: 'Office map NYC',
        sql: 'select null::geometry the_geom_webmercator',
        cartocss: getCartoCss('layer', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0;',
            'line-color: #333;',
            'line-width: 0;',
            'line-opacity: 0;'
        ]),
        center: [40.71502926732618, -73.96039009094238],
        bbox: {
            west: 6,
            south: 49,
            east: 9,
            north: 52
        },
        zoom: 18
    },
    office_maps: {
        name: 'Office map',
        sql: 'select null::geometry the_geom_webmercator',
        cartocss: getCartoCss('layer', [
            'polygon-fill: #FF3300;',
            'polygon-opacity: 0;',
            'line-color: #333;',
            'line-width: 0;',
            'line-opacity: 0;'
        ]),
        center: [40.4347, -3.7004],
        bbox: {
            west: 6,
            south: 49,
            east: 9,
            north: 52
        },
        zoom: 18
    }
};


var layers = {
    labels_basemap: {
        "type": "http",
        "options": {
            "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "subdomains": ["a", "b", "c"]
        }
    },
    basemap: {
        "type": "http",
        "options": {
            "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            "subdomains": ["a", "b", "c"]
        }
    },
    example: {
        checked: true
    },
    urban_areas: {
        "type": "mapnik",
        "options": {
            "sql": 'SELECT * FROM ne_50m_urban_areas',
            "cartocss": [
                '#ne_50m_urban_areas{',
                '  polygon-fill: #666;',
                '  polygon-opacity: 0.7;',
                '  line-color: #FFF;',
                '  line-width: 1;',
                '  line-opacity: 1;',
                '}'
            ].join(' '),
            "cartocss_version": "2.2.0"
        }
    },
    torque: {
        "type": "torque",
        options: {
            sql: "select *, (CASE WHEN \"road_type\" = '6' THEN 1 WHEN \"road_type\" = '3' THEN 2 WHEN \"road_type\" = '1' THEN 3 WHEN \"road_type\" = '2' THEN 4 WHEN \"road_type\" = '7' THEN 5 WHEN \"road_type\" = '9' THEN 6 ELSE 7 END) as torque_category FROM (SELECT to_timestamp(date || ' ' || time, 'DD/MM/YYYY HH24:MI') date_time, * FROM dftroadsafety_accidents_3) _cdb_wrap",
            cartocss: [
                'Map {',
                '-torque-frame-count:512;',
                '-torque-animation-duration:30;',
                '-torque-time-attribute:"date_time";',
                '-torque-aggregation-function:"CDB_Math_Mode(torque_category)";',
                '-torque-resolution:1;',
                '-torque-data-aggregation:linear;',
                '}',
                '',
                '#dftroadsafety_accidents_3{',
                '  comp-op: multiply;',
                '  marker-fill-opacity: 0.9;',
                '  marker-line-color: #FFF;',
                '  marker-line-width: 0;',
                '  marker-line-opacity: 1;',
                '  marker-type: ellipse;',
                '  marker-width: 3;',
                '  marker-fill: #FF9900;',
                '}',
                '#dftroadsafety_accidents_3[frame-offset=1] {',
                ' marker-width:5;',
                ' marker-fill-opacity:0.45; ',
                '}',
                '#dftroadsafety_accidents_3[frame-offset=2] {',
                ' marker-width:7;',
                ' marker-fill-opacity:0.225; ',
                '}',
                '#dftroadsafety_accidents_3[value=1] {',
                '   marker-fill: #A6CEE3;',
                '}',
                '#dftroadsafety_accidents_3[value=2] {',
                '   marker-fill: #1F78B4;',
                '}',
                '#dftroadsafety_accidents_3[value=3] {',
                '   marker-fill: #B2DF8A;',
                '}',
                '#dftroadsafety_accidents_3[value=4] {',
                '   marker-fill: #33A02C;',
                '}',
                '#dftroadsafety_accidents_3[value=5] {',
                '   marker-fill: #FB9A99;',
                '}',
                '#dftroadsafety_accidents_3[value=6] {',
                '   marker-fill: #E31A1C;',
                '}'
            ].join(' '),
            cartocss_version: "1.0.0",
            step: 128
        }
    },
    labels: {
        "type": "http",
        "options": {
            "urlTemplate": "http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
            "subdomains": ["a", "b", "c"]
        }
    }
};