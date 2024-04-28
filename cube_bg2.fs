in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform sampler2D texture2;
uniform float time;
uniform float timeMultiplier;
uniform float invert;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
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
    


    float distPlane = point.z+3.;
    float distObjects = distPlane;
	float xAmount = 9.;
	float yAmount = 5.;
	float zAmount = 4.;
	float yPosMod=mod(time*timeMultiplier,1.0)*4.0;
	float xPosMod=mod(time*timeMultiplier*0.2,1.0)*4.0;
	for(float ix=0.;ix<xAmount;ix++)
	{
		for(float iy=0.;iy<yAmount;iy++)
		{
			for(float iz=0.;iz<yAmount;iz++)
			{
				distObjects=min(distObjects, Box(point, vec3(xPosMod+2.+-xAmount*2.+ix*4.,yPosMod-yAmount*2.+iy*4.,55.0+-15.*zAmount+iz*15.), vec3(0.6,0.6,0.6)));
			}
		} 
	}
	
    //distObjects = min(sphere1,distPlane);
	//distObjects = min (distObjects, sphere2);



    return distObjects;
}

float RayMarch(vec3 rayOrigin, vec3 rayDir)
{
    float distOrigin = 0.;
    int MAX_STEPS = 15;
    float MAX_DIST = 100.0;
    float SURFACE_DIST = 0.015;

    for(int i=0; i<MAX_STEPS;i++)
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
    vec2 e = vec2(.01,0);
    vec3 normal = dist - vec3(
        GetDist(point-e.xyy), //e.xyy = 0.1,0,0
        GetDist(point-e.yxy),
        GetDist(point-e.yyx)); 
        
    return normalize(normal);
}

float GetLight(vec3 point)
{
    vec3 lightPos = vec3 (0, 0, 0);
    
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
    vec3 col = vec3(0);
    
    vec3 rayOrigin = vec3(0, 0, 0);
    vec3 rayDirection = normalize(vec3(uv.x,uv.y,1));
    
    float dist = RayMarch(rayOrigin, rayDirection); 

    vec3 point = rayOrigin + rayDirection * dist;
    float diffuse = GetLight(point);
    
 
	
    col = vec3(abs(invert*.8-diffuse));

    fragColor = vec4(col,1.0);
}