let cameraPosition = [0,0, -5];
let cameraRotation = [0, 0, 0]; // rotation in degrees
let vertexData = [];
let colorData = [];
let indices = [];
let bary = [];
let CURRENT_SHAPE = "CUBE";
let subdivisions1 = 1;
let subdivisions2 = 1;



function draw() {
	// Retrieve the canvas
	const canvas = document.getElementById('webgl-canvas');
	if (!canvas) {
		console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
		return null;
	}

	const mat4 = glMatrix.mat4;
	const gl = canvas.getContext('webgl2');




	// const colorData = [
	// 	1, 0, 0,
	// 	0, 1, 0,
	// 	0, 0, 1
	// ]




	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, `
		attribute vec3 vertexPosition;
		attribute vec3 vertexColor;
		varying vec3 vColor;
		
		uniform mat4 matrix;
		
		void main() {
			vColor = vertexColor;
			gl_Position = matrix * vec4(vertexPosition, 1.0);
			gl_PointSize = 10.0;
		}
		`
	);

	gl.compileShader(vertexShader);

	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('Error compiling vertex shader:', gl.getShaderInfoLog(vertexShader));
		return;
	}

	const fragmentShader = gl.createShader( gl.FRAGMENT_SHADER);

	gl.shaderSource(fragmentShader, `
		precision mediump float;
		varying vec3 vColor;
			
		void main() {
			gl_FragColor = vec4(vColor, 1.0);
		}
		`
	);

	gl.compileShader(fragmentShader);

	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('Error compiling fragment shader:', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	// Check if program linking was successful
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Error linking program:', gl.getProgramInfoLog(program));
		return;
	}

	const positionLocation = gl.getAttribLocation(program, 'vertexPosition');
	gl.enableVertexAttribArray(positionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

	const colorLocation = gl.getAttribLocation(program, 'vertexColor');
	gl.enableVertexAttribArray(colorLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

	gl.useProgram(program);
	gl.enable(gl.DEPTH_TEST)

	//uniform Location Binding
	const uniformLocations = {
		matrix: gl.getUniformLocation(program, 'matrix'),
	};

	//Moving our model
	const modelMatrix = mat4.create();
	mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);

	// Simulate a camera
	const viewMatrix = mat4.create();
	mat4.identity(viewMatrix);
	mat4.translate(viewMatrix, viewMatrix, cameraPosition);
	mat4.rotateX(viewMatrix, viewMatrix, glMatrix.glMatrix.toRadian(cameraRotation[0]));
	mat4.rotateY(viewMatrix, viewMatrix, glMatrix.glMatrix.toRadian(cameraRotation[1]));
	// mat4.invert(viewMatrix, viewMatrix);

	//Apply perspective to our model
	const projectionMatrix = mat4.create();
	//vertical fov (angle in radians), aspect W/H, near cull distance, far cull distance
	mat4.perspective(projectionMatrix,75 * Math.PI / 180, canvas.width / canvas.height, 1e-4, 1e4);

	const mvpMatrix = mat4.create();
	//intermediate for multiplication
	const mvMatrix = mat4.create();
	// function animate() {
	// 	requestAnimationFrame(animate);
	// 	// mat4.rotateZ(matrix, matrix, Math.PI / 2 / 70);
	// 	mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 2 / 70);
	//
	//
	//
	// 	//set the uniformAttribute matrix, with the value of our transposed matrix
	// }

	// Recalculate the mvpMatrix and update the uniform location
	mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
	// P * ModelMatrix
	mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);

	gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);

	gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

}

function init() {
	console.log("init called");
	// animate();
	window.addEventListener('keydown', gotKey ,false);

	makeCube(subdivisions1);
	draw();

}

function calculateCameraDistanceFromOrigin() {
	let dx = cameraPosition[0] - 0;
	let dy = cameraPosition[1] - 0;
	let dz = cameraPosition[2] - 0;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
