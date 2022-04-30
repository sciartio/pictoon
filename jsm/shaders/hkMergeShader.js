import {
	Vector2
} from 'three';

/**
 * Merge
 */

const hkMergeShader = {

	uniforms: {

		'u_src1': { value: null },
		'u_src2': { value: null },
		'u_light_mode': { value: true },
		
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_src1; 
		uniform sampler2D u_src2; 
		uniform bool u_light_mode; 
		
		varying vec2 vUv;

		void main() {     	        
			
			float src1 = texture2D(u_src1, vUv).r; 
			float src2 = texture2D(u_src2, vUv).r; 
			
			float g; 
			if (u_light_mode) {
				if (src1 < src2) g = src1; 			
				else g = src2;  
			}
			else {
				if (src1 > src2) g = src1; 			
				else g = src2;  
			}
			
			gl_FragColor = vec4(g, g, g, 1);    
		
		}`

};

export { hkMergeShader };


