var mapConfigEditor = CodeMirror.fromTextArea(document.getElementById('map_config_editor'), {
    theme: 'monokai',
    lineNumbers: true,
    mode:  "javascript",
    height: "200px",
    lineWrapping: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
});


function updateStaticPreview(options) {
    options = options || {};

    var example = examples[examplesSelector.value];

    // hack to reference example in examples
    layers.example = {
        "type": "mapnik",
        "options": {
            "sql": example.sql,
            "cartocss": example.cartocss,
            "cartocss_version": "2.2.0"
        }
    };

    var checkedLayerElements = layersElement.querySelectorAll('input:checked'),
        checkedLayers = [];
    for (var i = 0, len = checkedLayerElements.length; i < len; i++) {
        checkedLayers.push(layers[checkedLayerElements[i].value]);
    }

    var config = {
        "version": "1.3.0-alpha",
        "layers": checkedLayers
    };

    if (!checkedLayers.length) {
        return;
    }

    var jsonMapConfig = JSON.stringify(config, null, 2);

    if (!!options.fromEditor) {
        jsonMapConfig = mapConfigEditor.getValue();
    } else {
        mapConfigEditor.setValue(jsonMapConfig);
    }


    var request = new XMLHttpRequest();
    request.open('POST', currentEndpoint(), true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function() {
        if (this.status >= 200 && this.status < 400){
            var layergroup = JSON.parse(this.response);
            document.getElementById('preview').src = previewUrl(layergroup);
            inputValue('preview_url', previewUrl(layergroup));
        } else {
            throw 'Error calling server: Error ' + this.status + ' -> ' + this.response;
        }
    };
    request.send(jsonMapConfig);
}


function previewUrl(layergroup) {
    return checkboxChecked('bbox')
        ? bboxUrl(layergroup)
        : centerUrl(layergroup);
}

function bboxUrl(layergroup) {
    var path = [
        currentEndpoint(),
        'static',
        'bbox',
        layergroup.layergroupid,
        [
            inputValue('west'),
            inputValue('south'),
            inputValue('east'),
            inputValue('north')
        ].join(','),
        inputValue('width'),
        inputValue('height')
    ].join('/');
    return path + '.png';
}

function centerUrl(layergroup) {
    var path = [
        currentEndpoint(),
        'static',
        'center',
        layergroup.layergroupid,
        inputValue('zoom'),
        inputValue('lat'),
        inputValue('lng'),
        inputValue('width'),
        inputValue('height')
    ].join('/');
    return path + '.png';
}



function currentEndpoint() {
    return inputValue('endpoint');
}

function inputValue(elementId, value) {
    if (typeof value !== 'undefined') {
        document.getElementById(elementId).value = value;
    }
    return document.getElementById(elementId).value;
}

function checkboxChecked(elementId) {
    return document.getElementById(elementId).checked;
}


function loadExample() {
    var example = examples[examplesSelector.value];

    inputValue('lat', example.center[0]);
    inputValue('lng', example.center[1]);

    if (example.bbox) {
        inputValue('west', example.bbox.west);
        inputValue('south', example.bbox.south);
        inputValue('east', example.bbox.east);
        inputValue('north', example.bbox.north);
    }

    inputValue('zoom', example.zoom);

    updateStaticPreview();
}

CodeMirror.commands.save = function() {
    updateStaticPreview({fromEditor: true});
};


var examplesSelector = document.getElementById('examples');
examplesSelector.addEventListener('change', loadExample, false);

Object.keys(examples).forEach(function(k) {
    var option = document.createElement('option');
    option.value = k;
    option.innerText = examples[k].name;

    examplesSelector.appendChild(option);
});

[
    'zoom',
    'lat',
    'lng',
    'west',
    'south',
    'east',
    'north',
    'width',
    'height'
].forEach(function(elementId) {
    document.getElementById(elementId).addEventListener('blur', updateStaticPreview, false);
});

['endpoint'].forEach(function(elementId) {
    document.getElementById(elementId).addEventListener('blur', updateStaticPreview, false);
});


document.getElementById('bbox').addEventListener('click', function() {
    updateForm();
    updateStaticPreview();
}, false);

function updateForm() {
    var centerElementsCollection = document.getElementsByClassName('center');
    var bboxElementsCollection = document.getElementsByClassName('bbox');

    if (checkboxChecked('bbox')) {
        apply(centerElementsCollection, function(element) {
            element.style.display = 'none';
        });
        apply(bboxElementsCollection, function(element) {
            element.style.display = 'inline-block';
        });
    } else {
        apply(centerElementsCollection, function(element) {
            element.style.display = 'inline-block';
        });
        apply(bboxElementsCollection, function(element) {
            element.style.display = 'none';
        });
    }
}

function apply(htmlCollection, func) {
    for (var i = 0, len = htmlCollection.length; i < len; i++) {
        func(htmlCollection[i]);
    }
}

var layersElement = document.getElementById('layers');
Object.keys(layers).forEach(function(layerName) {
    var checkBoxElement = layerCheckboxElement(layerName, layers[layerName].checked);
    layersElement.appendChild(checkBoxElement);
    checkBoxElement.addEventListener('click', updateStaticPreview, false);

    layersElement.appendChild(layerCheckboxLabel(layerName));
});

function layerCheckboxElement(layerName, checked) {
    var checkboxElement = document.createElement('input');
    checkboxElement.name = layerName;
    checkboxElement.id = layerName;
    checkboxElement.value = layerName;
    checkboxElement.type = 'checkbox';
    checkboxElement.checked = checked;
    return checkboxElement;
}

function layerCheckboxLabel(layerName) {
    var labelElement = document.createElement('label');
    labelElement.setAttribute('for', layerName);
    labelElement.innerText = layerName;
    labelElement.id = layerName + '_label';
    return labelElement;
}



updateForm();
loadExample();
