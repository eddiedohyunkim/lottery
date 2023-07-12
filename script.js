var position = [
			{y:1, x:1},
			{y:1, x:2},
			{y:1, x:3},
			{y:1, x:4},
			{y:1, x:5},
			{y:1, x:6},
			{y:1, x:7},
			{y:1, x:8},
			{y:1, x:9},
			{y:1, x:10},
			{y:2, x:1},
			{y:2, x:2},
			{y:2, x:3},
			{y:2, x:4},
			{y:2, x:5},
			{y:2, x:6},
			{y:2, x:7},
			{y:2, x:8},
			{y:2, x:9},
			{y:2, x:10},
			{y:3, x:1},
			{y:3, x:2},
			{y:3, x:3},
			{y:3, x:4},
			{y:3, x:5},
			{y:3, x:6},
			{y:3, x:7},
			{y:3, x:8},
			{y:3, x:9},
			{y:3, x:10},
			{y:4, x:1},
			{y:4, x:2},
			{y:4, x:3},
			{y:4, x:4},
			{y:4, x:5},
			{y:4, x:6},
			{y:4, x:7},
			{y:4, x:8},
			{y:4, x:9},
			{y:4, x:10},
			{y:5, x:1},
			{y:5, x:2},
			{y:5, x:3},
			{y:5, x:4},
			{y:5, x:5},
		];
	// var stats;
	var camera, scene, renderer;
	var controls;
	var objects = [];
	var targets = { table: [], grid: [] };

	init();
	animate();

function init() {
		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.x = 1000;
		camera.position.y = 700;
		camera.position.z = 1000;
		scene = new THREE.Scene();

		var url = "https://raw.githubusercontent.com/eddiedohyunkim/ci19/master/studio/collection/lottery100latest.json"
		fetch(url)
		.then(function(response){return response.json();})
		.then(function(json){buildPage(json);})

		function buildPage(data) {
			console.table(data);
			// console.log(targets);
			// 10 x 5
			for ( var i = 0; i < data.length; i += 1) {
				for (var j = 0; j < 6; j += 1){

					var ballkey = "ball" + (j + 1);
					var ball = document.createElement( 'div' );
					
					ball.className =  "all" + " number"+data[i][ballkey] + " ball"+(j+1) + " row"+(i+1);						

					var number = document.createElement( 'div' );
					number.className = 'number' ;
					number.innerHTML = data[i][ballkey];
					ball.appendChild( number );

					// start position
					var object = new THREE.CSS3DObject( ball );
					object.position.x = Math.random() * 700-350;
					object.position.y = Math.random() * 700-250;
					object.position.z = Math.random() * 700-350;
					object.rotation.x = Math.random() * 5;
					object.rotation.y = Math.random() * 5;
					object.rotation.z = Math.random() * 5;
					scene.add( object );
					objects.push( object );

					// 10 x 5
					var object = new THREE.Object3D();
					object.position.x = ( position[ data[i][ballkey] - 1 ].x * 150 ) - 800;
					object.position.y = - ( position[ data[i][ballkey] - 1].y * 150 ) + 500;
					object.position.z = (  i * 40 )  - (data.length * 40 - ((data.length * 40) / 2));
					targets.table.push( object );
				}
			}
			

			// 6 x 1
			for ( var i = 0; i < objects.length ; i +=1 ) {
				var object = new THREE.Object3D();
				object.position.x = ( ( i % 6 ) * 150 ) - 370;
				object.position.y = ( - ( Math.floor( i ) % 1 ) * 150 ) ;
				object.position.z = ( Math.floor( i / 6 ) * 100 ) - (data.length * 100 - ((data.length * 100) / 2));
				targets.grid.push( object );
			}

			var count = 0;
			var ballrepeat = [];
			for(var balls = 0; balls < 46; balls += 1){
				for(var i = 0; i < data.length; i+= 1){
					for (var j = 0; j < 6; j+=1){
						var ballkey = "ball" + (j + 1);
						if(data[i][ballkey] == balls) {
							if(!ballrepeat[balls]) {ballrepeat[balls] = 0;}
							ballrepeat[balls] += 1;
						}
					}
				}
			}

			for( var k = 1; k < 46; k += 1){
				(function(index){	
					var numberbutton = document.getElementById("button" + k);
					numberbutton.onclick = function onoff() {
			  	 		document.getElementById("button" + index).value = index + " show";
			  	 		var all = document.getElementsByClassName("all");
			  	 		// console.log(ballrepeat);
			  	 		for (var i = 0; i < all.length; i++){
							all[i].style.display = "none";
						}
			  			var one = document.getElementsByClassName("number" + index); 		
						for (var i = 0; i < one.length; i++){
							one[i].style.display = "block";
						}
						var result = document.createElement("div");
						result.setAttribute("id", "result" + index);
						result.setAttribute("class", "removeresult");
						result.innerHTML = "<hr>" + index + " repeated " + ballrepeat[index] + " times.";
						document.getElementById("resultmenu").appendChild(result);
					}
				})(k);
			}
			
		}

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.getElementById( 'container' ).appendChild( renderer.domElement );
		// Orbit Ctrls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.rotateSpeed = 0.3;
		controls.minDistance = -10000;
		controls.maxDistance = 10000;
		controls.addEventListener( 'change', render );

		// button 10x5
		var button = document.getElementById( 'table' );
		button.addEventListener( 'click', function () {
			transform( targets.table, 1800 );
			// this is weird..
			for( var k = 1; k < 46; k += 1){
				var numberbutton = document.getElementById("button" + k);
			   	document.getElementById("button" + k )
			   	var all = document.getElementsByClassName("all");
			  	for (var i = 0; i < all.length; i++){
					all[i].style.display = "block";
				}
				var removeresult = document.getElementsByClassName("removeresult");
				for( var i = 0; i < removeresult.length; i+=1){
					removeresult[i].remove();
				}
			}
			
		}, false );
		
		// button 6x1
		var button = document.getElementById( 'grid' );
		button.addEventListener( 'click', function () {
			transform( targets.grid, 1800 );
			// this is weird..
			for( var k = 1; k < 46; k += 1){
				var numberbutton = document.getElementById("button" + k);
			   	document.getElementById("button" + k )
			   	var all = document.getElementsByClassName("all");
			  	 for (var i = 0; i < all.length; i++){
					all[i].style.display = "block";
				}
			}

		}, false );
		transform( targets.table, 1800 );
		// stats = new Stats();
		// container.appendChild( stats.dom );
		window.addEventListener( 'resize', onWindowResize, false );

}
	
	// small buttons from 1-45
	for(var i = 1; i < 46; i+=1){
		var buttons = document.createElement("button");
		buttons.setAttribute("id", "button" + i);
		buttons.setAttribute("class", "numberbuttons");
		buttons.setAttribute("value", i);
		buttons.innerHTML = i;
		document.getElementById("buttonmenu").appendChild(buttons);

	}

	// showall button
	var showall = document.getElementById('showall');
	showall.onclick = function() {
		for( var k = 1; k < 46; k += 1){
			var numberbutton = document.getElementById("button" + k);
			document.getElementById("button" + k ).value = k;
			var all = document.getElementsByClassName("all");
			for (var i = 0; i < all.length; i++){
				all[i].style.display = "block";
			}
		}
	}

	// colorbutton
	var colorbutton = document.getElementById('colorbutton');
	colorbutton.onclick = function() {
		if(colorbutton.value ==  "on"){
			colorbutton.value = "off";
			colorbutton.innerHTML = "color off";
			for(var i = 1; i < 11; i+=1){
			var yellow = document.getElementsByClassName("number" + i)
			var yellowbutton = document.getElementById("button" + i);
			for(var j = 0; j < yellow.length; j+=1){
					yellow[j].classList.add('yel');
				} 
			}
			for(var i = 11; i < 21; i+=1){
				var blue  = document.getElementsByClassName("number" + i)
				var bluebutton = document.getElementById("button" + i);
				for(var j = 0; j < blue.length; j+=1){
					blue[j].classList.add('blu');
				} 
			}
			for(var i = 21; i < 31; i+=1){
				var red  = document.getElementsByClassName("number" + i)
				var redbutton = document.getElementById("button" + i);
				for(var j = 0; j < red.length; j+=1){
					red[j].classList.add('red');
				} 
			}
			for(var i = 31; i < 41; i+=1){
				var grey  = document.getElementsByClassName("number" + i)
				var greybutton = document.getElementById("button" + i);
				for(var j = 0; j < grey.length; j+=1){
					grey[j].classList.add('gra');
				} 
			}
			for(var i = 41; i < 46; i+=1){
				var green  = document.getElementsByClassName("number" + i)
				var greenbutton = document.getElementById("button" + i);
				for(var j = 0; j < green.length; j+=1){
					green[j].classList.add('grn');
				} 
			}
			 	 	
		}else{
			colorbutton.value = "on";
			colorbutton.innerHTML = "color on"
			var alls = document.getElementsByClassName("all");
			var allbuttons = document.getElementsByClassName("numberbuttons");
				for(var j = 0; j < alls.length; j+=1){
					if(alls[j].classList.contains('yel')){alls[j].classList.remove('yel')};
					if(alls[j].classList.contains('blu')){alls[j].classList.remove('blu')};
					if(alls[j].classList.contains('red')){alls[j].classList.remove('red')};
					if(alls[j].classList.contains('gra')){alls[j].classList.remove('gra')};
					if(alls[j].classList.contains('grn')){alls[j].classList.remove('grn')};
				} 
		}
	}

	function transform( targets, duration ) {
		TWEEN.removeAll();
		for ( var i = 0; i < objects.length; i +=1 ) {
			var object = objects[ i ];
			var target = targets[ i ];

			new TWEEN.Tween( camera.position )
				// this is the perfect camera angle
				.to( { x: 0, y: targets[ targets.length-1 ].position.y + 400, z: targets[ targets.length-1 ].position.z + 1200 }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Quartic.InOut )
				.start();

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
			
			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}
		
		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate( render )
			.start();
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		render();
	}

	function animate() {
		requestAnimationFrame( animate );
		TWEEN.update();
		controls.update();
	}

	function render() {
		renderer.render( scene, camera );
	}
