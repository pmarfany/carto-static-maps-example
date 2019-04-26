function getCartoCss(id, rules) {
    return '#' + id + ' {\n\t' +
        rules.join('\n\t')
        + '\n}'
}

var examples = {
    marker: {
        name: 'Maker on point',
        type: "mapnik",
        sql: "select ST_Transform(ST_GeomFromText('POINT(LONGITUDE LATITUDE)', 4326), 3857) as the_geom_webmercator",
        cartocss: [
          '#ne_10m_populated_places_simple {',
          '  marker-placement: point;',
          '  marker-type: ellipse;',
          '  marker-width: 36;',
          '  marker-file: url(https://pmarfany.github.io/carto-static-maps-example/marker.png);',
          '  marker-allow-overlap: true;',
          '}'
        ].join('\n'),
        center: [41.234937, 1.823735],
        zoom: 17
    },
    radius: {
        name: 'Radius on point',
        sql: "select ST_Transform(ST_Buffer(ST_GeomFromText('POINT(LONGITUDE LATITUDE)', 4326)::geography, RADIUS)::geometry, 3857) as the_geom_webmercator",
        cartocss: [
          '#layer {',
          '  polygon-opacity: 0.2;',
          '  line-color: #e5005a;',
          '  line-width: 2;',
          '  line-opacity: 1;',
          '}'
        ].join('\n'),
        center: [41.234937, 1.823735],
        zoom: 17,
        radius: 170,
    },
    nyc: {
        name: 'NYC',
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
        zoom: 14
    },
    torque_heatmap: {
        name: 'torque heatmap',
        "type": "torque",
        "sql": "SELECT * FROM ne_10m_populated_places_simple",
        "cartocss": [
            'Map {',
            '  buffer-size:{bufferSize};',
            '  -torque-frame-count:1;',
            '  -torque-animation-duration:10;',
            '  -torque-time-attribute:\"cartodb_id\";',
            '  -torque-aggregation-function:\"count(cartodb_id)\";',
            '  -torque-resolution:1;',
            '  -torque-data-aggregation:linear;',
            '}',
            '',
            '#ne_10m_populated_places_simple{',
            '  image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
            '  marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
            '  marker-fill-opacity: 0.4;',
            '  marker-width: 12;',
            '}',
            '#ne_10m_populated_places_simple[frame-offset=1] {',
            ' marker-width:14;',
            ' marker-fill-opacity:0.2; ',
            '}',
            '#ne_10m_populated_places_simple[frame-offset=2] {',
            ' marker-width:16;',
            ' marker-fill-opacity:0.1; ',
            '}'
        ].join('\n'),
        center: [35, 0],
        bbox: {
            west: -8,
            south: 50,
            east: 3,
            north: 55
        },
        zoom: 2
    },
    torque_marker_file: {
        name: 'Torque Marker file',
        type: 'torque',
        sql: 'select * from ne_10m_populated_places_simple',
        cartocss: [
            'Map {',
            'buffer-size:{bufferSize};',
            '-torque-frame-count:1;',
            '-torque-animation-duration:30;',
            '-torque-time-attribute:"cartodb_id";',
            '-torque-aggregation-function:"count(cartodb_id)";',
            '-torque-resolution:1;',
            '-torque-data-aggregation:linear;',
            '}',
            '',
            '#ne_10m_populated_places_simple{',
            '  marker-fill-opacity: 0.9;',
            '  marker-line-color: #FFF;',
            '  marker-line-opacity: 1;',
            '  marker-placement: point;',
            '  marker-type: ellipse;',
            '  marker-width: 12;',
            '  marker-fill: #F84F40;',
            '  marker-file: url(http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/24px-Map_marker_font_awesome.svg.png);',
            '  marker-allow-overlap: true;',
            '}'
        ].join('\n'),
        center: [35, 0],
        bbox: {
            west: -8,
            south: 50,
            east: 3,
            north: 55
        },
        zoom: 2
    },
    torque_populated: {
        name: 'THE TORQUE',
        type: 'torque',
        sql: 'select * from ne_10m_populated_places_simple',
        cartocss: 'Map {\nbuffer-size:{bufferSize};\n-torque-frame-count:1;\n-torque-animation-duration:30;\n-torque-time-attribute:"cartodb_id";\n-torque-aggregation-function:"count(cartodb_id)";\n-torque-resolution:2;\n-torque-data-aggregation:linear;\n}\n\n#ne_10m_populated_places_simple_3{\n  comp-op: lighter;\n  marker-fill-opacity: 0.9;\n  marker-line-color: #2167AB;\n  marker-line-width: 5;\n  marker-line-opacity: 1;\n  marker-type: ellipse;\n  marker-width: 6;\n  marker-fill: #FF9900;\n}\n#ne_10m_populated_places_simple_3[frame-offset=1] {\n marker-width:8;\n marker-fill-opacity:0.45; \n}\n#ne_10m_populated_places_simple_3[frame-offset=2] {\n marker-width:10;\n marker-fill-opacity:0.225; \n}',
        center: [35, 0],
        bbox: {
            west: -8,
            south: 50,
            east: 3,
            north: 55
        },
        zoom: 2
    },
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
        sql: 'select * from world_borders_public',
        cartocss: getCartoCss('world_borders_public', [
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
        sql: 'select * from nurburgring_area_multipolygons',
        cartocss: getCartoCss('nurburgring_area_multipolygons', [
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
    voyager_only_labels: {
        config: {
          "type": "http",
          "options": {
            "urlTemplate": "http://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
            "subdomains": ["a", "b", "c"]
          }
        },
        checked: false
    },
    example: {
        checked: true,
    },
    urban_areas: {
        config: {
            "type": "mapnik",
            "options": {
                "sql": 'SELECT * FROM ne_50m_urban_areas',
                "cartocss": [
                    '#ne_50m_urban_areas{',
                    '  polygon-fill: #c33;',
                    '  polygon-opacity: 0.7;',
                    '  line-color: #FFF;',
                    '  line-width: 1;',
                    '  line-opacity: 1;',
                    '}'
                ].join(' '),
                "interactivity": "cartodb_id",
                "cartocss_version": "2.2.0"
            }
        },
        checked: false
    },
    torque: {
        config: {
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
        checked: false
    },
    labels: {
        config: {
            "type": "http",
            "options": {
                "urlTemplate": "http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
                "subdomains": ["a", "b", "c"]
            }
        },
        checked: false
    },
    named: {
        config: {
            "type": "named",
            "options": {
                "name": "world_borders"
            }
        },
        checked: false
    },
    nycha_developments_july2011: {
        config: {
            "type": "cartodb",
            "options": {
                "sql": "select * from nycha_developments_july2011",
                "cartocss": "/** simple visualization */\n\n#nycha_developments_july2011{\n  polygon-fill: #5CA2D1;\n  polygon-opacity: 0.7;\n  line-color: #FFF;\n  line-width: 0;\n  line-opacity: 1;\n}",
                "cartocss_version": "2.1.1"
            }
        },
        checked: false
    }
};

var basemaps = {
  plain: {
    config: {
      "type": "plain",
      "options": {
        "color": "#fabada"
      }
    },
    checked: false
  },
  voyager: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  },
  voyager_nolabels: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  },
  voyager_labels_under: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: true
  },
  labels_basemap_light: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  },
  basemap_light: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  },
  labels_basemap_dark: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  },
  basemap_dark: {
    config: {
      "type": "http",
      "options": {
        "urlTemplate": "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"]
      }
    },
    checked: false
  }
};
