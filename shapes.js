function makeCube(subdivisions) {
	vertexData = [];
	colorData = [];
	// increment (size) of each triangle
	subdivisions = subdivisions < 1 ? 1 : subdivisions;
	const increment = 1.0 / subdivisions;

	// front face
	for (let i = 0; i < subdivisions; i++) {
		const y_pos = i * increment - 0.5;
		const y_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const x_pos = j * increment - 0.5;
			const x_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(x_pos, y_pos, -0.5, x_pos_next, y_pos, -0.5, x_pos, y_pos_next, -0.5);
			addTriangle(x_pos_next, y_pos, -0.5, x_pos_next, y_pos_next, -0.5, x_pos, y_pos_next, -0.5);
		}
	}

	// back face
	for (let i = 0; i < subdivisions; i++) {
		const y_pos = i * increment - 0.5;
		const y_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const x_pos = j * increment - 0.5;
			const x_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(x_pos, y_pos, 0.5, x_pos_next, y_pos, 0.5, x_pos, y_pos_next, 0.5);
			addTriangle(x_pos_next, y_pos, 0.5, x_pos_next, y_pos_next, 0.5, x_pos, y_pos_next, 0.5);
		}
	}

	// left face
	for (let i = 0; i < subdivisions; i++) {
		const y_pos = i * increment - 0.5;
		const y_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const z_pos = j * increment - 0.5;
			const z_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(-0.5, y_pos, z_pos, -0.5, y_pos, z_pos_next, -0.5, y_pos_next, z_pos);
			addTriangle(-0.5, y_pos, z_pos_next, -0.5, y_pos_next, z_pos_next, -0.5, y_pos_next, z_pos);
		}
	}

	// right face
	for (let i = 0; i < subdivisions; i++) {
		const y_pos = i * increment - 0.5;
		const y_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const z_pos = j * increment - 0.5;
			const z_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(0.5, y_pos, z_pos, 0.5, y_pos, z_pos_next, 0.5, y_pos_next, z_pos);
			addTriangle(0.5, y_pos, z_pos_next, 0.5, y_pos_next, z_pos_next, 0.5, y_pos_next, z_pos);
		}
	}

	// top face
	for (let i = 0; i < subdivisions; i++) {
		const x_pos = i * increment - 0.5;
		const x_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const z_pos = j * increment - 0.5;
			const z_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(x_pos, 0.5, z_pos, x_pos_next, 0.5, z_pos, x_pos, 0.5, z_pos_next);
			addTriangle(x_pos_next, 0.5, z_pos, x_pos_next, 0.5, z_pos_next, x_pos, 0.5, z_pos_next);
		}
	}

	// bottom face
	for (let i = 0; i < subdivisions; i++) {
		const x_pos = i * increment - 0.5;
		const x_pos_next = (i + 1) * increment - 0.5;

		for (let j = 0; j < subdivisions; j++) {
			const z_pos = j * increment - 0.5;
			const z_pos_next = (j + 1) * increment - 0.5;

			// add two triangles for each square
			addTriangle(x_pos, -0.5, z_pos, x_pos_next, -0.5, z_pos, x_pos, -0.5, z_pos_next);
			addTriangle(x_pos_next, -0.5, z_pos, x_pos_next, -0.5, z_pos_next, x_pos, -0.5, z_pos_next);
		}
	}


}


function addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {


	var nverts = vertexData.length / 4;

	// push first vertex
	vertexData.push(x0);  bary.push (1.0);
	vertexData.push(y0);  bary.push (0.0);
	vertexData.push(z0);  bary.push (0.0);
	// vertexData.push(1.0);
	indices.push(nverts);
	nverts++;

	// push second vertex
	vertexData.push(x1); bary.push (0.0);
	vertexData.push(y1); bary.push (1.0);
	vertexData.push(z1); bary.push (0.0);
	// vertexData.push(1.0);
	indices.push(nverts);
	nverts++

	// push third vertex
	vertexData.push(x2); bary.push (0.0);
	vertexData.push(y2); bary.push (0.0);
	vertexData.push(z2); bary.push (1.0);
	// vertexData.push(1.0);
	indices.push(nverts);
	nverts++;

	randomColor();
	colorData.push(...randomColor());
	colorData.push(...randomColor());
	colorData.push(...randomColor());
	colorData.push(...randomColor());
	colorData.push(...randomColor());
	colorData.push(...randomColor());

}

function randomColor() {
	return [Math.random(), Math.random(), Math.random()];
}
