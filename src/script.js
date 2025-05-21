// check for common mobile user agents
if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    // the user is using a mobile device, so redirect to the mobile version of the website
    window.location = "mobile/index.html";
}

import * as THREE from 'three'
import { manager, modelOne, eurica, mercedes, otz, prize, board, stairs, paint, paper, tractor, scene, objects, floor } from './loader.js'
import { playHitSound, stopHitSound } from './sound.js';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { Octree } from 'three/addons/math/Octree.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

const notyf = new Notyf();

const worldOctree = new Octree();
const playerCollider = new THREE.Sphere(new THREE.Vector3(0,0,0), 0.5); // Initialize with a default center

/**
 * Base
 */

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;


let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();



// Canvas
const canvas = document.querySelector('canvas.webgl')





modelOne.position.set(22, 2, -21)
eurica.position.set(53, 2, 0)

board.position.set(10, 2.4, 20)
board.rotateY(180)

mercedes.position.set(-42, 1, -30)
mercedes.rotateY(-180)

otz.position.set(-23, 2, -45)
prize.position.set(-40, 2, 6)
stairs.position.set(0, 0, -8)
tractor.position.set(-4, 0, 27)
paper.position.set(16, 0, -44)
paint.position.set(-27, 0, -11)
// Load a glTF resource

// Add objects to Octree for collisions
objects.forEach(object => {
    // It's good practice to ensure the object is a mesh and has geometry
    // and is visible, before adding to Octree.
    // loader.js seems to handle this, as 'objects' array is used for raycasting.
    // We assume objects in the 'objects' array are suitable for collision.
    worldOctree.fromGraphNode(object);
});

// Add the floor separately if it's not part of the 'objects' array
// or if it needs special handling.
// From loader.js, 'floor' is exported separately.
worldOctree.fromGraphNode(floor);


/**
 * Fog
 */
// Fog
const fog = new THREE.Fog('#262837', 5, 30)
scene.fog = fog

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.y = 3;
// camera.position.x = 4
// camera.position.y = 2
// camera.position.z = 5
scene.add(camera)





// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// Controls

const controls = new PointerLockControls(camera, document.body);

const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');
const inventory = document.getElementById('inventory');
inventory.style.display = 'none';


instructions.addEventListener('click', function () {

    controls.lock();


});

controls.addEventListener('lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';
    playHitSound()

});

controls.addEventListener('unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';
    stopHitSound()



});

scene.add(controls.getObject());

const onKeyDown = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

document.addEventListener('keydown', (e) => {
    if (e.code == "KeyY") {
        if (inventory.style.display === 'none') {
            document.getElementById('inventory').style.display = 'block'
            // console.log("open");
        } else {
            inventory.style.display = 'none'
            // console.log("close");
        }
    }
})

// const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 4); // Removed old raycaster


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.useLegacyLights = false

const composer = new EffectComposer(renderer);
const renderPixelatedPass = new RenderPixelatedPass(7, scene, camera);
renderPixelatedPass.normalEdgeStrength = 0
renderPixelatedPass.depthEdgeStrength = 0
composer.addPass(renderPixelatedPass);



// Debug
// const gui = new dat.GUI()
// gui


const params = {
    pixelSize: 7, normalEdgeStrength: 0, depthEdgeStrength: 0, pixelAlignedPanning: true, threshold: 0,
    strength: 0.3,
    radius: 1,
    exposure: 1
};
// gui.add( params, 'pixelSize' ).min( 1 ).max( 16 ).step( 1 )
//     .onChange( () => {

//         renderPixelatedPass.setPixelSize( params.pixelSize );

//     } );
// gui.add( renderPixelatedPass, 'normalEdgeStrength' ).min( 0 ).max( 2 ).step( .05 );
// gui.add( renderPixelatedPass, 'depthEdgeStrength' ).min( 0 ).max( 1 ).step( .05 );
// gui.add( params, 'pixelAlignedPanning' );
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

/**
 * Animate
 */
const clock = new THREE.Clock()

var inScope

let INTERSECTED
const CLICKED = [];


const tick = () => {
    requestAnimationFrame(tick);

    const time = performance.now();

    if (controls.isLocked === true) {

        // Raycasting for object interaction (mouse picking) - this is separate from collision
        // For now, we'll need a new raycaster for this if INTERSECTED logic is to be kept fully functional.
        // Let's define a simple one for mouse picking.
        const interactionRaycaster = new THREE.Raycaster();
        interactionRaycaster.setFromCamera({ x: 0, y: 0 }, camera); // Ray from center of screen

        const intersectionsForInteraction = interactionRaycaster.intersectObjects(objects, true);
        const onObject = intersectionsForInteraction.length > 0; // Used for mouse interaction logic

        if (onObject) {
            const selectedForInteraction = intersectionsForInteraction[0].object;
            if (INTERSECTED !== selectedForInteraction) {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                INTERSECTED = selectedForInteraction;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                composer.addPass(bloomPass);
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            composer.removePass(bloomPass);
            INTERSECTED = null;
        }

        document.addEventListener('mousedown', onDocumentMouseDown);
        var numberInInventory = CLICKED.length
        document.getElementById("inventoryProgress").value = numberInInventory
        document.getElementById("myLog").innerHTML = `${numberInInventory} из 10`

        // The onObject variable for onDocumentMouseDown will now be based on interactionRaycaster
        function addToClicked(clickedObjectName) {
            if (CLICKED.includes(clickedObjectName)) {
                return
            } else {
                CLICKED.push(clickedObjectName)
                console.log(CLICKED);
                notyf.success({
                    message: `Objects found: ${numberInInventory + 1} of 10`,
                    duration: 2000,
                    icon: false,
                    background: 'grey',
                })
            }
        }



        function onDocumentMouseDown(event) {
            event.preventDefault();
            // Note: 'onObject' here is from the interactionRaycaster, not the old collision raycaster
            if (onObject && intersectionsForInteraction.length > 0) { 
                // Check INTERSECTED against the first object from interactionRaycaster
                if (INTERSECTED !== intersectionsForInteraction[0].object) { 
                    if (INTERSECTED) {
                        // This part seems to be missing logic to reset previous INTERSECTED if any
                    }
                    // INTERSECTED is already set above based on interactionRaycaster
                    // addToClicked(INTERSECTED.parent.parent.name); // This assumes INTERSECTED is correctly set
                    // Let's ensure INTERSECTED is valid before calling addToClicked
                    if (INTERSECTED && INTERSECTED.parent && INTERSECTED.parent.parent) {
                         addToClicked(INTERSECTED.parent.parent.name);
                    }
                    // Display a success notification

                    // console.log(numberInInventory);
                    // console.log(INTERSECTED);
                    // console.log(CLICKED);

                }

            } else {

                if (INTERSECTED);


                INTERSECTED = null;

            }

        }

        // Player movement and collision
        const delta = (time - prevTime) / 5000;

        // 1. Calculate tentative velocity based on input
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        // velocity.y remains for gravity if implemented, not directly affected by Octree planar collisions here

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        
        // 2. Define tentative movement based on current velocity
        const tentativeMovement = new THREE.Vector3(-velocity.x * delta, 0, -velocity.z * delta);
        
        // Update playerCollider to the *potential* new position
        playerCollider.center.copy(camera.position).add(tentativeMovement);
        
        // 3. Perform collision detection with Octree at the potential new position
        const collisionResult = worldOctree.sphereIntersect(playerCollider);

        if (collisionResult) {
            // console.log('Player collision:', collisionResult.normal.toArray(), collisionResult.depth);
            // A collision occurred. Correct the camera's current position by the penetration depth.
            camera.position.add(collisionResult.normal.multiplyScalar(collisionResult.depth));
            
            // Adjust velocity: Remove the component of velocity that is in the direction of the collision normal.
            // This stops the player from continuing to move into the collision surface.
            const vDotN = velocity.dot(collisionResult.normal);
            velocity.sub(collisionResult.normal.multiplyScalar(vDotN));
        }

        // 4. Apply final (potentially adjusted) velocity to controls.
        // PointerLockControls applies movement relative to the camera's orientation.
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        // Gravity (current implementation is basic and might interfere with Octree y-axis later)
        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        // controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        // if ( controls.getObject().position.y < playerCollider.radius ) { // Check against collider radius
        //     velocity.y = 0;
        //     controls.getObject().position.y = playerCollider.radius;
        // }

    }

    prevTime = time;

    //renderer.render( scene, camera );
    composer.render();
}

tick()
