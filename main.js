/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   The "Main" Function is an event handler that is called 
   whenever the HTML document is loaded/refreshed
*/

window.onload = function () {

    // initialize WebGL and compile shader program
    var canvas = window.document.getElementById("webgl_canvas");
    var gl = initWebGL("webgl_canvas");
    var vs = getShaderSource("vert_shader");
    var fs = getShaderSource("frag_shader");
    var prog = new Program(gl, vs, fs);

    
    // theScene is a global variable; it is accessed by the event handlers
    theScene = new SimpleScene(prog, [0.0 ,0.0, 0.0, 1.0]);
    
    // add an object to the scene
    var torus = new Torus(gl, 1.0, 0.5, 30, 20);
    var sphere = new Sphere(gl, 1.5, 30, 30);
    var triangle = new Triangle(gl);
    
    mat4.translate(torus.shape.nodeTransform, [1,2,0]);
    mat4.translate(sphere.shape.nodeTransform, [0,-1,1]);
    mat4.translate(triangle.shape.nodeTransform, [-1,0,-1]);

    theScene.addShape(torus);
    theScene.addShape(sphere);
    theScene.addShape(triangle);
    
    // set the camera's viewpoint and viewing direction
    theScene.camera.lookAt([0,2,4], [0,0,0], [0,1,0]);
    
    // use the values in the HTML form to initialize the camera's projection
    updateCamera(theScene); 
    
    // the SceneExporer handles events to manipulate the scene
    theExplorer = new SceneExplorer(canvas,theScene);
};


/*
    Event handler called whenever values in the 
    "cameraParameters" form have been updated.
    
    The function simply reads values from the HTML form
    and calls the respective functions of the scene's 
    camera object.
*/
     
updateCamera = function(scene) {

    var f = document.forms["cameraParameters"];
    var cam = scene.camera;
    var gl = initWebGL("webgl_canvas");
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'projectionParameters'.");
        return;
    }

    // add shapes to the scene
    if(f.elements["shape"][0].checked == true ){
    	scene.clearScene();
    	scene.addShape(new Triangle(gl));
    }
    if(f.elements["shape"][1].checked == true ){
    	scene.clearScene();
    	scene.addShape(new Pyramid(gl));
    }
    if(f.elements["shape"][2].checked == true){
    	scene.clearScene();
    	scene.addShape(new Cube(gl, parseFloat(f.elements["size"].value)));
    } 
    if(f.elements["shape"][3].checked == true ){
    	scene.clearScene();
    	scene.addShape(new Torus(gl, parseFloat(f.elements["r1"].value), 
    								 parseFloat(f.elements["r2"].value), 
    								 parseFloat(f.elements["m"].value), 
    								 parseFloat(f.elements["x"].value)));
    } 
    if(f.elements["shape"][4].checked == true ){
    	scene.clearScene();
    	scene.addShape(new Sphere(gl, parseFloat(f.elements["r"].value), 
    								 parseFloat(f.elements["m_sphere"].value), 
    								 parseFloat(f.elements["x_sphere"].value)));
    } 
    
    // check which projection type to use (0 = perspective; 1 = ortho)
    if(f.elements["projection_type"][0].checked == true) {
    
        // perspective projection: fovy, aspect, near, far
        if(!cam)
            alert("Cannot find camera object!!!");

        // update camera - set up perspective projection
        cam.perspective(parseFloat(f.elements["fovy"].value), 
                        1.0, // aspect
                        parseFloat(f.elements["znear"].value),
                        parseFloat(f.elements["zfar"].value)   );
        scene.draw();
        
    } else {

        // update camera - set up orthographic projection
        cam.orthographic(parseFloat(f.elements["left"].value),  parseFloat(f.elements["right"].value),
                         parseFloat(f.elements["bot"].value),   parseFloat(f.elements["top"].value),
                         parseFloat(f.elements["front"].value), parseFloat(f.elements["back"].value)  );
        scene.draw();
    }
  
}


