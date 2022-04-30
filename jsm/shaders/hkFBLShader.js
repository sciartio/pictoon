import {
	Vector2
} from 'three';

/**
 * FBL (flow bilateral)
 */

const hkFBLShader = {

	uniforms: {

		'u_image': { value: null },
		'u_tangent': { value: null },
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

		uniform vec2 resolution;
		uniform sampler2D u_image; // white noise
		uniform sampler2D u_tangent; // tangent 
		uniform float u_half; // spatial kernel half width
		uniform float u_range; // range kernel half width
		
		varying vec2 vUv;
			
		void main () {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			float dx = texel.x;
			float dy = texel.y;
			
			float sigma = u_half; 
			float two_sigma_s = 2.0 * sigma * sigma;
			
			float sigma2 = u_range;
			float two_sigma_r = 2.0 * sigma2 * sigma2;

			const float step = 1.0;

			vec2 p0 = vUv;

			float u = 0.0;
			vec4 sum4 = vec4(0.0); // (0.0, 0.0, 0.0, 0.0)
			float w_sum = 0.0;

			vec4 c = texture2D(u_image, p0);
			sum4 += c; // sum4 is vec4
			w_sum += 1.0;

			vec2 v0 = texture2D(u_tangent, p0).xy; // vec4
			v0 = v0 * 2.0 - 1.0; // [-1, 1]

			float sign = -1.0;    		    
			for (int i = 0; i < 2; i++) { // do it twice

				vec2 v = v0 * sign; // tangent vector direction						
				vec2 p = p0 + step * v * texel; // next position			

				for (float u = step; u <= sigma * 2.0; u += step) {					
					
					float w_s = exp(-u*u / two_sigma_s);
					vec4 c2 = texture2D(u_image, p); // vec4

					float r = distance(c.rgb, c2.rgb);
					float w_r = exp(-r*r / two_sigma_r);

					float weight = w_s * w_r;
					
					sum4 += weight * c2; // sum is float4
					w_sum += weight;
					
					vec2 t = texture2D(u_tangent, p).xy; // vec4
					t = t * 2.0 - 1.0; // [-1, 1]

					float vt = dot(v, t); // check if over 90 degrees
					if (vt < 0.0) t = -t; // flip it if bigger than 90 degree turn

					v = t; // update v direction				
					p += step * t * texel; // update position				
				}		
				sign *= -1.0; // reverse direction
			}		
			sum4 /= w_sum; // normalize weight
			
			gl_FragColor = sum4;		
			
		}`

};

export { hkFBLShader };
