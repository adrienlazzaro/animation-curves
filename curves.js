function polyOut(t, b, c, d){
	/*
	
	t is current time of the animation
	b is beginning value of property to animate
	c is difference between the end and beginning values of the property to animate
	d is the total duration of the animation
	
	*/
	
	// for t5 polynomial equation
	var ts = (t/=d) * t;	
	var tc = ts * t 
	
	var coef1 = 9.6475		// coefficient for t
	var coef2 = -32.99		// coefficient for t^2
	var coef3 = 51.18		// coefficient for t^3
	var coef4 = -36.985		// coefficient for t^4
	var coef5 = 10.1475		// coefficient for t^5

	// return new property value for new time		
	return b + c * (coef5*tc*ts + coef4*ts*ts + coef3*tc + coef2*ts + coef1*t);
	
}

function curve(t, k, m, p){
	
	/*
	
	This easing function replicates the behavior of a spring-mass-damper system
	
	|                 |---> x
	|       k      ______
	|---/\/\/\/\---|    |
	|              |  m |
	|------[-------|____|
	|      p
	|
	
	
	k is the spring constant
	m is the object mass
	p is the damping ratio
	
	The free moving system is described by the following differential equation
	d2x/dt2 + 2 p w dx/dt + w^2 x = 0;
	
	where
	w = sqrt(k/m)

	Applying a Laplace transform, the solution to the equation:
	x(t) = C1 * exp( [-p w + w sqrt(p^2 -1)]*t ) + C2 * exp( [-p w - w sqrt(p^2 -1)]*t )
	
	with initial conditions
	x(0) = a 
	dx/dt = b

	
	When p > 1, the system is overdamped and does not oscillate. The solution is
	C1 = a + [ b + a ( p w - w sqrt(p^2-1) ) ] / [ 2 w sqrt(p^2 - 1) ]
	C2 = [ -b - a ( p w - w sqrt(p^2-1) ) ] / [ 2 w sqrt(p^2 - 1) ]


	When p = 1, the system is critically damped and returns to its equilibrium faster
	C1 = a
	C2 = b + w a
	
	x(t) = a exp(-w t) + (b + w a) * t * exp(-w t)
	
	
	When p < 1, the system is under damped and oscillates.
	x(t) = A exp(-p w t) sin(w t + phi)
	
	where
	phi = arctan [ (w a) / (b + p w a) ]
	A = a / sin(phi)
	
	
	Since we want slight bounce behavior, p needs to be between 0 and 1 - larger dampin ratio equates to the less oscillation
	
	*/
	
	if( p >= 1 || p < 0 ) return;
	
	//var t = 5		//current time
	var a = 1 		//initial x location of the mass
	var b = 0.25	//initial velocity of mass on release
	
	var w = Math.sqrt(k/m);
	var phi = Math.atan( (w * a) / (b + p * w * a) );
	var A = a / Math.sin(phi);
	
	return A * Math.exp(-p * w * t) * Math.sin(w * t + phi);
	
}



function animate(e, o, props){

	var t = 3;					//animation duration
	var fps = 12;				//sampling rate
	var totalKeyframes = t*fps;	//total keyframes

	//property to animate
	var property = window.getComputedStyle(o,null).getPropertyValue('left');
	property = parseInt(property.substring(0, property.indexOf('p')));
	var duration = props.left - property;
	var percentage;
	var position;
	
	//generate the css for the animation keyframes
	var css = "#" + o.id + ".animate { -webkit-animation-name:move; -webkit-animation-duration: 2s; -webkit-animation-timing-function: ease; -webkit-animation-iteration-count: 1; -webkit-animation-direction: normal; -webkit-animation-delay: 0; -webkit-animation-play-state: running; -webkit-animation-fill-mode: forwards;} "
	var keyframesCSS = "@-webkit-keyframes move { ";
	
	//generate each keyframe
	for(var i = 0; i <= totalKeyframes; i++){
		
		//keyframe percentage
		percentage = Math.floor( i / totalKeyframes * 100 );
		
		//new property value at given time i
		position = property + ( 1 - curve(i, props.curve.k, props.curve.m, props.curve.p) ) * duration ;
		position = Math.round(position);
		
		keyframesCSS += percentage + '% { left: ' + position + 'px; } ';
		
	}
 
	keyframesCSS += '}';
	
	css += keyframesCSS;

	console.log(keyframesCSS);

	//Add stylesheet to head
	var style = document.createElement("style");
	style.innerHTML = css;
	document.head.appendChild(style);
	
	//Start animation
	box.className = 'animate';
}



function clear(e, o, prop){
	if (e.type == 'webkitAnimationEnd') {
		box.className = '';		
	}
}



window.onload = function (){
	
	var move = {
		left: 200,
		curve: {k:1, m:5, p:0.6}
	}
	
	var box = document.getElementById('box');
	box.addEventListener('click', function(e){animate(e, box, move)}, false);
	box.addEventListener('webkitAnimationEnd', clear, false);

}

