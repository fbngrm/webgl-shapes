/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   Class: VertexBasedShape
   The shape holds an array of vertices, and knows how to 
   draw itself using WebGL.
    
    Parameters to the constructor:
    - program is the Program that these buffer objects shall be bound to  
    - primitiveType is the geometric primitive to be used for drawing,
      e.g. gl.TRIANGLES, gl.LINES, gl.POINTS, gl.TRIANGLE_STRIP, 
            gl.TRIANGLE_FAN
    - numVertices is the number of vertices this object consists of
    - transMatrix is a transformation matrix
*/ 


VertexBasedShape = function(gl, primitiveType, numVertices) { 
	
    // arrays in which to store vertex buffers and the respective 
    this.vertexBuffers = new Array();
    
    // remember what goemtric primitive to use for drawing
    this.primitiveType = primitiveType;
    
    // remember how many vertices this shape has
    this.numVertices = numVertices;
   
    // transformation matrix
    this.nodeTransform = mat4.identity();
    
    // add a vertex attribute to the shape
    this.addVertexAttribute = function(gl, attrType, dataType, 
                                        numElements,dataArray) {
        this.vertexBuffers[attrType] = new VertexAttributeBuffer(gl,
                                            attrType, dataType,
                                            numElements,dataArray);
        var n = this.vertexBuffers[attrType].numVertices;
        if(this.numVertices != n) {
           alert("Warning: wrong number of vertices (" 
                                + n + " instead of " + this.numVertices 
                                + ") for attribute " + attrType);
        }
    }
    
    /* 
       Method: draw using a vertex buffer object
    */
    this.draw = function(program) {
    
        // go through all types of vertex attributes 
        // and enable them before drawing
        for(attribute in this.vertexBuffers) {
            //window.console.log("activating attribute: " + attribute);
            this.vertexBuffers[attribute].makeActive(program);
        }
        
        // perform the actual drawing of the primitive 
        // using the vertex buffer object
        //window.console.log("drawing shape with " + 
        //                    this.numVertices + " vertices.");
        program.gl.drawArrays(primitiveType, 0, this.numVertices);
    }

    this.setUniforms = function(program) {
        var matrixLocation = gl.getUniformLocation(program.glProgram, "nodeTransform");
        gl.uniformMatrix4fv(matrixLocation, false, this.nodeTransform);
    }
}
             
/* 

   Class:  Triangle
   The triangle consists of three vertices. 
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

Triangle = function(gl) {

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 3);

    var vposition = new Float32Array( [ 0,1,0,  -1,-1,0, 1,-1,0 ]);
    var vcolor    = new Float32Array( [ 1,0,0,  0,1,0,   0,0,1 ]);
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
                                  vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, 
                                  vcolor);
    
}  

/* 

Class:  Pyramid
The pyramid consists of three vertices. 
 
Parameters to the constructor:
- program is a Program object that knows which vertex attributes 
  are expected by its shaders

*/ 

Pyramid = function(gl) {

 // instantiate the shape as a member variable
 this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 12);

 var vposition = new Float32Array( [ 0,1.5,0, -1.5,-1.5,-0.75, 1.5,-1.5,1.5,  
                                     0,1.5,0, -1.5,-1.5,-0.75, 1.5,-1.5,-1.5,  
                                     0,1.5,0, 1.5,-1.5,1.5, 1.5,-1.5,-1.5,
                                     -1.5,-1.5,-0.75, 1.5,-1.5,1.5, 1.5,-1.5,-1.5]);
 var vcolor    = new Float32Array( [ 1,0,0,  0,1,0,   0,0,1,  
                                     1,0,0,  0,1,0,   0,0,1, 
                                     1,0,0,  0,1,0,   0,0,1,
                                     1,0,0,  0,1,0,   0,0,1]);
 this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
                               vposition);
 this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, 
                               vcolor);
 
} 
    
/* 

   Class:  TriangleFan
   A little fan around a center vertex. 
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

TriangleFan = function(gl) {

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLE_FAN, 9);

    var vposition = new Float32Array( [ 0,0,1,        0,1,0,       -0.7,0.7,0, 
                                        -1,0,0,      -0.7,-0.7,0,  0,-1,0, 
                                        0.7,-0.7,0,  1.0,0,0,      0.7,0.7,0]);
    var vcolor    = new Float32Array( [ 1,1,1,  1,0,0,  0,1,0,      
                                        0,0,1,  1,0,0,  0,1,0,  
                                        0,0,1,  1,0,0,  0,1,0,    ]);
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, vcolor);
    
}        

/* 

Class:  Cube
The cube consists of 36 vertices. 
 
Parameters to the constructor:
- program is a Program object that knows which vertex attributes 
  are expected by its shaders

*/ 

	Cube = function(gl, l) {
	
	 // instantiate the shape as a member variable
	 this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 36);
	 var size = l/2.0;
	 var vertices = [[-size, size, size], [size, size, size],[size, -size, size], [-size, -size, size], 
	                 [-size, -size, -size], [-size, size, -size], [size, size, -size], [size, -size, -size]];
	 var vposition = new Float32Array( [ // front
	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[1][0], vertices[1][1], vertices[1][2],
	                                     vertices[2][0], vertices[2][1], vertices[2][2],
	                                     
	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[3][0], vertices[3][1], vertices[3][2],
	                                     vertices[2][0], vertices[2][1], vertices[2][2],
	                                     
	                                     //right
	                                     vertices[1][0], vertices[1][1], vertices[1][2],
	                                     vertices[2][0], vertices[2][1], vertices[2][2],
	                                     vertices[7][0], vertices[7][1], vertices[7][2],

	                                     vertices[1][0], vertices[1][1], vertices[1][2],
	                                     vertices[6][0], vertices[6][1], vertices[6][2],
	                                     vertices[7][0], vertices[7][1], vertices[7][2],
	                                     
	                                     // back
	                                     vertices[7][0], vertices[7][1], vertices[7][2],
	                                     vertices[4][0], vertices[4][1], vertices[4][2],
	                                     vertices[5][0], vertices[5][1], vertices[5][2],

	                                     vertices[7][0], vertices[7][1], vertices[7][2],
	                                     vertices[6][0], vertices[6][1], vertices[6][2],
	                                     vertices[5][0], vertices[5][1], vertices[5][2],
	                                     
	                                     //left
	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[3][0], vertices[3][1], vertices[3][2],
	                                     vertices[4][0], vertices[4][1], vertices[4][2],

	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[5][0], vertices[5][1], vertices[5][2],
	                                     vertices[4][0], vertices[4][1], vertices[4][2],
	                                     
	                                     //top
	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[1][0], vertices[1][1], vertices[1][2],
	                                     vertices[6][0], vertices[6][1], vertices[6][2],

	                                     vertices[0][0], vertices[0][1], vertices[0][2],
	                                     vertices[5][0], vertices[5][1], vertices[5][2],
	                                     vertices[6][0], vertices[6][1], vertices[6][2],
	                                     
	                                     //bottom
	                                     vertices[4][0], vertices[4][1], vertices[4][2],
	                                     vertices[7][0], vertices[7][1], vertices[7][2],
	                                     vertices[2][0], vertices[2][1], vertices[2][2],
	                                     
	                                     vertices[2][0], vertices[2][1], vertices[2][2],
	                                     vertices[3][0], vertices[3][1], vertices[3][2],
	                                     vertices[4][0], vertices[4][1], vertices[4][2]

	                                    ]);
	 this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
	                               vposition);
	 
	 var colors = [[1,0,0],[0,1,0],[0,0,1],[1,1,0]];
	 var vcolor = new Float32Array([ 
									//front
									colors[0][0], colors[0][1], colors[0][2],
									colors[1][0], colors[1][1], colors[1][2],
									colors[2][0], colors[2][1], colors[2][2],
									
									colors[0][0], colors[0][1], colors[0][2],
									colors[3][0], colors[3][1], colors[3][2],
									colors[2][0], colors[2][1], colors[2][2],
									
									//right
									colors[1][0], colors[1][1], colors[1][2],
									colors[2][0], colors[2][1], colors[2][2],
									colors[3][0], colors[3][1], colors[3][2],

									colors[1][0], colors[1][1], colors[1][2],
									colors[0][0], colors[0][1], colors[0][2],
									colors[3][0], colors[3][1], colors[3][2],

									//back
									colors[3][0], colors[3][1], colors[3][2],
									colors[2][0], colors[2][1], colors[2][2],
									colors[1][0], colors[1][1], colors[1][2],

									colors[3][0], colors[3][1], colors[3][2],
									colors[0][0], colors[0][1], colors[0][2],
									colors[1][0], colors[1][1], colors[1][2],

									//left
									colors[0][0], colors[0][1], colors[0][2],
									colors[3][0], colors[3][1], colors[3][2],
									colors[2][0], colors[2][1], colors[2][2],

									colors[0][0], colors[0][1], colors[0][2],
									colors[1][0], colors[1][1], colors[1][2],
									colors[2][0], colors[2][1], colors[2][2],

									//top
									colors[0][0], colors[0][1], colors[0][2],
									colors[1][0], colors[1][1], colors[1][2],
									colors[0][0], colors[0][1], colors[0][2],

									colors[0][0], colors[0][1], colors[0][2],
									colors[1][0], colors[1][1], colors[1][2],
									colors[0][0], colors[0][1], colors[0][2],

									//bottom
									colors[2][0], colors[2][1], colors[2][2],
									colors[3][0], colors[3][1], colors[3][2],
									colors[2][0], colors[2][1], colors[2][2],

									colors[2][0], colors[2][1], colors[2][2],
									colors[3][0], colors[3][1], colors[3][2],
									colors[2][0], colors[2][1], colors[2][2]
	                                 
	                               ]);
	 this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, 
	                               vcolor);
}   
	
	/* 

	   Class:  Torus
	   The triangle consists of three vertices. 
	    
	   Parameters to the constructor:
	   - program is a Program object that knows which vertex attributes 
	     are expected by its shaders
	   
	*/ 

	Torus = function(gl, r1, r2, N, M) {
		
		// vertex positions
		var vposition = [];
	    // vertex colors
	    var vcolor = [];
	    
	    var color1 = [1,0,0];
	    var color2 = [0,1,0];
		
		for (var i = 1; i <= N; ++i) {
			for (var j = 1; j <= M; ++j) {

				getTorusVertex(i, j, N, M, r1, r2, vposition);
				getTorusVertex(i-1, j, N, M, r1, r2, vposition);
				getTorusVertex(i-1, j-1, N, M, r1, r2, vposition);
				
				getTorusVertex(i, j, N, M, r1, r2, vposition);
				getTorusVertex(i, j-1, N, M, r1, r2, vposition);
				getTorusVertex(i-1, j-1, N, M, r1, r2, vposition);
				
				if(i%2 + j%2 == 1){
					setColor(color1, vcolor);
				} else {
					setColor(color2, vcolor);
				}
				
			}
		}
	    // instantiate the shape as a member variable
	    this.shape = new VertexBasedShape(gl, gl.TRIANGLE_STRIP, vposition.length/3);

	    var vposition = new Float32Array(vposition);
	    var vcolor = new Float32Array(vcolor);
	    
	    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
	                                  vposition);
	    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, 
	                                  vcolor);
	} 	
	
	/* 

	   Class:  Sphere
	    
	   Parameters to the constructor:
	   - program is a Program object that knows which vertex attributes 
	     are expected by its shaders
	   
	*/ 

	Sphere = function(gl, r, N, M) {
		
		// vertex positions
		var vposition = [];
	    // vertex colors
	    var vcolor = [];
	    
	    var color1 = [1,0,0];
	    var color2 = [0,1,0];
	    
		for(var i=1; i<=N; i++){
			for(var j=1; j<=M; j++){

				getSphereVertex(r, i, j, N, M, vposition);
				getSphereVertex(r, i-1, j, N, M, vposition);
				getSphereVertex(r, i-1, j-1, N, M, vposition);
				
				getSphereVertex(r, i, j, N, M, vposition);
				getSphereVertex(r, i, j-1, N, M, vposition);
				getSphereVertex(r, i-1, j-1, N, M, vposition);

				if(i%2 + j%2 == 1){
					setColor(color1, vcolor);
				} else {
					setColor(color2, vcolor);
				}
			}
		}
	    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length/3);

	    // add vertices to shape
	    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, new Float32Array(vposition));
	    
	    
	    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, new Float32Array(vcolor));
	}  
	
	// calc the position for a vertex in a sphere
	function getSphereVertex(r, u, v, N, M, vposition){
		// u is the latitude with Pi <=> 180°
		var theta = u * Math.PI / N;
		// v is the longitude with 2 * Pi <=> 360° 
	    var phi = v * 2 * Math.PI / M;
	    
	    var sinTheta = Math.sin(theta);
	    var cosTheta = Math.cos(theta);
	    
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = r * cosPhi * sinTheta;
        var y = r * sinPhi * sinTheta;
        var z = r * cosTheta;

        vposition.push(x);
        vposition.push(y);
        vposition.push(z);
	}
	
	function getTorusVertex(i,j, N, M, r1, r2, vposition){

		var v = i * 2 * Math.PI / N ;
		var u = j * 2 * Math.PI / M;
		
		var x = (r1 + r2 * Math.cos(u)) * Math.cos(v);
		var y = (r1 + r2 * Math.cos(u)) * Math.sin(v);
		var z = r2 * Math.sin(u);
		
        vposition.push(x);
        vposition.push(y);
        vposition.push(z);
	}
	
	function setColor(color, vcolor){

		vcolor.push(color[0], color[1], color[2]);
		vcolor.push(color[0], color[1], color[2]);
		vcolor.push(color[0], color[1], color[2]);
		vcolor.push(color[0], color[1], color[2]);
		vcolor.push(color[0], color[1], color[2]);
		vcolor.push(color[0], color[1], color[2]);
	}


