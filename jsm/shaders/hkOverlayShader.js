import {
	Vector2
} from 'three';

/**
 * Overlay
 */

const hkOverlayShader = {

	uniforms: {

		'u_src': { value: null },
		'u_overlay': { value: null },
		
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_src; 
		uniform sampler2D u_overlay; 
		
		varying vec2 vUv;

		void main() {     	        
			
			vec4 src = texture2D(u_src, vUv); 
			vec4 overlay = texture2D(u_overlay, vUv); 
			
			vec4 cout = src;
			if (overlay.r < 0.5) cout = overlay; // overlay is black
			
			gl_FragColor = cout;    
		
		}`

};

export { hkOverlayShader };


