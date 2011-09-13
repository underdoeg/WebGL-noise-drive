function Ground(){
    
    

    
    this.init = function(){
        
        this.segsX = 100;
        this.segsY = 100;
        
        this.offX = 0;
        this.offY = 0;
        
        this.geometry = new THREE.PlaneGeometry( 3000, 3000, this.segsX - 1, this.segsY - 1 );
        this.geometry.dynamic = true;
        
        this.material = new THREE.MeshBasicMaterial( { color:0x666666, opacity:1, wireframe: true } );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.rotation.x = - 90 * Math.PI / 180;
    }
    
    this.update = function(posX, posY){
        var sXH = this.segsX*.5;
        var sYH = this.segsY*.5;;
        for(var y=0; y<this.segsY; y++){
            for(x = 0; x<this.segsX; x++){
                var i = y*this.segsX+x;
                this.geometry.vertices[i].position.z = noise.noise((x-sXH)*.03+posX, (y-sYH)*.03+posY)*nScale;
                
            }
        }
        
        /*for ( var i = 0, l = this.geometry.vertices.length; i < l; i ++ ) {
            //this.ground.vertices[ i ].position.z = 35 * Math.sin( i/5 + (time + i)/7 );
        }*/

        //geometry.computeFaceNormals();
        //geometry.computeVertexNormals();

        this.mesh.geometry.__dirtyVertices = true;
    }
}