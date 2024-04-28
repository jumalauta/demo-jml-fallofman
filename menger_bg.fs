in vec2 texCoord;
out vec4 fragColor;

uniform sampler2D texture0;
uniform sampler2D texture2;
uniform float time;

uniform float timeMultiplier;
uniform float invert;
uniform float rotation;
uniform float rotation2;
uniform float rotation3;
uniform float speed;
uniform float MAX_STEPS;
uniform float mengerdivisor;


mat2 Rot(float angle)
{
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, -s, s, c);
}
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float Cross(vec3 point)
{
	point = abs(point);
	vec3 d = vec3(max(point.x, point.y),
				  max(point.y, point.z),
				  max(point.z, point.x));
	return min(d.x, min(d.y, d.z)) - (1.0/mengerdivisor);
}

float CrossRep(vec3 point)
{
	vec3 q = mod(point + 1.0, 2.1) - 1.0;
	return Cross(q);
}
float CrossRepScale(vec3 point, float scale)
{
	return CrossRep(point * scale) / scale;
}

float Sphere(vec3 point, vec3 pos, float scale)
{ 
	return length(point - pos)-scale;
}

float Box(vec3 xyz, vec3 point, vec3 scale)
{
	return length(max(abs(point-xyz)-scale,-0.21));
}
float GetDist(vec3 point)
{
    float distPlane = -0.05;
    float distObjects = distPlane;

	
	float scale = 0.50;
	for(int i=0;i<6;i++)
	{
		distObjects = max(distObjects, -CrossRepScale(point, scale));
		scale *=1.5;
	}
	/*
	for(int ix=0;ix<xAmount;ix++)
	{
		for(int iy=0;iy<yAmount;iy++)
		{
			for(int iz=0;iz<yAmount;iz++)
			{
				distObjects=min(distObjects, Box(point, vec3(xPosMod+2.+-xAmount*2.+ix*4.,yPosMod-yAmount*2.+iy*4.,55.0+-15.*zAmount+iz*15.), vec3(0.6,0.6,0.6)));
			}
		} 
	}
	*/
	

    //distObjects = min(sphere1,distPlane);
	//distObjects = min (distObjects, sphere2);



    return distObjects;
}

float RayMarch(vec3 rayOrigin, vec3 rayDir)
{
    float distOrigin = 0.;
	float MAX_DIST = 100.0;
	float SURFACE_DIST = 0.000015;

    for(float i=0.; i<MAX_STEPS;i++)
    {
        vec3 pointOnRay = rayOrigin+rayDir*distOrigin;
        float distScene = GetDist(pointOnRay);
        distOrigin += distScene;
        if(distScene<SURFACE_DIST || distOrigin>MAX_DIST) break;
    }
    
    return distOrigin;
}

vec3 GetNormal(vec3 point)
{
    float dist = GetDist(point);
    vec2 e = vec2(.01,0.);
    vec3 normal = dist - vec3(
        GetDist(point-e.xyy), //e.xyy = 0.1,0,0
        GetDist(point-e.yxy),
        GetDist(point-e.yyx)); 
        
    return normalize(normal);
}

float GetLight(vec3 point)
{
    vec3 lightPos = vec3 (0., 0., 15.0-speed);
    
    //lightPos.xz+=vec2(sin(time),cos(time))*11.;
    vec3 light = normalize(lightPos-point);
    vec3 normal = GetNormal(point);
    
    float diffuse = clamp(dot(normal, light),0.,1.);
    

    return diffuse;
}



 
void main()
{
	vec2 uv = vec2(texCoord.x-.5,texCoord.y-.5);
	uv.y/=1.77777777778;

    //vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(0.);
    
    vec3 rayOrigin = vec3(0., 1.0 ,0.0);
	rayOrigin= vec3(0.0,0.0,-speed);
	

	
    vec3 rayDirection = normalize(vec3(uv.x,0.2,uv.y));
	
	if(rotation != 0.0 || rotation2 != 0.0)
	{
		rayDirection.xy *= Rot(rotation*3.14);
		rayDirection.yz *= Rot(rotation2*3.14);
		rayDirection.xz *= Rot(rotation3*3.14);
	}
    float dist = RayMarch(rayOrigin, rayDirection); 

    vec3 point = rayOrigin + rayDirection * dist;
    float diffuse = GetLight(point);
    
 
	
    col = vec3(abs(invert-diffuse));

    fragColor = vec4(col,1.0);
}