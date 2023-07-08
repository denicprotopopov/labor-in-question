import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Load Model
 */
// Scene
const objects = [];
const scene = new THREE.Scene()
var cubeMapLoader = new THREE.CubeTextureLoader()
.setPath( '/cubeMaps/' )
.load( [
    'px.jpeg',
    'nx.jpeg',
    'py.jpeg',
    'ny.jpeg',
    'pz.jpeg',
    'nz.jpeg'
] );

const updateAllMaterial = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap = cubeMapLoader
        }
        
    })
}

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const manager = new THREE.LoadingManager(
    () => {
	
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	}
);



const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader)

const modelOne = new THREE.Object3D()
const eurica = new THREE.Object3D()
const mercedes = new THREE.Object3D()
const otz = new THREE.Object3D()
const prize = new THREE.Object3D()
const board = new THREE.Object3D()
const stairs = new THREE.Object3D()
const paint = new THREE.Object3D()
const paper = new THREE.Object3D()
const tractor = new THREE.Object3D()


loader.load('/models/poly4.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.type === 'Mesh' ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        modelOne.add( gltf.scene )
        scene.add(modelOne)
        modelOne.name = "modelOne"
        objects.push(modelOne)
    }
)
loader.load('/models/eurica.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.type === 'Mesh' ) { node.castShadow = true
                node.receiveShadow = true }
    
        } );
        gltf.scene.userData.isContainer = true
        updateAllMaterial()
        eurica.add( gltf.scene )
        scene.add(eurica)
        eurica.name = "eurica"
        objects.push(eurica)
    }
)

loader.load('/models/mercedes.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        mercedes.add( gltf.scene )
        scene.add(mercedes)
        mercedes.name = "mercedes"
        objects.push(mercedes)
    }
)

loader.load('/models/otz.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        otz.add( gltf.scene )
        scene.add(otz)
        otz.name = "otz"
        objects.push(otz)
    }
)

loader.load('/models/board.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        board.add( gltf.scene )
        scene.add(board)
        board.name = "board"
        objects.push(board)
    }
)

loader.load('/models/prize.glb',
    function ( gltf ) {
        gltf.scene.scale.set(4, 4, 4)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        prize.add( gltf.scene )
        scene.add(prize)
        prize.name = "prize"
        objects.push(prize)
    }
)

loader.load('/models/stairs.glb',
    function ( gltf ) {
        gltf.scene.scale.set(4, 4, 4)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        stairs.add( gltf.scene )
        scene.add(stairs)
        stairs.parent.name = "stairs"
        objects.push(stairs)
    }
)

loader.load('/models/paint.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        paint.add( gltf.scene )
        scene.add(paint)
        paint.name = "paint"
        objects.push(paint)
    }
)

loader.load('/models/paper.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        paper.add( gltf.scene )
        scene.add(paper)
        paper.name = "paper"
        objects.push(paper)
    }
)

loader.load('/models/tractor.glb',
    function ( gltf ) {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        updateAllMaterial()
        tractor.add( gltf.scene )
        scene.add(tractor)
        tractor.name = "tractor"
        objects.push(tractor)
    }

    
)
function onTransitionEnd( event ) {

	event.target.remove();
	
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000, 100, 100),
    new THREE.MeshStandardMaterial({
        color: '#3b3c42',
        metalness: 0.3,
        roughness: 0.4
    }))
floor.receiveShadow = true
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotateX(- Math.PI / 2);

scene.add(floor)

export {manager, modelOne, eurica, mercedes, otz, prize, board, stairs, paint, paper, tractor, scene, objects, floor}

