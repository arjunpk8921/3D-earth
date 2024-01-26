// import * as THREE from 'three';

// // init

// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// camera.position.z = 1;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer( { antialias: true } );
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animation );
// document.body.appendChild( renderer.domElement );

// // animation

// function animation( time ) {

// 	mesh.rotation.x = time / 2000;
// 	mesh.rotation.y = time / 1000;

// 	renderer.render( scene, camera );

// }

// above is the code snippet for checking if three.js is working or not. If you are able to see a rotating cube, then you are good to go.

// Now, let's start with the actual code.

import * as THREE from 'three';

let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0, targetRotation = 0, targetRotationOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const delayFactor = 0.0002;
const slowingFactor = 0.98;
let targetRotationX = 0.05;
let targetRotationY = 0.02;

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    // document.addEventListener('mouseout', onDocumentMouseOut, false);
    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * delayFactor;
    targetRotationY = targetRotationOnMouseDown + (mouseY - mouseYOnMouseDown) * delayFactor;
}

//to prevent insteraction when cursor is out of the earth
function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
}


function main() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#globe') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //adding earth's geometry
    const earthGeometry = new THREE.SphereGeometry(.5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./texture/earthmap.jpeg'), bumpMap: new THREE.TextureLoader().load('./texture/earthbump.jpeg'), bumpScale: 0.08 }); ``
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // set ambientlight
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);
    // set point light
    const pointerlight = new THREE.PointLight(0xffffff, 90,);
    // // set light position
    pointerlight.position.set(5, 3, 5);
    scene.add(pointerlight);

    //adding camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const render = () => {
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        targetRotationX *= slowingFactor;
        targetRotationY *= slowingFactor;
        renderer.render(scene, camera);
    }
    const animate = () => {
        requestAnimationFrame(animate);
        render();
    }
    animate();

    //adding interactivity
    document.addEventListener('mousedown', onDocumentMouseDown, false);
}


window.onload = main;
