let cameraPosition = [0,0, -5];
let cameraRotation = [0, 0, 0]; // rotation in degrees
let vertexData = [];
let colorData = [];
let indices = [];
let bary = [];
let CURRENT_SHAPE = "CUBE";
let subdivisions1 = 1;
let subdivisions2 = 1;

let image;
let gl;
let canvas;
let brickTexture;
let thirdTexture;

let textureLoaded = false;



const cube2Data = [
    // Front
    2.5, 0.5, 0.5, // top right
    2.5, -.5, 0.5, // bottom right
    1.5, 0.5, 0.5, // top left
    1.5, 0.5, 0.5, // top left
    2.5, -.5, 0.5, // bottom right
    1.5, -.5, 0.5, // bottom left

    // Left
    1.5, 0.5, 0.5,
    1.5, -.5, 0.5,
    1.5, 0.5, -.5,
    1.5, 0.5, -.5,
    1.5, -.5, 0.5,
    1.5, -.5, -.5,

    // Back
    1.5, 0.5, -.5,
    1.5, -.5, -.5,
    2.5, 0.5, -.5,
    2.5, 0.5, -.5,
    1.5, -.5, -.5,
    2.5, -.5, -.5,

    // Right
    2.5, 0.5, -.5,
    2.5, -.5, -.5,
    2.5, 0.5, 0.5,
    2.5, 0.5, 0.5,
    2.5, -.5, 0.5,
    2.5, -.5, -.5,

    // Top
    2.5, 0.5, 0.5,
    2.5, 0.5, -.5,
    1.5, 0.5, 0.5,
    1.5, 0.5, 0.5,
    2.5, 0.5, -.5,
    1.5, 0.5, -.5,

    // Underside
    2.5, -.5, 0.5,
    2.5, -.5, -.5,
    1.5, -.5, 0.5,
    1.5, -.5, 0.5,
    2.5, -.5, -.5,
    1.5, -.5, -.5,
];

const cube3Data = [
    // Front
    -0.5, 0.5, 0.5, // top right
    -0.5, -.5, 0.5, // bottom right
    -1.5, 0.5, 0.5, // top left
    -1.5, 0.5, 0.5, // top left
    -0.5, -.5, 0.5, // bottom right
    -1.5, -.5, 0.5, // bottom left

    // Left
    -1.5, 0.5, 0.5,
    -1.5, -.5, 0.5,
    -1.5, 0.5, -.5,
    -1.5, 0.5, -.5,
    -1.5, -.5, 0.5,
    -1.5, -.5, -.5,

    // Back
    -1.5, 0.5, -.5,
    -1.5, -.5, -.5,
    -0.5, 0.5, -.5,
    -0.5, 0.5, -.5,
    -1.5, -.5, -.5,
    -0.5, -.5, -.5,

    // Right
    -0.5, 0.5, -.5,
    -0.5, -.5, -.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -.5, 0.5,
    -0.5, -.5, -.5,

    // Top
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -.5,
    -1.5, 0.5, 0.5,
    -1.5, 0.5, 0.5,
    -0.5, 0.5, -.5,
    -1.5, 0.5, -.5,

    // Underside
    -0.5, -.5, 0.5,
    -0.5, -.5, -.5,
    -1.5, -.5, 0.5,
    -1.5, -.5, 0.5,
    -0.5, -.5, -.5,
    -1.5, -.5, -.5,
];


function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}

const uvData = repeat(6, [
    1, 0, // top right
    1, 1, // bottom right
    0, 0, // top left
    0, 0, // top left
    1, 1, // bottom right
    0, 1  // bottom left
]);


function draw(gl, canvas, brickTexture) {

    const mat4 = glMatrix.mat4;


    const brickFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(brickFragmentShader, `
    precision mediump float;
    varying vec2 vUV;
    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, vUV);
    }
`);
    gl.compileShader(brickFragmentShader);

    const brickVertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(brickVertexShader, `
    attribute vec3 vertexPosition;
    attribute vec2 uv;
    varying vec2 vUV;

    uniform mat4 matrix;

    void main() {
        vUV = uv;
        gl_Position = matrix * vec4(vertexPosition, 1.0);
    }
`);
    gl.compileShader(brickVertexShader);

    const brickProgram = gl.createProgram();
    gl.attachShader(brickProgram, brickVertexShader);
    gl.attachShader(brickProgram, brickFragmentShader);
    gl.linkProgram(brickProgram);

    const cube2Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube2Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube2Data), gl.STATIC_DRAW);




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

    gl.useProgram(brickProgram);
    const secondPositionLocation = gl.getAttribLocation(brickProgram, 'vertexPosition');
    gl.enableVertexAttribArray(secondPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube2Buffer);
    gl.vertexAttribPointer(secondPositionLocation, 3, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

    const uvLocation = gl.getAttribLocation(brickProgram, 'uv');
    gl.enableVertexAttribArray(uvLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    const textureLocation = gl.getUniformLocation(brickProgram, 'uTexture');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, brickTexture);
    gl.uniform1i(textureLocation, 0);

    const matrixLocation = gl.getUniformLocation(brickProgram, 'matrix');
    gl.uniformMatrix4fv(matrixLocation, false, mvpMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, cube2Data.length / 3);

    console.log("draw called", gl.getError());

}

function loadTexture(url, gl) {
    const texture = gl.createTexture();


    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    console.log('Image width:', image.width);
    console.log('Image height:', image.height);


    return texture;
}

function init() {

    // Retrieve the canvas
     canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
        console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
        return null;
    }

    gl = canvas.getContext('webgl2');
	console.log("init called");
	// animate();
	window.addEventListener('keydown', gotKey ,false);

	makeCube(subdivisions1);


    brickTexture = loadTexture('brick.jpg', gl);
	draw(gl, canvas, brickTexture);

}

function calculateCameraDistanceFromOrigin() {
	let dx = cameraPosition[0] - 0;
	let dy = cameraPosition[1] - 0;
	let dz = cameraPosition[2] - 0;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
