import {
	Vector2
} from 'three';

/**
 * Dirdog
 */

const hkDirdogShader = {

	uniforms: {

		'u_image': { value: null },
		'u_tangent': { value: null },
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
		uniform sampler2D u_image; // white noise
		uniform sampler2D u_tangent; // tangent 
		uniform float u_half; // spatial kernel half width
		
		varying vec2 vUv;
			
		void main () {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			vec2 p0 = vUv;

			//float u = 0.0;

			vec4 c = texture2D(u_image, p0); // vec4

			vec2 v0 = texture2D(u_tangent, p0).xy; // vec4
			v0 = v0 * 2.0 - 1.0; // [-1, 1]

			v0 = vec2(-v0.y, v0.x); // rotate 90 degrees
			v0 = normalize(v0);

			float sigma = u_half; // in fact should be uniform variable 
			float twoSigma2 = 2.0 * sigma * sigma;
			float inner = 0.0;
			float w_sum = 0.0;

			// center gauss
			for (float i = -sigma; i <= sigma; i += 1.0) {
				vec2 p = p0 + i * v0 * texel; // next position

				float weight = exp(-i * i / twoSigma2);
				vec4 c = texture2D(u_image, p); // float4	
				float g = (c.r + c.g + c.b) / 3.0; // color to gray
				inner += weight * g;
				w_sum += weight;
			}

			inner /= w_sum; // normalize weight

			sigma = sigma * 1.6;
			twoSigma2 = 2.0 * sigma * sigma;
			float outer = 0.0;
			w_sum = 0.0;

			// surround gauss
			for (float j = -sigma; j <= sigma; j += 1.0) {
				vec2 p = p0 + j * v0 * texel; // next position

				float weight = exp(-j * j / twoSigma2);
				vec4 c = texture2D(u_image, p); // float4	
				float g = (c.r + c.g + c.b) / 3.0; // color to gray
				outer += weight * g;
				w_sum += weight;
			}

			outer /= w_sum; // normalize weight

			//float tau = 0.99; // noise sensitivity
			float tau = 1.0; // noise sensitivity

			float dog = inner - tau * outer; // [-1, 1]
			
			dog = (dog + 1.0) / 2.0; // [0, 1]

			gl_FragColor = vec4(dog, dog, dog, 1.0);

		}`

};

export { hkDirdogShader };

