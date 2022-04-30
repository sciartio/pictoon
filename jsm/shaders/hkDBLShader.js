import {
	Vector2
} from 'three';

/**
 * Directonal Bilateral
 */

const hkDBLShader = {

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

			vec2 p0 = vUv;

			vec2 v0 = texture2D(u_tangent, p0).xy; // vec4
			v0 = v0 * 2.0 - 1.0; // [-1, 1]

			v0 = vec2(-v0.y, v0.x); // rotate 90 degrees
			v0 = normalize(v0);

			float sigma = u_half; 
			float two_sigma_s = 2.0 * sigma * sigma;
			
			float sigma2 = u_range;
			float two_sigma_r = 2.0 * sigma2 * sigma2;
		
			vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
			float w_sum = 0.0;
			vec4 c = texture2D(u_image, p0); // vec4

			// center gauss
			for (float i = -sigma; i <= sigma; i += 1.0) {
				vec2 p = p0 + i * v0 * texel; // next position

				float w_s = exp(-i*i / two_sigma_s);
				vec4 c2 = texture2D(u_image, p);

				float r = distance(c.rgb, c2.rgb);
				float w_r = exp(-r*r / two_sigma_r);

				float weight = w_s * w_r;
				
				sum += weight * c2; // sum is float4
				w_sum += weight;
			}

			sum /= w_sum; // normalize weight
							
			gl_FragColor = vec4(sum.rgb, 1.0); 

		}`

};

export { hkDBLShader };

