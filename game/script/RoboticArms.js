var arm1 = (function() {
	// Environmental variables
	var backContext;
	var imgArm1;
	var env;

	// Robotic arm movement variables
	var lowerArmX, lowerArmY;
	var upperArmX, upperArmY;
	var tipX, tipY;
	var laserX, laserY;
	var r1, r2, r3;

	// Target variables
	const maxSpeed = 15;
	var targetX, targetY;
	var curX, curY;
	var moving;

	// Sliding movement variables
	var shiftX;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;

///////////////////////////////////////////////////////////////////////////////
//
// Arm1 movements
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		imgArm1 = _img.arm1;
		backContext = _backContext;

		reset();
	}

	function reset() {
		shiftX = -220;
		curX = env.screenWidth/2 + shiftX;
		curY = env.screenHeight/2;
		targetX = curX;
		targetY = curY;
		moving = 0;
		slideT = -1;
		slideCurrentPos = 0;
		slideTargetPos = 0;
		solveAngles(curX, curY);
	}

	function resetSliding(targetPos) {
		if(targetPos > 2 || targetPos < 0 || targetPos == slideCurrentPos) {
			return;
		}

		slideTargetPos = targetPos;
		var diff = slideTargetPos - slideCurrentPos;
		if(diff > 0) {
			slideAccel = 0.2;
		} else {
			slideAccel = -0.2;
			diff = (-1)*diff;
		}

		if(diff == 2) {
			slideT = 69;
		} else {
			switch(slideCurrentPos) {
			case 0:
				slideT = 39;
				break;
			case 1:
				if(slideAccel < 0) {
					slideT = 39;
				} else {
					slideT = 49;
				}
				break;
			case 2:
				slideT = 49;
				break;
			}
		}

		slideSpeed = 0;
		maxSlideT = slideT;
	}

	function push() {
		if(slideT >= 0) {
			if(slideT > maxSlideT - 20) {
				slideSpeed = slideSpeed + slideAccel;
			} else if(slideT < 20) {
				slideSpeed = slideSpeed - slideAccel;
			}
			shiftX += slideSpeed;
			targetX = env.screenWidth/2 + shiftX;
			targetY = env.screenHeight/2;
			slideT--;

			if(slideT < 0) {
				slideCurrentPos = slideTargetPos;
			}
		}
			
		if(curX == targetX && curY == targetY) {
			moving = 0;
		} else {
			var l = Math.sqrt((targetX-curX)*(targetX-curX) + (targetY-curY)*(targetY-curY));
			if(l <= maxSpeed) {
				curX = targetX;
				curY = targetY;
			} else {
				var r = angle(curX, curY, targetX, targetY);
				curX = curX + Math.cos(r)*maxSpeed;
				curY = curY + Math.sin(r)*maxSpeed;
			}
			moving = 1;
			solveAngles(curX, curY);
		}
	}

	function solveAngles(x, y) {
		// Cacluate laser head position
		lowerArmX = 125 + shiftX;
		lowerArmY = 392;
		var l = Math.sqrt((x-lowerArmX)*(x-lowerArmX) + (y-lowerArmY)*(y-lowerArmY));
		laserX = lowerArmX + (x - lowerArmX)*0.3;
		laserY = lowerArmY + (y - lowerArmY)*0.3 - (env.screenHeight - l)*0.2;
		r3 = angle(laserX, laserY, x, y);
		
		// Caculate tip angle
		tipX = laserX - Math.cos(-1.02-r3)*57;
		tipY = laserY + Math.sin(-1.02-r3)*57;
		var r0 = angle(lowerArmX, lowerArmY, tipX, tipY);

		// Solve lower arm angle by cosine rules
		var a = 125, b = Math.sqrt((tipX-lowerArmX)*(tipX-lowerArmX)+(tipY-lowerArmY)*(tipY-lowerArmY)), c = 121;
		r1 = r0 - Math.acos((a*a + b*b - c*c) / (2*a*b));
		
		// Caculate upper arm angle
		upperArmX = lowerArmX + Math.cos(r1) * a;
		upperArmY = lowerArmY + Math.sin(r1) * a;
		r2 = angle(upperArmX, upperArmY, tipX, tipY);
	}

	function draw() {
		// Draw bottom rare
		backContext.drawImage(imgArm1, 165, 71, 35, 15, 115+shiftX, 398, 35, 15);

		// Draw lower arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(lowerArmX, lowerArmY);
		backContext.rotate(r1 + Math.PI + 0.12);
		backContext.drawImage(imgArm1, 0, 66, 150, 54, -132, -26, 150, 54);
		backContext.restore();

		// Draw tip
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(tipX, tipY);
		backContext.rotate(r3);
		backContext.drawImage(imgArm1, 159, 0, 51, 55, -20, 0, 51, 55);
		backContext.restore();

		// Draw upper arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(upperArmX, upperArmY);
		backContext.rotate(r2 - 0.22);
		backContext.drawImage(imgArm1, 0, 0, 158, 65, -25, -25, 158, 65);
		backContext.restore();
		
		// Draw bottom front
		backContext.drawImage(imgArm1, 0, 121, 171, 110, 0+shiftX, 370, 171, 110);
	}

	function angle(ax, ay, bx, by) {
		var l = Math.sqrt((bx-ax)*(bx-ax)+(by-ay)*(by-ay));
		var r = Math.asin((by-ay) / l);
		if(bx < ax) {
			r = (-1)*r + Math.PI;
		}
		return r;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setTarget(x, y) {
		targetX = x;
		targetY = y;
	}

	function getLaserHead() {
		return [laserX, laserY];
	}

	function isMoving() {
		return moving;
	}

	function isSliding() {
		if(slideT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	return {
		init : init,
		reset : reset,
		resetSliding : resetSliding,
		push : push,
		draw : draw,
		setTarget : setTarget,
		getLaserHead : getLaserHead,
		isMoving : isMoving,
		isSliding : isSliding
	};
})();

///////////////////////////////////////////////////////////////////////////////

var arm2 = (function() {
	// General variables
	var backContext;
	var imgArm2;
	var env;
	
	// Robotic arm movement variables
	var lowerArmX, lowerArmY;
	var upperArmX, upperArmY;
	var tipX, tipY;
	var laserX, laserY;
	var r1, r2, r3;

	// Target variables
	const maxSpeed = 15;
	var targetX, targetY;
	var curX, curY;
	var moving;

	// Sliding movement variables
	var shiftX;
	var slideSpeed, slideAccel;
	var slideCurrentPos, slideTargetPos;
	var slideT, maxSlideT;
	
///////////////////////////////////////////////////////////////////////////////
//
// Arm2 movements
//
///////////////////////////////////////////////////////////////////////////////

	function init(_env, _img, _backContext) {
		env = _env;
		imgArm2 = _img.arm2;
		backContext = _backContext;
		
		reset();
	}

	function reset() {
		shiftX = 260;
		curX = env.screenWidth/2 + shiftX;
		curY = env.screenHeight/2;
		targetX = curX;
		targetY = curY;
		moving = 0;
		slideT = -1;
		slideCurrentPos = 0;
		slideTargetPos = 0;
		solveAngles(curX, curY);
	}

	function resetSliding(targetPos) {
		if(targetPos > 2 || targetPos < 0 || targetPos == slideCurrentPos) {
			return;
		}

		slideTargetPos = targetPos;
		var diff = slideTargetPos - slideCurrentPos;
		if(diff > 0) {
			slideAccel = -0.2;
		} else {
			slideAccel = +0.2;
			diff = (-1)*diff;
		}

		if(diff == 2) {
			slideT = 79;
		} else {
			switch(slideCurrentPos) {
			case 0:
				slideT = 59;
				break;
			case 1:
				if(slideAccel > 0) {
					slideT = 59;
				} else {
					slideT = 39;
				}
				break;
			case 2:
				slideT = 39;
				break;
			}
		}

		slideSpeed = 0;
		maxSlideT = slideT;
	}

	function push() {
		if(slideT >= 0) {
			if(slideT > maxSlideT - 20) {
				slideSpeed = slideSpeed + slideAccel;
			} else if(slideT < 20) {
				slideSpeed = slideSpeed - slideAccel;
			}
			shiftX += slideSpeed;
			targetX = env.screenWidth/2 + shiftX;
			targetY = env.screenHeight/2;
			slideT--;

			if(slideT < 0) {
				slideCurrentPos = slideTargetPos;
			}
		}

		if(curX == targetX && curY == targetY) {
			moving = 0;
			return;
		} else {
			var l = Math.sqrt((targetX-curX)*(targetX-curX) + (targetY-curY)*(targetY-curY));
				if(l <= maxSpeed) {
				curX = targetX;
				curY = targetY;
			} else {
				var r = angle(curX, curY, targetX, targetY);
				curX = curX + Math.cos(r)*maxSpeed;
				curY = curY + Math.sin(r)*maxSpeed;
			}
			moving = 1;
			solveAngles(curX, curY);
		}
	}

	function solveAngles(x, y) {
		// Caculate lower arm angle
		lowerArmX = 696 + shiftX;
		lowerArmY = 383;
		var maxLength = Math.sqrt(env.screenWidth*env.screenWidth+env.screenHeight*env.screenHeight);
		var l = Math.sqrt((x-lowerArmX)*(x-lowerArmX) + (y-lowerArmY)*(y-lowerArmY));
		var offset = (1 - l / maxLength) * 0.5 * Math.PI;
		var r0 = angle(lowerArmX, lowerArmY, x, y);
		r1 = r0 + offset;

		// Caculate upper arm angle
		upperArmX = lowerArmX + Math.cos(r1 + 0.36)*117;
		upperArmY = lowerArmY + Math.sin(r1 + 0.36)*117;
		r2 = r0 - offset + Math.PI + (1 - l / maxLength);

		// Caculate tip angle
		tipX = upperArmX + Math.cos(r2 + 3.13)*146;
		tipY = upperArmY + Math.sin(r2 + 3.13)*146;
		r3 = angle(tipX, tipY, x, y) + Math.PI;
		
		// Cacluate laser head position
		laserX = tipX + Math.cos(r3+3.15)*23;
		laserY = tipY + Math.sin(r3+3.15)*23;
	}

	function draw() {
		// Draw bottom
		backContext.drawImage(imgArm2, 0, 130, 158, 125, env.screenWidth-158+shiftX, env.screenHeight-125, 158, 125);

		// Draw tip
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(tipX, tipY);
		backContext.rotate(r3);
		backContext.drawImage(imgArm2, 152, 95, 40, 40, -25, -17, 40, 40);
		backContext.restore();

		// Draw upper arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(upperArmX, upperArmY);
		backContext.rotate(r2);
		backContext.drawImage(imgArm2, 0, 0, 196, 50, -160, -20, 196, 50);
		backContext.restore();

		// Draw lower arm
		backContext.save();
		backContext.setTransform(1, 0, 0, 1, 0, 0);
		backContext.translate(lowerArmX, lowerArmY);
		backContext.rotate(r1);
		backContext.drawImage(imgArm2, 0, 50, 150, 83, -23, -22, 150, 83);
		backContext.restore();
	}

	function angle(ax, ay, bx, by) {
		var l = Math.sqrt((bx-ax)*(bx-ax)+(by-ay)*(by-ay));
		var r = Math.asin((by-ay) / l);
		if(bx < ax) {
			r = (-1)*r + Math.PI;
		}
		return r;
	}

///////////////////////////////////////////////////////////////////////////////
//
// Setup public access
//
///////////////////////////////////////////////////////////////////////////////

	function setTarget(x, y) {
		targetX = x;
		targetY = y;
	}

	function getLaserHead() {
		return [laserX, laserY];
	}

	function isMoving() {
		return moving;
	}

	function isSliding() {
		if(slideT < 0) {
			return 0;
		} else {
			return 1;
		}
	}

	return {
		init : init,
		reset : reset,
		resetSliding : resetSliding,
		push : push,
		draw : draw,
		setTarget : setTarget,
		getLaserHead : getLaserHead,
		isMoving : isMoving,
		isSliding : isSliding
	};
})();

