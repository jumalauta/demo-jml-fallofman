
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float upfadeval;
uniform float downfadeval;
uniform vec4 color;
uniform float time;

void main()
{
vec4 colors;
 
    vec2 xy = texCoord.xy;
    vec4 color2=texture(texture0,xy);
	
	float upfade = (1.0/xy.y)*upfadeval;
	upfade=1.0-min(upfade,1.0);
	
	float downfade = (1.0/(1.0-xy.y))*downfadeval;
	downfade=1.0-min(downfade,1.0);

	
	color2.a -= downfade;
	color2.a -= upfade;

	fragColor=color2;
	  
 
}