import {
	Vector2
} from 'three';

/**
 * Add noise to image
 */

const hkAddNoiseShader = {

	uniforms: {

		'u_image': { value: null },
		'u_scale': { value: 4.0 },
		
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image;
		uniform float u_scale; 
		
		varying vec2 vUv;
		
		float random(vec2 coord) {
			return fract(sin(dot(coord.xy, vec2(12.9898,78.233))) * 43758.5453123);
		}

		void main () {

			float g = texture(u_image, vUv).r;

			float scale = u_scale; // supplied by javascript			
			
			float range = 1.0 - tanh(scale * g); 
			//range *= 0.1; // [0, 0.01]

			float noise = random(vUv); // [0, 1]
			noise = noise * 2.0 - 1.0; // [-1, 1]
			noise = noise * range; // [-0.01, 0.01]
			
			g = clamp(g + noise, 0.0, 1.0);

			gl_FragColor = vec4(g, g, g, 1.0);  

		}`

};

export { hkAddNoiseShader };