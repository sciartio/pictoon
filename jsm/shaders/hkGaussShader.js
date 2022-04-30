import {
	Vector2
} from 'three';

/**
 * Gaussian Blur
 */

const hkGaussShader = {

	uniforms: {

		'u_image': { value: null },
		'resolution': { value: new Vector2() },
		'u_half': { value: 3.0 },

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
		uniform float u_half; // spatial kernel half width
		
		varying vec2 vUv;
			
		void main () {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			float x = vUv.x;
			float y = vUv.y;
			float dx = texel.x;
			float dy = texel.y;        

			float sigma = u_half; 
			float twoSigma2 = 2.0 * sigma * sigma;
			vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
			float w_sum = 0.0;
				
			for (float j = -u_half; j <= u_half; j+=1.0) {	
				for (float i = -u_half; i <= u_half; i+=1.0) {	
					float d = distance(vec2(0.0), vec2(i, j));
					if (d > u_half) continue;		
					float weight = exp(-d * d / twoSigma2);
					vec4 st = texture2D(u_image, vec2(x+dx*i, y+dy*j));
					sum += weight * st; // sum is float4
					w_sum += weight;
				}
			}		
			
			sum /= w_sum; // normalize weight
							
			gl_FragColor = sum;		
			
		}`
};

export { hkGaussShader };
