in vec2 texCoord;
out vec4 fragColor;


vec3 glowsample(vec2 tc);
vec3 blur(vec2 tc, float offs);
vec3 highlights(vec3 pixel, float thres);
uniform float time;
uniform float multiplier;
uniform sampler2D texture0;
void main()
{
	vec2 tc = texCoord.xy;
	vec3 color = blur(tc, 0.02);
	vec4 oColor = texture2D(texture0, tc);
	vec4 bColor;
	
	 color += blur(tc, 0.004);
	 color += blur(tc, 0.006);
	 color += blur(tc, 0.008);
	 color /= 4.0;
	
	 color += glowsample(tc);

	float div_pos = 0.0;
	float divider = smoothstep(div_pos - 0.01, div_pos + 0.01, tc.x);
	
	bColor.rgb = mix(glowsample(tc), color, divider) * (divider * divider + (1.0 - divider) * (1.0 - divider));	
	bColor.a=0.0;
	bColor=clamp(bColor-oColor*1.1,0.0,1.0);
	oColor.a=1.0;
	fragColor = (bColor+oColor);
}

vec3 glowsample(vec2 tc)
{
	vec3 sampled=pow(texture2D(texture0, tc).xyz, vec3(2.2, 2.2, 2.2));
	return sampled;
}

vec3 hsample(vec2 tc)
{
	return highlights(glowsample(tc), 0.5);
}

vec3 blur(vec2 tc, float offs)
{
	vec4 xoffs = offs * vec4(-3.0, -2.0, 2.0, 2.0) * 0.521;
	vec4 yoffs = offs * vec4(-3.0, -2.0, 2.0, 2.0) * 0.521;
	

	vec3 color = vec3(0.0, 0.0, 0.0);
	color += hsample(tc + vec2(xoffs.x, yoffs.x)) * 0.1;
	color += hsample(tc + vec2(xoffs.y, yoffs.x)) * 0.1;
	color += hsample(tc + vec2(    0.0, yoffs.x)) * 0.1;
	color += hsample(tc + vec2(xoffs.z, yoffs.x)) * 0.1;
	color += hsample(tc + vec2(xoffs.w, yoffs.x)) * 0.1;
	
	color += hsample(tc + vec2(xoffs.x, yoffs.y)) * 0.1;
	color += hsample(tc + vec2(xoffs.y, yoffs.y)) * 0.1;
	color += hsample(tc + vec2(    0.0, yoffs.y)) * 0.1;
	color += hsample(tc + vec2(xoffs.z, yoffs.y)) * 0.1;
	color += hsample(tc + vec2(xoffs.w, yoffs.y)) * 0.1;
	
	color += hsample(tc + vec2(xoffs.x, 0.0)) * 0.1;
	color += hsample(tc + vec2(xoffs.y, 0.0)) * 0.1;
	color += hsample(tc + vec2(    0.0, 0.0)) *0.1;
	color += hsample(tc + vec2(xoffs.z, 0.0)) * 0.1;
	color += hsample(tc + vec2(xoffs.w, 0.0)) * 0.1;
	
	color += hsample(tc + vec2(xoffs.x, yoffs.z)) *0.1;
	color += hsample(tc + vec2(xoffs.y, yoffs.z)) * 0.1;
	color += hsample(tc + vec2(    0.0, yoffs.z)) * 0.1;
	color += hsample(tc + vec2(xoffs.z, yoffs.z)) * 0.1;
	color += hsample(tc + vec2(xoffs.w, yoffs.z)) * 0.1;
	
	color += hsample(tc + vec2(xoffs.x, yoffs.w)) * 0.1;
	color += hsample(tc + vec2(xoffs.y, yoffs.w)) * 0.1;
	color += hsample(tc + vec2(    0.0, yoffs.w)) * 0.1;
	color += hsample(tc + vec2(xoffs.z, yoffs.w)) * 0.1;
	color += hsample(tc + vec2(xoffs.w, yoffs.w)) * 0.1;



	return color*multiplier;
}

vec3 highlights(vec3 pixel, float thres)
{
	float val = (pixel.x + pixel.y + pixel.z) / 1.5;
	return pixel * smoothstep(thres - 0.5, thres + 0.5, val);
}