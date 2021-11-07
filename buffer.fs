precision highp float;
uniform sampler2D audio;
uniform sampler2D backbuffer;
uniform vec2 resolution;

void main (void) {
    vec2 pos = gl_FragCoord.xy / resolution;
    float prevVal = texture2D(backbuffer, pos).b / .25;

    float wave = texture2D(audio, vec2(pos.x, 0.)).r;
    float d = abs(pos.y - wave);
    float newVal = clamp(pow(1. - d, 50.), 0., 1.);

    vec4 color = vec4(1., .5, .25, 1.);
    float value = newVal * 1.5 + prevVal * .9;
    gl_FragColor = clamp(value * color, 0., 1.);
}
