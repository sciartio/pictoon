import {
	Vector2
} from 'three';

/**
 * Structure Tensor
 */

const hkTensorShader = {

	uniforms: {

		'u_image': { value: null },
		'resolution': { value: new Vector2() },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform vec2 resolution;
		uniform sampler2D u_image;
		
		varying vec2 vUv;
			
		void main () {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			float x = vUv.x;
			float y = vUv.y;
			float dx = texel.x;
			float dy = texel.y;        
			
			vec4 u4 = (          
				-0.25 * texture2D(u_image, vec2(x-dx, y-dy)) +
				-0.5 * texture2D(u_image, vec2(x-dx, y)) +
				-0.25 * texture2D(u_image, vec2(x-dx, y+dy)) +
				+0.25 * texture2D(u_image, vec2(x+dx, y-dy)) +
				+0.5 * texture2D(u_image, vec2(x+dx, y)) +
				+0.25 * texture2D(u_image, vec2(x+dx, y+dy))		
			); // [-1, 1] because texture returns [0, 1]		   

			vec4 v4 = (		
				-0.25 * texture2D(u_image, vec2(x-dx, y-dy)) +
				-0.5 * texture2D(u_image, vec2(x,    y-dy)) +
				-0.25 * texture2D(u_image, vec2(x+dx, y-dy)) +
				+0.25 * texture2D(u_image, vec2(x-dx, y+dy)) +
				+0.5 * texture2D(u_image, vec2(x,    y+dy)) +
				+0.25 * texture2D(u_image, vec2(x+dx, y+dy))		
			); // [-1, 1] because texture returns [0, 1]		   
			
			vec3 u = u4.rgb; // [-1, 1]
			vec3 v = v4.rgb; // [-1, 1]	
			//vec3 u = u4.rgb / 4.0; // [-1, 1]
			//vec3 v = v4.rgb / 4.0; // [-1, 1]	

			vec3 g = vec3(dot(u, u), dot(v, v), dot(u, v)); // [-3, 3] each
			g /= 3.0; // [-1, 1] each
			
			//float mag = g.x*g.x + g.y*g.y + 2.0*g.z*g.z; // [0, 4]
			//mag /= 4.0; // normalize to [0, 1]	 

			float mag = 1.0; // [0, 4]
				
			g = (g + 1.0) / 2.0; // [0, 1]		

			gl_FragColor = vec4(g, mag);
		}`
};

export { hkTensorShader }; // named export
