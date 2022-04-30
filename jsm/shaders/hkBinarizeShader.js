import {
	Vector2
} from 'three';

/**
 * Binarize image
 */

const hkBinarizeShader = {

	uniforms: {

		'u_image': { value: null },
		'u_thres': { value: 0.5 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
    	uniform float u_thres; // [0, 1]
		
		varying vec2 vUv;
		
		void main () {

			vec4 g = texture2D(u_image, vUv);
			float b = 0.0;
			if (g.r > u_thres) b = 1.0;

			gl_FragColor = vec4(b, b, b, 1.0);

		}`

};

export { hkBinarizeShader }; // named export
