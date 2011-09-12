var camera, scene, renderer, container, containerDiv, ground, mesh, material;

var width, height;

var ground, car;
var pos, posDirty;

var noise;

var lDown, rDown, upDown;
var trabbiLoaded = false;

var debug;

$(document).ready(function(){
    init();
})



function init(){
    debug = $("#debug");
    
    groundW = groundH = 20;
    
    lDown = rDown = upDown = false;
    
    container = $("#container");
    containerDiv = container[0];
    
    width = container.width();
    height = container.height();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    
    containerDiv.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.Camera(80, window.innerWidth/window.innerHeight, 1, 10000);
    
    camera.position.x = -20;
    camera.position.z = 0;
    camera.position.y = 702;
    camera.target.position.y = 650;
    
    noise = new SimplexNoise();
    
    ground = new Ground();
    ground.init();
    scene.addObject( ground.mesh );
    
    
    // Add trabbi
    var loader = new THREE.JSONLoader(true);
    loader.load( { model: "trabbi.js", callback: createTrabbi } );

    
    var light = new THREE.PointLight( 0xFFFF00 );
    light.position.set( 10, 200, 10 );
    scene.addLight( light );
    
    //stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    containerDiv.appendChild( stats.domElement );
    
    pos = new THREE.Vector2(0, 0);
    posDirty = true;
    
    update();
}

function createTrabbi(geometry){
    var material = new THREE.MeshFaceMaterial();
    trabbi = new THREE.Mesh( geometry, material );
    //mesh.scale.set(50, 50, 50);
    scene.addObject( trabbi );
    trabbiLoaded = true;
}

function update(){

    requestAnimationFrame( update);
    
    if(lDown == true){
        trabbi.rotation.y += .1;
        posDirty = true;
    }
    if(rDown == true){
        trabbi.rotation.y -= .1; 
        posDirty = true;
    }
    
    if(upDown == true){
        var colX = trabbi.matrix.getColumnX();
        pos.x -= colX.x*.01;
        pos.y -= colX.z*.01;
        
        debug.html(pos.y);
        posDirty = true;
    }
    
    //debug.html(trabbi.matrix.getColumnX().x+"");
    
    trabbi.updateMatrix();
    
    
    debug.html();
    
    if(posDirty == true){
        ground.update(pos.x, pos.y);
    }
    posDirty = false;
    
    render();
    
    stats.update();
}

function render(){
    var time = new Date().getTime() * 0.01;
    
    renderer.render(scene, camera);
}

function jump(){
    trabbi.position.y += 4;
    posDirty = true;
}

function move(x, y){
    /*pos.x += x*.1;
    pos.y += y*.1;*/
    posDirty = true;
}

//key stuff

$(document).keydown(function(e){
    if (e.keyCode == 37) { 
        lDown = true;
        return false;
    }
    if (e.keyCode == 39) { 
        rDown = true;
        return false;
    }
    if (e.keyCode == 38) { 
        upDown = true;
        return false;
    }
    if (e.keyCode == 39) { 
        //move(1);
        return false;
    }
});

$(document).keyup(function(e){
    
    
    if (e.keyCode == 37) { 
        lDown = false;
        return false;
    }
    if (e.keyCode == 39) { 
        rDown = false;
        return false;
    }
    if (e.keyCode == 38) { 
        upDown = false;
        return false;
    }
    if (e.keyCode == 39) { 
        //move(1);
        return false;
    }
    
    if(e.keyCode == 32) {
        jump();
        return false;
    }
});