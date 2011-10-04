var camera, scene, renderer, container, containerDiv, ground, mesh, material;

var width, height;

var ground, car, trabbiBounds, trabbiWidth, trabbiLength, carObj;
var pos, posDirty;

var noise  = new SimplexNoise();

var lDown, rDown, upDown;
var trabbiLoaded = false;

var debug;

var nScale = 180;

function heightAt(x, y){
    return noise.noise(x*.001, y*.001)*nScale;
}

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
    
    camera.position.x = -200;
    camera.position.z = 0;
    camera.position.y = 102;
    camera.target.position.y = 150;
    
    carObj = new THREE.Object3D();
    scene.addObject(carObj);
    
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
    carObj.addChild( trabbi );
    trabbiLoaded = true;
    geometry.computeBoundingBox();
    trabbiBounds = geometry.boundingBox;
    trabbiWidth = trabbiBounds.x[1]-trabbiBounds.x[0];
    trabbiLength = trabbiBounds.z[1]-trabbiBounds.z[0];
}

function update(){

    requestAnimationFrame( update);
    
    if(lDown == true){
        carObj.rotation.y += .1;
        posDirty = true;
    }
    if(rDown == true){
        carObj.rotation.y -= .1; 
        posDirty = true;
    }
    carObj.updateMatrix();
    
    var trabbiDir = carObj.matrix.getColumnX();
    trabbiDir = trabbiDir.normalize();
    
    if(upDown == true){
        pos.x += trabbiDir.x*5;
        pos.y += trabbiDir.z*5;
        posDirty = true;
    }
    
    var carY = heightAt(pos.x, pos.y);
    /*if(trabbi.position.y <= carY)
        trabbi.position.y =  carY;
    else
        trabbi.position.y *= .81;
    */
    carObj.position.y = carY;
    
    //calculate z rotation of trabbi
    {
        trabbiDir.multiplyScalar(trabbiLength*.5);
        var t1 = new THREE.Vector3(pos.x, 0, pos.y);
        t1 = t1.addSelf(trabbiDir);
        
        var t2 = new THREE.Vector3(pos.x, 0, pos.y);
        t2.subSelf(trabbiDir);
        var dLength = heightAt(t1.x, t1.z)-heightAt(t2.x, t2.z);
        
        trabbi.rotation.z = Math.atan(dLength/trabbiLength);
    }
    
    trabbi.updateMatrix();
    
    
    //calculate x rotation of trabbi
    {
        var trabbiDirPerp = trabbiDir.normalize().clone();
        trabbiDirPerp.set(trabbiDirPerp.z, 0, -trabbiDirPerp.x);
        trabbiDirPerp.multiplyScalar(trabbiWidth*.5);
        var t1 = new THREE.Vector3(pos.x, 0, pos.y);
        t1 = t1.addSelf(trabbiDirPerp);
        
        var t2 = new THREE.Vector3(pos.x, 0, pos.y);
        t2 = t2.subSelf(trabbiDirPerp);
        var dLength = heightAt(t2.x, t2.z)-heightAt(t1.x, t1.z);
        trabbi.rotation.x = -Math.atan(dLength/trabbiWidth);
        debug.html(trabbi.rotation.x);
        //debug.html(Math.round(t1.y)+" / "+Math.round(t2.y));
    }
    
    trabbi.updateMatrix();
    
    
    camera.target.position = trabbi.position;
    
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