import {
	Vector2
} from 'three';

/**
 * Hdog
 */

const hkHdogShader = {

	uniforms: {

		'u_adog': { value: null },
		'u_fdog': { value: null },
		
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_adog; 
		uniform sampler2D u_fdog; 
		
		varying vec2 vUv;

		void main() {     	        
			
			float adog = texture2D(u_adog, vUv).r; 
			float fdog = texture2D(u_fdog, vUv).r; 
			
			float g; 
			if (adog < fdog) g = adog; 			
			else g = fdog;  
			
			gl_FragColor = vec4(g, g, g, 1);    
		
		}`

};

export { hkHdogShader };


