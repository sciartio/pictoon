import {
	Vector2
} from 'three';

/**
 * Adjust Levels
 */

const hkLevelShader = {

	uniforms: {

		'u_image': { value: null },
		'u_pivot1': { value: new Vector2() },
		'u_pivot2': { value: new Vector2() },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
		uniform vec2 u_pivot1;
		uniform vec2 u_pivot2;
		
		varying vec2 vUv;
		
		void main () {

			vec4 c = texture2D(u_image, vUv);

			float g = (c.r + c.g + c.b) / 3.0; // average of RGB

			float x1 = u_pivot1.x, y1 = u_pivot1.y; // pivot1: (x1, y1) 
			float x2 = u_pivot2.x, y2 = u_pivot2.y; // pivot2: (x2, y2)

			if (g < x1) g = y1/x1 * g; // first leg
			else if (g < x2) g = (y2-y1)/(x2-x1) * (g - x1) + y1; // second leg
			else g = (1.0-y2)/(1.0-x2) * (g - x2) + y2; // third leg

			gl_FragColor = vec4(g, g, g, 1.0); // grayscale

		}`

};

export { hkLevelShader }; // named export

