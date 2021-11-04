precision highp float;
uniform sampler2D texture;
uniform vec2 resolution;

void main (void) {
    vec2 pos = gl_FragCoord.xy / resolution;
    float value = texture2D(texture, vec2(pos.x, 0.)).r;
    float d = distance(pos, vec2(pos.x, value));
    gl_FragColor = vec4(mix(vec3(0.), vec3(1., .5, 0.), pow(1. - d, 20.)), 1.);
}
