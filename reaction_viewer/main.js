import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ircImages from '/reaction_viewer/public/json/eb01.json' with { type: 'json' }

//** Reference vectors and scalars */
const distanceFromOrigin = 10;
var cameraOffset = 2;
var viewportSize = 0.5;
const origin = new THREE.Vector3(0,0,0);
const forward = new THREE.Vector3(1,0,0);
const right = new THREE.Vector3(0,1,0);
const up = new THREE.Vector3(0,0,1);
const screenWidth = window.innerWidth;

//** Reference materials */
const forwardMat = new THREE.LineBasicMaterial({color: 0x58f941});
const rightMat = new THREE.LineBasicMaterial({color: 0xef2770});
const upMat = new THREE.LineBasicMaterial({color: 0x273cef});
const outlineMat = new THREE.MeshBasicMaterial({
  color: 0x273cef,
  side: THREE.BackSide
});
const elementsToHighlight = ["O05","H04","C03","C02","Br15"];
const highlighterMeshes = [];
var elementsHighlighted = false;

//** possible image paths */
const frontGS = "/reaction_viewer/public/templates/front_gs.png";
const frontTS = "/reaction_viewer/public/templates/front_ts.png";
const frontPR = "/reaction_viewer/public/templates/front_pr.png";
const rightGS = "/reaction_viewer/public/templates/right_gs.png";
const rightTS = "/reaction_viewer/public/templates/right_ts.png";
const rightPR = "/reaction_viewer/public/templates/right_pr.png";
const leftGS = "/reaction_viewer/public/templates/left_gs.png";
const leftTS = "/reaction_viewer/public/templates/left_ts.png";
const leftPR = "/reaction_viewer/public/templates/left_pr.png";
const upGS = "/reaction_viewer/public/templates/up_gs.png";
const upTS = "/reaction_viewer/public/templates/up_ts.png";
const upPR = "/reaction_viewer/public/templates/up_pr.png";
const backGS = "/reaction_viewer/public/templates/back_gs.png";
const backTS = "/reaction_viewer/public/templates/back_ts.png";
const backPR = "/reaction_viewer/public/templates/back_pr.png";
const downGS = "/reaction_viewer/public/templates/down_gs.png";
const downTS = "/reaction_viewer/public/templates/down_ts.png";
const downPR = "/reaction_viewer/public/templates/down_pr.png";

//** Default image paths */
var gsImage = "/reaction_viewer/public/templates/right_gs.png";
var tsImage = "/reaction_viewer/public/templates/right_ts.png";
var prImage = "/reaction_viewer/public/templates/right_pr.png";


//** Properties & Constants */
const fieldOfView = 45, near=1, far=1000;
const glbLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const raycaster = new THREE.Raycaster();
const cameraDirection = new THREE.Vector3();

//** HTML elements */
const slider = document.getElementById("AnimationSlider");
const viewport2DImage = document.getElementById("Viewport2DImage");
const aboutSim = document.getElementById("about_sim");
const viewportIRCImage = document.getElementById("ViewportIRCImage");
const currentlySeeingText = document.getElementById("currentlySeeingText");
const buttonTextEmphasis = document.getElementById("buttonTextEmphasis");
const button2D = document.getElementById("2d_button");
const buttonIRC = document.getElementById("irc_button");
const buttonAbout = document.getElementById("about_button");
const firstDescription = document.getElementById("firstDescription");

//** Button text descriptions */
const button2DText = "The 2D representation to the right changes both when you rotate the 3D model, and when moving back and forth between the ground state, the transition state, and the product.";
const buttonIRCText = "The geometry changes for the 3D model as the intrinsic reaction coordinate progresses.";
const buttonAboutText = "The brief description about the level of theory implemented in the calculation that led to the 3D model seen here.";

let helperCubesArray = [];
let mixer, animationLength; //animation properties
let scene, camera, renderer, controls; //scene properties

var aspectRatio = window.innerWidth/window.innerHeight; //render properties

function init(){
  //** Scene */
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x212a20 );
  scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
  
  //** Camera */
  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
  //camera.position.set(0,0,distanceFromOrigin-cameraOffset);
  setCameraOffsetByScreenWidth(camera);
  scene.add(camera);

  //** Lights */
  const light = new THREE.SpotLight( 0xffffff, 10000 );
  light.position.set( 0, 25, 50 );
  light.angle = Math.PI / 9;
  light.castShadow = true;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 10;
  light.shadow.mapSize.width = 256;
  light.shadow.mapSize.height = 256;
  camera.add(light); //the light is a child of the camera to be able to follow it.

  //** Renderer */
  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  setUIContentByScreenWidth(renderer);
  //renderer.setSize(window.innerWidth*viewportSize, window.innerHeight*viewportSize);
  document.getElementById('webgl').appendChild(renderer.domElement);
 
  //** Controls */
  controls = new OrbitControls(camera, renderer.domElement);
 
  //** UI */
   changeButtonColors(button2D, buttonAbout, buttonIRC);
  aboutSim.style.display = 'none';
  viewportIRCImage.style.display = 'none';
    
  //** Events */
  document.addEventListener('click', onClick);
  button2D.addEventListener('click', view2DClick);
  buttonAbout.addEventListener('click', aboutClick);
  buttonIRC.addEventListener('click', ircClick);

  //** Reference objects */
  addReferenceLines(); //<-- uncomment this line to debug directions
  addReferenceCubes(); //cubes necessary for raycast detection logic
  makeHelperCubesInvisible(); //<-- uncomment this line during production
    
  //** Loading GLB Object */
  loadFBXObject('EB01', '/reaction_viewer/public/imports/EB01.fbx', new THREE.Vector3(), new THREE.Euler(), 0.01);
}

slider.oninput = function() {
  var percentage = this.value/100; //getting value from slider
  mixer.setTime(animationLength*percentage); //updating animation time
  slider2DLogic(this.value);
  sliderIRCLogic(this.value);
}

function instantiateHighlighters(atomList){
  if (elementsHighlighted == false){
    const radius = 1;  
    const widthSegments = 30;  
    const heightSegments = 30;
    const sphereGeom = new THREE.SphereGeometry( radius, widthSegments, heightSegments );

    for (var i = 0; i < atomList.length; i++) {
      const currentAtom = scene.getObjectByName(atomList[i]);
      const highlightName = atomList[i] + "_highlight";
      const currentMesh = new THREE.Mesh(sphereGeom, outlineMat);
      currentMesh.name = highlightName
      currentMesh.scale.setScalar(0.7);
      currentAtom.add(currentMesh);
      highlighterMeshes.push(currentMesh);
    }
    elementsHighlighted = true;
  }
}

function sliderIRCLogic(sliderValue){
  viewportIRCImage.src = ircImages[sliderValue].src;
}

function slider2DLogic(sliderValue){
  if(sliderValue <= 33){
    if(viewport2DImage.src == gsImage){
      return;
    }
    else{
      viewport2DImage.src = gsImage;
      currentlySeeingText.textContent = "ground state";
    }
  }
  else if(sliderValue > 33 && sliderValue <=66){
    if(viewport2DImage.src == tsImage){
      return;
    }
    else{
      viewport2DImage.src = tsImage;
      currentlySeeingText.textContent = "transition state";
    }
  }
  else{
    if(viewport2DImage.src == prImage){
      return;
    }
    else{
      viewport2DImage.src = prImage;
      currentlySeeingText.textContent = "product";
    }
  }
}

function addCube(name, position, material){
  const cubeGeom = new THREE.BoxGeometry(1,1,1);
  const cube = new THREE.Mesh(cubeGeom, material);
  cube.position.copy(position);
  cube.name = name;
  cube.scale.setScalar(distanceFromOrigin);
  scene.add(cube);
  return cube;
}

function updateViewerPerspective() {
  camera.getWorldDirection(cameraDirection);
  raycaster.set(camera.position, cameraDirection);
  const intersects = raycaster.intersectObjects(helperCubesArray);

  if (intersects.length > 0) {
    const intersectedCube = intersects[0].object; // Closest intersected object
    switch(intersectedCube.name) {
      case 'frontCube':
        console.log("front cube");
        updateImageSet(frontGS, frontTS, frontPR);
        slider2DLogic(slider.value);
        break;
      case 'rightCube':
        console.log("right cube");
        updateImageSet(rightGS, rightTS, rightPR);
        slider2DLogic(slider.value);
        break;
      case 'upCube':
        console.log("up cube");
        updateImageSet(upGS, upTS, upPR);
        slider2DLogic(slider.value);
        break;
      case 'backCube':
        console.log("back cube");
        updateImageSet(backGS, backTS, backPR);
        slider2DLogic(slider.value);
        break;
      case 'leftCube':
        console.log("left cube");
        updateImageSet(leftGS, leftTS, leftPR);
        slider2DLogic(slider.value);
        break;
      case 'downCube':
        console.log("up cube");
        updateImageSet(downGS, downTS, downPR);
        slider2DLogic(slider.value);
        break;
    }
  }
}

function updateImageSet(newGSPath, newTSPath, newPRPath){
  if(gsImage == newGSPath){
    return;
  }
  else{
    gsImage = newGSPath;
    tsImage = newTSPath;
    prImage = newPRPath;
  }
}

function update() {
	renderer.render(scene, camera);
  controls.update(); //to drag and drop the camera to see the object
  updateViewerPerspective();
  requestAnimationFrame(update); //function pauses everytime user goes to another tab
}

function addReferenceLines(){
  const fPoints = [];
  const rPoints = [];
  const uPoints = [];

  fPoints.push(origin);
  rPoints.push(origin);
  uPoints.push(origin);

  fPoints.push(forward);
  rPoints.push(right);
  uPoints.push(up);  

  const fGeom = new THREE.BufferGeometry().setFromPoints(fPoints);
  const rGeom = new THREE.BufferGeometry().setFromPoints(rPoints);
  const uGeom = new THREE.BufferGeometry().setFromPoints(uPoints);

  const fLine = new THREE.Line(fGeom, forwardMat);
  const rLine = new THREE.Line(rGeom, rightMat);
  const uLine = new THREE.Line(uGeom, upMat);

  scene.add(fLine);
  scene.add(rLine);
  scene.add(uLine);
}

function addReferenceCubes(){
  helperCubesArray.push(addCube("frontCube", forward.clone().multiplyScalar(distanceFromOrigin), forwardMat));
  helperCubesArray.push(addCube("rightCube", right.clone().multiplyScalar(distanceFromOrigin), rightMat));
  helperCubesArray.push(addCube("upCube", up.clone().multiplyScalar(distanceFromOrigin), upMat));
  helperCubesArray.push(addCube("downCube", up.clone().multiplyScalar(distanceFromOrigin*-1), upMat));
  helperCubesArray.push(addCube("leftCube", right.clone().multiplyScalar(distanceFromOrigin*-1), rightMat));
  helperCubesArray.push(addCube("backCube", forward.clone().multiplyScalar(distanceFromOrigin*-1), forwardMat));
}

function makeHelperCubesInvisible(){
  for(var i=0; i < helperCubesArray.length; i++){
    helperCubesArray[i].visible = false;
  }
}

function toggleHighlighterMeshes(state){
  for (var i=0; i<highlighterMeshes.length; i++){
    highlighterMeshes[i].visible = state;
  }
}

function changeButtonColors(bOn, bOff1, bOff2){
  bOn.style.backgroundColor = '#75e87fff';
  bOff1.style.background = "#ddddddff";
  bOff2.style.background = "#ddddddff";
}

function setCameraOffsetByScreenWidth(camera){
  if(window.innerWidth < 500) {
    cameraOffset = -1;
  }
  else{
    cameraOffset = 2;
  }
  camera.position.set(0,0,distanceFromOrigin-cameraOffset);
}

function setUIContentByScreenWidth(renderer){
  if(window.innerWidth < 500){
    firstDescription.innerHTML = "Above you";
    button2D.innerHTML = "2D";
    buttonIRC.innerHTML = "IRC";
    buttonAbout.innerHTML = "About";
    renderer.setSize(window.innerWidth*viewportSize*1.15, window.innerHeight*viewportSize*0.7);
  }
  else{
    firstDescription.innerHTML = "To your left";
    button2D.innerHTML = "2D View";
    buttonIRC.innerHTML = "Reaction Coordinate";
    buttonAbout.innerHTML = "About Simulation";
    viewportSize = 0.5; //viewport occupies half of the screen
    renderer.setSize(window.innerWidth*viewportSize, window.innerHeight*viewportSize);
  }
  
}

function view2DClick(){
  changeButtonColors(button2D, buttonAbout, buttonIRC);
  controls.reset();
  slider.value = 50;
  viewport2DImage.style.display = 'inline';
  aboutSim.style.display = 'none';
  viewportIRCImage.src = ircImages[50].src;
  viewportIRCImage.style.display = 'none';
  buttonTextEmphasis.textContent = button2DText;
  toggleHighlighterMeshes(false);
}
function aboutClick(){
  changeButtonColors(buttonAbout, button2D, buttonIRC);
  controls.reset();
  slider.value = 50;
  viewport2DImage.style.display = 'none';
  aboutSim.style.display = 'inline';
  viewportIRCImage.src = ircImages[50].src;
  viewportIRCImage.style.display = 'none';
  buttonTextEmphasis.textContent = buttonAboutText;
  toggleHighlighterMeshes(false);
}
function ircClick(){
  changeButtonColors(buttonIRC, button2D, buttonAbout);
  controls.reset();
  slider.value = 50;
  viewport2DImage.style.display = 'none';
  viewportIRCImage.src = ircImages[50].src;
  aboutSim.style.display = 'none';
  viewportIRCImage.style.display = 'inline';
  buttonTextEmphasis.textContent = buttonIRCText;
  instantiateHighlighters(elementsToHighlight);
  toggleHighlighterMeshes(true);
}

function loadGLBObject(objectName, objectPath, globalPosition, globalRotation, relativeScale){
  glbLoader.load(
    objectPath,
    function(gltf){
      const model = gltf.scene;
      model.name = objectName;
      model.position.set(globalPosition.x, globalPosition.y, globalPosition.z); //copy does not work
      model.rotation.set(globalRotation.x, globalRotation.y, globalRotation.z); //copy does not work
      model.scale.setScalar(relativeScale);
      scene.add(model);

      if(gltf.animations.length >0){
        mixer = new THREE.AnimationMixer(model);
        animationLength = gltf.animations[0].duration;
        mixer.clipAction(gltf.animations[0]).play();
      }
    },
    function(xhr){
      console.log((xhr.loaded/xhr.total*100) + '% loaded');
    },
    function(error){
      console.log('There was an error loading the file');
    }
  );
}

function loadFBXObject(objectName, objectPath, globalPosition, globalRotation, relativeScale){
  fbxLoader.load(
    objectPath,
    (object) => {
      object.name = objectName;
      object.position.set(globalPosition.x, globalPosition.y, globalPosition.z);
      object.rotation.set(globalRotation.x, globalRotation.y, globalRotation.z);
      object.scale.setScalar(relativeScale);
      scene.add(object)

      if(object.animations.length > 0){
        console.log("while loading fbx, animation found");
        mixer = new THREE.AnimationMixer(object);
        animationLength = object.animations[0].duration;
        mixer.clipAction(object.animations[0]).play();
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}

function onClick(event){
  console.log('clicked');
  console.log(window.innerWidth);
}

if ( WebGL.isWebGLAvailable() ) {
	init();
  update();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('container').appendChild( warning );
}