import {
	Vector2
} from 'three';

/**
 * Convert color image to grayscale image
 */

const hkGrayShader = {

	uniforms: {

		'u_image': { value: null },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
		
		varying vec2 vUv;
		
		void main () {

			vec4 c = texture2D(u_image, vUv);

			float g = (c.r + c.g + c.b) / 3.0; // grayscale

			gl_FragColor = vec4(g, g, g, 1.0);

		}`

};

export { hkGrayShader }; // named export
