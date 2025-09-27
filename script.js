import * as THREE from "three"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"

function lerp(a, b, t) { return a * (1 - t) + b * t; }
function easeInOut(t) { let sqr = Math.pow(t, 2); return sqr / (2 * (sqr - t) + 1); }
function easeOut(t) { return 1 - Math.pow(1 - t, 2); }
function easeIn(t) { return Math.pow(t, 2); }
function arraysEqual(a, b){
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; i++){
        if (a[i] !== b[i]) return false;
    }

    return true;
}
function stringToIndex(str){
    let result = 0;
    for (let i = 0; i < str.length; i++){
        result += str.charCodeAt(i);
    }
    return result + str.length;
}

var COOKIES = {};
function loadCookies(){
    if (document.cookie == "") return;
    var rawCooks = document.cookie.split("; ");
    if (rawCooks.length == 0) return;
    for (let i = 0; i < rawCooks.length; i++){
        let d = rawCooks[i].split("=");
        COOKIES[d[0]] = d[1];
    }
}
loadCookies();

function saveCookies(expiry){
    if (TOKEN == "") return;
    if (expiry == null){
        document.cookie = "playerToken=" + TOKEN + "; expires=" + COOKIES.expiryTime;
    }
    else{
        document.cookie = "playerToken=" + TOKEN + "; expires=" + expiry.toUTCString();
        document.cookie = "expiryTime=" + expiry.toUTCString() + "; expires=" + expiry.toUTCString();
    }
}

var TOKEN = "";
if (Object.hasOwn(COOKIES, "playerToken")){
    TOKEN = COOKIES.playerToken;
}

var MinigameData;
fetch("/resources/minigames.json").then(r => r.text()).then(t => MinigameData = JSON.parse(t));

const EPSILON = 0.001;

var Scene = new THREE.Scene();
const Camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const Renderer = new THREE.WebGLRenderer();
Renderer.shadowMap.enabled = true;
Renderer.shadowMap.type = THREE.BasicShadowMap;
Renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("world").appendChild(Renderer.domElement);

window.onresize = function(e){ 
    Renderer.setSize(window.innerWidth, window.innerHeight);
    Camera.aspect = window.innerWidth / window.innerHeight;
    Camera.updateProjectionMatrix();
}

var mapData;
var mapSize = {x: 0, y: 0};

const BlockMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const TrimMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

const TexLoader = new THREE.TextureLoader();
const ModelLoader = new FBXLoader();

var PlayerAvatars = [
    "/resources/avatars/blue_octo_1.png",
    "/resources/avatars/blue_octo_2.png",
    "/resources/avatars/blue_octo_3.png",

    "/resources/avatars/green_octo_1.png",
    "/resources/avatars/green_octo_2.png",
    "/resources/avatars/green_octo_3.png",

    "/resources/avatars/pink_octo_1.png",
    "/resources/avatars/pink_octo_2.png",
    "/resources/avatars/pink_octo_3.png",

    "/resources/avatars/purple_octo_1.png",
    "/resources/avatars/purple_octo_2.png",
    "/resources/avatars/purple_octo_3.png",

    "/resources/avatars/teal_octo_1.png",
    "/resources/avatars/teal_octo_2.png",
    "/resources/avatars/teal_octo_3.png",

    "/resources/avatars/yellow_octo_1.png",
    "/resources/avatars/yellow_octo_2.png",
    "/resources/avatars/yellow_octo_3.png",

    "/resources/avatars/blue_squid_1.png",
    "/resources/avatars/blue_squid_2.png",
    "/resources/avatars/blue_squid_3.png",

    "/resources/avatars/green_squid_1.png",
    "/resources/avatars/green_squid_2.png",
    "/resources/avatars/green_squid_3.png",

    "/resources/avatars/pink_squid_1.png",
    "/resources/avatars/pink_squid_2.png",
    "/resources/avatars/pink_squid_3.png",

    "/resources/avatars/purple_squid_1.png",
    "/resources/avatars/purple_squid_2.png",
    "/resources/avatars/purple_squid_3.png",

    "/resources/avatars/teal_squid_1.png",
    "/resources/avatars/teal_squid_2.png",
    "/resources/avatars/teal_squid_3.png",

    "/resources/avatars/yellow_squid_1.png",
    "/resources/avatars/yellow_squid_2.png",
    "/resources/avatars/yellow_squid_3.png",
];
var PlayerAvatarsTex = [];
for (let i = 0; i < PlayerAvatars.length; i++){
    let tex = TexLoader.load(PlayerAvatars[i]);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    PlayerAvatarsTex.push(tex);

}

const SKYBOX_TEX = new THREE.CubeTextureLoader().load([
    "/resources/Skyboxes/px.png",
    "/resources/Skyboxes/nx.png",
    "/resources/Skyboxes/py.png",
    "/resources/Skyboxes/ny.png",
    "/resources/Skyboxes/pz.png",
    "/resources/Skyboxes/nz.png"
]);
SKYBOX_TEX.colorSpace = THREE.SRGBColorSpace;

var Star;
ModelLoader.load("/resources/models/squid_star.fbx", (object) => {
    Star = object;
    Scene.add(Star);
    Star.scale.set(0, 0, 0);
    
    Star.traverse(function (child){
        if (child.isMesh) {
            if (child.material.map !== null){
                child.material.map.colorSpace = THREE.SRGBColorSpace;
                child.material = new THREE.MeshBasicMaterial({ map: child.material.map, transparent: true });
            }
            else{
                child.material = new THREE.MeshStandardMaterial({ color: 0xffbf00, envMap: SKYBOX_TEX, roughness: 0.1, metalness: 0.8, emissive: 0xffdc73, emissiveIntensity: 0.5 });
            }
        }
    });
});
const RingParticleTex = TexLoader.load("/resources/textures/ring_particle.png");
RingParticleTex.colorSpace = THREE.SRGBColorSpace;
var StarRingParticle = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: RingParticleTex, transparent: true, opacity: 0, color: 0xffea00 }));
var ItemRingParticle = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: RingParticleTex, transparent: true, opacity: 0, color: 0xffffff }));
Scene.add(StarRingParticle);

const GreenPipeTex = TexLoader.load("/resources/models/green-pipe.png");
GreenPipeTex.colorSpace = THREE.SRGBColorSpace;
GreenPipeTex.minFilter = THREE.NearestFilter;
GreenPipeTex.magFilter = THREE.NearestFilter;
GreenPipeTex.wrapS = THREE.RepeatWrapping;
GreenPipeTex.wrapT = THREE.RepeatWrapping;
const GoldPipeTex = TexLoader.load("/resources/models/gold-pipe.png");
GoldPipeTex.colorSpace = THREE.SRGBColorSpace;
GoldPipeTex.minFilter = THREE.NearestFilter;
GoldPipeTex.magFilter = THREE.NearestFilter;
GoldPipeTex.wrapS = THREE.RepeatWrapping;
GoldPipeTex.wrapT = THREE.RepeatWrapping;
var GreenPipe, GoldPipe;
ModelLoader.load("/resources/models/pipe.fbx", (object) => {
    GreenPipe = object;
    GoldPipe = object.clone(true);
    
    GreenPipe.traverse(function (child){
        if (child.isMesh){
            child.material = new THREE.MeshStandardMaterial({ map: GreenPipeTex });
            child.castShadow = false;
            child.receiveShadow = true;
        }
    });
    GoldPipe.traverse(function (child){
        if (child.isMesh){
            child.material = new THREE.MeshStandardMaterial({ map: GoldPipeTex });
            child.castShadow = false;
            child.receiveShadow = true;
        }
    });

    GreenPipe.scale.set(0.00375, 0.00375, 0.00375);
    GreenPipe.rotation.set(0, Math.PI / 2, 0);
    GoldPipe.scale.set(0.00375, 0.00375, 0.00375);
    GoldPipe.rotation.set(0, Math.PI / 2, 0);

    Scene.add(GreenPipe);
    Scene.add(GoldPipe);
});


const ATLAS = TexLoader.load("/resources/textures/atlas.png");
ATLAS.wrapS = THREE.RepeatWrapping;
ATLAS.wrapT = THREE.RepeatWrapping;
ATLAS.magFilter = THREE.NearestFilter;
ATLAS.minFilter = THREE.NearestFilter;
ATLAS.colorSpace = THREE.SRGBColorSpace;

Scene.background = SKYBOX_TEX;

const ATLAS_SIZE = {x: 8, y: 8};
const ATLAS_UV_SIZE = {x: 1 / ATLAS_SIZE.x - (EPSILON * 2), y: 1 / ATLAS_SIZE.y - (EPSILON * 2)};

const PlayerTex = TexLoader.load("/resources/textures/AIRA_Pixel1.png");
PlayerTex.magFilter = THREE.NearestFilter;
PlayerTex.minFilter = THREE.NearestFilter;
PlayerTex.colorSpace = THREE.SRGBColorSpace;

var Player = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({map: PlayerTex, alphaTest: 0.5, side: THREE.DoubleSide}));
Player.castShadow = true;
Player.receiveShadow = false;
Player.position.set(10, 2.875, 15);
Scene.add(Player);

var ItemPreview = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ transparent: true }));

var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
var light = new THREE.DirectionalLight(0xFFFFFF, 2);

light.castShadow = true;
light.position.y = 20;
light.position.z = 10;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

light.target = Player;

Player.add(ambient);
Player.add(light);


var selectorTex = TexLoader.load("resources/textures/selector.png");
selectorTex.colorSpace = THREE.SRGBColorSpace;
selectorTex.magFilter = THREE.NearestFilter;
selectorTex.minFilter = THREE.NearestFilter;
var mapSelectorBox = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({map: selectorTex, alphaTest: 0.5}));
mapSelectorBox.scale.set(0, 0, 0);
mapSelectorBox.rotation.set(-Math.PI / 2, 0, 0);
Scene.add(mapSelectorBox);

//Dice block
var DiceFont;
var Dice = [
    new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({color: 0xFFFFFF})),
    new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({color: 0xFFFFFF})),
    new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({color: 0xFFFFFF})),
];
for (var i = 0; i < Dice.length; i++){
    Scene.add(Dice[i]);
    Dice[i].scale.set(0.85, 0.85, 0.85);
    Dice[i].castShadow = true;
    Dice[i].receiveShadow = true;
}
var CoinText = new THREE.Group();
const CoinTex = TexLoader.load("/resources/textures/coin_low_res.png");
CoinTex.colorSpace = THREE.SRGBColorSpace;
CoinTex.minFilter = THREE.NearestFilter;
CoinTex.magFilter = THREE.NearestFilter;
var CoinPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: CoinTex, transparent: true }));
CoinText.add(CoinPlane);
var fontLoader = new FontLoader();
fontLoader.load("/resources/fonts/Jersey 10/Jersey 10_Regular.json", function(font){
    DiceFont = font;

    for (var i = 0; i < Dice.length; i++){
        Dice[i].add(new THREE.Mesh(new TextGeometry("1", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].add(new THREE.Mesh(new TextGeometry("2", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].add(new THREE.Mesh(new TextGeometry("3", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].add(new THREE.Mesh(new TextGeometry("4", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].add(new THREE.Mesh(new TextGeometry("5", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].add(new THREE.Mesh(new TextGeometry("6", { font: font, size: 0.45, depth: 0, curveSegments: 1 }), new THREE.MeshBasicMaterial({color: 0x000000})));
        Dice[i].children[5].position.set(-0.115, -0.169, 0.2525);

        Dice[i].children[1].position.set(0.115, -0.169, -0.2525);
        Dice[i].children[1].rotation.set(0, Math.PI, 0);

        Dice[i].children[2].position.set(-0.2525, -0.169, -0.115);
        Dice[i].children[2].rotation.set(0, -Math.PI/2, 0);

        Dice[i].children[3].position.set(0.2525, -0.169, 0.115);
        Dice[i].children[3].rotation.set(0, Math.PI/2, 0);

        Dice[i].children[4].position.set(-0.1, 0.2525, 0.169);
        Dice[i].children[4].rotation.set(-Math.PI/2, 0, 0);

        Dice[i].children[0].position.set(-0.06, -0.2525, -0.169);
        Dice[i].children[0].rotation.set(Math.PI/2, 0, 0);
    }

    CoinText.add(new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshBasicMaterial({ color: 0xffffff })));
    CoinText.add(new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshBasicMaterial({ color: 0xffffff })));
});



function loadMap(){
    fetch("/resources/maps/barnacle-and-dime.json").then(res => res.json()).then(async res => {
        mapData = res;
        mapSize = {x: mapData[0].length, y: mapData.length};
        
        for (var i = 0; i < mapSize.x; i ++){
            for (var j = 0; j < mapSize.y; j++){
                mapData[j][i].material = Number.parseInt(mapData[j][i].material);
                if (!Array.isArray(mapData[j][i].wallMaterial.n)) mapData[j][i].wallMaterial.n = Number.parseInt(mapData[j][i].wallMaterial.n);
                if (!Array.isArray(mapData[j][i].wallMaterial.s)) mapData[j][i].wallMaterial.s = Number.parseInt(mapData[j][i].wallMaterial.s);
                if (!Array.isArray(mapData[j][i].wallMaterial.e)) mapData[j][i].wallMaterial.e = Number.parseInt(mapData[j][i].wallMaterial.e);
                if (!Array.isArray(mapData[j][i].wallMaterial.w)) mapData[j][i].wallMaterial.w = Number.parseInt(mapData[j][i].wallMaterial.w);
            }
        }

        buildMap();
    });
}

var MapMesh;
function buildMap(){
    var geometry = new THREE.BufferGeometry();

    var vertices = [];
    var indices = [];
    var uvs = [];

    function buildWall(x, y, dirX, dirY, ramp){
        let indexStart = vertices.length / 3;

        if (ramp){
            let maxHeight = Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg);
            let minHeight = Math.min(mapData[y][x].height.pos, mapData[y][x].height.neg);
            let segments = Math.ceil(minHeight);
            let lastSegment = minHeight % 1;
            lastSegment = lastSegment == 0 ? 1 : lastSegment;

            if (dirX == -1){
                let atlas_coord = {x: (mapData[y][x].wallMaterial.w % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(mapData[y][x].wallMaterial.w / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                vertices.push(x - 0.5, minHeight, y - 0.5);
                vertices.push(x - 0.5, minHeight, y + 0.5);
                vertices.push(x - 0.5, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5));
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                uvs.push(atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                indices.push(indexStart, indexStart + 1, indexStart + 2);
                indexStart += 3;

                for (let i = segments - 1; i >= 0; i--){
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x - 0.5, i, y - 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x - 0.5, i, y + 0.5);
                    uvs.push(atlas_coord.x, atlas_coord.y + (ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1)));
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    indices.push(indexStart, indexStart + 1, indexStart + 3);
                    indices.push(indexStart, indexStart + 3, indexStart + 2);
                    indexStart += 4;
                    if (x != 0 && ((!mapData[y][x-1].ramp && mapData[y][x-1].height >= i) || (mapData[y][x-1].ramp && Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg) >= i))) break;
                }
            }
            else if (dirX == 1){
                let atlas_coord = {x: (mapData[y][x].wallMaterial.e % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(mapData[y][x].wallMaterial.e / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                vertices.push(x + 0.5, minHeight, y - 0.5);
                vertices.push(x + 0.5, minHeight, y + 0.5);
                vertices.push(x + 0.5, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5));
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                indices.push(indexStart, indexStart + 2, indexStart + 1);
                indexStart += 3;    

                for (let i = segments - 1; i >= 0; i--){
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x + 0.5, i, y - 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x + 0.5, i, y + 0.5);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    indices.push(indexStart, indexStart + 3, indexStart + 1);
                    indices.push(indexStart, indexStart + 2, indexStart + 3);
                    indexStart += 4;
                    if (x != mapSize.x - 1 && ((!mapData[y][x+1].ramp && mapData[y][x+1].height >= i) || (mapData[y][x+1].ramp && Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg) >= i))) break;
                }
            }
            else if (dirY == -1){
                let atlas_coord = {x: (mapData[y][x].wallMaterial.n % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(mapData[y][x].wallMaterial.n / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};
                    
                vertices.push(x - 0.5, minHeight, y - 0.5);
                vertices.push(x + 0.5, minHeight, y - 0.5);
                vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5), maxHeight, y - 0.5);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                indices.push(indexStart, indexStart + 2, indexStart + 1);
                indexStart += 3;

                for (let i = segments - 1; i >= 0; i--){
                    vertices.push(x - 0.5, i, y - 0.5);
                    vertices.push(x + 0.5, i, y - 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    indices.push(indexStart, indexStart + 3, indexStart + 1);
                    indices.push(indexStart, indexStart + 2, indexStart + 3);
                    indexStart += 4;
                    if (y != 0 && ((!mapData[y-1][x].ramp && mapData[y-1][x].height >= i) || (mapData[y-1][x].ramp && Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg) >= i))) break;
                }
            }
            else if (dirY == 1){
                let atlas_coord = {x: (mapData[y][x].wallMaterial.s % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(mapData[y][x].wallMaterial.s / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                vertices.push(x - 0.5, minHeight, y + 0.5);
                vertices.push(x + 0.5, minHeight, y + 0.5);
                vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5), maxHeight, y + 0.5);
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                uvs.push(atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                indices.push(indexStart, indexStart + 1, indexStart + 2);
                indexStart += 3;

                for (let i = segments - 1; i >= 0; i--){
                    vertices.push(x - 0.5, i, y + 0.5);
                    vertices.push(x + 0.5, i, y + 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    indices.push(indexStart, indexStart + 1, indexStart + 3);
                    indices.push(indexStart, indexStart + 3, indexStart + 2);
                    indexStart += 4;
                    if (y != mapSize.y - 1 && ((!mapData[y+1][x].ramp && mapData[y+1][x].height >= i) || (mapData[y+1][x].ramp && Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg) >= i))) break;
                }
            }
        }
        else{
            let segments = Math.ceil(mapData[y][x].height);
            let lastSegment = mapData[y][x].height % 1;
            lastSegment = lastSegment == 0 ? 1 : lastSegment;
            if (dirX == -1){
                for (let i = segments - 1; i >= 0; i--){
                    let matIndex = Array.isArray(mapData[y][x].wallMaterial.w) ? mapData[y][x].wallMaterial.w[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.w.length - 1)] : mapData[y][x].wallMaterial.w;
                    let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x - 0.5, i, y - 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x - 0.5, i, y + 0.5);
                    uvs.push(atlas_coord.x, atlas_coord.y + (ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1)));
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    indices.push(indexStart, indexStart + 1, indexStart + 3);
                    indices.push(indexStart, indexStart + 3, indexStart + 2);
                    indexStart += 4;
                    if (x != 0 && ((!mapData[y][x-1].ramp && mapData[y][x-1].height >= i) || (mapData[y][x-1].ramp && Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg) >= i))) break;
                }
            }
            else if (dirX == 1){
                for (let i = segments - 1; i >= 0; i--){
                    let matIndex = Array.isArray(mapData[y][x].wallMaterial.e) ? mapData[y][x].wallMaterial.e[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.e.length - 1)] : mapData[y][x].wallMaterial.e;
                    let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x + 0.5, i, y - 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x + 0.5, i, y + 0.5);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    indices.push(indexStart, indexStart + 3, indexStart + 1);
                    indices.push(indexStart, indexStart + 2, indexStart + 3);
                    indexStart += 4;
                    if (x != mapSize.x - 1 && ((!mapData[y][x+1].ramp && mapData[y][x+1].height >= i) || (mapData[y][x+1].ramp && Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg) >= i))) break;
                }
            }
            else if (dirY == -1){
                for (let i = segments - 1; i >= 0; i--){
                    let matIndex = Array.isArray(mapData[y][x].wallMaterial.n) ? mapData[y][x].wallMaterial.n[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.n.length - 1)] : mapData[y][x].wallMaterial.n;
                    let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};
                    
                    vertices.push(x - 0.5, i, y - 0.5);
                    vertices.push(x + 0.5, i, y - 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y - 0.5);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    indices.push(indexStart, indexStart + 3, indexStart + 1);
                    indices.push(indexStart, indexStart + 2, indexStart + 3);
                    indexStart += 4;
                    if (y != 0 && ((!mapData[y-1][x].ramp && mapData[y-1][x].height >= i) || (mapData[y-1][x].ramp && Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg) >= i))) break;
                }
            }
            else if (dirY == 1){
                for (let i = segments - 1; i >= 0; i--){
                    let matIndex = Array.isArray(mapData[y][x].wallMaterial.s) ? mapData[y][x].wallMaterial.s[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.s.length - 1)] : mapData[y][x].wallMaterial.s;
                    let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x - 0.5, i, y + 0.5);
                    vertices.push(x + 0.5, i, y + 0.5);
                    vertices.push(x - 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    vertices.push(x + 0.5, i + (i == segments-1 ? lastSegment : 1), y + 0.5);
                    uvs.push(atlas_coord.x, atlas_coord.y);
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                    uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                    indices.push(indexStart, indexStart + 1, indexStart + 3);
                    indices.push(indexStart, indexStart + 3, indexStart + 2);
                    indexStart += 4;
                    if (y != mapSize.y - 1 && ((!mapData[y+1][x].ramp && mapData[y+1][x].height >= i) || (mapData[y+1][x].ramp && Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg) >= i))) break;
                }
            }
        }
    }

    for (let y = 0; y < mapData.length; y++){
        for (let x = 0; x < mapData[y].length; x++){
            if (mapData[y][x].height == 0) continue;

            let indexStart = vertices.length / 3;
            let atlas_coord = {x: (mapData[y][x].material % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: Math.floor(mapData[y][x].material / ATLAS_SIZE.x) / ATLAS_SIZE.y + EPSILON};
            if (mapData[y][x].ramp){
                var dirV = mapData[y][x].height.dir == "v";
                vertices.push(x - 0.5, mapData[y][x].height["neg"], y - 0.5);
                vertices.push(x + 0.5, mapData[y][x].height[dirV ? "neg" : "pos"], y - 0.5);
                vertices.push(x - 0.5, mapData[y][x].height[dirV ? "pos" : "neg"], y + 0.5);
                vertices.push(x + 0.5, mapData[y][x].height["pos"], y + 0.5);
                uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y);
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                indices.push(indexStart, indexStart + 3, indexStart + 1);
                indices.push(indexStart, indexStart + 2, indexStart + 3);

                var avg = (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2;

                if (dirV && (x == 0 || (!mapData[y][x-1].ramp && avg > mapData[y][x-1].height) || (mapData[y][x-1].ramp && avg > (mapData[y][x-1].height.pos + mapData[y][x-1].height.neg) / 2))){
                    buildWall(x, y, -1, 0, true);
                }
                if (dirV && (x == mapSize.x - 1 || (!mapData[y][x+1].ramp && avg > mapData[y][x+1].height) || (mapData[y][x+1].ramp && avg > (mapData[y][x+1].height.pos + mapData[y][x+1].height.neg) / 2))){
                    buildWall(x, y, 1, 0, true);
                }
                if (!dirV && (y == 0 || (!mapData[y-1][x].ramp && avg > mapData[y-1][x].height) || (mapData[y-1][x].ramp && avg > (mapData[y-1][x].height.pos + mapData[y-1][x].height.neg) / 2))){
                    buildWall(x, y, 0, -1, true);
                }
                if (!dirV && (y == mapSize.y - 1 || (!mapData[y+1][x].ramp && avg > mapData[y+1][x].height) || (mapData[y+1][x].ramp && avg > (mapData[y+1][x].height.pos + mapData[y+1][x].height.neg) / 2))){
                    buildWall(x, y, 0, 1, true);
                }
            }
            else {
                vertices.push(x - 0.5, mapData[y][x].height, y - 0.5);
                vertices.push(x + 0.5, mapData[y][x].height, y - 0.5);
                vertices.push(x - 0.5, mapData[y][x].height, y + 0.5);
                vertices.push(x + 0.5, mapData[y][x].height, y + 0.5);
                uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y);
                uvs.push(atlas_coord.x, atlas_coord.y);
                uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                indices.push(indexStart, indexStart + 3, indexStart + 1);
                indices.push(indexStart, indexStart + 2, indexStart + 3);

                if (x == 0 || (!mapData[y][x-1].ramp && mapData[y][x].height > mapData[y][x-1].height) || (mapData[y][x-1].ramp && mapData[y][x].height > (mapData[y][x-1].height.pos + mapData[y][x-1].height.neg) / 2)){
                    buildWall(x, y, -1, 0, false);
                }
                if (x == mapSize.x - 1 || (!mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height) || (mapData[y][x+1].ramp && mapData[y][x].height > (mapData[y][x+1].height.pos + mapData[y][x+1].height.neg) / 2)){
                    buildWall(x, y, 1, 0, false);
                }
                if (y == 0 || (!mapData[y-1][x].ramp && mapData[y][x].height > mapData[y-1][x].height) || (mapData[y-1][x].ramp && mapData[y][x].height > (mapData[y-1][x].height.pos + mapData[y-1][x].height.neg) / 2)){
                    buildWall(x, y, 0, -1, false);
                }
                if (y == mapSize.y - 1 || (!mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height) || (mapData[y+1][x].ramp && mapData[y][x].height > (mapData[y+1][x].height.pos + mapData[y+1][x].height.neg) / 2)){
                    buildWall(x, y, 0, 1, false);
                }
            }

            //Block placements
            if (x > 0 && !mapData[y][x].connections.w && !mapData[y][x].ramp && !mapData[y][x-1].ramp && mapData[y][x].height > mapData[y][x-1].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1/4, 1/4, 1), BlockMat);
                block.position.set(x - 0.5 + 1/8, mapData[y][x].height + 1/8, y);
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (x < mapSize.x - 1 && !mapData[y][x].connections.e && !mapData[y][x].ramp && !mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1/4, 1/4, 1), BlockMat);
                block.position.set(x + 0.5 - 1/8, mapData[y][x].height + 1/8, y);
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (y > 0 && !mapData[y][x].connections.n && !mapData[y][x].ramp && !mapData[y-1][x].ramp && mapData[y][x].height > mapData[y-1][x].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/4, 1/4), BlockMat);
                block.position.set(x, mapData[y][x].height + 1/8, y- 0.5 + 1/8);
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (y < mapSize.y - 1 && !mapData[y][x].connections.s && !mapData[y][x].ramp && !mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/4, 1/4), BlockMat);
                block.position.set(x, mapData[y][x].height + 1/8, y + 0.5 - 1/8);
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }

            //Trim placements
            if (x == 0 || mapData[y][x-1].height == 0){
                //Place a block there
                let block;
                if (mapData[y][x].ramp){
                    let extension = 0;
                    let angle = Math.atan2(mapData[y][x].height.neg - mapData[y][x].height.pos, 1);
                    if (y > 0 && mapData[y-1][x].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    if (y < mapSize.y - 1 && mapData[y+1][x].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension), TrimMat);
                    block.position.set(x - 0.5 + 1/32, (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)), y + ((1/32 - (extension/2)) * Math.sin(angle)));
                    block.setRotationFromEuler(new THREE.Euler(angle, 0, 0));
                }
                else{
                    let extension = 0;
                    let offset = 0;
                    if (y > 0 && mapData[y-1][x].ramp && mapData[y-1][x].height.neg < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y-1][x].height.neg - mapData[y-1][x].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (y < mapSize.y - 1 && mapData[y+1][x].ramp && mapData[y+1][x].height.pos < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y+1][x].height.neg - mapData[y+1][x].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (x > 0 && y > 0 && mapData[y-1][x-1].height == mapData[y][x].height){
                        offset += 1/32;
                        extension += 1/16;
                    }
                    if (x > 0 && y < mapSize.y - 1 && mapData[y+1][x-1].height == mapData[y][x].height){
                        offset -= 1/32;
                        extension += 1/16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, 1 + extension), TrimMat);
                    block.position.set(x - 0.5 + 1/32, mapData[y][x].height + 1/32, y - offset);
                }
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (x == mapSize.x - 1 || mapData[y][x+1].height == 0){
                //Place a block there
                let block;
                if (mapData[y][x].ramp){
                    let extension = 0;
                    let angle = Math.atan2(mapData[y][x].height.neg - mapData[y][x].height.pos, 1);
                    if (y > 0 && mapData[y-1][x].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    if (y < mapSize.y - 1 && mapData[y+1][x].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension), TrimMat);
                    block.position.set(x + 0.5 - 1/32, (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)), y + ((1/32 - (extension/2)) * Math.sin(angle)));
                    block.setRotationFromEuler(new THREE.Euler(angle, 0, 0));
                }
                else{
                    let extension = 0;
                    let offset = 0;
                    if (y > 0 && mapData[y-1][x].ramp && mapData[y-1][x].height.neg < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y-1][x].height.neg - mapData[y-1][x].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (y < mapSize.y - 1 && mapData[y+1][x].ramp && mapData[y+1][x].height.pos < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y+1][x].height.neg - mapData[y+1][x].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (x < mapSize.x - 1 && y > 0 && mapData[y-1][x+1].height == mapData[y][x].height){
                        offset += 1/32;
                        extension += 1/16;
                    }
                    if (x < mapSize.x - 1 && y < mapSize.y - 1 && mapData[y+1][x+1].height == mapData[y][x].height){
                        offset -= 1/32;
                        extension += 1/16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, 1 + extension), TrimMat);
                    block.position.set(x + 0.5 - 1/32, mapData[y][x].height + 1/32, y - offset);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (y == 0 || mapData[y-1][x].height == 0){
                //Place a block there
                let block;
                if (mapData[y][x].ramp){
                    let extension = 0;
                    let angle = Math.atan2(mapData[y][x].height.neg - mapData[y][x].height.pos, 1);
                    if (x > 0 && mapData[y][x-1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    if (x < mapSize.x - 1 && mapData[y][x+1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat);
                    block.position.set((mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)), y + ((1/32 - (extension/2)) * Math.sin(angle)), y - 0.5 + 1/32);
                    block.setRotationFromEuler(new THREE.Euler(0, 0, angle));
                }
                else{
                    let extension = 0;
                    let offset = 0;
                    if (x > 0 && mapData[y][x-1].ramp && mapData[y][x-1].height.neg < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y][x-1].height.neg - mapData[y][x-1].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (x < mapSize.x - 1 && mapData[y][x+1].ramp && mapData[y][x+1].height.pos < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y][x+1].height.neg - mapData[y][x+1].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1 + extension, 1/16, 1/16), TrimMat);
                    block.position.set(x - offset, mapData[y][x].height + 1/32, y - 0.5 + 1/32);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
            if (y == mapSize.y - 1 || mapData[y+1][x].height == 0){
                //Place a block there
                let block;
                if (mapData[y][x].ramp){
                    let extension = 0;
                    let angle = Math.atan2(mapData[y][x].height.neg - mapData[y][x].height.pos, 1);
                    if (x > 0 && mapData[y][x-1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    if (x < mapSize.x - 1 && mapData[y][x+1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                        let v = Math.sin(-angle/2);
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat);
                    block.position.set((mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)), y + ((1/32 - (extension/2)) * Math.sin(angle)), y + 0.5 - 1/32);
                    block.setRotationFromEuler(new THREE.Euler(0, 0, angle));
                }
                else{
                    let extension = 0;
                    let offset = 0;
                    if (x > 0 && mapData[y][x-1].ramp && mapData[y][x-1].height.neg < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y][x-1].height.neg - mapData[y][x-1].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    if (x < mapSize.x - 1 && mapData[y][x+1].ramp && mapData[y][x+1].height.pos < mapData[y][x].height){
                        let v = Math.sin(-Math.atan2(mapData[y][x+1].height.neg - mapData[y][x+1].height.pos, 1) / 2);
                        offset += v / 32;
                        extension += Math.abs(v) / 16;
                    }
                    block = new THREE.Mesh(new THREE.BoxGeometry(1 + extension, 1/16, 1/16), TrimMat);
                    block.position.set(x - offset, mapData[y][x].height + 1/32, y + 0.5 - 1/32);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                Scene.add(block);
            }
        }
    }


    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.computeVertexNormals();

    var mat = new THREE.MeshStandardMaterial({ map: ATLAS });
    MapMesh = new THREE.Mesh(geometry, mat);
    MapMesh.castShadow = true;
    MapMesh.receiveShadow = true;
    Scene.add(MapMesh);

    Renderer.domElement.style.filter = "blur(10px) opacity(50%)";
    let angle = Date.now() / 10000;
    Camera.position.set(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
    Camera.lookAt(new THREE.Vector3(mapSize.x / 2, 2.5, mapSize.y / 2));

    InitializeSocket();

    update();
}

loadMap();

const ItemData = {
    doubledice: {
        name: "Double Dice",
        description: "Roll 2 dice and move their total value",
        url: "/resources/textures/doubledice.png",
        price: 5,
        image: TexLoader.load("/resources/textures/doubledice.png")
    },
    tripledice: {
        name: "Triple Dice",
        description: "Roll 3 dice and move their total value",
        url: "/resources/textures/tripledice.png",
        price: 10,
        image: TexLoader.load("/resources/textures/tripledice.png")
    },
    pipe: {
        name: "Warp Pipe",
        description: "Warps you to a random tile on the board",
        url: "/resources/textures/pipe.png",
        price: 4,
        image: TexLoader.load("/resources/textures/pipe.png")
    },
    goldpipe: {
        name: "Gold Pipe",
        description: "Warps you directly to the star",
        url: "/resources/textures/goldpipe.png",
        price: 25,
        image: TexLoader.load("/resources/textures/goldpipe.png")
    },
    customdice: {
        name: "Custom Dice",
        description: "Choose any number between 1 and 10 to roll",
        url: "/resources/textures/customdice.png",
        price: 10,
        image: TexLoader.load("/resources/textures/customdice.png")
    },
    mushroom: {
        name: "Mushroom",
        description: "Add 3 onto your next roll",
        url: "/resources/textures/mushroom.png",
        price: 3,
        image: TexLoader.load("/resources/textures/mushroom.png")
    },
    shophopbox: {
        name: "Shop Hop Box",
        description: "Warp to a random shop",
        url: "/resources/textures/shophopbox.png",
        price: 7,
        image: TexLoader.load("/resources/textures/shophopbox.png")
    }
};

var keys = {};
window.onkeydown = function(e){ 
    keys[e.keyCode] = true; 

    if (e.keyCode == 13){
        //Enter
        
    }

    //Map Build Stuff
    /*if (e.keyCode == 13){
        //Enter
        let input = prompt("Material", mapData[PlayerData.position.y][PlayerData.position.x].material);
        mapData[PlayerData.position.y][PlayerData.position.x].material = Number.parseInt(input);
        Scene.remove(MapMesh);
        buildMap();
    }
    if (e.keyCode == 27){
        //ESC
        navigator.clipboard.writeText(JSON.stringify(mapData, null, "\t"));
    }*/
}
window.onkeyup = function(e){ keys[e.keyCode] = false; }

const StartingTile = { x: 15, y: 30 };
const ShopWarpTiles = [
    {x: 7, y: 17},
    {x: 13, y: 13},
    {x: 7, y: 10},
    {x: 13, y: 20}
];

var PlayerData = {
    position: {
        x: 15,
        y: 30
    },
    roll: 0,
    items: [],
    coins: 10,
    stars: 0,
    currentTurn: 1,
    turnsCompleted: 0
};

var lastFrameTime = Date.now();
const UIPanels = {
    connecting: document.getElementById("connecting"),
    login: document.getElementById("login"),
    checkin: document.getElementById("checkin"),
    waitMinigame: document.getElementById("waiting-minigame"),
    minigame: document.getElementById("minigame")
};

const MinigameChatElement = document.getElementsByClassName("minigame-chat")[0];
var isMinigameChatScrolledToBottom = true;
var DeltaTime = 0;
function update(){
    var thisFrameTime = Date.now();
    DeltaTime = (thisFrameTime - lastFrameTime) / 1000;
    lastFrameTime = thisFrameTime;
    document.getElementsByClassName("debug")[0].textContent = "FPS: " + Math.round(1 / DeltaTime);

    if (MinigameChatElement.parentElement.style.display == "initial"){
        isMinigameChatScrolledToBottom = MinigameChatElement.scrollHeight - MinigameChatElement.clientHeight <= MinigameChatElement.scrollTop + 1;
        if (isMinigameChatScrolledToBottom && MinigameChatElement.parentElement.style.display == "initial") minigameChatNotification.style.display = "none";
    }

    DoTurn();

    UpdateUI();
    
    Renderer.render(Scene, Camera);
    requestAnimationFrame(update);
}

var UIState = "menu";
var lastUIState = "menu";
var transitionValues = {
    filter: null,
    playerRot: null,
    playerPos: null,
    cameraRot: null,
    cameraPos: null
};
const transitionLength = {
    menu: 500,
    orbit: 500,
    player: 500,
    above: 200,
    roll: 200,
    map: 500
};
var transitionStart = 0;
function UpdateUI(){
    var filter;
    var playerRot;
    var playerPos;
    var cameraRot;
    var cameraPos;

    if (UIState == "override") return;

    if (UIState == "menu"){
        filter = 1;
        let angle = Date.now() / 10000 % (Math.PI * 2);
        playerRot = new THREE.Euler(0, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? (mapData[PlayerData.position.y][PlayerData.position.x].height.pos + mapData[PlayerData.position.y][PlayerData.position.x].height.neg) / 2 : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        cameraRot = new THREE.Euler(-Math.PI / 12, Math.PI / 2 - angle, 0, "YXZ");
    }
    else if (UIState == "orbit"){
        filter = 0;
        let angle = Date.now() / 10000 % (Math.PI * 2);
        playerRot = new THREE.Euler(0, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? (mapData[PlayerData.position.y][PlayerData.position.x].height.pos + mapData[PlayerData.position.y][PlayerData.position.x].height.neg) / 2 : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        cameraRot = new THREE.Euler(-Math.PI / 12, Math.PI / 2 - angle, 0, "YXZ");
    }
    else if (UIState == "player"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? (mapData[PlayerData.position.y][PlayerData.position.x].height.pos + mapData[PlayerData.position.y][PlayerData.position.x].height.neg) / 2 : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 0.125, Player.position.z + 1.5);
        cameraRot = new THREE.Euler(0, 0, 0);
    }
    else if (UIState == "roll"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? (mapData[PlayerData.position.y][PlayerData.position.x].height.pos + mapData[PlayerData.position.y][PlayerData.position.x].height.neg) / 2 : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 0.5, Player.position.z + 1.75);
        cameraRot = new THREE.Euler(0, 0, 0);
    }
    else if (UIState == "above"){
        filter = 0;
        playerRot = new THREE.Euler(-Math.PI / 2, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? Math.max(mapData[PlayerData.position.y][PlayerData.position.x].height.pos, mapData[PlayerData.position.y][PlayerData.position.x].height.neg) : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.02, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 5, Player.position.z);
        cameraRot = new THREE.Euler(-Math.PI / 2, 0, 0);
    }
    else if (UIState == "map"){
        filter = 0;
        playerRot = new THREE.Euler(-Math.PI / 2, 0, 0);
        let yPos = mapData[PlayerData.position.y][PlayerData.position.x].ramp ? Math.max(mapData[PlayerData.position.y][PlayerData.position.x].height.pos, mapData[PlayerData.position.y][PlayerData.position.x].height.neg) : mapData[PlayerData.position.y][PlayerData.position.x].height;
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.02, PlayerData.position.y);
        cameraPos = new THREE.Vector3(mapSize.x / 2, 20, mapSize.y / 2);
        cameraRot = new THREE.Euler(-Math.PI / 2, 0, 0);
    }

    if (lastUIState != UIState){
        //Enable transition
        lastUIState = UIState;
        transitionStart = Date.now();
    }

    if (transitionStart + transitionLength[UIState] > Date.now()){
        let t = (Date.now() - transitionStart) / transitionLength[UIState];

        filter = lerp(transitionValues.filter, filter, t);
        playerPos = new THREE.Vector3(lerp(transitionValues.playerPos.x, playerPos.x, t), lerp(transitionValues.playerPos.y, playerPos.y, t), lerp(transitionValues.playerPos.z, playerPos.z, t));
        playerRot = new THREE.Euler(lerp(transitionValues.playerRot.x, playerRot.x, t), lerp(transitionValues.playerRot.y, playerRot.y, t), lerp(transitionValues.playerRot.z, playerRot.z, t), "YXZ");
        cameraPos = new THREE.Vector3(lerp(transitionValues.cameraPos.x, cameraPos.x, t), lerp(transitionValues.cameraPos.y, cameraPos.y, t), lerp(transitionValues.cameraPos.z, cameraPos.z, t));
        cameraRot = new THREE.Euler(lerp(transitionValues.cameraRot.x, cameraRot.x, t), lerp(transitionValues.cameraRot.y, cameraRot.y, t), lerp(transitionValues.cameraRot.z, cameraRot.z, t), "YXZ");
    }
    else{
        transitionValues.filter = filter;
        transitionValues.playerRot = playerRot;
        transitionValues.playerPos = playerPos;
        transitionValues.cameraRot = cameraRot;
        transitionValues.cameraPos = cameraPos;
    }

    Renderer.domElement.style.filter = filter > 0 ? "blur(" + (10 * filter) + "px) opacity(" + (100 - (50 * filter)) + "%)" : "";
    Player.setRotationFromEuler(playerRot);
    Player.position.set(playerPos.x, playerPos.y, playerPos.z);
    Camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    Camera.setRotationFromEuler(cameraRot);
}

function getHeightTile(x, y){
    return mapData[y][x].ramp ? (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 : mapData[y][x].height;
}


var RollClick = false;
document.getElementsByClassName("roll-canvas-button")[0].onclick = function(e){
    RollClick = true;
}
document.getElementById("roll-button").onclick = function(e){
    if (turnStep == "menu"){
        turnStep = "roll";
        UIState = "roll";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementsByClassName("roll-inputs")[0].style.display = "initial";
        PlayerData.roll = 0;
        document.getElementsByClassName("custom-dice-input")[0].style.display = customDiceRoll == 0 ? "none" : "initial";
    }
}
document.getElementById("items-button").onclick = function(e){
    if (turnStep == "menu"){
        turnStep = "item";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementsByClassName("item-menu")[0].style.display = "initial";
        UpdateItemUI();
    }
}

var turnStep = "menu";
var turnAnimTimer = 0;
var rollsRemaining = 1;
var currentRoll = 0;
var addToRoll = 0;
var openShopPreview = "";
var customDiceRoll = 0;
var luckyOptions = document.getElementsByClassName("lucky-option");
var luckyTimer = 0;
var luckyClickTimer = -1;
const luckyItemOptions = ["doubledice", "tripledice", "mushroom", "customdice", "shophopbox", "pipe"];
var luckyRouletteItems = [];
function DoTurn(){
    if (turnStep == "menu"){

    }
    else if (turnStep == "roll"){
        if (customDiceRoll == 0){
            if (turnAnimTimer == 0){
                console.log(rollsRemaining);
                Dice[rollsRemaining - 1].position.set(Player.position.x, Player.position.y + 0.85, Player.position.z);
                Dice[rollsRemaining - 1].rotation.set(Date.now() / 96, Date.now() / 232, Date.now() / 181, "YXZ");
                Dice[rollsRemaining - 1].scale.set(0.85, 0.85, 0.85);

                if (RollClick){
                    turnAnimTimer = 1.5;
                    UIState = "override";
                    document.getElementsByClassName("roll-back-button")[0].style.display = "none";

                    //Do Roll
                    currentRoll = Math.floor(Math.random() * 10) + 1;
                    PlayerData.roll += currentRoll + addToRoll;
                    addToRoll = 0;
                    spacesMoved = 0;
                    Dice[rollsRemaining - 1].children[5].geometry.dispose();
                    Dice[rollsRemaining - 1].children[5].geometry = new TextGeometry("" + currentRoll, {font: DiceFont, size: 0.45, depth: 0, curveSegments: 1});
                    if (currentRoll == 10){
                        Dice[rollsRemaining - 1].children[5].position.set(-0.1625, -0.169, 0.2525);
                    }
                    else if (currentRoll == 1){
                        Dice[rollsRemaining - 1].children[5].position.set(-0.06, -0.169, 0.2525);
                    }
                    else{
                        Dice[rollsRemaining - 1].children[5].position.set(-0.115, -0.169, 0.2525);
                    }
                    document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
                    moveHistory = [];
                    rollsRemaining--;
                    SetMoveUI();
                    saveCookies();
                }
            }
            else{
                let lastAnimTimer = turnAnimTimer;
                turnAnimTimer -= DeltaTime;

                let targetPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
                if (turnAnimTimer > 1.4){
                    //Start Jump
                    let t = 1 - ((turnAnimTimer - 1.4) / 0.1);
                    Dice[rollsRemaining].position.set(targetPlayerPos.x, targetPlayerPos.y + 0.85, targetPlayerPos.z);
                    Dice[rollsRemaining].rotation.set(Date.now() / 96 % (Math.PI * 2), Date.now() / 232 % (Math.PI * 2), Date.now() / 181 % (Math.PI * 2), "YXZ");
                    Player.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0, 0.35, t), targetPlayerPos.z);
                }
                else if (turnAnimTimer > 1.3){
                    //Hit Dice Block Up
                    let t = 1 - ((turnAnimTimer - 1.3) / 0.1);
                    Dice[rollsRemaining].position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.85, 1.1, t), targetPlayerPos.z);
                    Dice[rollsRemaining].rotation.set(0, 0, 0, "YXZ");
                    Player.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.35, 0.6, t), targetPlayerPos.z);
                }
                else if (turnAnimTimer > 1.2){
                    //Hit Dice Block Down
                    let t = 1 - ((turnAnimTimer - 1.2) / 0.1);
                    Dice[rollsRemaining].position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(1.1, 0.85, t), targetPlayerPos.z);
                    Player.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.6, 0.35, t), targetPlayerPos.z);
                }
                else if (turnAnimTimer > 1.1){
                    //Fall To Ground
                    let t = 1 - ((turnAnimTimer - 1.1) / 0.1);
                    Player.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.35, 0, t), targetPlayerPos.z);
                }
                else if (turnAnimTimer > 0.1){
                    //Pause or move dice to side
                    if (rollsRemaining > 0){
                        if (turnAnimTimer > 0.9){
                            let t = 1 - ((turnAnimTimer - 1) / 0.2);
                            Dice[rollsRemaining].position.set(targetPlayerPos.x + lerp(0, rollsRemaining == 1 ? -0.5 : 0.5, t), targetPlayerPos.y + 0.85, targetPlayerPos.z - lerp(0, 0.25, t));
                        }
                        else{
                            Dice[rollsRemaining].position.set(targetPlayerPos.x + (rollsRemaining == 1 ? -0.5 : 0.5), targetPlayerPos.y + 0.85, targetPlayerPos.z - 0.25);
                            turnAnimTimer = 0;
                        }
                    }
                }
                else if (turnAnimTimer > 0){
                    //Put Dice Away
                    let t = turnAnimTimer / 0.1;
                    for (var i = 0; i < Dice.length; i++){
                        Dice[i].scale.set(Math.max(Dice[i].scale.x - (8.5 * DeltaTime), 0), Math.max(Dice[i].scale.y - (8.5 * DeltaTime), 0), Math.max(Dice[i].scale.z - (8.5 * DeltaTime), 0));
                    }
                    document.getElementsByClassName("roll-display")[0].style.transform = "scale(" + ((1 - t) * 100) + "%)";
                }
                else{
                    for (var i = 0; i < Dice.length; i++){
                        Dice[i].scale.set(0, 0, 0);
                    }
                    turnAnimTimer = 0;
                    UIState = "above";
                    turnStep = "move";
                    document.getElementsByClassName("board-inputs")[0].style.display = "initial";
                    document.getElementsByClassName("roll-inputs")[0].style.display = "none";
                    document.getElementsByClassName("roll-back-button")[0].style.display = "initial";
                }
            }
        }
        else{
            if (turnAnimTimer > 0){
                turnAnimTimer = Math.max(0, turnAnimTimer - DeltaTime);
                let t = turnAnimTimer * 4;
                Dice[0].rotation.set(0, lerp(0, Math.PI, t), 0);
            }
            else if (turnAnimTimer < 0){
                turnAnimTimer = Math.min(0, turnAnimTimer + DeltaTime);
                let t = turnAnimTimer * 4 + 1;
                Dice[0].rotation.set(0, lerp(0, Math.PI, t), 0);
            }
            else{
                Dice[0].position.set(Player.position.x, Player.position.y + 0.85, Player.position.z);
                Dice[0].rotation.set(0, 0, 0);
                Dice[0].scale.set(0.85, 0.85, 0.85);

                if (RollClick){
                    turnAnimTimer = 1.5;
                    UIState = "override";
                    document.getElementsByClassName("roll-back-button")[0].style.display = "none";

                    //Do Roll
                    currentRoll = customDiceRoll;
                    PlayerData.roll += currentRoll + addToRoll;
                    addToRoll = 0;
                    customDiceRoll = 0;
                    spacesMoved = 0;
                    
                    document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
                    moveHistory = [];
                    rollsRemaining--;
                    SetMoveUI();
                    saveCookies();

                    document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
                }
            }
        }
    }
    else if (turnStep == "map"){
        raycaster.setFromCamera(pointer, Camera);
        var intersections = raycaster.intersectObject(MapMesh, false);
        if (intersections.length > 0){
            //DO STUFF HERE!!!
            let intersectPos = new THREE.Vector2(Math.round(intersections[0].point.x), Math.round(intersections[0].point.z));
            DistanceAwayMap(intersectPos.x, intersectPos.y);
            mapSelectorBox.scale.set(1, 1, 1);
            if (!mapData[intersectPos.y][intersectPos.x].ramp){
                mapSelectorBox.position.set(intersectPos.x, mapData[intersectPos.y][intersectPos.x].height + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(-Math.PI / 2, 0, 0);
                mapSelectorBox.scale.set(1, 1, 1);
            }
            else if (mapData[intersectPos.y][intersectPos.x].height.dir == "v"){
                let angle = -Math.atan2(mapData[intersectPos.y][intersectPos.x].height.pos - mapData[intersectPos.y][intersectPos.x].height.neg, 1);
                mapSelectorBox.position.set(intersectPos.x, (mapData[intersectPos.y][intersectPos.x].height.pos + mapData[intersectPos.y][intersectPos.x].height.neg) / 2 + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(angle - (Math.PI / 2), 0, 0);
                mapSelectorBox.scale.set(1, Math.sqrt(Math.pow(mapData[intersectPos.y][intersectPos.x].height.pos - mapData[intersectPos.y][intersectPos.x].height.neg, 2) + 1), 1);
            }
            else{
                let angle = -Math.atan2(mapData[intersectPos.y][intersectPos.x].height.pos - mapData[intersectPos.y][intersectPos.x].height.neg, 1);
                mapSelectorBox.position.set(intersectPos.x, (mapData[intersectPos.y][intersectPos.x].height.pos + mapData[intersectPos.y][intersectPos.x].height.neg) / 2 + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(-Math.PI / 2, angle, 0);
                mapSelectorBox.scale.set(Math.sqrt(Math.pow(mapData[intersectPos.y][intersectPos.x].height.pos - mapData[intersectPos.y][intersectPos.x].height.neg, 2) + 1), 1, 1);
            }

            if (Object.hasOwn(mapData[intersectPos.y][intersectPos.x], "popup") && mapData[intersectPos.y][intersectPos.x].popup != "lucky-space"){
                if (mapData[intersectPos.y][intersectPos.x].popup != openShopPreview){
                    if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
                    openShopPreview = mapData[intersectPos.y][intersectPos.x].popup;
                    document.getElementById(openShopPreview + "-preview").style.display = "initial";
                }
            }
            else{
                if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
                openShopPreview = "";
            }
        }
        else{
            if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
            openShopPreview = "";
            document.getElementsByClassName("map-distance-text")[0].textContent = "";
            mapSelectorBox.scale.set(0, 0, 0);
        }
    }
    else if (turnStep == "star-get-anim"){
        StarGetAnimation();
    }
    else if (turnStep == "pipe-warp-anim" || turnStep == "pipe-warp-anim-end-turn"){
        PipeWarpAnimation();
    }
    else if (turnStep == "gold-pipe-warp-anim"){
        GoldPipeWarpAnimation();
    }
    else if (turnStep == "give-item-anim"){
        GiveItemAnimation();
    }
    else if (turnStep == "coin-change-anim"){
        if (giveCoinsAnimAmount < 0) LoseCoinsAnimation();
        else GainCoinsAnimation();
    }
    else if (turnStep == "coin-space-anim"){
        CoinSpaceAnimation();
    }
    else if (turnStep == "popup"){
        if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "lucky-space"){
            luckyTimer += luckyClickTimer == -1 ? DeltaTime : DeltaTime * lerp(0, 0.85, Math.max(Math.min(luckyClickTimer - 1, 2), 0) / 2);
            let selectedIndex = Math.floor(luckyTimer * 15) % 6;
            for (var i = 0; i < luckyOptions.length; i++){
                luckyOptions[i].classList.remove("lucky-selected");
                if (selectedIndex == i){
                    luckyOptions[i].classList.add("lucky-selected");
                }
            }
            luckyClickTimer = luckyClickTimer == -1 ? -1 : Math.max(0, luckyClickTimer - DeltaTime);
            if (luckyClickTimer == 0){
                document.getElementById("lucky-space").style.display = "none";
                //End
                if (selectedIndex % 2 == 0){
                    //Coins
                    TriggerCoinChangeAnimation([10, 5, 15][selectedIndex / 2]);
                }
                else{
                    //Item
                    TriggerGiveItemAnimation(luckyRouletteItems[(selectedIndex - 1) / 2]);
                }
            }
        }
    }
    else if (turnStep == "end-turn"){
        EndTurn();
    }

    RollClick = false;
}

document.getElementsByClassName("lucky-stop-button")[0].onclick = function(e){
    document.getElementsByClassName("lucky-stop-button")[0].disabled = true;
    luckyClickTimer = lerp(2, 4, Math.random());
}

function UpdateCustomDiceFace(){
    Dice[0].children[5].geometry.dispose();
    Dice[0].children[5].geometry = new TextGeometry("" + customDiceRoll, {font: DiceFont, size: 0.45, depth: 0, curveSegments: 1});
    if (customDiceRoll == 10){
        Dice[0].children[5].position.set(-0.1625, -0.169, 0.2525);
    }
    else if (customDiceRoll == 1){
        Dice[0].children[5].position.set(-0.06, -0.169, 0.2525);
    }
    else{
        Dice[0].children[5].position.set(-0.115, -0.169, 0.2525);
    }
}
document.getElementsByClassName("increase-dice-button")[0].onclick = function(e){
    if (turnStep == "roll" && customDiceRoll != 0 && turnAnimTimer == 0){
        turnAnimTimer = -0.25;
        customDiceRoll++;
        if (customDiceRoll == 11) customDiceRoll = 1;

        UpdateCustomDiceFace();
    }
}
document.getElementsByClassName("decrease-dice-button")[0].onclick = function(e){
    if (turnStep == "roll" && customDiceRoll != 0 && turnAnimTimer == 0){
        turnAnimTimer = 0.25;
        customDiceRoll--;
        if (customDiceRoll == 0) customDiceRoll = 10;

        UpdateCustomDiceFace();
    }
}

function DistanceAwayMap(tx, ty){
    var checkedTiles = [];
    for (var j = 0; j < mapData.length; j++){
        checkedTiles.push([]);
        for (var i = 0; i < mapData[j].length; i++){
            checkedTiles[j].push(false);
        }
    }

    var found = false;
    var checkList = [{x: PlayerData.position.x, y: PlayerData.position.y}];
    var activeCheckList = [];
    var l = 0;
    for (l = 0; l < 50 && !found; l++){
        activeCheckList = [];
        for (var n = 0; n < checkList.length; n++) activeCheckList.push(checkList[n]);
        checkList = [];
        for (var j = 0; j < activeCheckList.length; j++){
            let check = activeCheckList[j];
            if (check.x == tx && check.y == ty){
                found = true;
                break;
            }
            else if (!checkedTiles[check.y][check.x]){
                checkedTiles[check.y][check.x] = true;
                if (check.x > 0 && mapData[check.y][check.x].connections.w && mapData[check.y][check.x - 1].height !== 0){
                    checkList.push({x: check.x - 1, y: check.y});
                }
                if (check.x < mapSize.x - 1 && mapData[check.y][check.x].connections.e && mapData[check.y][check.x + 1].height !== 0){
                    checkList.push({x: check.x + 1, y: check.y});
                }
                if (check.y > 0 && mapData[check.y][check.x].connections.n && mapData[check.y - 1][check.x].height !== 0){
                    checkList.push({x: check.x, y: check.y - 1});
                }
                if (check.y < mapSize.y - 1 && mapData[check.y][check.x].connections.s && mapData[check.y + 1][check.x].height !== 0){
                    checkList.push({x: check.x, y: check.y + 1});
                }
            }
        }
    }

    if (found){
        document.getElementsByClassName("map-distance-text")[0].textContent = (l - 1) + " Away";
    }
    else{
        document.getElementsByClassName("map-distance-text")[0].textContent = "Cannot get here";
    }
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.onpointermove = function(e){
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function SetMoveUI(){
    if (spacesMoved < PlayerData.roll){
        document.getElementsByClassName("move-undo-button")[0].style.display = spacesMoved > 0 ? "initial" : "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("roll-display")[0].children[0].textContent = PlayerData.roll - spacesMoved;
        document.getElementsByClassName("left-move-button")[0].style.display = 
            PlayerData.position.x > 0 && mapData[PlayerData.position.y][PlayerData.position.x].connections.w && mapData[PlayerData.position.y][PlayerData.position.x - 1].height != 0 ? "initial" : "none";
        document.getElementsByClassName("right-move-button")[0].style.display = 
            PlayerData.position.x < mapSize.x - 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.e && mapData[PlayerData.position.y][PlayerData.position.x + 1].height != 0 ? "initial" : "none";
        document.getElementsByClassName("up-move-button")[0].style.display = 
            PlayerData.position.y > 0 && mapData[PlayerData.position.y][PlayerData.position.x].connections.n && mapData[PlayerData.position.y - 1][PlayerData.position.x].height != 0 ? "initial" : "none";
        document.getElementsByClassName("down-move-button")[0].style.display = 
            PlayerData.position.y < mapSize.y - 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.s && mapData[PlayerData.position.y + 1][PlayerData.position.x].height != 0 ? "initial" : "none";
    }
    else{
        document.getElementsByClassName("move-undo-button")[0].style.display = "initial";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "initial";
        document.getElementsByClassName("roll-display")[0].children[0].textContent = "";
        document.getElementsByClassName("left-move-button")[0].style.display = "none";
        document.getElementsByClassName("right-move-button")[0].style.display = "none";
        document.getElementsByClassName("up-move-button")[0].style.display = "none";
        document.getElementsByClassName("down-move-button")[0].style.display = "none";
    }
}
var spacesMoved = 0;
var moveHistory = [];
function TestMoveSpace(xOffset, yOffset){
    if (turnStep == "move"){
        let x = PlayerData.position.x + xOffset;
        let y = PlayerData.position.y + yOffset;
        
        if (x < 0 || y < 0 || x > mapSize.x - 1 || y > mapSize.y - 1) return;
        if ((xOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.w) ||
            (xOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.e) ||
            (yOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.n) ||
            (yOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.s)){
            moveHistory.push(PlayerData.position);
            PlayerData.position = { x: x, y: y };
            spacesMoved++;
            SetMoveUI();
        }
    }
}
document.getElementsByClassName("roll-back-button")[0].onclick = (e) => {
    if (turnStep == "roll"){
        turnStep = "menu";
        UIState = "player";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        document.getElementsByClassName("roll-inputs")[0].style.display = "none";
        for (var i = 0; i < Dice.length; i++){
            Dice[i].scale.set(0, 0, 0);
        }
        document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
    }
}
document.getElementsByClassName("move-undo-button")[0].onclick = (e) => {
    if (spacesMoved > 0){
        let pos = moveHistory.pop();
        spacesMoved--;
        PlayerData.position = pos;
        SetMoveUI();
    }
}
document.getElementsByClassName("up-move-button")[0].onclick = (e) => { TestMoveSpace(0, -1); }
document.getElementsByClassName("down-move-button")[0].onclick = (e) => { TestMoveSpace(0, 1); }
document.getElementsByClassName("left-move-button")[0].onclick = (e) => { TestMoveSpace(-1, 0); }
document.getElementsByClassName("right-move-button")[0].onclick = (e) => { TestMoveSpace(1, 0); }

document.getElementsByClassName("item-back-button")[0].onclick = (e) => {
    if (turnStep == "item"){
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        document.getElementsByClassName("item-menu")[0].style.display = "none";
    }
    else if (turnStep == "popup"){
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "initial";
    }
};

var playerItemDisplays = document.getElementsByClassName("player-item");

var itemHover = [false, false, false];
document.getElementsByClassName("item-option")[0].onmouseover = (e) => { itemHover[0] = true; UpdateItemUI(); };
document.getElementsByClassName("item-option")[0].onmouseout = (e) => { itemHover[0] = false; UpdateItemUI(); };
document.getElementsByClassName("item-option")[1].onmouseover = (e) => { itemHover[1] = true; UpdateItemUI(); };
document.getElementsByClassName("item-option")[1].onmouseout = (e) => { itemHover[1] = false; UpdateItemUI(); };
document.getElementsByClassName("item-option")[2].onmouseover = (e) => { itemHover[2] = true; UpdateItemUI(); };
document.getElementsByClassName("item-option")[2].onmouseout = (e) => { itemHover[2] = false; UpdateItemUI(); };
function UpdateItemUI(){
    var itemElems = document.getElementsByClassName("item-option");
    var hover = false;
    for (var i = 0; i < playerItemDisplays.length; i++){
        playerItemDisplays[i].src = PlayerData.items.length > i ? ItemData[PlayerData.items[i]].url : "resources/textures/noitem.png";
    }
    for (var i = 0; i < itemHover.length; i++){
        itemElems[i].disabled = !(PlayerData.items.length > i);
        if (PlayerData.items.length > i){
            itemElems[i].style.backgroundImage = "url(\"" + ItemData[PlayerData.items[i]].url + "\")";
            if (itemHover[i]){
                document.getElementsByClassName("item-title")[0].textContent = turnStep == "item" ? ItemData[PlayerData.items[i]].name : "Toss which Item?";
                document.getElementsByClassName("item-description")[0].textContent = turnStep == "item" ? ItemData[PlayerData.items[i]].description : ItemData[PlayerData.items[i]].name + ": " + ItemData[PlayerData.items[i]].description;
                hover = true;
            }
        }
        else{
            itemElems[i].style.backgroundImage = "";
        }
    }
    if (hover) return;
    document.getElementsByClassName("item-title")[0].textContent = turnStep == "item" ? "Items" : "Toss which Item?";
    document.getElementsByClassName("item-description")[0].textContent = "Hover over an item to learn more about it";
}
document.getElementsByClassName("item-toss-option")[0].onmouseover = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = ItemData[tossItem4].description; };
document.getElementsByClassName("item-toss-option")[0].onmouseout = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = "Hover over an item to learn more about it"; };
document.getElementsByClassName("item-toss-option")[1].onmouseover = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = ItemData[PlayerData.items[0]].description; };
document.getElementsByClassName("item-toss-option")[1].onmouseout = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = "Hover over an item to learn more about it"; };
document.getElementsByClassName("item-toss-option")[2].onmouseover = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = ItemData[PlayerData.items[1]].description; };
document.getElementsByClassName("item-toss-option")[2].onmouseout = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = "Hover over an item to learn more about it"; };
document.getElementsByClassName("item-toss-option")[3].onmouseover = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = ItemData[PlayerData.items[2]].description; };
document.getElementsByClassName("item-toss-option")[3].onmouseout = (e) => { document.getElementsByClassName("item-toss-description")[0].textContent = "Hover over an item to learn more about it"; };
var tossItem4;
function UpdateTossItemUI(item4){
    tossItem4 = item4;
    var itemElems = document.getElementsByClassName("item-toss-option");
    itemElems[0].style.backgroundImage = "url(\"" + ItemData[item4].url + "\")";
    for (var i = 1; i < 4; i++){
        itemElems[i].style.backgroundImage = "url(\"" + ItemData[PlayerData.items[i - 1]].url + "\")";
    }
}
document.getElementsByClassName("item-option")[0].onclick = (e) => { UseItem(0); };
document.getElementsByClassName("item-option")[1].onclick = (e) => { UseItem(1); };
document.getElementsByClassName("item-option")[2].onclick = (e) => { UseItem(2); };
function UseItem(index){
    if (turnStep == "item"){
        if (PlayerData.items.length > index){
            switch (PlayerData.items[index]){
                case "doubledice":
                    rollsRemaining = 2;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    break;
                case "tripledice":
                    rollsRemaining = 3;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    break;
                case "pipe":
                    TriggerPipeWarpAnimation(RandomMapSpace(), false);
                    break;
                case "goldpipe":
                    TriggerGoldPipeWarpAnimation();
                    break;
                case "mushroom":
                    addToRoll = 3;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    break;
                case "customdice":
                    customDiceRoll = 5;
                    UpdateCustomDiceFace();
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    break;
                case "shophopbox":
                    TriggerPipeWarpAnimation(ShopWarpTiles[Math.floor(Math.random() * ShopWarpTiles.length)], false);
                    break;
                default:
                    console.error("Cannot Recognize item: " + PlayerData.items[index]);
                    break;
            }
            PlayerData.items.splice(index, 1);
            document.getElementsByClassName("item-menu")[0].style.display = "none";
            document.getElementById("items-button").disabled = true;
            UpdateItemUI();
        }
    }
    else if (turnStep == "popup"){
        //Disposed of an item to buy an item from the shop
        PlayerData.items.splice(index, 1);
        PlayerData.items.push(shopItemBuffer);
        PlayerData.coins -= ItemData[shopItemBuffer].price;
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        EndTurn();
        UpdateItemUI();
        UpdatePlayerUI();
    }
}

document.getElementsByClassName("item-toss-option")[0].onclick = (e) => { ReplaceItem(0) };
document.getElementsByClassName("item-toss-option")[1].onclick = (e) => { ReplaceItem(1) };
document.getElementsByClassName("item-toss-option")[2].onclick = (e) => { ReplaceItem(2) };
document.getElementsByClassName("item-toss-option")[3].onclick = (e) => { ReplaceItem(3) };
function ReplaceItem(index){
    if (index == 0){
        
    }
    else{
        index--;
        PlayerData.items.splice(index, 1);
        PlayerData.items.push(tossItem4);
    }

    document.getElementsByClassName("item-toss-menu")[0].style.display = "none";
    UpdateItemUI();
    EndTurn();
}

document.getElementsByClassName("move-end-turn-button")[0].onclick = (e) => {
    if (turnStep == "move"){
        if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "popup")){
            EndTurnPopup();
        }
        else if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "coins")){
            TriggerCoinSpaceAnimation(mapData[PlayerData.position.y][PlayerData.position.x].coins);
        }
        else{
            EndTurn();
        }
    }
}

var shopItems = document.getElementsByClassName("shop-button");
for (var i = 0; i < shopItems.length; i++){
    let shopItem = shopItems[i].getAttribute("item");
    shopItems[i].onmouseover = (e) => {
        document.getElementsByClassName("shop-description")[0].innerHTML = "<b>" + ItemData[shopItem].name + ":</b> " + ItemData[shopItem].description;
    }
    shopItems[i].onmouseout = (e) => {
        document.getElementsByClassName("shop-description")[0].innerHTML = "Hover over an item to learn about it";
    }
    shopItems[i].onclick = (e) => {
        PurchaseItem(shopItem);
    }
}

var shopLeaveButtons = document.getElementsByClassName("shop-leave-button");
for (var i = 0; i < shopLeaveButtons.length; i++){
    shopLeaveButtons[i].onclick = EndTurn;
}

function EndTurn(){
    if (PlayerData.roll == spacesMoved){
        if (turnStep == "popup") document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        UIState = "menu";
        turnStep = "wait";
        PlayerData.turnsCompleted = ServerTurn;
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        UIPanels.waitMinigame.style.display = "initial";
        saveCookies();
        Socket.send(JSON.stringify({ method: "end_turn", token: TOKEN, position: PlayerData.position, stars: PlayerData.stars, coins: PlayerData.coins, items: PlayerData.items }));
    }
}

function EndTurnPopup(){
    if (turnStep == "move" && PlayerData.roll == spacesMoved){
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "initial";
        turnStep = "popup";
        UIState = "player";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";

        if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "lucky-space"){
            document.getElementsByClassName("lucky-stop-button")[0].disabled = false;
            luckyTimer = 0;
            luckyClickTimer = -1;

            //Set item options on roulette
            luckyRouletteItems = [];
            while(luckyRouletteItems.length < 3){
                let index = Math.floor(Math.random() * luckyItemOptions.length);
                if (!luckyRouletteItems.includes(luckyItemOptions[index])){
                    luckyRouletteItems.push(luckyItemOptions[index]);
                }
            }
            for (var i = 0; i < 3; i++){
                luckyOptions[i * 2 + 1].textContent = ItemData[luckyRouletteItems[i]].name;
            }
        }
        else if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "star-1"){
            document.getElementsByClassName("purchase-star-button")[0].textContent = PlayerData.coins >= 20 ? "Yes" : "Not enough coins";
            document.getElementsByClassName("purchase-star-button")[0].disabled = PlayerData.coins < 20;
        }
    }
}

var shopItemBuffer = "";
function PurchaseItem(item){
    if (turnStep == "popup" && PlayerData.coins >= ItemData[item].price){
        if (PlayerData.items.length == 3){
            shopItemBuffer = item;
            document.getElementsByClassName("item-menu")[0].style.display = "initial";
            document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
            UpdateItemUI();
        }
        else{
            PlayerData.coins -= ItemData[item].price;
            PlayerData.items.push(item);
            document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
            EndTurn();
            UpdateItemUI();
            UpdatePlayerUI();
        }
    }
}

document.getElementsByClassName("purchase-star-button")[0].onclick = function(e){
    if (turnStep == "popup" && PlayerData.coins >= 20){
        PlayerData.coins -= 20;
        PlayerData.stars++;
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerStarGetAnimation();
    }
}


var animTimer = 0;

function TriggerStarGetAnimation(){
    UIState = "override";
    turnStep = "star-get-anim";
    animTimer = 4;

    StarRingParticle.scale.set(0, 0, 0);
    StarRingParticle.position.set(Player.position.x, Player.position.y, Player.position.z + 0.05);
}
function StarGetAnimation(){
    animTimer -= DeltaTime;
    let targetPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > 3){
        let t = 1 - ((animTimer - 3) / 1);
        Star.position.set(targetPlayerPos.x, targetPlayerPos.y + 0.575, targetPlayerPos.z);
        Star.scale.set(lerp(0, 0.0015, t), lerp(0, 0.0015, t), lerp(0, 0.0015, t));
        Star.rotation.set(0, lerp(Math.PI * 4, 0, t), 0);
    }
    else if (animTimer > 2){
        Star.position.set(targetPlayerPos.x, targetPlayerPos.y + 0.575, targetPlayerPos.z);
        Star.scale.set(0.0015, 0.0015, 0.0015);
        Star.rotation.set(0, 0, 0);
    }
    else if (animTimer > 1.5){
        let t = 1 - ((animTimer - 1.5) / 0.5);
        Star.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.575, 0.2, t), targetPlayerPos.z + lerp(0, 0.05, t));
        Star.scale.set(lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t));
        Star.rotation.set(0, 0, 0);
    }
    else if (animTimer > 1.25){
        let t = 1 - ((animTimer - 1.25) / 0.25);
        Star.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.2, 0, t), targetPlayerPos.z + 0.05);
        Star.scale.set(lerp(0.0005, 0, t), lerp(0.0005, 0, t), lerp(0.0005, 0, t));
    }
    else if (animTimer > 1){
        let t = 1 - ((animTimer - 1) / 0.25);
        Star.scale.set(0, 0, 0);
        StarRingParticle.scale.set(lerp(0, 0.35, t), lerp(0, 0.35, t), lerp(0, 0.35, t));
        StarRingParticle.material.opacity = lerp(0, 1, t);
        UpdatePlayerUI();
    }
    else if (animTimer > 0.5){
        let t = 1 - ((animTimer - 0.5) / 0.5);
        StarRingParticle.scale.set(lerp(0.35, 1, t), lerp(0.35, 1, t), lerp(0.35, 1, t));
        StarRingParticle.material.opacity = lerp(1, 0, t);
    }
    else if (animTimer > 0){
        StarRingParticle.scale.set(0, 0, 0);
    }
    else{
        TriggerPipeWarpAnimation(StartingTile, true);
    }
}

function RandomMapSpace(){
    var result;
    while(true){
        result = { x: Math.floor(Math.random() * mapSize.x), y: Math.floor(Math.random() * mapSize.y) };
        if (mapData[result.y][result.x].height !== 0) return result;
    }
}

var pipeWarpLocation;
function TriggerPipeWarpAnimation(location, endOfTurn){
    UIState = "override";
    turnStep = endOfTurn ? "pipe-warp-anim-end-turn" : "pipe-warp-anim";
    animTimer = 6;
    pipeWarpLocation = location;
}
function PipeWarpAnimation(){
    const animLength = 6;
    animTimer -= DeltaTime;

    let startPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
    let endPlayerPos = new THREE.Vector3(pipeWarpLocation.x, getHeightTile(pipeWarpLocation.x, pipeWarpLocation.y) + 0.375, pipeWarpLocation.y);

    if (animTimer > animLength - 0.15){
        let t = 1 - ((animTimer - animLength + 0.15) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0, 0.4, t), startPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - 0.6, startPlayerPos.z);
    }
    else if (animTimer > animLength - 0.3){
        let t = 1 - ((animTimer - animLength + 0.3) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.4, 0.65, t), startPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.6, 0.35, t), startPlayerPos.z);
    }
    else if (animTimer > animLength - 0.45){
        let t = 1 - ((animTimer - animLength + 0.45) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.65, 0.4, t), startPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.35, 0.1, t), startPlayerPos.z);
    }
    else if (animTimer > animLength - 1.45){
        let t = 1 - ((animTimer - animLength + 1.45) / 1);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.4, -0.3, t), startPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.475, startPlayerPos.z);
    }
    else if (animTimer > animLength - 3.45){
        let t = 1 - ((animTimer - animLength + 3.45) / 2);
        Player.position.set(endPlayerPos.x, 0, endPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.1, 0.6, t), startPlayerPos.z);
        Camera.position.set(lerp(startPlayerPos.x, endPlayerPos.x, t), lerp(startPlayerPos.y + 0.125, endPlayerPos.y + 0.125, t), lerp(startPlayerPos.z + 1.5, endPlayerPos.z + 1.5, t));
    }
    else if (animTimer > animLength - 4.45){
        let t = 1 - ((animTimer - animLength + 4.45) / 1);
        GreenPipe.rotation.set(Math.PI, Math.PI / 2, 0);
        GreenPipe.position.set(endPlayerPos.x, endPlayerPos.y + lerp(2, 1, t), endPlayerPos.z);
        Camera.position.set(endPlayerPos.x, endPlayerPos.y + 0.125, endPlayerPos.z + 1.5);
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 5) / 0.55);
        GreenPipe.position.set(endPlayerPos.x, endPlayerPos.y + 1, endPlayerPos.z);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + lerp(1, 0, t), endPlayerPos.z);
    }
    else if (animTimer > animLength - 6){
        let t = 1 - ((animTimer - animLength + 6) / 1);
        GreenPipe.position.set(endPlayerPos.x, endPlayerPos.y + lerp(1, 2, t), endPlayerPos.z);
        Player.position.set(endPlayerPos.x, endPlayerPos.y, endPlayerPos.z);
    }
    else{
        GreenPipe.rotation.set(0, Math.PI / 2, 0);
        GreenPipe.position.set(0, 0, 0);
        UIState = "player";
        PlayerData.position = { x: pipeWarpLocation.x, y: pipeWarpLocation.y };
        
        if (turnStep == "pipe-warp-anim-end-turn"){
            EndTurn();
        }
        else{
            //Go to dice roll
            turnStep = "menu";
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        }
    }
}
const StarWarpLocation = { x: 6, y: 7 };
function TriggerGoldPipeWarpAnimation(){
    UIState = "override";
    turnStep = "gold-pipe-warp-anim";
    animTimer = 6;
    pipeWarpLocation = StarWarpLocation;
}
function GoldPipeWarpAnimation(){
    const animLength = 6;
    animTimer -= DeltaTime;

    let startPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
    let endPlayerPos = new THREE.Vector3(pipeWarpLocation.x, getHeightTile(pipeWarpLocation.x, pipeWarpLocation.y) + 0.375, pipeWarpLocation.y);

    if (animTimer > animLength - 0.15){
        let t = 1 - ((animTimer - animLength + 0.15) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0, 0.4, t), startPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - 0.6, startPlayerPos.z);
    }
    else if (animTimer > animLength - 0.3){
        let t = 1 - ((animTimer - animLength + 0.3) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.4, 0.65, t), startPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.6, 0.35, t), startPlayerPos.z);
    }
    else if (animTimer > animLength - 0.45){
        let t = 1 - ((animTimer - animLength + 0.45) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.65, 0.4, t), startPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.35, 0.1, t), startPlayerPos.z);
    }
    else if (animTimer > animLength - 1.45){
        let t = 1 - ((animTimer - animLength + 1.45) / 1);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.4, -0.3, t), startPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.475, startPlayerPos.z);
    }
    else if (animTimer > animLength - 3.45){
        let t = 1 - ((animTimer - animLength + 3.45) / 2);
        Player.position.set(endPlayerPos.x, 0, endPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.1, 0.6, t), startPlayerPos.z);
        Camera.position.set(lerp(startPlayerPos.x, endPlayerPos.x, t), lerp(startPlayerPos.y + 0.125, endPlayerPos.y + 0.125, t), lerp(startPlayerPos.z + 1.5, endPlayerPos.z + 1.5, t));
    }
    else if (animTimer > animLength - 4.45){
        let t = 1 - ((animTimer - animLength + 4.45) / 1);
        GoldPipe.rotation.set(Math.PI, Math.PI / 2, 0);
        GoldPipe.position.set(endPlayerPos.x, endPlayerPos.y + lerp(2, 1, t), endPlayerPos.z);
        Camera.position.set(endPlayerPos.x, endPlayerPos.y + 0.125, endPlayerPos.z + 1.5);
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 5) / 0.55);
        GoldPipe.position.set(endPlayerPos.x, endPlayerPos.y + 1, endPlayerPos.z);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + lerp(1, 0, t), endPlayerPos.z);
    }
    else if (animTimer > animLength - 6){
        let t = 1 - ((animTimer - animLength + 6) / 1);
        GoldPipe.position.set(endPlayerPos.x, endPlayerPos.y + lerp(1, 2, t), endPlayerPos.z);
        Player.position.set(endPlayerPos.x, endPlayerPos.y, endPlayerPos.z);
    }
    else{
        GoldPipe.rotation.set(0, Math.PI / 2, 0);
        GoldPipe.position.set(0, 0, 0);
        UIState = "player";
        PlayerData.position = { x: pipeWarpLocation.x, y: pipeWarpLocation.y };
        
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
    }
}

var giveItemAnimItem;
function TriggerGiveItemAnimation(item){
    UIState = "override";
    turnStep = "give-item-anim";
    animTimer = 3;
    giveItemAnimItem = item;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    ItemPreview.material.opacity = 1;
    ItemPreview.material.map = ItemData[item].image;
    ItemPreview.scale.set(1, 1, 1);
    Scene.add(ItemPreview);

    ItemRingParticle.material.opacity = 0;
    ItemRingParticle.material.color.set(0xffffff);
    ItemRingParticle.position.set(targetPos.x, targetPos.y, targetPos.z + 0.15);
    Scene.add(ItemRingParticle);

    document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
}
function GiveItemAnimation(){
    const animLength = 3;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 0.5){
        let t = 1 - ((animTimer - animLength + 0.5) / 0.5);

        ItemPreview.position.set(targetPos.x, targetPos.y + lerp(1.25, 0.625, t), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 1){
        let t = 1 - ((animTimer - animLength + 1) / 0.5);
        let ei = easeIn(t);

        ItemPreview.scale.set(lerp(1, 0.5, ei), lerp(1, 0.5, ei), lerp(1, 0.5, ei));
        ItemPreview.position.set(targetPos.x, targetPos.y + lerp(0.625, 0.175, t), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 1.25){
        let t = 1 - ((animTimer - animLength + 1.25) / 0.25);

        ItemPreview.scale.set(lerp(0.5, 0.25, t), lerp(0.5, 0.25, t), lerp(0.5, 0.25, t));
        ItemPreview.position.set(targetPos.x, targetPos.y + lerp(0.175, 0, t), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 1.5){
        let t = 1 - ((animTimer - animLength + 1.5) / 0.25);

        ItemPreview.scale.set(0, 0, 0);
        ItemRingParticle.material.opacity = 1;
        ItemRingParticle.scale.set(lerp(0.1, 0.35, t), lerp(0.1, 0.35, t), lerp(0.1, 0.35, t));
    }
    else if (animTimer > animLength - 2.5){
        let t = 1 - ((animTimer - animLength + 2.5) / 1);
        let eo = easeOut(t);

        ItemPreview.scale.set(0, 0, 0);
        ItemRingParticle.scale.set(lerp(0.35, 1, eo), lerp(0.35, 1, eo), lerp(0.35, 1, eo));
        ItemRingParticle.material.opacity = lerp(1, 0, eo);
    }
    else if (animTimer > animLength - 3){
        ItemRingParticle.material.opacity = 0;
    }
    else{
        Scene.remove(ItemPreview);
        Scene.remove(ItemRingParticle);

        UIState = "player";
        turnStep = "toss-item";

        if (PlayerData.items.length == 3){
            document.getElementsByClassName("item-toss-menu")[0].style.display = "initial";
            UpdateTossItemUI(giveItemAnimItem);
        }
        else{
            PlayerData.items.push(giveItemAnimItem);
            UpdateItemUI();
            EndTurn();
        }
    }
}

var giveCoinsAnimAmount;
var coinsTextWidth;
var coinsAnimFirstTrigger = true;
var coinsAnimTurnStepBuffer;
function TriggerCoinChangeAnimation(amount){
    if (PlayerData.coins + amount < 0) amount = PlayerData.coins;

    coinsAnimTurnStepBuffer = turnStep;
    UIState = "player";
    turnStep = "coin-change-anim";
    animTimer = amount < 0 ? 3 : 4;
    giveCoinsAnimAmount = amount;
    coinsAnimFirstTrigger = true;

    coinsTextWidth = SetCoinText(amount);

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    CoinText.scale.set(0.85, 0.85, 0.85);
    Scene.add(CoinText);
    ItemRingParticle.scale.set(0, 0, 0);
    ItemRingParticle.position.set(targetPos.x, targetPos.y - (amount < 0 ? 0.05 : 0.1), targetPos.z);
    ItemRingParticle.material.color.set(amount < 0 ? 0xff5555 : 0x5555ff);
    Scene.add(ItemRingParticle);

    PlayerData.coins += amount;
    if (amount < 0) UpdatePlayerUI();
}
function GainCoinsAnimation(){
    const animLength = 4;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 1){
        let t = 1 - ((animTimer - animLength + 1) / 1);
        let eo = easeOut(t);

        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y + lerp(1.5, -0.1, eo), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 2){
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y -0.1, targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 3){
        let t = 1 - ((animTimer - animLength + 3) / 1);
        let ei = easeIn(t);

        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * lerp(0.85, 0.15, ei)), targetPos.y - 0.1, targetPos.z + 0.1);
        CoinText.scale.set(lerp(0.85, 0.15, ei), lerp(0.85, 0.15, ei), lerp(0.85, 0.15, ei));
    }
    else if (animTimer > animLength - 4){
        if (coinsAnimFirstTrigger){
            coinsAnimFirstTrigger = false;
            UpdatePlayerUI();
        }
        let t = 1 - ((animTimer - animLength + 4) / 1);

        CoinText.scale.set(0, 0, 0);
        ItemRingParticle.scale.set(lerp(0.1, 1, t), lerp(0.1, 1, t), lerp(0.1, 1, t));
        ItemRingParticle.material.opacity = lerp(1, 0, t);
    }
    else{
        Scene.remove(CoinText);
        Scene.remove(ItemRingParticle);

        UIState = "player";
        turnStep = coinsAnimTurnStepBuffer;
        if (coinsAnimTurnStepBuffer == "popup") EndTurn();
        else if (coinsAnimTurnStepBuffer == "menu"){
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        }
    }
}
function LoseCoinsAnimation(){
    const animLength = 3;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 1){
        let t = 1 - ((animTimer - animLength + 1) / 1);
        let eo = easeOut(t);

        CoinText.scale.set(lerp(0.15, 0.85, eo), lerp(0.15, 0.85, eo), lerp(0.15, 0.85, eo));
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * lerp(0.15, 0.85, eo)), targetPos.y - 0.1, targetPos.z + 0.1);
        ItemRingParticle.scale.set(lerp(0.1, 1, t), lerp(0.1, 1, t), lerp(0.1, 1, t));
        ItemRingParticle.material.opacity = lerp(1, 0, t);
    }
    else if (animTimer > animLength - 2){
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y -0.1, targetPos.z + 0.1);
        CoinText.scale.set(0.85, 0.85, 0.85);
    }
    else if (animTimer > animLength - 3){
        let t = 1 - ((animTimer - animLength + 3) / 1);
        let ei = easeIn(t);

        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y + lerp(-0.1, 1.5, ei), targetPos.z + 0.1);
    }
    else{
        Scene.remove(CoinText);
        Scene.remove(ItemRingParticle);

        UIState = "player";
        turnStep = coinsAnimTurnStepBuffer;
        if (coinsAnimTurnStepBuffer == "popup") EndTurn();
    }
}

function TriggerCoinSpaceAnimation(amount){
    giveCoinsAnimAmount = amount;

    UIState = "player";
    turnStep = "coin-space-anim";

    animTimer = 0.85;

    document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
    document.getElementsByClassName("move-undo-button")[0].style.display = "none";
}
function CoinSpaceAnimation(){
    animTimer -= DeltaTime;

    if (animTimer < 0){
        if (minigameCoinGiveCheck){
            minigameCoinGiveCheck = false;
            turnStep = "menu";
        }
        else{
            turnStep = "end-turn";
        }
        TriggerCoinChangeAnimation(giveCoinsAnimAmount);
    }
}

function SetCoinText(coins){
    var text = (coins < 0 ? "-" : "+") + Math.abs(coins).toString();
    var coinInnerText = new TextGeometry(text, 
        { font: DiceFont, size: 0.35, depth: 0.01, curveSegments: 2 });
    var coinOutlineText = new TextGeometry(text, 
        { font: DiceFont, size: 0.35, depth: 0, curveSegments: 2, bevelEnabled: true, bevelThickness: 0, bevelSize: 0.02, bevelOffset: 0, bevelSegments: 1 });
    CoinText.children[1].geometry.dispose();
    CoinText.children[2].geometry.dispose();
    CoinText.children[1].geometry = coinInnerText;
    CoinText.children[2].geometry = coinOutlineText;
    CoinText.children[2].material.color.set(coins < 0 ? 0xff0000 : 0x0000ff);
    coinInnerText.computeBoundingBox();
    CoinPlane.position.set(coinInnerText.boundingBox.max.x + 0.2, 0.125, 0);

    return coinInnerText.boundingBox.max.x + 0.2 + 0.15;
}

function UpdatePlayerUI(){
    document.getElementsByClassName("player-stars")[0].textContent = PlayerData.stars;
    document.getElementsByClassName("player-coins")[0].textContent = PlayerData.coins;
    document.getElementsByClassName("player-name")[0].textContent = COOKIES["ign"].split("#")[0];
}

document.getElementById("map-button").onclick = function(e){
    if (turnStep == "menu"){
        UIState = "map";
        turnStep = "map";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementById("leaderboard").style.display = "none";
        document.getElementsByClassName("map-overlay")[0].style.display = "initial";
    }
}

document.getElementsByClassName("map-back-button")[0].onclick = function(e){
    if (turnStep == "map"){
        UIState = "player";
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        document.getElementById("leaderboard").style.display = "initial";
        document.getElementsByClassName("map-overlay")[0].style.display = "none";
    }
}

document.getElementsByClassName("minigame-navigator-button")[0].onclick = function(e){
    document.getElementsByClassName("minigame-navigator-button")[0].classList.add("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[1].classList.remove("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[2].classList.remove("minigame-navigator-button-selected");

    document.getElementsByClassName("minigame-sub-window")[0].style.display = "initial";
    document.getElementsByClassName("minigame-sub-window")[1].style.display = "none";
    document.getElementsByClassName("minigame-sub-window")[2].style.display = "none";
}
document.getElementsByClassName("minigame-navigator-button")[1].onclick = function(e){
    document.getElementsByClassName("minigame-navigator-button")[0].classList.remove("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[1].classList.add("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[2].classList.remove("minigame-navigator-button-selected");

    document.getElementsByClassName("minigame-sub-window")[0].style.display = "none";
    document.getElementsByClassName("minigame-sub-window")[1].style.display = "initial";
    document.getElementsByClassName("minigame-sub-window")[2].style.display = "none";
}
document.getElementsByClassName("minigame-navigator-button")[2].onclick = function(e){
    //Chat Button
    document.getElementsByClassName("minigame-navigator-button")[0].classList.remove("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[1].classList.remove("minigame-navigator-button-selected");
    document.getElementsByClassName("minigame-navigator-button")[2].classList.add("minigame-navigator-button-selected");

    document.getElementsByClassName("minigame-sub-window")[0].style.display = "none";
    document.getElementsByClassName("minigame-sub-window")[1].style.display = "none";
    document.getElementsByClassName("minigame-sub-window")[2].style.display = "initial";

    if(isMinigameChatScrolledToBottom){
         MinigameChatElement.scrollTop = MinigameChatElement.scrollHeight - MinigameChatElement.clientHeight;
    }
}


document.getElementsByClassName("minigame-submit")[0].onclick = function(e){
    var result = [];

    for (var i = 0; i < CurrentMinigameLobby.length; i++){
        result.push(Number.parseFloat(document.getElementsByClassName("minigame-player-result-" + MinigameData[CurrentMinigame].type)[i].value));
    }

    Socket.send(JSON.stringify({ method: "submit_results", token: TOKEN, result: result }));
    console.log(result);

    minigameSubmitButton.disabled = true;
    minigameSubmitButton.textContent = "Submitted";
}

//NETWORKING!!!
var Socket;
var SignedIn = false;
function InitializeSocket(){
    Socket = new WebSocket("wss://" + new URLSearchParams(window.location.search).get("socket") + ".ngrok-free.dev");

    Socket.onopen = function(e){
        console.log("Socket open");
        if (TOKEN != ""){
            signInTimeout(0);
        }
        else{
            getStatusTimeout(0);
        }
    }

    Socket.onclose = function(e){
        console.log("WS Closed");
    }

    Socket.onmessage = function(e){
        try{
            var data = JSON.parse(e.data);
        }
        catch {return;}
        console.log(data);

        switch (data.method){
            case "get_status":
                get_status_server(data);
                break;
            case "announcement":
                announcement_server(data);
                break;
            case "end_turn":
                end_turn_server(data);
                break;
            case "sign_in":
                sign_in_server(data);
                break;
            case "check_in":
                check_in_server(data);
                break;
            case "register":
                register_server(data);
                break;
            case "get_lobby":
                get_lobby_server(data);
                break;
            case "get_player_data":
                get_player_data_server(data);
                break;
            case "send_message":
                send_message_server(data);
                break;
        }
    }
}

var GetStatusServerTimeout;
function getStatusTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    GetStatusServerTimeout = setTimeout(() => {getStatusTimeout(i+1)}, 1000);
    Socket.send(JSON.stringify(TOKEN == "" ? { method: "get_status" } : { method: "get_status", token: TOKEN }));
}
var ServerStatus = "null";
var ServerTurn = 0;
function get_status_server(data){
    clearTimeout(GetStatusServerTimeout);
    ServerTurn = data.turn;

    if (Object.hasOwn(data, "data")){
        if (data.status == "RESULTS"){
            GenerateResultsPage(data);
        }
        else{
            if (PlayerData.coins != data.data.coins || PlayerData.stars != data.data.stars || !arraysEqual(PlayerData.items, data.data.items) || PlayerData.position.x != data.data.position.x || PlayerData.position.y != data.data.position.y){
                if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "popup")) document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
                document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
                document.getElementsByClassName("move-undo-button")[0].style.display = "none";
                document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
                document.getElementsByClassName("roll-inputs")[0].style.display = "none";
                document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
                document.getElementById("leaderboard").style.display = "initial";
                document.getElementsByClassName("board-inputs")[0].style.display = "none";
                document.getElementsByClassName("item-menu")[0].style.display = "none";
                document.getElementsByClassName("item-toss-menu")[0].style.display = "none";
                document.getElementsByClassName("map-overlay")[0].style.display = "none";
                
                rollsRemaining = 1;

                PlayerData = {
                    position: {
                        x: data.data.position.x,
                        y: data.data.position.y
                    },
                    roll: PlayerData.roll,
                    items: data.data.items,
                    coins: data.data.coins,
                    stars: data.data.stars,
                    turnsCompleted: data.data.turnsCompleted
                };
                if (data.status == "TURN"){
                    //Reset Turn UI and States
                    UIPanels.minigame.style.display = "none";
                    if (PlayerData.turnsCompleted == ServerTurn){
                        document.getElementsByClassName("player-inputs")[0].style.display = "none";
                        UIPanels.waitMinigame.style.display = "initial";
                        turnStep = "wait";
                        UIState = "player";
                    }
                    else{
                        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                        PlayerData.roll = 0;
                        turnStep = "menu";
                        UIState = "player";
                        UIPanels.waitMinigame.style.display = "none";
                    }
                }
                else if (data.status == "MINIGAME"){
                    UIState = "menu";
                    document.getElementById("leaderboard").style.display = "none";
                }
                UpdateItemUI();
                UpdatePlayerUI();
            }
        }
    }

    if (ServerStatus != data.status){
        switch(data.status){
            case "REGISTRATION":
                UIPanels.connecting.style.display = "none";
                if (!SignedIn){
                    UIState = "menu";
                    UIPanels.login.style.display = "initial";
                }
                else{
                    UIPanels.checkin.style.display = "initial";
                    UIPanels.checkin.children[0].children[2].textContent = "Check-in opens 1 hour before tournament";
                    document.getElementById("checkinbtn").disabled = true;
                    document.getElementById("checkinbtn").textContent = "Check-in Closed";
                }
                break;
            case "CHECK_IN":
                UIPanels.connecting.style.display = "none";
                if (!SignedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "initial";
                }
                else{
                    UIPanels.checkin.children[0].children[2].textContent = checkedIn ? "You are checked-in!" : "Check-in is live";
                    document.getElementById("checkinbtn").disabled = checkedIn;
                    document.getElementById("checkinbtn").textContent = checkedIn ? "Checked-In" : "Check-in";
                }
                break;
            case "TURN":
                if (!checkedIn || !SignedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "initial";
                }
                else{
                    UIState = "player";
                    UIPanels.checkin.style.display = "none";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "none";
                    document.getElementsByClassName("player-data")[0].style.display = "initial";
                    document.getElementById("leaderboard").style.display = "initial";
                    //Check if done turn or not
                    if (PlayerData.turnsCompleted < ServerTurn){
                        //Play your turn
                        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    }
                    else{
                        //Wait for Minigame
                        UIPanels.waitMinigame.style.display = "initial";
                    }
                }
                break;
            case "MINIGAME":
                if (!checkedIn || !SignedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "initial";
                }
                else{
                    GetLobbyServerTimeout = setTimeout(() => {getLobbyTimeout(0)}, 1000);
                    Socket.send(JSON.stringify({ method: "get_lobby", token: TOKEN }));
                }
                break;
            case "RESULTS":
                break;
        }
    }
    ServerStatus = data.status;
}

const TIMEOUT_LIMIT = 10;
function announcement_server(data){
    if (Object.hasOwn(data, "status")){
        let lastStatus = ServerStatus;
        ServerStatus = data.status;

        if (ServerStatus == "CHECK_IN"){
            if (TOKEN != ""){
                UIPanels.checkin.children[0].children[2].textContent = checkedIn ? "You are checked-in!" : "Check-in is live";
                document.getElementById("checkinbtn").disabled = checkedIn;
                document.getElementById("checkinbtn").textContent = checkedIn ? "Checked-In" : "Check-in";
            }
        }
        else if (ServerStatus == "TURN"){
            if (TOKEN == ""){
                UIState = "menu";
                UIPanels.connecting.style.display = "none";
                UIPanels.login.style.display = "initial";
            }
            else{
                rollsRemaining = 1;
                UIState = "player";
                turnStep = "menu";
                UIPanels.checkin.style.display = "none";
                UIPanels.connecting.style.display = "none";
                UIPanels.login.style.display = "none";
                UIPanels.minigame.style.display = "none";
                document.getElementsByClassName("player-data")[0].style.display = "initial";
                document.getElementById("leaderboard").style.display = "initial";
                document.getElementById("items-button").disabled = false;
                if (lastStatus == "MINIGAME"){
                    console.log("CAME FROM MINIGAME");
                    minigameCoinGiveCheck = true;
                    getPlayerDataTimeout(0);
                }
                else{
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                }
            }
        }
        else if (ServerStatus == "MINIGAME"){
            document.getElementsByClassName("minigame-navigator-button")[0].classList.add("minigame-navigator-button-selected");
            document.getElementsByClassName("minigame-navigator-button")[1].classList.remove("minigame-navigator-button-selected");
            document.getElementsByClassName("minigame-navigator-button")[2].classList.remove("minigame-navigator-button-selected");
            document.getElementsByClassName("minigame-sub-window")[0].style.display = "initial";
            document.getElementsByClassName("minigame-sub-window")[1].style.display = "none";
            document.getElementsByClassName("minigame-sub-window")[2].style.display = "none";

            minigameSubmitButton.disabled = false;
            minigameSubmitButton.textContent = "Submit Results";

            getLobbyTimeout(0);
        }
        else if (ServerStatus == "RESULTS"){
            GenerateResultsPage(data);
        }
    }
}

function GenerateResultsPage(data){
    UIPanels.minigame.style.display = "none";
    UIPanels.checkin.style.display = "none";
    UIPanels.connecting.style.display = "none";
    UIPanels.login.style.display = "none";
    UIPanels.waitMinigame.style.display = "none";
    document.getElementById("results").style.display = "initial";

    UIState = "menu";
    turnStep = "results";

    //Sort Results
    for (var i = 0; i < data.data.length - 1; i++){
        for (var j = 0; j < data.data.length - i - 1; j++){
            if (data.data[j].stars < data.data[j+1].stars || (data.data[j].stars == data.data[j+1].stars && data.data[j].coins < data.data[j+1].coins)){
                let temp = data.data[j];
                data.data[j] = data.data[j+1];
                data.data[j+1] = temp;
            }
        }
    }

    //Set Podium Players
    let podiumNames = document.getElementsByClassName("results-podium-name");
    let podiumStars = document.getElementsByClassName("results-podium-stars");
    let podiumCoins = document.getElementsByClassName("results-podium-coins");
    let podiumAvatars = document.getElementsByClassName("results-podium-image");
    podiumNames[0].textContent = data.data[0].ign.split("#")[0];
    podiumNames[1].textContent = data.data[1].ign.split("#")[0];
    podiumNames[2].textContent = data.data[2].ign.split("#")[0];
    podiumCoins[0].textContent = data.data[0].coins;
    podiumCoins[1].textContent = data.data[1].coins;
    podiumCoins[2].textContent = data.data[2].coins;
    podiumStars[0].textContent = data.data[0].stars;
    podiumStars[1].textContent = data.data[1].stars;
    podiumStars[2].textContent = data.data[2].stars;
    podiumAvatars[0].setAttribute("src", PlayerAvatars[stringToIndex(data.data[0].ign) % PlayerAvatars.length]);
    podiumAvatars[1].setAttribute("src", PlayerAvatars[stringToIndex(data.data[1].ign) % PlayerAvatars.length]);
    podiumAvatars[2].setAttribute("src", PlayerAvatars[stringToIndex(data.data[2].ign) % PlayerAvatars.length]);

    //Generate scrollable leaderboard
    let foundYou = false;
    let resultsList = document.getElementsByClassName("results-list")[0];
    for (var i = 0; i < data.data.length; i++){
        let listElement = document.createElement("div");
        listElement.classList.add("results-list-item-" + (i%2==0?"a":"b"));
        if (i == 0) listElement.classList.add("results-list-item-1");
        else if (i == 1) listElement.classList.add("results-list-item-2");
        else if (i == 2) listElement.classList.add("results-list-item-3");
        resultsList.appendChild(listElement);

        listElement.appendChild(document.createElement("span"));
        listElement.children[0].classList.add("results-list-placement");
        listElement.children[0].textContent = (i + 1) + ". ";
        listElement.appendChild(document.createElement("img"));
        listElement.children[1].setAttribute("src", PlayerAvatars[stringToIndex(data.data[i].ign) % PlayerAvatars.length]);
        listElement.children[1].classList.add("results-list-avatar");
        listElement.appendChild(document.createElement("span"));
        listElement.children[2].classList.add("results-list-username");
        listElement.children[2].textContent = data.data[i].ign.split("#")[0];
        listElement.appendChild(document.createElement("span"));
        listElement.children[3].classList.add("results-list-info");

        listElement.children[3].appendChild(document.createElement("span"));
        listElement.children[3].children[0].classList.add("results-list-stars");
        listElement.children[3].children[0].textContent = data.data[i].stars + " ";
        listElement.children[3].appendChild(document.createElement("img"));
        listElement.children[3].children[1].classList.add("results-list-text-img");
        listElement.children[3].children[1].setAttribute("src", "resources/textures/squid_star.svg");
        listElement.children[3].appendChild(document.createElement("div"));
        listElement.children[3].children[2].style.display = "inline-block";
        listElement.children[3].children[2].style.width = "5px";
        listElement.children[3].appendChild(document.createElement("span"));
        listElement.children[3].children[3].classList.add("results-list-coins");
        listElement.children[3].children[3].textContent = data.data[i].coins + " ";
        listElement.children[3].appendChild(document.createElement("img"));
        listElement.children[3].children[4].classList.add("results-list-text-img");
        listElement.children[3].children[4].setAttribute("src", "resources/textures/squid_coin.svg");

        if (Object.hasOwn(COOKIES, "ign") && data.data[i].ign == COOKIES["ign"]){
            //THIS IS YOU
            document.getElementsByClassName("results-you")[0].style.display = "inline-block";
            document.getElementsByClassName("results-you-username")[0].textContent = COOKIES["ign"].split("#")[0];
            document.getElementsByClassName("results-you-stars")[0].textContent = data.data[i].stars;
            document.getElementsByClassName("results-you-coins")[0].textContent = data.data[i].coins;
            document.getElementsByClassName("results-you-placement")[0].textContent = (i+1) + ". ";
            foundYou = true;
        }
    }
}

function end_turn_server(data){

}

const minigamePopupPlayers = document.getElementsByClassName("minigame-player");
var GetLobbyServerTimeout;
var CurrentMinigame = "null";
var CurrentMinigameLobby = [];
function getLobbyTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    GetLobbyServerTimeout = setTimeout(() => {getLobbyTimeout(i+1)}, 1000);
    Socket.send(JSON.stringify({ method: "get_lobby", token: TOKEN }));
}
function get_lobby_server(data){
    clearTimeout(GetLobbyServerTimeout);
    
    CurrentMinigame = data.minigame;
    CurrentMinigameLobby = data.lobby;

    UIPanels.connecting.style.display = "none";
    UIPanels.waitMinigame.style.display = "none";
    UIPanels.login.style.display = "none";
    UIPanels.checkin.style.display = "none";
    UIPanels.minigame.style.display = "initial";
    
    for (let i = 0; i < minigamePopupPlayers.length; i++){
        if (i < data.lobby.length){
            minigamePopupPlayers[i].style.display = "inline-block";
            minigamePopupPlayers[i].getElementsByClassName("minigame-player-name")[0].innerHTML = data.lobby[i].ign.split("#", 2).join("<br>#") + "<span class=\"minigame-player-tooltip\">" + data.lobby[i].discord + "</span>";
            minigamePopupPlayers[i].getElementsByClassName("minigame-player-result-vs")[0].style.display = MinigameData[data.minigame].type == "vs" ? "initial" : "none";
            minigamePopupPlayers[i].getElementsByClassName("minigame-player-result-coop")[0].style.display = MinigameData[data.minigame].type == "coop" ? "initial" : "none";
            minigamePopupPlayers[i].getElementsByClassName("minigame-player-result-coin")[0].style.display = MinigameData[data.minigame].type == "coin" ? "initial" : "none";
        }
        else{
            minigamePopupPlayers[i].style.display = "none";
        }
    }

    document.getElementsByClassName("minigame-navigator-button")[2].style.display = data.lobby.length > 1 ? "initial" : "none";

    document.getElementsByClassName("minigame-pool")[0].textContent = "Pool: " + data.pool;
    document.getElementsByClassName("minigame-pass")[0].textContent = "Pass: " + data.pass;

    document.getElementsByClassName("minigame-title")[0].textContent = MinigameData[data.minigame].title;
    document.getElementsByClassName("minigame-description")[0].innerHTML = MinigameData[data.minigame].description;

    //Chat Stuff
    document.getElementsByClassName("minigame-chat")[0].innerHTML = "";
    minigameChatNotification.style.display = "none";
    MinigameChatHistory = data.chatHistory;
    for (let i = 0; i < MinigameChatHistory.length; i++){
        if (MinigameChatHistory[i].sender == "SERVER"){
            let p = document.createElement("p");
            p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[MinigameChatHistory[i].message].replace("{subject}", MinigameChatHistory[i].subject.split("#")[0]) + "</b>";
            document.getElementsByClassName("minigame-chat")[0].appendChild(p);

            if (MinigameChatHistory[i].message == "submit"){
                minigameSubmitButton.disabled = MinigameChatHistory[i].subject == COOKIES["ign"];
                minigameSubmitButton.textContent = MinigameChatHistory[i].subject == COOKIES["ign"] ? "Submitted" : "Submit Results";
            }
            else if (MinigameChatHistory[i].message == "confirm"){
                minigameSubmitButton.disabled = true;
                minigameSubmitButton.textContent = "Score Locked";
            }
        }
        else{
            let p = document.createElement("p");
            p.innerHTML = "<b>" + MinigameChatHistory[i].sender.split("#")[0] + ": </b>" + MinigameChatHistory[i].message;
            document.getElementsByClassName("minigame-chat")[0].appendChild(p);
        }
    }
    MinigameChatElement.scrollTop = MinigameChatElement.scrollHeight - MinigameChatElement.clientHeight;
}

var checkedIn = false;
var SignInServerTimeout;
function signInTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    SignInServerTimeout = setTimeout(() => {signInTimeout(i+1)}, 1000);
    Socket.send(JSON.stringify({ method:"sign_in", token: TOKEN }));
}
function sign_in_server(data){
    clearTimeout(SignInServerTimeout);
    if (data.success){
        SignedIn = true;
        UIState = "menu";
        checkedIn = data.checkedIn;

        Player.material.map = PlayerAvatarsTex[stringToIndex(COOKIES["ign"]) % PlayerAvatarsTex.length];

        UIPanels.checkin.children[0].children[0].textContent = "Tournament starts " + new Date(data.startTime * 1000).toLocaleString("en-CA", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short" });
        UIPanels.connecting.style.display = "none";
        UIPanels.checkin.style.display = "initial";

        UpdatePlayerUI();
    }
    else{
        SignedIn = false;
        UIPanels.login.style.display = "initial";
        UIPanels.connecting.style.display = "none";
    }

    ServerStatus = "null";

    getStatusTimeout(0);
}

var RegisterServerTimeout;
function registerTimeout(discord, ign, i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method: "register", discord: discord, ign: ign }));
    RegisterServerTimeout = setTimeout(() => {registerTimeout(discord, ign, i+1);}, 1000);
}
document.getElementById("loginbtn").onclick = function(e){
    if (Socket.readyState == Socket.OPEN){
        let discord = document.getElementById("login_discord_input").value;
        let ign = document.getElementById("login_ign_input").value;

        let testIGN = ign.split("#");
        if (testIGN.length != 2){
            //Error, must contain numbers at end
            console.error("IGN must contain identifying number (i.e. Username#1234)");
            return;
        }

        document.cookie = "ign=" + ign + "; expires=" + new Date(2999, 12, 30).toUTCString();
        document.cookie = "discord=" + discord + "; expires=" + new Date(2999, 12, 30).toUTCString();
        loadCookies();
        Socket.send(JSON.stringify({ method: "register", discord: discord, ign: ign }));
        RegisterServerTimeout = setTimeout(() => {registerTimeout(discord, ign, 0);}, 1000);

        UIState = "menu";
        UIPanels.login.style.display = "none";
        UIPanels.connecting.style.display = "initial";
    }
}
function register_server(data){
    clearTimeout(RegisterServerTimeout);
    if (data.success){
        TOKEN = data.token;
        //TODO!!! Change back to 1 day after start time
        //saveCookies(new Date(data.startTime * 1000 + 86400000));//1 day after start time
        saveCookies(new Date(data.startTime * 1000 + 86400000000));
        
        signInTimeout(0);
    }
    else{
        //ERROR POP UP
        //PLEASE CONTACT A MOD
        //Maybe do a better implementation later
        alert("Error: Could not register player. Please leave a message in the tournament helpdesk for assistance.");
    }
}

var CheckInServerTimeout;
function check_in_server(data){
    clearTimeout(CheckInServerTimeout);
    if (data.success){
        document.getElementById("checkinbtn").disabled = true;
        document.getElementById("checkinbtn").textContent = "Checked-In";
        UIPanels.checkin.children[0].children[2].textContent = "You are checked-in!";
    }
}
document.getElementById("checkinbtn").onclick = function(e){
    Socket.send(JSON.stringify({ method:"check_in", token: TOKEN }));
    document.getElementById("checkinbtn").disabled = true;
    document.getElementById("checkinbtn").textContent = "Please Wait";
    CheckInServerTimeout = setTimeout(() => {checkInTimeout(0);}, 1000);
}
function checkInTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method:"check_in", token: TOKEN }));
    CheckInServerTimeout = setTimeout(() => {checkInTimeout(i+1)}, 1000);
}

var minigameCoinGiveCheck = false;
var GetPlayerDataServerTimeout;
function getPlayerDataTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method: "get_player_data", token: TOKEN }));
    GetPlayerDataServerTimeout = setTimeout(() => {getPlayerDataTimeout(i + 1)}, 1000);
}
function get_player_data_server(data){
    clearTimeout(GetPlayerDataServerTimeout);
    if (minigameCoinGiveCheck){
        TriggerCoinSpaceAnimation(data.data.coins - PlayerData.coins);
    }
    else{
        //TODO!!! Mod Check Verify Here!
        //Don't think this is needed anymore because PlayerData is stored on the server now
    }
}

var MinigameChatHistory = [];
document.getElementById("minigame-chat-send-button").onclick = (e) => {
    let message = document.getElementById("minigame-chat-input").value;
    document.getElementById("minigame-chat-input").value = "";
    if (message == "" || message == null) return;

    Socket.send(JSON.stringify({ method: "send_message", token: TOKEN, message: message }));
};
var minigameChatNotification = document.getElementsByClassName("minigame-chat-notification")[0];
var ServerMessages = {
    submit: "{subject} has reported the score. Waiting for a second player to confirm the score.",
    confirm: "{subject} has locked in the score.",
    warn3min: "There are 3 minutes left to submit the results for your minigame.",
    warn1min: "There is 1 minute left to submit the results for your minigame."
};
var minigameSubmitButton = document.getElementsByClassName("minigame-submit")[0];
function send_message_server(data){
    MinigameChatHistory.push(data.data);

    if (data.data.sender == "SERVER"){
        let p = document.createElement("p");
        p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[data.data.message].replace("{subject}", data.data.subject.split("#")[0]) + "</b>";
        document.getElementsByClassName("minigame-chat")[0].appendChild(p);

        if (data.data.message == "submit"){
            minigameSubmitButton.disabled = data.data.subject == COOKIES["ign"];
            minigameSubmitButton.textContent = data.data.subject == COOKIES["ign"] ? "Submitted" : "Submit Results";
        }
        else if (data.data.message == "confirm"){
            minigameSubmitButton.disabled = true;
            minigameSubmitButton.textContent = "Score Locked";
        }
    }
    else{
        let p = document.createElement("p");
        p.innerHTML = "<b>" + data.data.sender.split("#")[0] + ": </b>" + data.data.message;
        document.getElementsByClassName("minigame-chat")[0].appendChild(p);
    }

    if(isMinigameChatScrolledToBottom){
         MinigameChatElement.scrollTop = MinigameChatElement.scrollHeight - MinigameChatElement.clientHeight;
    }

    if (MinigameChatElement.parentElement.style.display == "none" || !isMinigameChatScrolledToBottom){
        //Notification of new chat
        minigameChatNotification.style.display = "initial";
    }
    else{
        //Clear notification
        minigameChatNotification.style.display = "none";
    }
}


function disconnectError(){
    alert("Could not connect to server! Check your internet and refresh the page.");
}











function debugSetState(state){
    UIState = state;
}

const debugSet = document.getElementsByClassName("debug-set");
for (let i = 0; i < debugSet.length; i++){
    debugSet[i].onclick = (e) => {debugSetState(debugSet[i].textContent);};
}


//TODO!!! Update minigames.json salmon run related descriptions to clarify weapon selection (if needed. Hoping there's a random option in game)
//TODO!!! Make leaderboard functional
//TODO!!! Update tableturf and scrims descriptions because TYPE was changed

//Backburner TODO list (Stuff that doesn't matter till after testing)
//TODO!!! Auto Reconnect if socket disconnects (Maybe just a pop-up to refresh the page for now, I think websockets already auto-does this)
//TODO!!! Rules Page
//TODO!!! Full leaderboard (Button in top right) (Not high priority)
//TODO!!! Low quality version of webpage (no animations, no lighting, no filters)
