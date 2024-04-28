
in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform float time;
uniform vec4 color;

void main()
{
vec4 colors;
 
    vec2 xy = texCoord.xy;

	xy.x+=0.1*sin(1.0*time);
	xy.y+=0.1*cos(1.0*time);
     vec4 color2=texture(texture0,xy);

	

	fragColor=color2;
	  
 
}