import {
	Vector2
} from 'three';

/**
 * Convert color image to color image
 */

const hkRenderShader = {

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

			gl_FragColor = c;

		}`

};

export { hkRenderShader }; // named export
