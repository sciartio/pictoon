import {
	Vector2
} from 'three';

/**
 * Adjust Levels
 */

const hkLevelShader = {

	uniforms: {

		'u_image': { value: null },
		'u_lower': { value: 0.0 },
		'u_upper': { value: 1.0 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
		uniform float u_lower;
		uniform float u_upper;
		
		varying vec2 vUv;
		
		void main () {

			vec4 c = texture2D(u_image, vUv);

			float g = (c.r + c.g + c.b) / 3.0; // average of RGB

			g = smoothstep(u_lower, u_upper, g);
			gl_FragColor = vec4(g, g, g, 1.0); // grayscale

		}`

};

export { hkLevelShader }; // named export

