import {
	Vector2
} from 'three';

/**
 * Quantization
 */

const hkQuantShader = {

	uniforms: {

		'u_image': { value: null },
		'u_bits': { value: 4.0 },
		
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D u_image; 
		uniform float u_bits;
		
		varying vec2 vUv;

		vec3 rgb2hsv(vec3 c) {
			vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
			vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
			vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
		
			float d = q.x - min(q.w, q.y);
			float e = 1.0e-10;
			return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
		}
		
		vec3 hsv2rgb(vec3 c) {
			vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
			vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
			return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
		}

		void main() {     	        
			
			vec4 c = texture2D(u_image, vUv); 

			vec3 hsv = rgb2hsv(c.rgb);
			float g = hsv.z; // luminance

			// float g = (c.r + c.g + c.b) / 3.0; // average of RGB
			// const float u_bits = 1.0; // number of bits to use

			// shift-right by (8-bits) bits
			float q = (g*255.0) / pow(2.0, 8.0-u_bits); 
			g = floor(q) / pow(2.0, u_bits); // normalize to [0.0, 1.0)
			
			// scale to fit [0.0, 1.0]
			g *= pow(2.0, u_bits) / (pow(2.0, u_bits)-1.0); 

			vec3 rgb = hsv2rgb(vec3(hsv.xy, g));
			// vec3 rgb = hsv2rgb(hsv);

			gl_FragColor = vec4(rgb, 1.0); // quantized color
			// gl_FragColor = vec4(g, g, g, 1.0); // quantized gray
			
		}`

};

export { hkQuantShader };


