import {
	Vector2
} from 'three';

/**
 * Bilateral filter
 */

const hkBilateralShader = {

	uniforms: {

		'u_image': { value: null },
		'resolution': { value: new Vector2() },
		'u_half': { value: 3.0 },
		'u_range': { value: 0.3 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		// uniform vec2 u_texel; 
		uniform vec2 resolution;
		// uniform sampler2D u_image;
		uniform sampler2D u_image;
		uniform float u_half; // spatial kernel half width
		uniform float u_range; // range kernel half width
		
		varying vec2 vUv;
			
		void main () {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			float x = vUv.x;
			float y = vUv.y;
			float dx = texel.x;
			float dy = texel.y;        

			float sigma = u_half; 
			float two_sigma_s = 2.0 * sigma * sigma;
			
			float sigma2 = u_range;
			float two_sigma_r = 2.0 * sigma2 * sigma2;
		
			vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
			float w_sum = 0.0;
			vec4 c = texture2D(u_image, vec2(x, y));

			for (float j = -u_half; j <= u_half; j+=1.0) {	
				for (float i = -u_half; i <= u_half; i+=1.0) {	

					float d = distance(vec2(0.0), vec2(i, j));
					if (d > u_half) continue;	
						
					float w_s = exp(-d*d / two_sigma_s);
					vec4 c2 = texture2D(u_image, vec2(x+dx*i, y+dy*j));

					float r = distance(c.rgb, c2.rgb);
					float w_r = exp(-r*r / two_sigma_r);

					float weight = w_s * w_r;
					
					sum += weight * c2; // sum is float4
					w_sum += weight;
				}
			}		
			
			sum /= w_sum; // normalize weight
							
			gl_FragColor = vec4(sum.rgb, 1.0); 
		}`

};

export { hkBilateralShader };

