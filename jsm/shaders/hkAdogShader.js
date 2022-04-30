import {
	Vector2
} from 'three';

/**
 * Adog
 */

const hkAdogShader = {

	uniforms: {

		'u_image': { value: null },
		'u_inner': { value: null },
		'u_outer': { value: null },
		'u_scale': { value: 3.0 },
		'u_base': { value: 3.0 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image; // white noise
		uniform sampler2D u_inner; // inner gaussian
		uniform sampler2D u_outer; // outer gaussian
		uniform float u_scale; // scale value
		uniform float u_base; // base of tau
			
		varying vec2 vUv;

		void main() {     	        
		
			float inner = texture2D(u_inner, vUv).r; 
			float outer = texture2D(u_outer, vUv).r; 
			
			//float scale = 1.0; // 2.0 default
			//float scale = 2.0; // 2.0 default
			//float scale = 3.0; // 2.0 default
			float scale = u_scale; // supplied by javascript			
			//float darkness = 1.0 - texture2D(u_image, vUv).r; // gray src image
			//darkness = tanh( darkness * scale ); // [0, scale] where 0 means white and scale means dark			
			//float tau = u_base + (1.0 - u_base) * darkness; // ranges in [base, 1.0]
			
			float tau = u_base + (1.0 - u_base) * (1.0 - tanh(scale * texture2D(u_image, vUv).r)); 
			//float tau = 1.0;
			float dog = inner - tau * outer; // [-1, 1]
			
			float g; 
			if (dog > 0.0) g = 1.0; 			
			else g = tanh(dog) + 1.0; // [0, 1] 
			//else g = tanh(dog * 100.0) + 1.0;
	
			gl_FragColor = vec4(g, g, g, 1);    
		
		}`

};

export { hkAdogShader };

