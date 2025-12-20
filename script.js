import * as THREE from "three"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

const TIMEOUT_LIMIT = 5;

const AvatarDecorations = {
    hair: [
        "resources/avatars/Hair/hair-0.png",
        "resources/avatars/Hair/hair-1.png",
        "resources/avatars/Hair/hair-2.png",
        "resources/avatars/Hair/hair-3.png",
        "resources/avatars/Hair/hair-4.png",
        "resources/avatars/Hair/hair-5.png",
        "resources/avatars/Hair/hair-6.png",
        "resources/avatars/Hair/hair-7.png",
        "resources/avatars/Hair/hair-8.png",
        "resources/avatars/Hair/hair-9.png",
        "resources/avatars/Hair/hair-10.png",
        "resources/avatars/Hair/hair-11.png",
        "resources/avatars/Hair/hair-12.png",
        "resources/avatars/Hair/hair-13.png",
        "resources/avatars/Hair/hair-14.png",
        "resources/avatars/Hair/hair-15.png",
        "resources/avatars/Hair/hair-16.png",
        "resources/avatars/Hair/hair-17.png",
        "resources/avatars/Hair/hair-18.png",
        "resources/avatars/Hair/hair-19.png",
        "resources/avatars/Hair/hair-20.png",
        "resources/avatars/Hair/hair-21.png",
        "resources/avatars/Hair/hair-22.png",
        "resources/avatars/Hair/hair-23.png",
        "resources/avatars/Hair/hair-24.png",
        "resources/avatars/Hair/hair-25.png",
        "resources/avatars/Hair/hair-26.png",
        "resources/avatars/Hair/hair-27.png",
        "resources/avatars/Hair/hair-28.png",
        "resources/avatars/Hair/hair-29.png",
        "resources/avatars/Hair/hair-30.png",
        "resources/avatars/Hair/hair-31.png",
        "resources/avatars/Hair/hair-32.png",
        "resources/avatars/Hair/hair-33.png",
        "resources/avatars/Hair/hair-34.png",
        "resources/avatars/Hair/hair-35.png"
    ],
    hat: [
        { url: "resources/avatars/Hat/hat-0.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-1.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 1, y: 1 },{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: 1, y: 1 }] },
        { url: "resources/avatars/Hat/hat-2.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-3.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-4.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-5.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-6.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-7.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 }] },
        { url: "resources/avatars/Hat/hat-8.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-9.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-10.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 }] },
        { url: "resources/avatars/Hat/hat-11.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 },{ x: 0, y: 2 }] },
        { url: "resources/avatars/Hat/hat-12.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-13.png", offsets: [{ x: 1, y: 0 },{ x: 1, y: 0 },{ x: 1, y: 1 },{ x: 1, y: 1 },{ x: 1, y: 1 },{ x: 1, y: 1 }] },
        { url: "resources/avatars/Hat/hat-14.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-15.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 },{ x: 0, y: 1 }] },
        { url: "resources/avatars/Hat/hat-16.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-17.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 1, y: 1 },{ x: 1, y: 1 },{ x: 1, y: 1 },{ x: 1, y: 1 }] },
        { url: "resources/avatars/Hat/hat-18.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-19.png", offsets: [{ x: 0, y: -1 },{ x: 0, y: -1 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-20.png", offsets: [{ x: 0, y: -1 },{ x: 0, y: -1 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
        { url: "resources/avatars/Hat/hat-21.png", offsets: [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }] },
    ],
    shirt: [
        "resources/avatars/Shirt/shirt-0.png",
        "resources/avatars/Shirt/shirt-1.png",
        "resources/avatars/Shirt/shirt-2.png",
        "resources/avatars/Shirt/shirt-3.png",
        "resources/avatars/Shirt/shirt-4.png",
        "resources/avatars/Shirt/shirt-5.png",
        "resources/avatars/Shirt/shirt-6.png",
        "resources/avatars/Shirt/shirt-7.png",
        "resources/avatars/Shirt/shirt-8.png",
        "resources/avatars/Shirt/shirt-9.png",
        "resources/avatars/Shirt/shirt-10.png",
        "resources/avatars/Shirt/shirt-11.png",
        "resources/avatars/Shirt/shirt-12.png",
        "resources/avatars/Shirt/shirt-13.png",
        "resources/avatars/Shirt/shirt-14.png",
        "resources/avatars/Shirt/shirt-15.png",
        "resources/avatars/Shirt/shirt-16.png",
        "resources/avatars/Shirt/shirt-17.png",
        "resources/avatars/Shirt/shirt-18.png",
        "resources/avatars/Shirt/shirt-19.png",
        "resources/avatars/Shirt/shirt-20.png",
        "resources/avatars/Shirt/shirt-21.png",
        "resources/avatars/Shirt/shirt-22.png",
        "resources/avatars/Shirt/shirt-23.png",
        "resources/avatars/Shirt/shirt-24.png",
        "resources/avatars/Shirt/shirt-25.png",
        "resources/avatars/Shirt/shirt-26.png",
        "resources/avatars/Shirt/shirt-27.png",
        "resources/avatars/Shirt/shirt-28.png",
        "resources/avatars/Shirt/shirt-29.png",
        "resources/avatars/Shirt/shirt-30.png",
        "resources/avatars/Shirt/shirt-31.png",
        "resources/avatars/Shirt/shirt-32.png",
        "resources/avatars/Shirt/shirt-33.png",
        "resources/avatars/Shirt/shirt-34.png",
        "resources/avatars/Shirt/shirt-35.png"
    ],
    skin: [
        "resources/avatars/Skin/skin-0.png",
        "resources/avatars/Skin/skin-1.png",
        "resources/avatars/Skin/skin-2.png",
        "resources/avatars/Skin/skin-3.png",
        "resources/avatars/Skin/skin-4.png",
        "resources/avatars/Skin/skin-5.png",
    ]
}
var AvatarImages = {
    hair: [],
    hat: [],
    skin: [],
    shirt: []
}

var AvatarDecorationsLoaded = 0;
for (let i = 0; i < AvatarDecorations.hair.length; i++){
    let img = document.createElement("img");
    img.onload = () => { AvatarDecorationsLoaded++; };
    img.src = AvatarDecorations.hair[i];
    AvatarImages.hair.push(img);
}
for (let i = 0; i < AvatarDecorations.hat.length; i++){
    let img = document.createElement("img");
    img.onload = () => { AvatarDecorationsLoaded++; };
    img.src = AvatarDecorations.hat[i].url;
    AvatarImages.hat.push(img);
}
for (let i = 0; i < AvatarDecorations.skin.length; i++){
    let img = document.createElement("img");
    img.onload = () => { AvatarDecorationsLoaded++; };
    img.src = AvatarDecorations.skin[i];
    AvatarImages.skin.push(img);
}
for (let i = 0; i < AvatarDecorations.shirt.length; i++){
    let img = document.createElement("img");
    img.onload = () => { AvatarDecorationsLoaded++; };
    img.src = AvatarDecorations.shirt[i];
    AvatarImages.shirt.push(img);
}

var playerTextureCache = {};
var playerURLCache = {};
function CharacterToInt(char) { return ((char.skin) + (char.shirt * 1000) + (char.hair * 1000 * 1000) + (char.hat * 1000 * 1000 * 1000)).toString(); }
function GeneratePlayerTexture(char){
    let v = CharacterToInt(char);
    if (Object.hasOwn(playerTextureCache, v)) return playerTextureCache[v];

    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 20;
    let ctx = canvas.getContext("2d");

    ctx.drawImage(AvatarImages.skin[char.skin], 0, 0);
    ctx.drawImage(AvatarImages.shirt[char.shirt], 0, 0);
    ctx.drawImage(AvatarImages.hair[char.hair], 0, 0);
    ctx.drawImage(AvatarImages.hat[char.hat], AvatarDecorations.hat[char.hat].offsets[char.hair % AvatarDecorations.hat[char.hat].offsets.length].x, AvatarDecorations.hat[char.hat].offsets[char.hair % AvatarDecorations.hat[char.hat].offsets.length].y);

    let tex = new THREE.CanvasTexture(canvas);
    //tex.needsUpdate = true;
    //let tex = new THREE.DataTexture(ctx.getImageData(0, 0, 16, 20).data, 16, 20);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    
    Object.defineProperty(playerURLCache, v, { writable: false, enumerable: true, configurable: true, value: canvas.toDataURL() });
    Object.defineProperty(playerTextureCache, v, { writable: false, enumerable: true, configurable: true, value: tex });

    return tex;
}
function GeneratePlayerURL(char){
    let v = CharacterToInt(char);
    if (Object.hasOwn(playerURLCache, v)) return playerURLCache[v];

    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 20;
    let ctx = canvas.getContext("2d");

    ctx.drawImage(AvatarImages.skin[char.skin], 0, 0);
    ctx.drawImage(AvatarImages.shirt[char.shirt], 0, 0);
    ctx.drawImage(AvatarImages.hair[char.hair], 0, 0);
    ctx.drawImage(AvatarImages.hat[char.hat], AvatarDecorations.hat[char.hat].offsets[char.hair % AvatarDecorations.hat[char.hat].offsets.length].x, AvatarDecorations.hat[char.hat].offsets[char.hair % AvatarDecorations.hat[char.hat].offsets.length].y);

    let tex = new THREE.CanvasTexture(canvas);
    //tex.needsUpdate = true;
    //let tex = new THREE.DataTexture(ctx.getImageData(0, 0, 16, 20).data, 16, 20);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    
    Object.defineProperty(playerURLCache, v, { writable: false, enumerable: true, configurable: true, value: canvas.toDataURL() });
    Object.defineProperty(playerTextureCache, v, { writable: false, enumerable: true, configurable: true, value: tex });

    return playerURLCache[v];
}

function lerp(a, b, t) { return a * (1 - t) + b * t; }
function lerpVector(a, b, t) { return new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t)); }
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
fetch("resources/minigames.json").then(r => r.text()).then(t => MinigameData = JSON.parse(t));

const EPSILON = 0.001;

const NotifSFX = new Audio("resources/sfx/notification.ogg");
const StartTurnSFX = new Audio("resources/sfx/start_turn.ogg");

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

const BlockMat = new THREE.MeshStandardMaterial({ color: 0x111111, alphaTest: 0.5 });
const TrimMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, alphaTest: 0.5 });

const TexLoader = new THREE.TextureLoader();
const ModelLoader = new FBXLoader();

/*var PlayerAvatars = [
    "resources/avatars/blue_octo_1.png",
    "resources/avatars/blue_octo_2.png",
    "resources/avatars/blue_octo_3.png",

    "resources/avatars/green_octo_1.png",
    "resources/avatars/green_octo_2.png",
    "resources/avatars/green_octo_3.png",

    "resources/avatars/pink_octo_1.png",
    "resources/avatars/pink_octo_2.png",
    "resources/avatars/pink_octo_3.png",

    "resources/avatars/purple_octo_1.png",
    "resources/avatars/purple_octo_2.png",
    "resources/avatars/purple_octo_3.png",

    "resources/avatars/teal_octo_1.png",
    "resources/avatars/teal_octo_2.png",
    "resources/avatars/teal_octo_3.png",

    "resources/avatars/yellow_octo_1.png",
    "resources/avatars/yellow_octo_2.png",
    "resources/avatars/yellow_octo_3.png",

    "resources/avatars/blue_squid_1.png",
    "resources/avatars/blue_squid_2.png",
    "resources/avatars/blue_squid_3.png",

    "resources/avatars/green_squid_1.png",
    "resources/avatars/green_squid_2.png",
    "resources/avatars/green_squid_3.png",

    "resources/avatars/pink_squid_1.png",
    "resources/avatars/pink_squid_2.png",
    "resources/avatars/pink_squid_3.png",

    "resources/avatars/purple_squid_1.png",
    "resources/avatars/purple_squid_2.png",
    "resources/avatars/purple_squid_3.png",

    "resources/avatars/teal_squid_1.png",
    "resources/avatars/teal_squid_2.png",
    "resources/avatars/teal_squid_3.png",

    "resources/avatars/yellow_squid_1.png",
    "resources/avatars/yellow_squid_2.png",
    "resources/avatars/yellow_squid_3.png"
];
var PlayerAvatarsTex = [];
for (let i = 0; i < PlayerAvatars.length; i++){
    let tex = TexLoader.load(PlayerAvatars[i]);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    PlayerAvatarsTex.push(tex);

}*/

const CubeTexLoader = new THREE.CubeTextureLoader();

var SKYBOX_TEX;
var DARK_SKYBOX_TEX;

var Star;
var SilverStar;
ModelLoader.load("resources/models/squid_star.fbx", (object) => {
    Star = object.clone(true);
    Scene.add(Star);
    Star.scale.set(0, 0, 0);
    Star.traverse(function (child){
        if (child.isMesh) {
            if (child.material.map !== null){
                child.material.map.colorSpace = THREE.SRGBColorSpace;
                child.material = new THREE.MeshBasicMaterial({ map: child.material.map, transparent: true });
            }
            else{
                child.material = new THREE.MeshStandardMaterial({ color: 0xffbf00, roughness: 0.075, metalness: 0.8, emissive: 0xffdc73, emissiveIntensity: 0.5 });
                if (mapData != null) child.material.envMap = SKYBOX_TEX;
            }
        }
    });

    SilverStar = object.clone(true);
    SilverStar.traverse(function (c){
        if (c.isMesh) {
            c.castShadow = true;
            if (c.material.map !== null){
                c.material.map.colorSpace = THREE.SRGBColorSpace;
                c.material = new THREE.MeshBasicMaterial({ map: c.material.map, transparent: true });
            }
            else{
                c.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.075, metalness: 0.8, emissive: 0xffffff, emissiveIntensity: 0.25 });
                if (mapData != null) c.material.envMap = SKYBOX_TEX;
            }
        }
    });
    SilverStar.scale.set(0.001, 0.001, 0.001);
});
const RingParticleTex = TexLoader.load("resources/textures/ring_particle.png");
RingParticleTex.colorSpace = THREE.SRGBColorSpace;
var StarRingParticle = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: RingParticleTex, transparent: true, opacity: 0, color: 0xffea00 }));
var ItemRingParticle = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: RingParticleTex, transparent: true, opacity: 0, color: 0xffffff }));
Scene.add(StarRingParticle);

var KeyGateModel;
ModelLoader.load("resources/models/KeyGate.fbx", (object) => {
    KeyGateModel = object;
    KeyGateModel.traverse(function (child) {
        if (child.isMesh){
            if (child.material.map !== null){
                child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
        }
    });
});

const GreenPipeTex = TexLoader.load("resources/models/green-pipe.png");
GreenPipeTex.colorSpace = THREE.SRGBColorSpace;
GreenPipeTex.minFilter = THREE.NearestFilter;
GreenPipeTex.magFilter = THREE.NearestFilter;
GreenPipeTex.wrapS = THREE.RepeatWrapping;
GreenPipeTex.wrapT = THREE.RepeatWrapping;
const GoldPipeTex = TexLoader.load("resources/models/gold-pipe.png");
GoldPipeTex.colorSpace = THREE.SRGBColorSpace;
GoldPipeTex.minFilter = THREE.NearestFilter;
GoldPipeTex.magFilter = THREE.NearestFilter;
GoldPipeTex.wrapS = THREE.RepeatWrapping;
GoldPipeTex.wrapT = THREE.RepeatWrapping;
var GreenPipe, GoldPipe;
ModelLoader.load("resources/models/pipe.fbx", (object) => {
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


var ATLAS;

var MapMat;// = new THREE.MeshStandardMaterial({map: ATLAS});

const ATLAS_SIZE = {x: 16, y: 16};
const ATLAS_UV_SIZE = {x: 1 / ATLAS_SIZE.x - (EPSILON * 2), y: 1 / ATLAS_SIZE.y - (EPSILON * 2)};

const PlayerTex = TexLoader.load("resources/textures/AIRA_Pixel1.png");
PlayerTex.magFilter = THREE.NearestFilter;
PlayerTex.minFilter = THREE.NearestFilter;
PlayerTex.colorSpace = THREE.SRGBColorSpace;

var Player = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.75), new THREE.MeshStandardMaterial({map: PlayerTex, alphaTest: 0.5, side: THREE.DoubleSide}));
Player.castShadow = true;
Player.receiveShadow = false;
Player.position.set(10, 2.875, 15);
Scene.add(Player);

var ItemPreview = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ transparent: true }));

var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
var light = new THREE.DirectionalLight(0xFFFFFF, 2);
var lightTarget = new THREE.Object3D();

light.target = lightTarget;
Scene.add(lightTarget);

light.castShadow = true;

light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

Scene.add(ambient);
Scene.add(light);

var selectorTex = TexLoader.load("resources/textures/selector.png");
selectorTex.colorSpace = THREE.SRGBColorSpace;
selectorTex.magFilter = THREE.NearestFilter;
selectorTex.minFilter = THREE.NearestFilter;
var mapSelectorBox = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({map: selectorTex, alphaTest: 0.5}));
mapSelectorBox.scale.set(0, 0, 0);
mapSelectorBox.rotation.set(-Math.PI / 2, 0, 0);

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
const CoinTex = TexLoader.load("resources/textures/coin_low_res.png");
CoinTex.colorSpace = THREE.SRGBColorSpace;
CoinTex.minFilter = THREE.NearestFilter;
CoinTex.magFilter = THREE.NearestFilter;
var CoinPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: CoinTex, transparent: true }));
CoinText.add(CoinPlane);
var fontLoader = new FontLoader();
fontLoader.load("resources/fonts/Jersey 10/Jersey 10_Regular.json", function(font){
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
    fetch("resources/maps/barnacle-and-dime.json").then(res => res.json()).then(async res => {
        mapData = res.data;
        tutorialStarPos = res.tutorialStar.pos;
        tutorialStarRot = res.tutorialStar.rot;
        tutorialShopPos = res.tutorialShop.pos;
        tutorialShopRot = res.tutorialShop.rot;
        ShopWarpTiles = res.shopWarpTiles;
        StartingTile = res.startingTile;
        SKYBOX_TEX = CubeTexLoader.load(res.skybox);
        SKYBOX_TEX.colorSpace = THREE.SRGBColorSpace;
        DARK_SKYBOX_TEX = CubeTexLoader.load(res.darkSkybox);
        DARK_SKYBOX_TEX.colorSpace = THREE.SRGBColorSpace;
        ATLAS = TexLoader.load(res.atlas);
        ATLAS.colorSpace = THREE.SRGBColorSpace;
        ATLAS.wrapS = THREE.RepeatWrapping;
        ATLAS.wrapT = THREE.RepeatWrapping;
        ATLAS.magFilter = THREE.NearestFilter;
        ATLAS.minFilter = THREE.NearestFilter;
        MapMat = new THREE.MeshStandardMaterial({map: ATLAS});

        Scene.background = SKYBOX_TEX;

        if (Star != null){
            Star.children[1].material.envMap = SKYBOX_TEX;
            SilverStar.children[1].material.envMap = SKYBOX_TEX;
        }

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
var BlockList = new THREE.Group();
var KeyDoors = new THREE.Group();
const LockTex = TexLoader.load("./resources/textures/lock.png");
LockTex.colorSpace = THREE.SRGBColorSpace;
LockTex.minFilter = THREE.NearestFilter;
LockTex.magFilter = THREE.NearestFilter;
const LockMat = new THREE.MeshBasicMaterial({ map: LockTex, alphaTest: 0.5 });
var MapLocks = new THREE.Group();
function buildMap(){
    //Make sure everything is loaded first
    if (SilverStar == null || Star == null || KeyGateModel == null || GreenPipe == null || GoldPipe == null ||
        AvatarDecorationsLoaded < AvatarDecorations.hair.length + AvatarDecorations.hat.length + AvatarDecorations.skin.length + AvatarDecorations.shirt.length
    ){
        console.log("Waiting for resources to load...");
        setTimeout(buildMap, 100);
        return;
    }

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.set(mapSize.x / 2, 10, mapSize.y / 2 + 5);
    lightTarget.position.set(mapSize.x / 2, 0, mapSize.y / 2);

    light.shadow.camera.left = -(Math.max(mapSize.x, mapSize.y) + 1) / 2;
    light.shadow.camera.right = (Math.max(mapSize.x, mapSize.y) + 1) / 2;
    light.shadow.camera.top = (Math.max(mapSize.x, mapSize.y) + 1) / 2;
    light.shadow.camera.bottom = -(Math.max(mapSize.x, mapSize.y) + 1) / 2;
    light.shadow.camera.updateProjectionMatrix();

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

                var avg = Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg);

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

                if (x == 0 || (!mapData[y][x-1].ramp && mapData[y][x].height > mapData[y][x-1].height) || (mapData[y][x-1].ramp && mapData[y][x].height > Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg))){
                    buildWall(x, y, -1, 0, false);
                }
                if (x == mapSize.x - 1 || (!mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height) || (mapData[y][x+1].ramp && mapData[y][x].height > Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg))){
                    buildWall(x, y, 1, 0, false);
                }
                if (y == 0 || (!mapData[y-1][x].ramp && mapData[y][x].height > mapData[y-1][x].height) || (mapData[y-1][x].ramp && mapData[y][x].height > Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg))){
                    buildWall(x, y, 0, -1, false);
                }
                if (y == mapSize.y - 1 || (!mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height) || (mapData[y+1][x].ramp && mapData[y][x].height > Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg))){
                    buildWall(x, y, 0, 1, false);
                }
            }

            //Block placements
            if (x > 0 && !mapData[y][x].connections.w && !mapData[y][x].ramp && !mapData[y][x-1].ramp){
                //Place a block there
                if (mapData[y][x].height > mapData[y][x-1].height){
                    let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                    block.position.set(x - 0.5 + 1/16, mapData[y][x].height + 1/16, y);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    BlockList.add(block);
                }
                else if (mapData[y][x].height == mapData[y][x-1].height){
                    let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                    block.position.set(x - 0.5, mapData[y][x].height + 1/16, y);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    BlockList.add(block);
                }
            }
            if (x < mapSize.x - 1 && !mapData[y][x].connections.e && !mapData[y][x].ramp && !mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                block.position.set(x + 0.5 - 1/16, mapData[y][x].height + 1/16, y);
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
            }
            if (y > 0 && !mapData[y][x].connections.n && !mapData[y][x].ramp && !mapData[y-1][x].ramp){
                //Place a block there
                if (mapData[y][x].height > mapData[y-1][x].height){
                    let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/8, 1/8), BlockMat.clone());
                    block.position.set(x, mapData[y][x].height + 1/16, y - 0.5 + 1/16);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    BlockList.add(block);
                }
                else if (mapData[y][x].height == mapData[y-1][x].height){
                    let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/8, 1/8), BlockMat.clone());
                    block.position.set(x, mapData[y][x].height + 1/16, y - 0.5);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    BlockList.add(block);
                }
            }
            if (y < mapSize.y - 1 && !mapData[y][x].connections.s && !mapData[y][x].ramp && !mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height){
                //Place a block there
                let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/8, 1/8), BlockMat.clone());
                block.position.set(x, mapData[y][x].height + 1/16, y + 0.5 - 1/16);
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension), TrimMat.clone());
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, 1 + extension), TrimMat.clone());
                    block.position.set(x - 0.5 + 1/32, mapData[y][x].height + 1/32, y - offset);
                }
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension), TrimMat.clone());
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1/16, 1/16, 1 + extension), TrimMat.clone());
                    block.position.set(x + 0.5 - 1/32, mapData[y][x].height + 1/32, y - offset);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat.clone());
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1 + extension, 1/16, 1/16), TrimMat.clone());
                    block.position.set(x - offset, mapData[y][x].height + 1/32, y - 0.5 + 1/32);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat.clone());
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
                    block = new THREE.Mesh(new THREE.BoxGeometry(1 + extension, 1/16, 1/16), TrimMat.clone());
                    block.position.set(x - offset, mapData[y][x].height + 1/32, y + 0.5 - 1/32);
                } 
                block.castShadow = true;
                block.receiveShadow = true;
                BlockList.add(block);
            }

            //Key door placements
            if (x > 0 && mapData[y][x].connections.w == "lock" && mapData[y][x - 1].connections.e == "lock"){
                //Clone keygate here
                let gate = KeyGateModel.clone(true);
                let lock = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), LockMat);
                KeyDoors.add(gate);
                MapLocks.add(lock);
                gate.scale.set(0.1 / 16, 0.1 / 16, 0.1 / 16);
                gate.rotation.set(0, Math.PI / 2, 0);
                if (getHeightTile(x, y) > getHeightTile(x - 1, y)){
                    gate.position.set(x - 0.4375, getHeightTile(x, y), y);
                }
                else if (getHeightTile(x, y) < getHeightTile(x - 1, y)){
                    gate.position.set(x - 1 + 0.4375, getHeightTile(x - 1, y), y);
                    gate.rotation.set(0, -Math.PI / 2, 0);
                }
                else{
                    gate.position.set(x - 0.5, getHeightTile(x, y), y);
                }
                lock.rotation.set(-Math.PI / 2, 0, 0);
                lock.position.set(x - 0.5, getHeightTile(x, y) + 1.5, y);
            }
            if (y > 0 && mapData[y][x].connections.n == "lock" && mapData[y - 1][x].connections.s == "lock"){
                let gate = KeyGateModel.clone(true);
                let lock = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), LockMat);
                KeyDoors.add(gate);
                MapLocks.add(lock);
                gate.scale.set(0.1 / 16, 0.1 / 16, 0.1 / 16);
                gate.rotation.set(0, 0, 0);
                if (getHeightTile(x, y) > getHeightTile(x, y - 1)){
                    gate.position.set(x, getHeightTile(x, y), y - 0.4375);
                }
                else if (getHeightTile(x, y) < getHeightTile(x, y - 1)){
                    gate.position.set(x, getHeightTile(x, y - 1), y - 1 + 0.4375);
                    gate.rotation.set(0, Math.PI, 0);
                }
                else{
                    gate.position.set(x, getHeightTile(x, y), y - 0.5);
                }
                lock.rotation.set(-Math.PI / 2, 0, 0);
                lock.position.set(x, getHeightTile(x, y) + 1.5, y - 0.5);
            }
        }
    }

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.computeVertexNormals();

    var mat = new THREE.MeshStandardMaterial({ map: ATLAS, side: THREE.DoubleSide });
    MapMesh = new THREE.Mesh(geometry, /*mat*/MapMat);
    MapMesh.castShadow = true;
    MapMesh.receiveShadow = true;

    Scene.add(MapMesh);
    Scene.add(BlockList);
    Scene.add(KeyDoors);

    Renderer.domElement.style.filter = "blur(10px) opacity(50%)";
    let angle = Date.now() / 10000;
    Camera.position.set(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
    Camera.lookAt(new THREE.Vector3(mapSize.x / 2, 2.5, mapSize.y / 2));

    InitializeSocket();

    update();
}

loadMap();

var ItemData = {
    doubledice: {
        name: "Double Dice",
        description: "Roll 2 dice and move their total value",
        url: "resources/textures/doubledice.png",
        price: 7,
        usable: true,
        image: TexLoader.load("resources/textures/doubledice.png")
    },
    tripledice: {
        name: "Triple Dice",
        description: "Roll 3 dice and move their total value",
        url: "resources/textures/tripledice.png",
        price: 15,
        usable: true,
        image: TexLoader.load("resources/textures/tripledice.png")
    },
    pipe: {
        name: "Warp Pipe",
        description: "Warps you to a random tile on the board",
        url: "resources/textures/pipe.png",
        price: 4,
        usable: true,
        image: TexLoader.load("resources/textures/pipe.png")
    },
    goldpipe: {
        name: "Gold Pipe",
        description: "Warps you directly to the star",
        url: "resources/textures/goldpipe.png",
        price: 25,
        usable: true,
        image: TexLoader.load("resources/textures/goldpipe.png")
    },
    customdice: {
        name: "Custom Dice",
        description: "Choose any number between 1 and 10 to roll",
        url: "resources/textures/customdice.png",
        price: 5,
        usable: true,
        image: TexLoader.load("resources/textures/customdice.png")
    },
    tacticooler: {
        name: "Tacticooler",
        description: "Add 3 onto your next roll",
        url: "resources/textures/tacticooler.png",
        price: 3,
        usable: true,
        image: TexLoader.load("resources/textures/tacticooler.png")
    },
    shophopbox: {
        name: "Shop Hop Box",
        description: "Warp to a random shop",
        url: "resources/textures/shophopbox.png",
        price: 5,
        usable: true,
        image: TexLoader.load("resources/textures/shophopbox.png")
    },
    inkjet: {
        name: "Ink Jet",
        description: "Use to reach previously inaccessible areas",
        url: "resources/textures/inkjet.png",
        price: 3,
        usable: true,
        image: TexLoader.load("resources/textures/inkjet.png")
    },
    key: {
        name: "Skeleton Key",
        description: "Can be used at locked gates to open them",
        url: "resources/textures/key.png",
        price: 3,
        usable: false,
        image: TexLoader.load("resources/textures/key.png")
    }
};

for (var [key, value] of Object.entries(ItemData)){
    value.image.colorSpace = THREE.SRGBColorSpace;
    value.image.minFilter = THREE.NearestFilter;
    value.image.magFilter = THREE.NearestFilter;
}

var keys = {};
window.onkeydown = function(e){ 
    keys[e.keyCode] = true; 

    if (turnStep == "move" && spacesMoved < PlayerData.roll){
        if (e.key == "w" || e.key == "ArrowUp"){
            TestMoveSpace(0, -1);
        }
        else if (e.key == "a" || e.key == "ArrowLeft"){
            TestMoveSpace(-1, 0);
        }
        else if (e.key == "s" || e.key == "ArrowDown"){
            TestMoveSpace(0, 1);
        }
        else if (e.key == "d" || e.key == "ArrowRight"){
            TestMoveSpace(1, 0);
        }
    }

    //Map Build Stuff
    /*if (e.keyCode == 13){
        //Enter
        let input = prompt("Material", mapData[PlayerData.position.y][PlayerData.position.x].material);
        mapData[PlayerData.position.y][PlayerData.position.x].material = Number.parseInt(input);
        Scene.remove(MapMesh);
        buildMap();
    }*/
    /*if (e.keyCode == 27){
        //ESC
        navigator.clipboard.writeText(JSON.stringify(mapData, null, "\t"));
        console.log("COPY!!!!");
    }*/
}
window.onkeyup = function(e){ keys[e.keyCode] = false; }

var StartingTile = { x: 15, y: 30 };
var ShopWarpTiles = [];

var PlayerData = {
    position: {
        x: 15,
        y: 30
    },
    roll: 0,
    items: ["doubledice"],
    coins: 10,
    stars: 0,
    collectedSilverStars: [],
    currentTurn: 1,
    turnsCompleted: 0,
    canDuel: true,
    canSteal: true,
    isStealing: false,
    tutorial: true
};

var PlayerSilverStarObjs = [];
var CollectedSilverStarPlayerPos = [
    new THREE.Vector3(-0.3, 0.85, 0),
    new THREE.Vector3(0.4, 0.7, 0),
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0.1, 1, 0),
    new THREE.Vector3(0.55, 0.35, 0)
];
var CollectedSilverStarAbovePos = [
    new THREE.Vector3(-0.05, 0.1, -0.1),
    new THREE.Vector3(0.05, 0.1, -0.1),
    new THREE.Vector3(-0.05, 0.1, 0),
    new THREE.Vector3(0, 0.1, -0.05),
    new THREE.Vector3(-0.1, 0.1, 0.1)
];

var ServerSilverStars = [];

var lastFrameTime = Date.now();
const UIPanels = {
    connecting: document.getElementById("connecting"),
    login: document.getElementById("login"),
    characterCreator: document.getElementById("character-creator"),
    checkin: document.getElementById("checkin"),
    waitMinigame: document.getElementById("waiting-minigame"),
    waitTurn: document.getElementById("waiting-turn"),
    minigame: document.getElementById("new-minigame"),
    globalLeaderboard: document.getElementById("global-leaderboard"),
    disconnected: document.getElementById("disconnected")
};

const MinigameChatElement = document.getElementById("new-minigame-chat");
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

    AnimateSilverStars();

    updateDoorOpenings();

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
    map: 500,
    doorn: 500,
    doors: 500,
    doore: 500,
    doorw: 500,
    podium: 500,
    tutorialstar: 500,
    tutorialshop: 500
};
var transitionStart = 0;
var tutorialStarPos, tutorialStarRot, tutorialShopPos, tutorialShopRot;
function UpdateUI(){
    var filter;
    var playerRot;
    var playerPos;
    var cameraRot;
    var cameraPos;

    if (UIState == "override"){
        lastUIState = "override";
        return;
    }

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
        cameraPos = new THREE.Vector3(mapSize.x / 2 - 0.5, 32, mapSize.y / 2 - 0.5);
        cameraRot = new THREE.Euler(-Math.PI / 2, 0, 0);
    }
    else if (UIState == "doorn"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        let yPos = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y - 1) + 0.4, PlayerData.position.y - 1 + 1.5);
        cameraRot = new THREE.Euler(0, 0, 0);
    }
    else if (UIState == "doors"){
        filter = 0;
        playerRot = new THREE.Euler(0, Math.PI, 0);
        let yPos = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y + 1) + 0.4, PlayerData.position.y + 1 - 1.5);
        cameraRot = new THREE.Euler(0, Math.PI, 0);
    }
    else if (UIState == "doore"){
        filter = 0;
        playerRot = new THREE.Euler(0, -Math.PI / 2, 0);
        let yPos = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x + 1 - 1.5, getHeightTile(PlayerData.position.x + 1, PlayerData.position.y) + 0.4, PlayerData.position.y);
        cameraRot = new THREE.Euler(0, -Math.PI / 2, 0);
    }
    else if (UIState == "doorw"){
        filter = 0;
        playerRot = new THREE.Euler(0, Math.PI / 2, 0);
        let yPos = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        playerPos = new THREE.Vector3(PlayerData.position.x, yPos + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x - 1 + 1.5, getHeightTile(PlayerData.position.x - 1, PlayerData.position.y) + 0.4, PlayerData.position.y);
        cameraRot = new THREE.Euler(0, Math.PI / 2, 0);
    }
    else if (UIState == "podium"){
        filter = 1;
        let angle = (Date.now() - resultsAnimEndTime) / 10000 % (Math.PI * 2) + (Math.PI / 2);
        cameraPos = new THREE.Vector3(PodiumPosition.x + (Math.cos(angle) * 2.5), getHeightTile(PodiumPosition.x, PodiumPosition.y) + 1.25, PodiumPosition.y + (Math.sin(angle) * 2.5));
        cameraRot = new THREE.Euler(-0.09966865249116202, Math.PI / 2 - angle, 0, "YXZ");
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(0, 0, 0);
    }
    else if (UIState == "tutorialstar"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(tutorialStarPos.x, tutorialStarPos.y, tutorialStarPos.z);
        cameraRot = new THREE.Euler(tutorialStarRot.x, tutorialStarRot.y, tutorialStarRot.z);
    }
    else if (UIState == "tutorialshop"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(tutorialShopPos.x, tutorialShopPos.y, tutorialShopPos.z);
        cameraRot = new THREE.Euler(tutorialShopRot.x, tutorialShopRot.y, tutorialShopRot.z);
    }

    if (lastUIState != UIState){
        //Enable transition
        lastUIState = UIState;
        transitionStart = Date.now();
        if (UIState == "player"){
            SetBlockTranparency();
        }
        else{
            SetBlockOpaque();
        }
    }

    if (UIState == "podium"){
        if (transitionStart + transitionLength[UIState] > Date.now()){
            let t = (Date.now() - transitionStart) / transitionLength[UIState];

            filter = lerp(transitionValues.filter, filter, t);

            document.getElementById("results").style.opacity = t * 100 + "%";
            document.getElementById("results").style.transform = "translate(-50%, calc(-50% + " + ((1-t) * 10) + "vmin))";
        }
        else{
            document.getElementById("results").style.opacity = "";
            document.getElementById("results").style.transform = "";
        }
    }
    else if (transitionStart + transitionLength[UIState] > Date.now()){
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

function SetBlockTranparency(){
    for (let i = 0; i < BlockList.children.length; i++){
        let tZ = PlayerData.position.y + EPSILON;
        BlockList.children[i].material.opacity = getHeightTile(PlayerData.position.x, Math.round(tZ)) == getHeightTile(Math.round(BlockList.children[i].position.x), Math.round(BlockList.children[i].position.z)) ? 1 : Math.max(0, Math.min(1, Math.sign(tZ - BlockList.children[i].position.z)));
    }
}

function SetBlockTranparencyFromCamera(){
    for (let i = 0; i < BlockList.children.length; i++){
        let tZ = Camera.position.z - 1.5 + EPSILON;
        BlockList.children[i].material.opacity = Math.max(0, Math.min(1, Math.sign(tZ - BlockList.children[i].position.z)));
    }
}

function SetBlockOpaque(){
    for (let i = 0; i < BlockList.children.length; i++){
        BlockList.children[i].material.opacity = 1;
    }
}

function InitializeSilverStars(){
    for (var i = 0; i < ServerSilverStars.length; i++){
        if (!Object.hasOwn(ServerSilverStars[i], "obj")){
            Object.defineProperty(ServerSilverStars[i], "obj", { writable: true, enumerable: true, value: null });
            Object.defineProperty(ServerSilverStars[i], "offset", { writable: true, enumerable: true, value: Math.random() });
        }

        if (!Object.hasOwn(ServerSilverStars[i], "buffer")){
            Object.defineProperty(ServerSilverStars[i], "buffer", { enumerable: false, writable: true, value: { pos: new THREE.Vector3(), rot: new THREE.Vector3(), scale: new THREE.Vector3() } });
        }

        if (ServerSilverStars[i].obj == null && !PlayerData.collectedSilverStars.includes(i)){
            ServerSilverStars[i].obj = SilverStar.clone(true);
            ServerSilverStars[i].obj.children[0].material = SilverStar.children[0].material.clone();
            ServerSilverStars[i].obj.children[1].material = SilverStar.children[1].material.clone();
            Scene.add(ServerSilverStars[i].obj);
            ServerSilverStars[i].obj.position.set(ServerSilverStars[i].x, getHeightTile(ServerSilverStars[i].x, ServerSilverStars[i].y) + 0.35, ServerSilverStars[i].y);
        }
    }
    for (var i = 0; i < PlayerData.collectedSilverStars.length % 5; i++){
        let ss = SilverStar.clone(true);
        ss.material = SilverStar.material.clone();
        Scene.add(ss);
        PlayerSilverStarObjs.push(ss);
    }
}
var silverStarCameFromMinigame = false;
function SpawnSilverStarBoard(starPos, cameFromMinigame){
    silverStarCameFromMinigame = cameFromMinigame;
    //Don't need to set position because the animate function will take care of that
    let star = SilverStar.clone(true);
    star.children[0].material = SilverStar.children[0].material.clone();
    star.children[1].material = SilverStar.children[1].material.clone();
    ServerSilverStars.push({ x: starPos.x, y: starPos.y, spawned: true, obj: star, offset: Math.random() });
    Object.defineProperty(ServerSilverStars[ServerSilverStars.length - 1], "buffer", { enumerable: false, writable: true, value: { pos: new THREE.Vector3(), rot: new THREE.Vector3(), scale: new THREE.Vector3() } });
    Scene.add(star);

    UIState = "override";
    turnStep = "spawn-silver-star-anim";
    animTimer = 5;
    transitionValues.filter = 0;
}
function SpawnSilverStarAnimation(){
    const animLength = 5;

    animTimer -= DeltaTime;

    let silverStar = ServerSilverStars[ServerSilverStars.length - 1];
    let starPos = new THREE.Vector3(silverStar.x, getHeightTile(silverStar.x, silverStar.y), silverStar.y);
    let playerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 2){
        let t = 1 - ((animTimer - animLength + 2) / 2);
        let filter = 1 - Math.min(t * 4, 1);
        //Extra long so it pauses at the beginning
        silverStar.obj.position.set(starPos.x, starPos.y + lerp(4, 0.35, t), starPos.z);
        Camera.position.set(starPos.x, starPos.y + 1.5, starPos.z + 2.5);
        Camera.rotation.set(-Math.PI / 6, 0, 0, "YXZ");
        Renderer.domElement.style.filter = filter > 0 ? "blur(" + (10 * filter) + "px) opacity(" + (100 - (50 * filter)) + "%)" : "";
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 6) / 4);
        //(Math.sin(Date.now() / 750 + ServerSilverStars[i].offset) * 0.075)
        silverStar.obj.position.set(starPos.x, starPos.y + 0.35 + (Math.sin(-t * 8) * 0.075), starPos.z);
        silverStar.obj.rotation.set(0, 0, Math.sin(t * 10) * 0.1, "YXZ");
    }
    else{
        UIState = "player";
        turnStep = "menu";

        transitionValues.cameraPos = new THREE.Vector3(Camera.position.x, Camera.position.y, Camera.position.z);
        transitionValues.cameraRot = new THREE.Euler(Camera.rotation.x, Camera.rotation.y, Camera.rotation.z, "YXZ");
                
        if (silverStarCameFromMinigame){
            console.log("CAME FROM MINIGAME");
            minigameCoinGiveCheck = true;
            getPlayerDataTimeout(0);
        }
        else{
            if (PlayerData.tutorial){
                UIState = "player";
                turnStep = "tutorial";
                document.getElementById("tutorial").style.display = "initial";
                document.getElementsByClassName("player-data")[0].style.display = "none";
            }
            else{
                document.getElementsByClassName("player-inputs")[0].style.display = "flex";
            }
        }
        UpdateItemUI();
        UpdatePlayerUI();
    }
}
function CollectSilverStar(index){
    if (PlayerData.collectedSilverStars.includes(index)){
        console.error("Player Collected a star that has already been collected!");
        return;
    }

    PlayerData.collectedSilverStars.push(index);
    PlayerSilverStarObjs.push(ServerSilverStars[index].obj);
    ServerSilverStars[index].obj = null;
}
function UncollectLatestSilverStar(){
    let index = PlayerData.collectedSilverStars[PlayerData.collectedSilverStars.length - 1];
    PlayerData.collectedSilverStars.splice(PlayerData.collectedSilverStars.length - 1, 1);

    ServerSilverStars[index].obj = PlayerSilverStarObjs[PlayerSilverStarObjs.length - 1];
    PlayerSilverStarObjs.splice(PlayerSilverStarObjs.length - 1, 1);
}
const SilverStarMoveSpeed = 2;
const SilverStarFollowOffset = 0.5;
const SilverStarStopFollowDistance = 0.25;
const SilverStarSlowDownDistance = 0.5;
function AnimateSilverStars(){
    //Uncollected map silver stars
    for (var i = 0; i < ServerSilverStars.length; i++){
        if (ServerSilverStars[i].obj == null || PlayerData.collectedSilverStars.includes(i)) continue;
        if (i == ServerSilverStars.length - 1 && turnStep == "spawn-silver-star-anim") break;
        let pos, rot, scale;
        if (UIState == "map"){
            pos = new THREE.Vector3(ServerSilverStars[i].x, getHeightTile(ServerSilverStars[i].x, ServerSilverStars[i].y) + 0.2, ServerSilverStars[i].y);
            rot = new THREE.Euler(-Math.PI / 2, 0, Math.sin(Date.now() / 887 + ServerSilverStars[i].offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.002, 0.002, 0.002);
        }
        else if (UIState == "above"){
            pos = new THREE.Vector3(ServerSilverStars[i].x, getHeightTile(ServerSilverStars[i].x, ServerSilverStars[i].y) + 0.2, ServerSilverStars[i].y);
            rot = new THREE.Euler(-Math.PI / 2, 0, Math.sin(Date.now() / 887 + ServerSilverStars[i].offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.0015, 0.0015, 0.0015);
        }
        else{
            pos = new THREE.Vector3(ServerSilverStars[i].x, getHeightTile(ServerSilverStars[i].x, ServerSilverStars[i].y) + (Math.sin(Date.now() / 750 + ServerSilverStars[i].offset) * 0.075) + 0.35, ServerSilverStars[i].y);
            rot = new THREE.Euler(0, 
                easeInOut(Math.min(1, (Date.now() / 1000 + (ServerSilverStars[i].offset * 12)) % 12)) * Math.PI * 2, 
                Math.sin(Date.now() / 887 + ServerSilverStars[i].offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.001, 0.001, 0.001);
        }

        if (transitionStart + transitionLength[UIState] > Date.now()){
            let t = (Date.now() - transitionStart) / transitionLength[UIState];

            pos = new THREE.Vector3(lerp(ServerSilverStars[i].buffer.pos.x, pos.x, t), lerp(ServerSilverStars[i].buffer.pos.y, pos.y, t), lerp(ServerSilverStars[i].buffer.pos.z, pos.z, t));
            rot = new THREE.Euler(lerp(ServerSilverStars[i].buffer.rot.x, rot.x, t), lerp(ServerSilverStars[i].buffer.rot.y, rot.y, t), lerp(ServerSilverStars[i].buffer.rot.z, rot.z, t), "YXZ");
            scale = new THREE.Vector3(lerp(ServerSilverStars[i].buffer.scale.x, scale.x, t), lerp(ServerSilverStars[i].buffer.scale.y, scale.y, t), lerp(ServerSilverStars[i].buffer.scale.z, scale.z, t));
        }
        else{
            //Set buffer values
            ServerSilverStars[i].buffer.pos = pos;
            ServerSilverStars[i].buffer.rot = rot;
            ServerSilverStars[i].buffer.scale = scale;
        }

        ServerSilverStars[i].obj.position.set(pos.x, pos.y, pos.z);
        ServerSilverStars[i].obj.setRotationFromEuler(rot);
        ServerSilverStars[i].obj.scale.set(scale.x, scale.y, scale.z);
    }

    //Animated collected silver stars floating around player and following them on map
    if (PlayerSilverStarObjs.length == 0) return;
    if (turnStep == "silver-stars-to-star-anim") return;
    for (var i = 0; i < PlayerSilverStarObjs.length; i++){
        let offset = (i * Math.PI / 2);
        let pos, rot, scale;

        if (UIState == "above"){
            //Do a follow anim here
            let targetPos = new THREE.Vector3(
                PlayerData.position.x + CollectedSilverStarAbovePos[i % 5].x, 
                Math.max(getHeightTile(Math.round(PlayerSilverStarObjs[i].position.x), Math.round(PlayerSilverStarObjs[i].position.z)), getHeightTile(PlayerData.position.x, PlayerData.position.y)) + CollectedSilverStarAbovePos[i % 5].y,
                PlayerData.position.y + CollectedSilverStarAbovePos[i % 5].z);
            let dist = Math.sqrt(Math.pow(PlayerSilverStarObjs[i].position.x - targetPos.x, 2) + Math.pow(PlayerSilverStarObjs[i].position.y - targetPos.y, 2) + Math.pow(PlayerSilverStarObjs[i].position.z - targetPos.z, 2));
            let speed = Math.min(Math.max(dist - (SilverStarStopFollowDistance * i + SilverStarFollowOffset), 0) / SilverStarSlowDownDistance, 1) * SilverStarMoveSpeed * DeltaTime;
            pos = new THREE.Vector3(
                lerp(PlayerSilverStarObjs[i].position.x, targetPos.x, speed / dist),
                lerp(PlayerSilverStarObjs[i].position.y, targetPos.y, speed / dist),
                lerp(PlayerSilverStarObjs[i].position.z, targetPos.z, speed / dist),
            );
            rot = new THREE.Euler(-Math.PI/2, 0, Math.sin(Date.now() / 887 + offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.00075, 0.00075, 0.00075);
        }
        else{
            if (i < 5){
                pos = new THREE.Vector3(PlayerData.position.x + CollectedSilverStarPlayerPos[i].x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + CollectedSilverStarPlayerPos[i].y + (Math.sin(Date.now() / 750 + offset) * 0.075), PlayerData.position.y)
                rot = new THREE.Euler(0, 
                    easeInOut(Math.min(1, (Date.now() / 1000 + (offset * 12)) % 12)) * Math.PI * 2, 
                    Math.sin(Date.now() / 887 + offset) * 0.1, "YXZ");
                scale = new THREE.Vector3(0.00075, 0.00075, 0.00075);
            }
            else{
                //Hide any stars above 5, need these out of the way for a star get animation
                pos = new THREE.Vector3(PlayerData.position.x, 0, PlayerData.position.y);
                rot = new THREE.Euler(0, 0, 0, "YXZ");
                scale = new THREE.Vector3(0, 0, 0);
            }
        }

        PlayerSilverStarObjs[i].position.set(pos.x, pos.y, pos.z);
        PlayerSilverStarObjs[i].setRotationFromEuler(rot);
        PlayerSilverStarObjs[i].scale.set(scale.x, scale.y, scale.z);
    }
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

var turnStep = "menu";//Deafult is menu
var turnAnimTimer = 0;
var rollsRemaining = 1;
var currentRoll = 0;
var addToRoll = 0;
let rollHistory = [];
var rollBonus = false;
const doubleDittoBonus = 10;
const tripleDittoBonus = 20;
var openShopPreview = "";
var customDiceRoll = 0;
var luckyOptions = document.getElementsByClassName("lucky-option");
var luckyTimer = 0;
var luckyClickTimer = -1;
const luckyItemOptions = ["doubledice", "tripledice", "tacticooler", "customdice", "shophopbox", "pipe", "key"];
var luckyRouletteItems = [];
function DoTurn(){
    if (turnStep == "menu"){

    }
    else if (turnStep == "roll"){
        if (customDiceRoll == 0){
            //Not using custom dice
            if (turnAnimTimer == 0){
                Dice[rollsRemaining - 1].position.set(Player.position.x, Player.position.y + 0.85, Player.position.z);
                Dice[rollsRemaining - 1].rotation.set(Date.now() / 96, Date.now() / 232, Date.now() / 181, "YXZ");
                Dice[rollsRemaining - 1].scale.set(0.85, 0.85, 0.85);

                if (RollClick){
                    turnAnimTimer = 1.5;
                    UIState = "override";
                    document.getElementsByClassName("roll-back-button")[0].style.display = "none";
                    document.getElementsByClassName("board-inputs")[0].style.display = "none";

                    //Do Roll
                    currentRoll = Math.floor(Math.random() * 10) + 1;
                    rollHistory.push(currentRoll);
                    PlayerData.roll += currentRoll + addToRoll;
                    addToRoll = 0;
                    spacesMoved = 0;
                    Dice[rollsRemaining - 1].children[5].geometry.dispose();
                    Dice[rollsRemaining - 1].children[5].geometry = new TextGeometry(currentRoll.toString(), {font: DiceFont, size: 0.45, depth: 0, curveSegments: 1});
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
                    if (rollsRemaining == 0){
                        SetMoveUI();

                        if (rollHistory.length == 2) rollBonus = rollHistory[0] == rollHistory[1];
                        else if (rollHistory.length == 3) rollBonus = rollHistory[0] == rollHistory[1] && rollHistory[1] == rollHistory[2];
                        else rollBonus = false;

                        if (rollBonus){
                            if (rollHistory.length == 2){
                                Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, roll: PlayerData.roll, coins: PlayerData.coins + doubleDittoBonus }));
                                document.getElementById("double-ditto-roll").style.display = "initial";
                            }
                            else if (rollHistory.length == 3){
                                Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, roll: PlayerData.roll, coins: PlayerData.coins + tripleDittoBonus }));
                                document.getElementById("triple-ditto-roll").style.display = "initial";
                            }
                        }
                        else{
                            Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, roll: PlayerData.roll }));
                        }
                        rollHistory = [];
                    }
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
                    if (rollBonus){
                        turnAnimTimer += DeltaTime;
                    }
                    else{
                        let t = turnAnimTimer / 0.1;
                        for (var i = 0; i < Dice.length; i++){
                            Dice[i].scale.set(Math.max(Dice[i].scale.x - (8.5 * DeltaTime), 0), Math.max(Dice[i].scale.y - (8.5 * DeltaTime), 0), Math.max(Dice[i].scale.z - (8.5 * DeltaTime), 0));
                        }
                        document.getElementsByClassName("roll-display")[0].style.transform = "scale(" + ((1 - t) * 100) + "%)";
                    }
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
                    document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
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
                    document.getElementsByClassName("board-inputs")[0].style.display = "none";

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
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, roll: PlayerData.roll }));

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

                    document.getElementsByClassName("leaderboard-button")[0].style.display = "none";
                    document.getElementsByClassName("help-button")[0].style.display = "none";
                }
            }
            else{
                if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
                openShopPreview = "";

                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                document.getElementsByClassName("help-button")[0].style.display = "initial";
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
    else if (turnStep == "star-lose-anim"){
        StarLoseAnimation();
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
    else if (turnStep == "silver-stars-to-star-anim" || turnStep == "silver-stars-to-star-anim-intro"){
        SilverStarsToStarAnimation();
    }
    else if (turnStep == "spawn-silver-star-anim"){
        SpawnSilverStarAnimation();
    }
    else if (turnStep == "results-anim"){
        ResultsAnimation();
    }
    else if (turnStep == "tutorial-give-anim"){
        TutorialGiveAnimation();
    }
    else if (turnStep == "popup"){
        if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "lucky-space"){
            luckyTimer += luckyClickTimer == -1 ? DeltaTime : DeltaTime * lerp(0, 0.85, Math.max(Math.min(luckyClickTimer - 1, 2), 0) / 2);
            let selectedIndex = Math.floor(luckyTimer * 15) % luckyOptions.length;
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
                if (selectedIndex % 2 == 1){
                    //Coins
                    TriggerCoinChangeAnimation([10, 5, 15][(selectedIndex - 1) / 2]);
                }
                else{
                    //Item
                    TriggerGiveItemAnimation(luckyRouletteItems[selectedIndex / 2], false);
                }
            }
        }
    }
    else if (turnStep == "end-turn"){
        EndTurn();
    }

    RollClick = false;
}

document.getElementById("double-ditto-roll-okay").onclick = function(e){
    TriggerCoinChangeAnimation(doubleDittoBonus);
    document.getElementById("double-ditto-roll").style.display = "none";
};

document.getElementById("triple-ditto-roll-okay").onclick = function(e){
    TriggerCoinChangeAnimation(tripleDittoBonus);
    document.getElementById("triple-ditto-roll").style.display = "none";
};

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
//THIS IS A MAP BUILDING FUNCTION
var targetDebugPos;
window.onmousedown = function(e){
    /*if (turnStep == "map"){
        raycaster.setFromCamera(pointer, Camera);
        var intersections = raycaster.intersectObject(MapMesh, false);

        if (intersections.length > 0){
            let intersectPos = new THREE.Vector2(Math.round(intersections[0].point.x), Math.round(intersections[0].point.z));
            //let newMat = Number.parseInt(prompt("Enter New Material", mapData[intersectPos.y][intersectPos.x].material));
            //let spawnable = window.confirm("Spawnable? " + mapData[intersectPos.y][intersectPos.x].silverStarSpawnable);

            document.getElementById("debug-text-input").value = JSON.stringify(mapData[intersectPos.y][intersectPos.x], null, "\t");
            targetDebugPos = intersectPos;
            console.log("HI");
            console.log(intersectPos);

            //let data = JSON.parse(prompt("MapData", JSON.stringify(mapData[intersectPos.y][intersectPos.x])));
            //mapData[intersectPos.y][intersectPos.x] = data;
            //mapData[intersectPos.y][intersectPos.x].silverStarSpawnable = spawnable;
            //console.log(spawnable);
            //if (mapData[intersectPos.y][intersectPos.x].material != newMat){
            //    mapData[intersectPos.y][intersectPos.x].material = newMat;

                //Then update face appearance
                //Scene.remove(MapMesh);
                //buildMap();
            //}
            
        }
    }*/
}
document.getElementById("debug-set-button").onclick = function(e){
    let data = JSON.parse(document.getElementById("debug-text-input").value);
    mapData[targetDebugPos.y][targetDebugPos.x] = data;
    
    MapMesh.geometry.dispose();
    MapMesh.material.dispose();
    Scene.remove(MapMesh);

    while (BlockList.children.length > 0){
        let child = BlockList.children[0];
        child.geometry.dispose();
        BlockList.remove(child);
    }
    Scene.remove(BlockList);

    while (KeyDoors.children.length > 0){
        let child = KeyDoors.children[0];
        KeyDoors.remove(child);
    }
    Scene.remove(KeyDoors);

    buildMap();
}
document.getElementById("debug-map-button").onclick = function(e){
    UIState = "map";
    turnStep = "map";
    Scene.add(mapSelectorBox);
}
document.getElementById("debug-player-button").onclick = function(e){
    UIState = "player";
    turnStep = "null";
}

function SetMoveUI(){
    if (turnStep == "key"){
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("roll-display")[0].children[0].textContent = "";
        document.getElementsByClassName("left-move-button")[0].style.display = "none";
        document.getElementsByClassName("right-move-button")[0].style.display = "none";
        document.getElementsByClassName("up-move-button")[0].style.display = "none";
        document.getElementsByClassName("down-move-button")[0].style.display = "none";
    }
    else if (spacesMoved < PlayerData.roll){
        document.getElementsByClassName("move-undo-button")[0].style.display = spacesMoved > 0 ? "initial" : "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("roll-display")[0].children[0].textContent = PlayerData.roll - spacesMoved;
        document.getElementsByClassName("left-move-button")[0].style.display = 
            PlayerData.position.x > 0 && (mapData[PlayerData.position.y][PlayerData.position.x].connections.w == true || (mapData[PlayerData.position.y][PlayerData.position.x].connections.w == "lock" && PlayerData.items.includes("key")) || doorUnlocked(PlayerData.position.x, PlayerData.position.y, "w")) 
            && mapData[PlayerData.position.y][PlayerData.position.x - 1].height != 0 ? "initial" : "none";
        document.getElementsByClassName("right-move-button")[0].style.display = 
            PlayerData.position.x < mapSize.x - 1 && (mapData[PlayerData.position.y][PlayerData.position.x].connections.e == true || (mapData[PlayerData.position.y][PlayerData.position.x].connections.e == "lock" && PlayerData.items.includes("key")) || doorUnlocked(PlayerData.position.x, PlayerData.position.y, "e"))
            && mapData[PlayerData.position.y][PlayerData.position.x + 1].height != 0 ? "initial" : "none";
        document.getElementsByClassName("up-move-button")[0].style.display = 
            PlayerData.position.y > 0 && (mapData[PlayerData.position.y][PlayerData.position.x].connections.n == true || (mapData[PlayerData.position.y][PlayerData.position.x].connections.n == "lock" && PlayerData.items.includes("key")) || doorUnlocked(PlayerData.position.x, PlayerData.position.y, "n"))
            && mapData[PlayerData.position.y - 1][PlayerData.position.x].height != 0 ? "initial" : "none";
        document.getElementsByClassName("down-move-button")[0].style.display = 
            PlayerData.position.y < mapSize.y - 1 && (mapData[PlayerData.position.y][PlayerData.position.x].connections.s == true || (mapData[PlayerData.position.y][PlayerData.position.x].connections.s == "lock" && PlayerData.items.includes("key")) || doorUnlocked(PlayerData.position.x, PlayerData.position.y, "s"))
            && mapData[PlayerData.position.y + 1][PlayerData.position.x].height != 0 ? "initial" : "none";
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

function updateDoorOpenings(){
    for (var i = 0; i < KeyDoors.children.length; i++){
        let x1 = Math.floor(KeyDoors.children[i].position.x);
        let y1 = Math.floor(KeyDoors.children[i].position.z);
        let x2 = Math.ceil(KeyDoors.children[i].position.x);
        let y2 = Math.ceil(KeyDoors.children[i].position.z);
        let dir = (x2 - x1) == 1 ? "h" : "v";
        //console.log(x1 + ", " + y1);
        let j = doorUnlockedIndex(x1, y1, dir == "h" ? "e" : "s");
        if (j != -1){
            unlockedDoors[j].t = Math.min(unlockedDoors[j].t + (DeltaTime * 2), 1.5);
            let eio = easeInOut(Math.max(0, unlockedDoors[j].t - 0.5));
            KeyDoors.children[i].children[0].rotation.set(0, lerp(0, Math.PI / 2, eio), 0);
            KeyDoors.children[i].children[2].rotation.set(0, lerp(0, -Math.PI / 2, eio), 0);
        }
        else{
            KeyDoors.children[i].children[0].rotation.set(0, 0, 0);
            KeyDoors.children[i].children[2].rotation.set(0, 0, 0);
        }
    }
}

function doorUnlocked(x, y, dir){
    let xOffset = dir == "w" ? -1 : (dir == "e" ? 1 : 0);
    let yOffset = dir == "n" ? -1 : (dir == "s" ? 1 : 0);
    let negDir = (dir == "w" ? "e" : (dir == "e" ? "w" : (dir == "n" ? "s" : "n")));
    for (var i = 0; i < unlockedDoors.length; i++){
        if (unlockedDoors[i].x == x && unlockedDoors[i].y == y && unlockedDoors[i].dir == dir){
            return true;
        }
        if (unlockedDoors[i].x == x + xOffset && unlockedDoors[i].y == y + yOffset && unlockedDoors[i].dir == negDir){
            return true;
        }
    }
    return false;
}
function doorUnlockedIndex(x, y, dir){
    let xOffset = dir == "w" ? -1 : (dir == "e" ? 1 : 0);
    let yOffset = dir == "n" ? -1 : (dir == "s" ? 1 : 0);
    let negDir = (dir == "w" ? "e" : (dir == "e" ? "w" : (dir == "n" ? "s" : "n")));
    for (var i = 0; i < unlockedDoors.length; i++){
        if (unlockedDoors[i].x == x && unlockedDoors[i].y == y && unlockedDoors[i].dir == dir){
            return i;
        }
        if (unlockedDoors[i].x == x + xOffset && unlockedDoors[i].y == y + yOffset && unlockedDoors[i].dir == negDir){
            return i;
        }
    }
    return -1;
}

function resetDoorUnlocks(){
    unlockedDoors = [];
}

var spacesMoved = 0;
var moveHistory = [];
var unlockedDoors = [];
var targetLockedDoor;
function TestMoveSpace(xOffset, yOffset){
    if (turnStep == "move"){
        let x = PlayerData.position.x + xOffset;
        let y = PlayerData.position.y + yOffset;
        
        if (x < 0 || y < 0 || x > mapSize.x - 1 || y > mapSize.y - 1) return;
        if (mapData[y][x].height == 0) return;

        if ((xOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.w == true) ||
        (xOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.e == true) ||
        (yOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.n == true) ||
        (yOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.s == true) ||
        (xOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.w == "lock" && doorUnlocked(PlayerData.position.x, PlayerData.position.y, "w")) || 
        (xOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.e == "lock" && doorUnlocked(PlayerData.position.x, PlayerData.position.y, "e")) ||
        (yOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.n == "lock" && doorUnlocked(PlayerData.position.x, PlayerData.position.y, "n")) ||
        (yOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.s == "lock" && doorUnlocked(PlayerData.position.x, PlayerData.position.y, "s"))){
            let newItemArray = [];
            for (let i = 0; i < PlayerData.items.length; i++) newItemArray.push(PlayerData.items[i]);
            let newSilverStarArray = [];
            for (let i = 0; i < PlayerData.collectedSilverStars.length; i++) newSilverStarArray.push(PlayerData.collectedSilverStars[i]);
            let newUnlockedDoorsArray = [];
            for (let i = 0; i < unlockedDoors.length; i++) newUnlockedDoorsArray.push(unlockedDoors[i]);
            moveHistory.push({ position: PlayerData.position, coins: PlayerData.coins, stars: PlayerData.stars, items: newItemArray, collectedSilverStars: newSilverStarArray,
                unlockedDoors: newUnlockedDoorsArray, canDuel: PlayerData.canDuel, canSteal: PlayerData.canSteal, isStealing: PlayerData.isStealing
             });
            PlayerData.position = { x: x, y: y };
            spacesMoved++;
            SetMoveUI();
            
            //Test if space has a silver star on it
            for (let i = 0; i < ServerSilverStars.length; i++){
                if (PlayerData.collectedSilverStars.includes(i)) continue;
                if (ServerSilverStars[i].x == PlayerData.position.x && ServerSilverStars[i].y == PlayerData.position.y){
                    //Collect it
                    CollectSilverStar(i);
                    break;
                }
            }

            if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "popup") && mapData[PlayerData.position.y][PlayerData.position.x].walkOver){
                //Trigger Popup
                OpenPopup();
            }
        }
        else if (PlayerData.items.includes("key") && 
        ((xOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.w == "lock") || 
        (xOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.e == "lock") ||
        (yOffset == -1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.n == "lock") ||
        (yOffset == 1 && mapData[PlayerData.position.y][PlayerData.position.x].connections.s == "lock"))){
            UIState = xOffset == 0 ? (yOffset == 1 ? "doors" : "doorn") : (xOffset == 1 ? "doore" : "doorw");
            turnStep = "key";
            document.getElementById("key-door").style.display = "initial";
            targetLockedDoor = { x: PlayerData.position.x, y: PlayerData.position.y, 
                dir: (mapData[PlayerData.position.y][PlayerData.position.x].connections.w == "lock" ? "w" : (mapData[PlayerData.position.y][PlayerData.position.x].connections.e == "lock" ? "e" : (mapData[PlayerData.position.y][PlayerData.position.x].connections.n == "lock" ? "n" : "s"))), 
                t: 0 };
            SetMoveUI();
        }
    }
}
document.getElementById("key-door-yes-button").onclick = (e) => {
    PlayerData.items.splice(PlayerData.items.indexOf("key"), 1);
    turnStep = "move";
    UIState = "above";
    document.getElementById("key-door").style.display = "none";
    unlockedDoors.push(targetLockedDoor);
    targetLockedDoor = null;
    UpdateItemUI();
    SetMoveUI();
};
document.getElementById("key-door-no-button").onclick = (e) => {
    turnStep = "move";
    UIState = "above";
    document.getElementById("key-door").style.display = "none";
    SetMoveUI();
};
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
        let data = moveHistory.pop();
        spacesMoved--;
        PlayerData.position = data.position;
        PlayerData.stars = data.stars;
        PlayerData.coins = data.coins;
        PlayerData.items = data.items;
        if (PlayerData.collectedSilverStars > data.collectedSilverStars) UncollectLatestSilverStar();
        unlockedDoors = data.unlockedDoors;
        PlayerData.canDuel = data.canDuel;
        PlayerData.canSteal = data.canSteal;
        PlayerData.isStealing = data.isStealing;
        UpdatePlayerUI();
        UpdateItemUI();
        SetMoveUI();
    }
}
document.getElementsByClassName("up-move-button")[0].onclick = (e) => { TestMoveSpace(0, -1); }
document.getElementsByClassName("down-move-button")[0].onclick = (e) => { TestMoveSpace(0, 1); }
document.getElementsByClassName("left-move-button")[0].onclick = (e) => { TestMoveSpace(-1, 0); }
document.getElementsByClassName("right-move-button")[0].onclick = (e) => { TestMoveSpace(1, 0); }

function ItemBackButton(e){
    if (turnStep == "item"){
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        document.getElementsByClassName("item-menu")[0].style.display = "none";
    }
    else if (turnStep == "popup"){
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "initial";
    }
}
document.getElementsByClassName("item-back-button")[0].onclick = ItemBackButton;
document.getElementsByClassName("item-back-button")[1].onclick = ItemBackButton;


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
        itemElems[i].disabled = !(PlayerData.items.length > i) || !ItemData[PlayerData.items[i]].usable;
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
            let item = PlayerData.items[index];
            PlayerData.items.splice(index, 1);
            let loc;
            document.getElementsByClassName("used-item")[0].setAttribute("src", ItemData[item].url);
            switch (item){
                case "doubledice":
                    rollsRemaining = 2;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    document.getElementById("roll-button-item-preview").style.display = "initial";
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, items: PlayerData.items }));
                    break;
                case "tripledice":
                    rollsRemaining = 3;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    document.getElementById("roll-button-item-preview").style.display = "initial";
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, items: PlayerData.items }));
                    break;
                case "pipe":
                    loc = RandomMapSpace();
                    TriggerPipeWarpAnimation(loc, false);
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, position: loc, items: PlayerData.items }));
                    break;
                case "goldpipe":
                    TriggerGoldPipeWarpAnimation();
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, position: StarWarpLocation, items: PlayerData.items }));
                    break;
                case "tacticooler":
                    addToRoll = 3;
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    document.getElementById("roll-button-item-preview").style.display = "initial";
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, items: PlayerData.items }));
                    break;
                case "customdice":
                    customDiceRoll = 5;
                    UpdateCustomDiceFace();
                    turnStep = "menu";
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    document.getElementById("roll-button-item-preview").style.display = "initial";
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, items: PlayerData.items }));
                    break;
                case "shophopbox":
                    loc = ShopWarpTiles[Math.floor(Math.random() * ShopWarpTiles.length)];
                    TriggerPipeWarpAnimation(loc, false);
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, position: loc, items: PlayerData.items }));
                    break;
                default:
                    console.error("Cannot Recognize item: " + item);
                    break;
            }
            document.getElementsByClassName("item-menu")[0].style.display = "none";
            document.getElementById("items-button").disabled = true;
            UpdateItemUI();
        }
    }
    else if (turnStep == "popup"){
        //Disposed of an item to buy an item from the shop
        PlayerData.items.splice(index, 1);
        PlayerData.coins -= ItemData[shopItemBuffer].price;
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        UpdatePlayerUI();
        TriggerGiveItemAnimation(shopItemBuffer, true);
    }
}
function ServerUseItem(item){
    console.log(PlayerData.roll);
    if (PlayerData.roll > 0 || item == null) return;
    console.log("1");
    document.getElementById("items-button").disabled = true;
    document.getElementsByClassName("used-item")[0].setAttribute("src", ItemData[item].url);
    switch (item){
        case "doubledice":
            rollsRemaining = 2;
            console.log("use");
            document.getElementById("roll-button-item-preview").style.display = "initial";
            break;
        case "tripledice":
            rollsRemaining = 3;
            document.getElementById("roll-button-item-preview").style.display = "initial";
            break;
        case "pipe":
            break;
        case "goldpipe":
            break;
        case "tacticooler":
            addToRoll = 3;
            document.getElementById("roll-button-item-preview").style.display = "initial";
            break;
        case "customdice":
            customDiceRoll = 5;
            UpdateCustomDiceFace();
            document.getElementById("roll-button-item-preview").style.display = "initial";
            break;
        case "shophopbox":
            break;
        default:
            console.error("Cannot Recognize item: " + item);
            break;
    }
}

document.getElementsByClassName("item-toss-option")[0].onclick = (e) => { ReplaceItem(0) };
document.getElementsByClassName("item-toss-option")[1].onclick = (e) => { ReplaceItem(1) };
document.getElementsByClassName("item-toss-option")[2].onclick = (e) => { ReplaceItem(2) };
document.getElementsByClassName("item-toss-option")[3].onclick = (e) => { ReplaceItem(3) };
function ReplaceItem(index){
    //I think this function is only used for Lucky Spaces (Might be wrong)
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
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "popup") && !mapData[PlayerData.position.y][PlayerData.position.x].walkOver){
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
        document.getElementsByClassName("shop-description")[1].innerHTML = "<b>" + ItemData[shopItem].name + ":</b> " + ItemData[shopItem].description;
        document.getElementsByClassName("shop-description")[2].innerHTML = "<b>" + ItemData[shopItem].name + ":</b> " + ItemData[shopItem].description;
    }
    shopItems[i].onmouseout = (e) => {
        document.getElementsByClassName("shop-description")[0].innerHTML = "Hover over an item to learn about it";
        document.getElementsByClassName("shop-description")[1].innerHTML = "Hover over an item to learn about it";
        document.getElementsByClassName("shop-description")[2].innerHTML = "Hover over an item to learn about it";
    }
    shopItems[i].onclick = (e) => {
        PurchaseItem(shopItem);
    }
}

function LeaveShop(){
    ClosePopup();
}
var shopLeaveButtons = document.getElementsByClassName("shop-leave-button");
for (var i = 0; i < shopLeaveButtons.length; i++){
    shopLeaveButtons[i].onclick = LeaveShop;
}

function EndTurn(){
    document.getElementById("roll-button-item-preview").style.display = "none";
    if (PlayerSilverStarObjs.length >= 5){
        TriggerSilverStarsToStarAnimation();
    }
    else if (PlayerData.roll == spacesMoved){
        if (turnStep == "popup") document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        UIState = "menu";
        turnStep = "wait";
        PlayerData.turnsCompleted = ServerTurn;
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        UIPanels.waitMinigame.style.display = "initial";
        document.getElementById("wait-minigame-map").style.display = "initial";
        saveCookies();
        resetDoorUnlocks();
        endTurnTimeout(0, JSON.stringify({ method: "end_turn", token: TOKEN, position: PlayerData.position, stars: PlayerData.stars, coins: PlayerData.coins, items: PlayerData.items, collectedSilverStars: PlayerData.collectedSilverStars, duel: duelBet, canDuel: PlayerData.canDuel, canSteal: PlayerData.canSteal, isStealing: PlayerData.isStealing }));
        //Socket.send(JSON.stringify({ method: "end_turn", token: TOKEN, position: PlayerData.position, stars: PlayerData.stars, coins: PlayerData.coins, items: PlayerData.items, collectedSilverStars: PlayerData.collectedSilverStars, duel: duelBet, canDuel: PlayerData.canDuel }));
    }
}

function OpenPopup(){
    document.getElementsByClassName("board-inputs")[0].style.display = "none";
    document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "initial";
    document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
    turnStep = "popup";
    UIState = "player";
    document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
    document.getElementsByClassName("move-undo-button")[0].style.display = "none";

    if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "star-1"){
        document.getElementsByClassName("purchase-star-button")[0].textContent = PlayerData.coins >= 20 ? "Yes" : "Not enough coins";
        document.getElementsByClassName("purchase-star-button")[0].disabled = PlayerData.coins < 20;
    }
    else if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "star-1"){
        document.getElementsByClassName("purchase-1-star-button")[0].disabled = PlayerData.coins < 20;
        document.getElementsByClassName("purchase-2-star-button")[0].disabled = PlayerData.coins < 40;
    }
    else if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "shop-1" || mapData[PlayerData.position.y][PlayerData.position.x].popup == "shop-2" || mapData[PlayerData.position.y][PlayerData.position.x].popup == "shop-3"){
        //Enable/Disable Buttons
        for (var i = 0; i < shopItems.length; i++){
            shopItems[i].disabled = ItemData[shopItems[i].getAttribute("item")].price > PlayerData.coins;
        }
    }
    else if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "duel"){
        duelButtons[0].disabled = PlayerData.coins < 10;
        duelButtons[1].disabled = PlayerData.coins <= 0;
        duelButtons[2].disabled = PlayerData.stars < 1;

        document.getElementById("canduel").style.display = PlayerData.canDuel ? "inline-block" : "none";
        document.getElementById("cantduel").style.display = PlayerData.canDuel ? "none" : "inline-block";
    }
    else if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "star-steal"){
        document.getElementById("star-steal-steal-button").disabled = PlayerData.coins < 30;

        document.getElementById("cansteal").style.display = PlayerData.canSteal ? "inline-block" : "none";
        document.getElementById("cantsteal").style.display = PlayerData.canSteal ? "none" : "inline-block";
    }
}
function ClosePopup(){
    document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
    if (mapData[PlayerData.position.y][PlayerData.position.x].walkOver){
        turnStep = "move";
        UIState = "above";
        document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
        document.getElementsByClassName("board-inputs")[0].style.display = "initial";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = spacesMoved == PlayerData.roll ? "initial" : "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "initial";
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
                luckyOptions[i * 2].textContent = ItemData[luckyRouletteItems[i]].name;
            }
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
            document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
            //EndTurn();
            //UpdateItemUI();
            UpdatePlayerUI();
            TriggerGiveItemAnimation(item, true);
        }
    }
}

function PurchaseStar(){
    if (turnStep == "popup" && PlayerData.coins >= 20){
        PlayerData.coins -= 20;
        PlayerData.stars++;
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerStarGetAnimation(true, 1);
        PlayerData.canDuel = true;
        PlayerData.canSteal = true;
    }
}
function Purchase2Stars(){
    if (turnStep == "popup" && PlayerData.coins >= 40){
        PlayerData.coins -= 40;
        PlayerData.stars += 2;
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerStarGetAnimation(true, 2);
        PlayerData.canDuel = true;
    }
}

document.getElementsByClassName("purchase-star-button")[0].onclick = PurchaseStar;
document.getElementsByClassName("purchase-1-star-button")[0].onclick = PurchaseStar;
document.getElementsByClassName("purchase-2-star-button")[0].onclick = Purchase2Stars;


var animTimer = 0;
var starGetAnimWarp = false;
var starGetAnimCount = 0;
var starGetAnimStarObjs = [];
function TriggerStarGetAnimation(warp, amount){
    starGetAnimWarp = warp;
    starGetAnimCount = amount;

    UIState = "player";
    turnStep = "star-get-anim";
    animTimer = warp ? 4 : 5;

    StarRingParticle.scale.set(0, 0, 0);
    StarRingParticle.position.set(Player.position.x, Player.position.y, Player.position.z + 0.05);

    for (var i = 0; i < starGetAnimCount; i++){
        starGetAnimStarObjs.push(Star.clone(true));
        Scene.add(starGetAnimStarObjs[i]);
    }
}

function StarGetAnimation(){
    animTimer -= DeltaTime;
    let targetPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    function HorizontalStarOffset(index){
        return lerp(-0.3, 0.3, starGetAnimCount == 1 ? 0.5 : (index / (starGetAnimCount - 1)));
    }

    if (animTimer > 4){
        //Wait if warp is false
        StarRingParticle.scale.set(0, 0, 0);
        StarRingParticle.position.set(Player.position.x, Player.position.y, Player.position.z + 0.05);
    }
    else if (animTimer > 3){
        let t = 1 - ((animTimer - 3) / 1);
        //Star.position.set(targetPlayerPos.x, targetPlayerPos.y + 0.575, targetPlayerPos.z);
        //Star.scale.set(lerp(0, 0.0015, t), lerp(0, 0.0015, t), lerp(0, 0.0015, t));
        //Star.rotation.set(0, lerp(Math.PI * 4, 0, t), 0);
        for (var i = 0; i < starGetAnimCount; i++){
            starGetAnimStarObjs[i].position.set(targetPlayerPos.x + HorizontalStarOffset(i), targetPlayerPos.y + 0.575, targetPlayerPos.z);
            starGetAnimStarObjs[i].scale.set(lerp(0, 0.0015, t), lerp(0, 0.0015, t), lerp(0, 0.0015, t));
            starGetAnimStarObjs[i].rotation.set(0, lerp(Math.PI * 4, 0, t), 0);
        }
    }
    else if (animTimer > 2){
        //Star.position.set(targetPlayerPos.x, targetPlayerPos.y + 0.575, targetPlayerPos.z);
        //Star.scale.set(0.0015, 0.0015, 0.0015);
        //Star.rotation.set(0, 0, 0);
        for (var i = 0; i < starGetAnimCount; i++){
            starGetAnimStarObjs[i].position.set(targetPlayerPos.x + HorizontalStarOffset(i), targetPlayerPos.y + 0.575, targetPlayerPos.z);
            starGetAnimStarObjs[i].scale.set(0.0015, 0.0015, 0.0015);
            starGetAnimStarObjs[i].rotation.set(0, 0, 0);
        }
    }
    else if (animTimer > 1.5){
        let t = 1 - ((animTimer - 1.5) / 0.5);
        //Star.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.575, 0.2, t), targetPlayerPos.z + lerp(0, 0.05, t));
        //Star.scale.set(lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t));
        //Star.rotation.set(0, 0, 0);
        for (var i = 0; i < starGetAnimCount; i++){
            starGetAnimStarObjs[i].position.set(targetPlayerPos.x + (HorizontalStarOffset(i) * lerp(1, 0.333, t)), targetPlayerPos.y + lerp(0.575, 0.2, t), targetPlayerPos.z + lerp(0, 0.05, t));
            starGetAnimStarObjs[i].scale.set(lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t));
            starGetAnimStarObjs[i].rotation.set(0, 0, 0);
        }
    }
    else if (animTimer > 1.25){
        let t = 1 - ((animTimer - 1.25) / 0.25);
        //Star.position.set(targetPlayerPos.x, targetPlayerPos.y + lerp(0.2, 0, t), targetPlayerPos.z + 0.05);
        //Star.scale.set(lerp(0.0005, 0, t), lerp(0.0005, 0, t), lerp(0.0005, 0, t));
        for (var i = 0; i < starGetAnimCount; i++){
            starGetAnimStarObjs[i].position.set(targetPlayerPos.x + (HorizontalStarOffset(i) * lerp(0.333, 0, t)), targetPlayerPos.y + lerp(0.2, 0, t), targetPlayerPos.z + 0.05);
            starGetAnimStarObjs[i].scale.set(lerp(0.0005, 0, t), lerp(0.0005, 0, t), lerp(0.0005, 0, t));
        }
    }
    else if (animTimer > 1){
        let t = 1 - ((animTimer - 1) / 0.25);
        //Star.scale.set(0, 0, 0);
        StarRingParticle.scale.set(lerp(0, 0.35, t), lerp(0, 0.35, t), lerp(0, 0.35, t));
        StarRingParticle.material.opacity = lerp(0, 1, t);
        for (var i = 0; i < starGetAnimCount; i++){
            starGetAnimStarObjs[i].scale.set(0, 0, 0);
        }
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
        for (var i = 0; i < starGetAnimCount; i++){
            Scene.remove(starGetAnimStarObjs[i]);
            starGetAnimStarObjs[i].children[0].geometry.dispose();
            starGetAnimStarObjs[i].children[0].material.dispose();
            starGetAnimStarObjs[i].children[1].geometry.dispose();
            starGetAnimStarObjs[i].children[1].material.dispose();
        }

        if (starGetAnimWarp) TriggerPipeWarpAnimation(StartingTile, true);
        else{
            UIState = "player";
            turnStep = "menu";
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        }
    }
}

let starLoseAnimPopup = false;
function TriggerStarLoseAnimation(){
    starLoseAnimPopup = turnStep == "popup";

    UIState = "player";
    turnStep = "star-lose-anim";
    animTimer = 3;

    StarRingParticle.scale.set(0, 0, 0);
    StarRingParticle.position.set(Player.position.x, Player.position.y, Player.position.z + 0.05);

    UpdatePlayerUI();
}
function StarLoseAnimation(){
    const animLength = 3;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 0.75){
        let t = 1 - ((animTimer - animLength + 0.75) / 0.75);
        let eo = easeOut(t);
        let ei = easeIn(t);

        Star.position.set(targetPos.x, targetPos.y, targetPos.z + 0.1);
        Star.scale.set(lerp(0, 0.001, eo), lerp(0, 0.001, eo), lerp(0, 0.001, eo));
        StarRingParticle.scale.set(lerp(0, 0.65, t), lerp(0, 0.65, t), lerp(0, 0.65, t));
        StarRingParticle.material.opacity = t;
    }
    else if (animTimer > animLength - 1.25){
        let t = 1 - ((animTimer - animLength + 1.25) / 0.5);
        let eo = easeOut(t);
        
        StarRingParticle.scale.set(lerp(0.65, 1, t), lerp(0.65, 1, t), lerp(0.65, 1, t));
        StarRingParticle.material.opacity = lerp(1, 0, eo);
    }
    else if (animTimer > animLength - 1.75){
        StarRingParticle.material.opacity = 0;
        StarRingParticle.scale.set(0, 0, 0);
    }
    else if (animTimer > animLength - 2.5){
        let t = 1 - ((animTimer - animLength + 2.5) / 0.75);
        let ei = easeIn(t);

        Star.position.set(targetPos.x, targetPos.y + lerp(0, 2, ei), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 3){
        Star.position.set(0, 0, 0);
        Star.scale.set(0, 0, 0);
    }
    else{
        UpdatePlayerUI();
        if (starLoseAnimPopup){
            UIState = "above";
            turnStep = "popup";
            ClosePopup();
        }
        else{
            UIState = "player";
            turnStep = "menu";

            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
            document.getElementsByClassName("player-data")[0].style.display = "initial";
            document.getElementById("turn-counter").style.display = "initial";
            document.getElementById("leaderboard").style.display = "initial";
        }
    }
}

function RandomMapSpace(){
    var result;
    while(true){
        result = { x: Math.floor(Math.random() * mapSize.x), y: Math.floor(Math.random() * mapSize.y) };
        if (mapData[result.y][result.x].height !== 0){
            for (let i = 0; i < ServerSilverStars.length; i++){
                if (ServerSilverStars[i].x == result.x && ServerSilverStars[i].y == result.y){
                    continue;
                }
            }
            return result;
        }
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
        SetBlockTranparencyFromCamera();
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
        SetBlockTranparency();
        PlayerData.position = { x: pipeWarpLocation.x, y: pipeWarpLocation.y };

        transitionValues.cameraPos = Camera.position;
        transitionValues.cameraRot = Camera.rotation;
        transitionValues.playerPos = Player.position;
        transitionValues.playerRot = Player.rotation;
        
        if (turnStep == "pipe-warp-anim-end-turn"){
            SetMoveUI();
            turnStep = "move";
            UIState = "above";
            document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
            document.getElementsByClassName("board-inputs")[0].style.display = "initial";
            document.getElementsByClassName("move-end-turn-button")[0].style.display = (spacesMoved == PlayerData.roll && spacesMoved != 0) ? "initial" : "none";
            document.getElementsByClassName("move-undo-button")[0].style.display = spacesMoved == 0 ? "none" : "initial";
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
    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, position: StarWarpLocation, items: PlayerData.items }));
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
        
        transitionValues.cameraPos = Camera.position;
        transitionValues.cameraRot = Camera.rotation;
        transitionValues.playerPos = Player.position;
        transitionValues.playerRot = Player.rotation;

        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
    }
}

var giveItemAnimItem;
var giveItemAnimIsShop;
function TriggerGiveItemAnimation(item, isShop){
    UIState = "override";
    turnStep = "give-item-anim";
    animTimer = 3;
    giveItemAnimItem = item;
    giveItemAnimIsShop = isShop;

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
    UpdatePlayerUI();
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

        if (giveItemAnimIsShop){
            UIState = "player";
            PlayerData.items.push(giveItemAnimItem);
            UpdateItemUI();
            ClosePopup();
        }
        else{
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
}

var giveCoinsAnimAmount;
var coinsTextWidth;
var coinsAnimFirstTrigger = true;
var coinsAnimTurnStepBuffer;
function TriggerCoinChangeAnimation(amount){
    if (PlayerData.coins + amount < 0) amount = -PlayerData.coins;

    coinsAnimTurnStepBuffer = turnStep;
    UIState = "player";
    turnStep = "coin-change-anim";
    animTimer = amount < 0 ? 3 : 4;
    giveCoinsAnimAmount = amount;
    coinsAnimFirstTrigger = true;

    coinsTextWidth = SetCoinText(amount);

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    CoinText.scale.set(0, 0, 0);
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
        CoinText.scale.set(0.85, 0.85, 0.85);
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

        if (coinsAnimTurnStepBuffer == "roll") rollBonus = false;
        else if (coinsAnimTurnStepBuffer == "popup") EndTurn();
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
        if (coinsAnimTurnStepBuffer == "popup"){
            if (mapData[PlayerData.position.y][PlayerData.position.x].popup == "duel" || mapData[PlayerData.position.y][PlayerData.position.x].popup == "star-steal"){
                UIState = "above";
                ClosePopup();
            }
            else EndTurn();
        } 
        else if (coinsAnimTurnStepBuffer == "menu"){
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        }
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

var silverStarsAnimBuffer = [];
function TriggerSilverStarsToStarAnimation(){
    UIState = "player";
    turnStep = "silver-stars-to-star-anim-intro";
    animTimer = 8.5;

    silverStarsAnimBuffer = [];
    for (var i = 0; i < 5; i++){
        silverStarsAnimBuffer.push({ position: PlayerSilverStarObjs[i].position, rotation: PlayerSilverStarObjs[i].rotation });
    }

    StarRingParticle.scale.set(0, 0, 0);
    StarRingParticle.position.set(Player.position.x, Player.position.y, Player.position.z + 0.05);

    document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
    document.getElementsByClassName("move-undo-button")[0].style.display = "none";

    PlayerData.stars++;

    firstSilverStarTrigger = true;
}
var firstSilverStarTrigger = true;
function SilverStarsToStarAnimation(){
    const animLength = 8.5;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 1){
        //Wait
    }
    else if (animTimer > animLength - 2){
        turnStep = "silver-stars-to-star-anim";
        let t = 1 - ((animTimer - animLength + 2) / 1);
        let ei = easeIn(t);

        for (let i = 0; i < PlayerSilverStarObjs.length; i++){
            if (i < 5){
                let angle = (Math.PI * 2 / 5 * i) + (t * Math.PI);
                let starPos = new THREE.Vector3(Math.cos(angle) * 0.5 + targetPos.x, targetPos.y + 0.45, Math.sin(angle) * 0.5 + targetPos.z);
                PlayerSilverStarObjs[i].position.set(lerp(silverStarsAnimBuffer[i].position.x, starPos.x, ei), lerp(silverStarsAnimBuffer[i].position.y, starPos.y, ei), lerp(silverStarsAnimBuffer[i].position.z, starPos.z, ei));
                PlayerSilverStarObjs[i].rotation.set(lerp(silverStarsAnimBuffer[i].rotation.x, 0, ei), lerp(silverStarsAnimBuffer[i].rotation.y, -angle, ei), lerp(silverStarsAnimBuffer[i].rotation.z, 0, ei), "YXZ");
            }
            else{
                PlayerSilverStarObjs[i].scale.set(0, 0, 0);
            }
        }
    }
    else if (animTimer > animLength - 4){
        let t = 1 - ((animTimer - animLength + 4) / 2);
        let ei = easeIn(t);
        let b = lerp(t, ei, 0.75);

        for (let i = 0; i < PlayerSilverStarObjs.length; i++){
            if (i < 5){
                let angle = (Math.PI * 2 / 5 * i) + (b * Math.PI * 8 + Math.PI);
                let starPos = new THREE.Vector3(Math.cos(angle) * 0.5 * (1 - t) + targetPos.x, targetPos.y + lerp(0.45, 0.575, ei), Math.sin(angle) * 0.5 * (1 - t) + targetPos.z);
                PlayerSilverStarObjs[i].position.set(starPos.x, starPos.y, starPos.z);
                PlayerSilverStarObjs[i].rotation.set(0, -angle, 0, "YXZ");
                PlayerSilverStarObjs[i].children[1].material.emissiveIntensity = lerp(0.25, 1, t);
                PlayerSilverStarObjs[i].scale.set(lerp(0.00075, 0.001, ei), lerp(0.00075, 0.001, ei), lerp(0.00075, 0.001, ei));
            }
        }
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 5) / 1);
        let ei = easeIn(t);
        let eo = easeOut(t);

        for (let i = 0; i < PlayerSilverStarObjs.length; i++){
            if (i < 5){
                PlayerSilverStarObjs[i].scale.set(0, 0, 0);
            }
        }

        let angle = (eo * Math.PI * 4);
        Star.scale.set(lerp(0.001, 0.0015, t), lerp(0.001, 0.0015, t), lerp(0.001, 0.0015, t));
        Star.position.set(targetPos.x, targetPos.y + 0.575, targetPos.z);
        Star.rotation.set(0, angle, 0, "YXZ");
        Star.children[1].material.emissive.set(new THREE.Color(1, lerp(1, 0.715, ei), lerp(1, 0.171, ei)));
        Star.children[1].material.emissiveIntensity = lerp(1, 0.5, ei);
    }
    else if (animTimer > animLength - 6){
        Star.scale.set(0.0015, 0.0015, 0.0015);
        Star.position.set(targetPos.x, targetPos.y + 0.575, targetPos.z);
        Star.rotation.set(0, 0, 0, "YXZ");
        Star.children[1].material.emissive.set(new THREE.Color(1, 0.715, 0.171));
        Star.children[1].material.emissiveIntensity = 0.5;
    }
    else if (animTimer > animLength - 6.5){
        let t = 1 - ((animTimer - animLength + 6.5) / 0.5);
        Star.position.set(targetPos.x, targetPos.y + lerp(0.575, 0.2, t), targetPos.z + lerp(0, 0.05, t));
        Star.scale.set(lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t), lerp(0.0015, 0.0005, t));
        Star.rotation.set(0, 0, 0);
    }
    else if (animTimer > animLength - 6.75){
        let t = 1 - ((animTimer - animLength + 6.75) / 0.25);
        Star.position.set(targetPos.x, targetPos.y + lerp(0.2, 0, t), targetPos.z + 0.05);
        Star.scale.set(lerp(0.0005, 0, t), lerp(0.0005, 0, t), lerp(0.0005, 0, t));
    }
    else if (animTimer > animLength - 7){
        if (firstSilverStarTrigger){
            UpdatePlayerUI();
            firstSilverStarTrigger = false;
        }

        let t = 1 - ((animTimer - animLength + 7) / 0.25);
        Star.scale.set(0, 0, 0);
        StarRingParticle.scale.set(lerp(0, 0.35, t), lerp(0, 0.35, t), lerp(0, 0.35, t));
        StarRingParticle.material.opacity = lerp(0, 1, t);
        UpdatePlayerUI();
    }
    else if (animTimer > animLength - 7.5){
        let t = 1 - ((animTimer - animLength + 7.5) / 0.5);
        StarRingParticle.scale.set(lerp(0.35, 1, t), lerp(0.35, 1, t), lerp(0.35, 1, t));
        StarRingParticle.material.opacity = lerp(1, 0, t);
    }
    else if (animTimer > animLength - 8.5){
        StarRingParticle.scale.set(0, 0, 0);
    }
    else{
        for (let i = 0; i < 5; i++){
            Scene.remove(PlayerSilverStarObjs[i]);
            PlayerSilverStarObjs[i].material.dispose();
            PlayerSilverStarObjs[i].geometry.dispose();
        }
        PlayerSilverStarObjs.splice(0, 5);

        EndTurn();
    }
}

function UpdatePlayerUI(){
    document.getElementsByClassName("player-stars")[0].textContent = PlayerData.stars;
    document.getElementsByClassName("player-coins")[0].textContent = PlayerData.coins;
    document.getElementsByClassName("player-name")[0].textContent = COOKIES["ign"].split("#")[0];
}

var mapTriggeredFrom = "null";
function OpenMap(){
    Scene.add(MapLocks);
    mapTriggeredFrom = turnStep;
    Scene.add(mapSelectorBox);
    if (turnStep == "menu"){
        UIState = "map";
        turnStep = "map";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementById("leaderboard").style.display = "none";
        document.getElementById("turn-counter").style.display = "none";
        document.getElementsByClassName("map-overlay")[0].style.display = "initial";
    }
    else if (turnStep == "move"){
        UIState = "map";
        turnStep = "map";
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
        document.getElementById("leaderboard").style.display = "none";
        document.getElementById("turn-counter").style.display = "none";
        document.getElementsByClassName("map-overlay")[0].style.display = "initial";
    }
    else if (turnStep == "wait"){
        UIState = "map";
        turnStep = "map";
        document.getElementById("leaderboard").style.display = "none";
        document.getElementById("turn-counter").style.display = "none";
        document.getElementsByClassName("map-overlay")[0].style.display = "initial";
        document.getElementById("wait-minigame-map").style.display = "none";
        UIPanels.waitMinigame.style.display = "none";
    }
    else if (turnStep == "minigame"){
        UIState = "map";
        turnStep = "map";
        document.getElementsByClassName("map-overlay")[0].style.display = "initial";
        document.getElementById("wait-minigame-map").style.display = "none";
        UIPanels.minigame.style.display = "none";
    }
}
document.getElementById("map-button").onclick = OpenMap;
document.getElementsByClassName("board-map-button")[0].onclick = OpenMap;
document.getElementsByClassName("board-map-button")[1].onclick = OpenMap;

function CloseMap(){
    Scene.remove(MapLocks);
    Scene.remove(mapSelectorBox);
    if (turnStep == "map"){
        document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
        document.getElementsByClassName("help-button")[0].style.display = "initial";

        if (mapTriggeredFrom == "menu"){
            UIState = "player";
            turnStep = "menu";
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
            document.getElementById("leaderboard").style.display = "initial";
            document.getElementById("turn-counter").style.display = "initial";
            document.getElementsByClassName("map-overlay")[0].style.display = "none";
        }
        else if (mapTriggeredFrom == "move"){
            UIState = "above";
            turnStep = "move";
            document.getElementsByClassName("board-inputs")[0].style.display = "initial";
            document.getElementsByClassName("move-undo-button")[0].style.display = spacesMoved > 0 ? "initial" : "none";
            document.getElementsByClassName("move-end-turn-button")[0].style.display = spacesMoved == PlayerData.roll ? "initial" : "none";
            document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
            document.getElementById("leaderboard").style.display = "initial";
            document.getElementById("turn-counter").style.display = "initial";
            document.getElementsByClassName("map-overlay")[0].style.display = "none";
        }
        else if (mapTriggeredFrom == "wait"){
            UIState = "menu";
            turnStep = "wait";
            document.getElementById("leaderboard").style.display = "initial";
            document.getElementById("turn-counter").style.display = "initial";
            document.getElementsByClassName("map-overlay")[0].style.display = "none";
            document.getElementById("wait-minigame-map").style.display = "initial";
            UIPanels.waitMinigame.style.display = "initial";
        }
        else if (mapTriggeredFrom == "minigame"){
            UIState = "menu";
            turnStep = "minigame";
            document.getElementById("turn-counter").style.display = "initial";
            document.getElementsByClassName("map-overlay")[0].style.display = "none";
            document.getElementById("wait-minigame-map").style.display = "initial";
            UIPanels.minigame.style.display = "initial";
        }
    }
}
document.getElementsByClassName("map-back-button")[0].onclick = CloseMap;

var minigameNavButtons = document.getElementsByClassName("new-minigame-navigator-button");
minigameNavButtons[0].onclick = function(e){
    minigameNavButtons[0].classList.add("new-minigame-navigator-selected");
    minigameNavButtons[1].classList.remove("new-minigame-navigator-selected");

    document.getElementById("new-minigame-result-window").style.display = "initial";
    document.getElementById("new-minigame-chat-window").style.display = "none";
};
minigameNavButtons[1].onclick = function(e){
    minigameNavButtons[1].classList.add("new-minigame-navigator-selected");
    minigameNavButtons[0].classList.remove("new-minigame-navigator-selected");

    document.getElementById("new-minigame-result-window").style.display = "none";
    document.getElementById("new-minigame-chat-window").style.display = "initial";
};


document.getElementById("new-minigame-submit-button").onclick = function(e){
    var result = [];

    let setApartSkips = 0;
    for (var i = 0; i < CurrentMinigameLobby.length; i++){
        if (MinigameData[CurrentMinigame].teams == 0){
            //No Teams
            result.push(Number.parseInt(document.getElementsByClassName("new-minigame-player-result-" + MinigameData[CurrentMinigame].type)[i].value));
        }
        else if (!Object.hasOwn(MinigameData[CurrentMinigame], "setApartPlayers") || MinigameData[CurrentMinigame].setApartPlayers % MinigameData[CurrentMinigame].teams == 0){
            //Throwers are split between teams
            if (CurrentMinigameSetApartPlayers.includes(i)){
                result.push(Number.parseInt(document.getElementsByClassName("new-minigame-player-result-" + MinigameData[CurrentMinigame].type)[CurrentMinigameSetApartPlayers.indexOf(i) % MinigameData[CurrentMinigame].teams].value));
                setApartSkips++;
            }
            else{
                result.push(Number.parseInt(document.getElementsByClassName("new-minigame-player-result-" + MinigameData[CurrentMinigame].type)[(i - setApartSkips) % MinigameData[CurrentMinigame].teams].value));
            }
        }
        else {
            //Throwers are their own team
            if (CurrentMinigameSetApartPlayers.includes(i)){
                result.push(Number.parseInt(document.getElementsByClassName("new-minigame-player-result-" + MinigameData[CurrentMinigame].type)[0].value));
                setApartSkips++;
            }
            else{
                result.push(Number.parseInt(document.getElementsByClassName("new-minigame-player-result-" + MinigameData[CurrentMinigame].type)[(i - setApartSkips) % (MinigameData[CurrentMinigame].teams - 1) + 1].value));
            }
        }

        if (Object.hasOwn(MinigameData[CurrentMinigame], "setApartPlayers") && MinigameData[CurrentMinigame].type == "coop" && MinigameData[CurrentMinigame].invertSetApartScore && CurrentMinigameSetApartPlayers.includes(i)){
            //Invert Set Apart Score if it's a coop minigame
            result[result.length - 1] = result[result.length - 1] == 0 ? 1 : 0;
        }
    }

    Socket.send(JSON.stringify({ method: "submit_results", token: TOKEN, result: result }));
    console.log(result);

    minigameSubmitButton.disabled = true;
    minigameSubmitButton.textContent = "Submitted";
};

var helpWindow = document.getElementsByClassName("help-info")[0];
var helpSidebarSubjects = document.getElementsByClassName("help-sidebar-subgroup-title");
var helpSubjects = document.getElementsByClassName("help-subject");
var helpSidebarCategories = document.getElementsByClassName("help-sidebar-group-title");
for (let i = 0; i < helpSidebarSubjects.length; i++){
    helpSidebarSubjects[i].onclick = function(e){
        document.getElementsByClassName("help-sidebar-selected")[0].classList.remove("help-sidebar-selected");
        helpSidebarSubjects[i].classList.add("help-sidebar-selected");
        for (let j = 0; j < helpSubjects.length; j++){
            helpSubjects[j].style.display = i == j ? "block" : "none";
        }
        helpWindow.scrollTop = 0;
    };
}
for (let i = 0; i < helpSidebarCategories.length; i++){
    helpSidebarCategories[i].onclick = function(e){
        document.getElementsByClassName("help-sidebar-selected")[0].classList.remove("help-sidebar-selected");
        helpSidebarCategories[i].classList.add("help-sidebar-selected");
        let subgroupIndex = 0;
        for (let j = 0; j < helpSidebarCategories.length; j++){
            let subgroups = helpSidebarCategories[j].parentElement.children[1].children;
            for (let k = 0; k < subgroups.length; k++){
                helpSubjects[subgroupIndex + k].style.display = i == j ? "block" : "none";
            }
            subgroupIndex += subgroups.length;
        }
        helpWindow.scrollTop = 0;
    }
}
var helpGroupLinks = document.getElementsByClassName("help-group-link");
var helpSubgroupLinks = document.getElementsByClassName("help-subgroup-link");
for (let i = 0; i < helpGroupLinks.length; i++){
    helpGroupLinks[i].onclick = function(e){ helpSidebarCategories[Number.parseInt(helpGroupLinks[i].getAttribute("index"))].onclick(); };
}
for (let i = 0; i < helpSubgroupLinks.length; i++){
    helpSubgroupLinks[i].onclick = function(e){ helpSidebarSubjects[Number.parseInt(helpSubgroupLinks[i].getAttribute("index"))].onclick(); };
}

var helpElement = document.getElementById("help");
document.getElementsByClassName("help-button")[0].onclick = function(e){
    helpElement.style.display = helpElement.style.display == "none" ? "initial" : "none";
};
document.getElementsByClassName("help-close-button")[0].onclick = function(e){
    helpElement.style.display = "none";
};

var duelBet = false;
var duelButtons = document.getElementsByClassName("duel-button");
duelButtons[0].onclick = function(e){ 
    if (PlayerData.coins >= 10 && PlayerData.canDuel){
        duelBet = { type: "coins", amount: 10 };
        UpdatePlayerUI();
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerCoinChangeAnimation(-10);
        PlayerData.canDuel = false;
    }
};
duelButtons[1].onclick = function(e){ 
    if (PlayerData.coins > 0 && PlayerData.canDuel){
        duelBet = { type: "coins", amount: PlayerData.coins };
        UpdatePlayerUI();
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerCoinChangeAnimation(-duelBet.amount);
        PlayerData.canDuel = false;
    }
};
duelButtons[2].onclick = function(e){ 
    if (PlayerData.stars >= 1 && PlayerData.canDuel){
        duelBet = { type: "stars", amount: 1 };
        UpdatePlayerUI();
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        PlayerData.stars--;
        TriggerStarLoseAnimation();
        PlayerData.canDuel = false;
    }
};
document.getElementById("duel-leave-button").onclick = function(e){
    ClosePopup();
};
document.getElementById("cant-duel-leave-button").onclick = function(e){
    ClosePopup();
};


document.getElementById("star-steal-steal-button").onclick = function(e){
    if (PlayerData.coins >= 30 && PlayerData.canSteal){
        PlayerData.isStealing = true;
        document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        TriggerCoinChangeAnimation(-30);
        PlayerData.canSteal = false;
    }
};
document.getElementById("star-steal-leave-button").onclick = function(e){
    ClosePopup();
};
document.getElementById("cant-steal-leave-button").onclick = function(e){
    ClosePopup();
};

var tutorialIndex = 0;
const tutorialPages = document.getElementsByClassName("tutorial-text");
const tutorialNextButtons = document.getElementsByClassName("tutorial-next-button");
const tutorialCancelButton = document.getElementsByClassName("tutorial-cancel-button")[0];
const tutorialUIStates = ["player", "player", "tutorialstar", "tutorialstar", "tutorialshop", "player", "player"];
function EndTutorial(){
    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, tutorial: false }));

    document.getElementById("tutorial").style.display = "none";

    UIPanels.checkin.style.display = "none";
    UIPanels.connecting.style.display = "none";
    UIPanels.login.style.display = "none";
    document.getElementsByClassName("player-data")[0].style.display = "initial";
    document.getElementById("leaderboard").style.display = "initial";
    document.getElementById("turn-counter").style.display = "initial";
    document.getElementById("turn-counter-text").textContent = ServerTurn + "/15";
    //Check if done turn or not
    if (PlayerData.turnsCompleted < ServerTurn){
        //Play your turn
        if (PlayerData.roll == 0){
            UIState = "player";
            turnStep = "menu";
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        }
        else{
            UIState = "above";
            turnStep = "move";
            document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
            document.getElementsByClassName("board-inputs")[0].style.display = "initial";
            SetMoveUI();
        }
    }
    else{
        //Wait for Minigame
        UIState = "menu";
        turnStep = "wait";
        UIPanels.waitMinigame.style.display = "initial";
    }
}
for (let i = 0; i < tutorialNextButtons.length; i++){
    tutorialNextButtons[i].onclick = function(e){
        tutorialIndex++;

        if (tutorialIndex == tutorialPages.length){
            EndTutorial();
        }
        else if (tutorialIndex == 6){
            //Give 10 coins and dice anim
            tutorialPages[tutorialIndex].style.display = "initial";
            tutorialPages[tutorialIndex - 1].style.display = "none";
            UIState = tutorialUIStates[tutorialIndex];
            TriggerTutorialGiveAnim();
        }
        else{
            tutorialPages[tutorialIndex].style.display = "initial";
            tutorialPages[tutorialIndex - 1].style.display = "none";
            UIState = tutorialUIStates[tutorialIndex];
        }
    };
}
tutorialCancelButton.onclick = function(e){
    EndTutorial();
};
function TriggerTutorialGiveAnim(){
    animTimer = 5;
    UIState = "player";
    turnStep = "tutorial-give-anim";
    document.getElementById("tutorial").style.display = "none";

    //Spawn coins and item
    coinsTextWidth = SetCoinText(10);

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    CoinText.scale.set(0.85, 0.85, 0.85);
    Scene.add(CoinText);
    ItemRingParticle.scale.set(0, 0, 0);
    ItemRingParticle.position.set(targetPos.x, targetPos.y, targetPos.z + 0.01);
    ItemRingParticle.material.color.set(0xffffff);
    Scene.add(ItemRingParticle);

    ItemPreview.material.opacity = 1;
    ItemPreview.material.map = ItemData["doubledice"].image;
    ItemPreview.scale.set(1, 1, 1);
    Scene.add(ItemPreview);
}
function TutorialGiveAnimation(){
    const animLength = 5;
    animTimer -= DeltaTime;
    
    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 1.5){
        let t = 1 - ((animTimer - animLength + 1.5) / 1.5);
        let eo = easeOut(t);

        CoinText.position.set(targetPos.x - 0.5 - (coinsTextWidth / 2 * 0.85), targetPos.y - 0.1 + lerp(2, 0, eo), targetPos.z);
        ItemPreview.position.set(targetPos.x + 0.5, targetPos.y + lerp(2, 0, eo), targetPos.z);
    }
    else if (animTimer > animLength - 2){
        CoinText.position.set(targetPos.x - 0.5 - (coinsTextWidth / 2 * 0.85), targetPos.y - 0.1, targetPos.z);
        ItemPreview.position.set(targetPos.x + 0.5, targetPos.y, targetPos.z);
    }
    else if (animTimer > animLength - 3){
        let t = 1 - ((animTimer - animLength + 3) / 1);
        let ei = easeIn(t);

        CoinText.position.set(targetPos.x - lerp(0.5, 0, ei) - (coinsTextWidth / 2 * lerp(0.85, 0.1, ei)), targetPos.y - lerp(0.1, 0, ei), targetPos.z);
        ItemPreview.position.set(targetPos.x + lerp(0.5, 0, ei), targetPos.y, targetPos.z);
        CoinText.scale.set(lerp(0.85, 0.1, ei), lerp(0.85, 0.1, ei), lerp(0.85, 0.1, ei));
        ItemPreview.scale.set(lerp(1, 0.1, ei), lerp(1, 0.1, ei), lerp(1, 0.1, ei));
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 5) / 2);
        let eo = easeOut(t);

        CoinText.scale.set(0, 0, 0);
        ItemPreview.scale.set(0, 0, 0);
        ItemRingParticle.scale.set(lerp(0.1, 1, eo), lerp(0.1, 1, eo), lerp(0.1, 1, eo));
        ItemRingParticle.material.opacity = lerp(1, 0, eo);
    }
    else{
        Scene.remove(CoinText, ItemPreview, ItemRingParticle);
        document.getElementById("tutorial").style.display = "initial";
        turnStep = "tutorial";
        UIState = tutorialUIStates[tutorialIndex];
    }
}

const CCElements = document.getElementsByClassName("cc-display");
const CCIncreaseButtons = document.getElementsByClassName("cc-increase-button");
const CCDecreaseButtons = document.getElementsByClassName("cc-decrease-button");
var CCHatIndex = Math.floor(Math.random() * AvatarDecorations.hat.length);
CCIncreaseButtons[0].onclick = function(e){
    CCHatIndex = (CCHatIndex + 1) % AvatarDecorations.hat.length;
    CCElements[3].src = AvatarDecorations.hat[CCHatIndex].url;
    CCElements[3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 20) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 20) + "px)";
};
CCDecreaseButtons[0].onclick = function(e){
    CCHatIndex = (CCHatIndex + AvatarDecorations.hat.length - 1) % AvatarDecorations.hat.length;
    CCElements[3].src = AvatarDecorations.hat[CCHatIndex].url;
    CCElements[3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 20) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 20) + "px)";
};
var CCHairIndex = Math.floor(Math.random() * AvatarDecorations.hair.length);
CCIncreaseButtons[1].onclick = function(e){
    CCHairIndex = (CCHairIndex + 1) % AvatarDecorations.hair.length;
    CCElements[2].src = AvatarDecorations.hair[CCHairIndex];
    CCElements[3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 20) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 20) + "px)";
};
CCDecreaseButtons[1].onclick = function(e){
    CCHairIndex = (CCHairIndex + AvatarDecorations.hair.length - 1) % AvatarDecorations.hair.length;
    CCElements[2].src = AvatarDecorations.hair[CCHairIndex];
    CCElements[3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 20) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 20) + "px)";
};
var CCSkinIndex = Math.floor(Math.random() * AvatarDecorations.skin.length);
CCIncreaseButtons[2].onclick = function(e){
    CCSkinIndex = (CCSkinIndex + 1) % AvatarDecorations.skin.length;
    CCElements[0].src = AvatarDecorations.skin[CCSkinIndex];
};
CCDecreaseButtons[2].onclick = function(e){
    CCSkinIndex = (CCSkinIndex + AvatarDecorations.skin.length - 1) % AvatarDecorations.skin.length;
    CCElements[0].src = AvatarDecorations.skin[CCSkinIndex];
};
var CCShirtIndex = Math.floor(Math.random() * AvatarDecorations.shirt.length);
CCIncreaseButtons[3].onclick = function(e){
    CCShirtIndex = (CCShirtIndex + 1) % AvatarDecorations.shirt.length;
    CCElements[1].src = AvatarDecorations.shirt[CCShirtIndex];
};
CCDecreaseButtons[3].onclick = function(e){
    CCShirtIndex = (CCShirtIndex + AvatarDecorations.shirt.length - 1) % AvatarDecorations.shirt.length;
    CCElements[1].src = AvatarDecorations.shirt[CCShirtIndex];
};

CCElements[0].src = AvatarDecorations.skin[CCSkinIndex];
CCElements[1].src = AvatarDecorations.shirt[CCShirtIndex];
CCElements[2].src = AvatarDecorations.hair[CCHairIndex];
CCElements[3].src = AvatarDecorations.hat[CCHatIndex].url;
CCElements[3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 20) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 20) + "px)";

document.getElementById("cc-submit-button").onclick = function(e){
    UIPanels.characterCreator.style.display = "none";
    UIPanels.connecting.style.display = "initial";
    registerTimeout(registerDiscord, registerIGN, { hat: CCHatIndex, hair: CCHairIndex, skin: CCSkinIndex, shirt: CCShirtIndex }, 0);
    //Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, character: { hat: CCHatIndex, hair: CCHairIndex, skin: CCSkinIndex, shirt: CCShirtIndex } }));
};




//NETWORKING!!!
var Socket;
var SignedIn = false;
var socketHasConnected = false;
function InitializeSocket(){
    //Changes the Socket connection based on if it's local hosted or not
    //Also checks if the url search parameter has a unique url for the socket
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("socket")){
        Socket = new WebSocket("wss://" + searchParams.get("socket"));
    }
    else{
        Socket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:6969" : "wss://msp.astrodwarf.space/server");
    }

    Socket.onopen = function(e){
        console.log("Socket open");
        startPingLoop();
        socketHasConnected = true;
        if (TOKEN != ""){
            signInTimeout(0);
        }
        else{
            getStatusTimeout(0);
        }
    }

    Socket.onclose = function(e){
        endPingLoop();

        if (ServerStatus == "RESULTS") return;

        turnStep = "dc";
        UIState = "menu";
        for (const [key, value] of Object.entries(UIPanels)){
            value.style.display = "none";
        }
        UIPanels.disconnected.style.display = "initial";

        document.getElementById("tutorial").style.display = "none";
        document.getElementById("key-door").style.display = "none";
        document.getElementById("shop-1").style.display = "none";
        document.getElementById("shop-2").style.display = "none";
        document.getElementById("shop-3").style.display = "none";
        document.getElementById("star-1").style.display = "none";
        document.getElementById("star-2").style.display = "none";
        document.getElementById("duel").style.display = "none";
        document.getElementById("lucky-space").style.display = "none";
        document.getElementById("results").style.display = "none";
        document.getElementById("global-leaderboard").style.display = "none";

        document.getElementsByClassName("game-ui")[0].style.display = "none";

        if (!socketHasConnected){
            document.getElementById("disconnect-reason").textContent = "Can't Connect to Server";
            document.getElementById("disconnect-reason-1").style.display = "none";
            document.getElementById("disconnect-reason-2").style.display = "initial";
        }
        else{
            document.getElementById("disconnect-reason").textContent = "Disconnected";
            document.getElementById("disconnect-reason-1").style.display = "initial";
            document.getElementById("disconnect-reason-2").style.display = "none";
        }
    }

    Socket.onmessage = function(e){
        if (e.data == "pong" || e.data == "ping") return;

        try{
            var data = JSON.parse(e.data);
        }
        catch {return;}

        console.log(data);

        switch (data.method){
            case "update_player_data":
                update_player_data_server(data);
                break;
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
            case "set_player_data":
                set_player_data_server(data);
                break;
            case "send_message":
                send_message_server(data);
                break;
        }
    }
}

var pingLoop;
function startPingLoop(){
    pingLoop = setInterval(() => {
        if (ServerStatus == "REGISTRATION" || ServerStatus == "CHECK_IN"){
            Socket.send("ping");
        }
        else{
            endPingLoop();
        }
    }, 60000);
}
function endPingLoop(){
    if (pingLoop != null) clearInterval(pingLoop);
}

function set_player_data_server(data){
    if (!data.success){
        //Mod Flag was triggered
        confirmMod(data);
    }
}

function confirmMod(data){
    PlayerData = {
        position: {
            x: data.data.position.x,
            y: data.data.position.y
        },
        roll: data.data.roll,
        items: data.data.items,
        coins: data.data.coins,
        stars: data.data.stars,
        collectedSilverStars: data.data.collectedSilverStars,
        turnsCompleted: data.data.turnsCompleted,
        canDuel: data.data.canDuel,
        canSteal: data.data.canSteal,
        isStealing: data.data.isStealing,
        tutorial: data.data.tutorial
    };
    duelBet = false;
    UpdateItemUI();
    UpdatePlayerUI();

    Socket.send(JSON.stringify({ method: "confirm_mod", token: TOKEN, position: PlayerData.position, coins: PlayerData.coins, stars: PlayerData.stars, items: PlayerData.items, turnsCompleted: PlayerData.turnsCompleted }));
    document.getElementById("mod-change").style.display = "initial";
    UIPanels.waitMinigame.style.display = "none";

    for (let i = 0; i < Dice.length; i++){
        Dice[i].scale.set(0, 0, 0);
    }
    turnAnimTimer = 0;
    rollsRemaining = 1;
    addToRoll = 0;
    spacesMoved = 0;
    console.log(data.data.usedItem);
    ServerUseItem(data.data.usedItem);
    
    document.getElementsByClassName("player-data")[0].style.display = "initial";
    document.getElementById("turn-counter").style.display = "initial";
    document.getElementById("wait-minigame-map").style.display = "none";
    document.getElementsByClassName("map-overlay")[0].style.display = "none";

    //
    //Copied from get_status (Below)
    //

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
    document.getElementById("turn-counter").style.display = "initial";
    document.getElementsByClassName("player-data")[0].style.display = "initial";

    transitionValues.playerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (ServerStatus == "TURN"){
        //Reset Turn UI and States
        UIPanels.minigame.style.display = "none";
        if (PlayerData.turnsCompleted == ServerTurn){
            document.getElementsByClassName("player-inputs")[0].style.display = "none";
            UIPanels.waitMinigame.style.display = "initial";
            document.getElementById("wait-minigame-map").style.display = "initial";
            turnStep = "wait";
            UIState = "player";
        }
        else if (data.data.roll == 0){
            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
            PlayerData.roll = 0;
            turnStep = "menu";
            UIState = "player";
            UIPanels.waitMinigame.style.display = "none";
        }
        else{
            document.getElementsByClassName("player-inputs")[0].style.display = "none";
            PlayerData.roll = data.data.roll;
            turnStep = "move";
            UIState = "above";
            UIPanels.waitMinigame.style.display = "none";
            document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
            document.getElementsByClassName("board-inputs")[0].style.display = "initial";
            SetMoveUI();
        }
    }
}

var GetStatusServerTimeout;
function getStatusTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    GetStatusServerTimeout = setTimeout(() => {getStatusTimeout(i+1)}, 3000);
    Socket.send(JSON.stringify(TOKEN == "" ? { method: "get_status" } : { method: "get_status", token: TOKEN }));
}
var ServerStatus = "null";
var ServerTurn = 0;
function get_status_server(data){
    clearTimeout(GetStatusServerTimeout);

    if (Object.hasOwn(data, "turn")){
        ServerTurn = data.turn;
        document.getElementById("turn-counter-text").textContent = ServerTurn + "/15";
    }
    if (Object.hasOwn(data, "endTime")) document.getElementById("turn-timer").textContent = new Date(data.endTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});

    if (Object.hasOwn(data, "data")){
        if (data.status == "RESULTS"){
            TriggerResultsAnimation(data, true);
        }
        else{
            rollsRemaining = 1;
            if (PlayerData.coins != data.data.coins || PlayerData.stars != data.data.stars || !arraysEqual(PlayerData.items, data.data.items) || PlayerData.position.x != data.data.position.x || PlayerData.position.y != data.data.position.y|| PlayerData.tutorial != data.data.tutorial){
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
                document.getElementById("turn-counter").style.display = "initial";
                document.getElementsByClassName("player-data")[0].style.display = "initial";

                PlayerData = {
                    position: {
                        x: data.data.position.x,
                        y: data.data.position.y
                    },
                    roll: PlayerData.roll,
                    items: data.data.items,
                    coins: data.data.coins,
                    stars: data.data.stars,
                    collectedSilverStars: data.data.collectedSilverStars,
                    turnsCompleted: data.data.turnsCompleted,
                    canDuel: data.data.canDuel,
                    canSteal: data.data.canSteal,
                    isStealing: data.data.isStealing,
                    tutorial: data.data.tutorial
                };

                if (data.data.usedItem != null) ServerUseItem(data.data.usedItem);
                transitionValues.playerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

                if (data.status == "TURN"){
                    //Reset Turn UI and States
                    UIPanels.minigame.style.display = "none";
                    if (PlayerData.turnsCompleted == ServerTurn){
                        document.getElementsByClassName("player-inputs")[0].style.display = "none";
                        UIPanels.waitMinigame.style.display = "initial";
                        document.getElementById("wait-minigame-map").style.display = "initial";
                        turnStep = "wait";
                        UIState = "player";
                    }
                    else if (data.data.roll == 0){
                        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                        PlayerData.roll = 0;
                        turnStep = "menu";
                        UIState = "player";
                        UIPanels.waitMinigame.style.display = "none";
                    }
                    else{
                        document.getElementsByClassName("player-inputs")[0].style.display = "none";
                        PlayerData.roll = data.data.roll;
                        turnStep = "move";
                        UIState = "above";
                        UIPanels.waitMinigame.style.display = "none";
                        document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
                        document.getElementsByClassName("board-inputs")[0].style.display = "initial";
                        SetMoveUI();
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

    if (Object.hasOwn(data, "modFlag") && data.modFlag){
        document.getElementById("mod-change").style.display = "initial";
        Socket.send(JSON.stringify({ method: "confirm_mod", token: TOKEN, position: PlayerData.position, coins: PlayerData.coins, stars: PlayerData.stars, items: PlayerData.items, turnsCompleted: PlayerData.turnsCompleted }));
    }

    if (Object.hasOwn(data, "silverStars")){
        ServerSilverStars = data.silverStars;

        InitializeSilverStars();
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
                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                if (!SignedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "initial";
                }
                else if (!checkedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.checkin.style.display = "initial";
                    UIPanels.checkin.children[0].children[2].textContent = "Game is currently running";
                    document.getElementById("checkinbtn").disabled = false;
                    document.getElementById("checkinbtn").textContent = "Start Playing";
                }
                else if (PlayerData.tutorial){
                    UIPanels.checkin.style.display = "none";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "none";
                    document.getElementById("leaderboard").style.display = "initial";
                    document.getElementById("turn-counter").style.display = "initial";
                    UIState = "player";
                    turnStep = "tutorial";
                    document.getElementById("tutorial").style.display = "initial";
                    PlayerData.roll = data.data.roll;
                }
                else{
                    UIPanels.checkin.style.display = "none";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "none";
                    document.getElementsByClassName("player-data")[0].style.display = "initial";
                    document.getElementById("leaderboard").style.display = "initial";
                    document.getElementById("turn-counter").style.display = "initial";
                    //Check if done turn or not
                    if (PlayerData.turnsCompleted < ServerTurn){
                        //Play your turn
                        if (data.data.roll == 0){
                            UIState = "player";
                            document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                        }
                        else{
                            UIState = "above";
                            turnStep = "move";
                            PlayerData.roll = data.data.roll;
                            document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
                            document.getElementsByClassName("board-inputs")[0].style.display = "initial";
                            SetMoveUI();
                        }
                    }
                    else{
                        //Wait for Minigame
                        UIState = "menu";
                        UIPanels.waitMinigame.style.display = "initial";
                    }
                }
                break;
            case "MINIGAME":
                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                if (!SignedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.login.style.display = "initial";
                }
                else if (!checkedIn){
                    UIState = "menu";
                    UIPanels.connecting.style.display = "none";
                    UIPanels.checkin.style.display = "initial";
                    UIPanels.checkin.children[0].children[2].textContent = "Game is currently running";
                    document.getElementById("checkinbtn").disabled = false;
                    document.getElementById("checkinbtn").textContent = "Start Playing";
                }
                else{
                    GetLobbyServerTimeout = setTimeout(() => {getLobbyTimeout(0)}, 3000);
                    Socket.send(JSON.stringify({ method: "get_lobby", token: TOKEN }));
                }
                break;
            case "RESULTS":
                break;
        }
    }
    ServerStatus = data.status;
}

function announcement_server(data){
    if (Object.hasOwn(data, "status")){
        let lastStatus = ServerStatus;
        ServerStatus = data.status;
        animTimer = 0;
        if (Object.hasOwn(data, "turn")){
            ServerTurn = data.turn;
            document.getElementById("turn-counter-text").textContent = ServerTurn + "/15";
        }
        if (Object.hasOwn(data, "endTime")) document.getElementById("turn-timer").textContent = new Date(data.endTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});

        if (ServerStatus == "CHECK_IN"){
            if (SignedIn){
                UIPanels.checkin.children[0].children[2].textContent = checkedIn ? "You are checked-in!" : "Check-in is live";
                document.getElementById("checkinbtn").disabled = checkedIn;
                document.getElementById("checkinbtn").textContent = checkedIn ? "Checked-In" : "Check-in";
            }
        }
        else if (ServerStatus == "TURN"){
            document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";

            if (SignedIn && checkedIn){
                StartTurnSFX.currentTime = 0;
                StartTurnSFX.play();

                UIPanels.waitTurn.style.display = "none";
                duelBet = false;
                PlayerData.isStealing = false;
                if (turnStep == "map") CloseMap();
                document.getElementById("wait-minigame-map").style.display = "none";
                rollsRemaining = 1;
                UIPanels.checkin.style.display = "none";
                UIPanels.connecting.style.display = "none";
                UIPanels.login.style.display = "none";
                UIPanels.minigame.style.display = "none";
                document.getElementsByClassName("player-data")[0].style.display = "initial";
                document.getElementById("leaderboard").style.display = "initial";
                document.getElementById("items-button").disabled = false;
                document.getElementById("turn-counter").style.display = "initial";
                console.log(ServerTurn);
                if (Object.hasOwn(data, "silverStar")){
                    SpawnSilverStarBoard(data.silverStar, lastStatus == "MINIGAME");
                }
                else if (ServerTurn == 1){
                    if (PlayerData.tutorial){
                        UIState = "player";
                        turnStep = "tutorial";
                        document.getElementById("tutorial").style.display = "initial";
                        document.getElementsByClassName("player-data")[0].style.display = "none";
                    }
                    else{
                        UIState = "player";
                        turnStep = "menu";
                        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                    }
                }
                else if (lastStatus == "MINIGAME"){
                    UIState = "player";
                    turnStep = "menu";
                    minigameCoinGiveCheck = true;
                    getPlayerDataTimeout(0);
                }
                else{
                    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
                }
            }
        }
        else if (ServerStatus == "MINIGAME"){
            document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
            
            if (SignedIn && checkedIn){
                minigameNavButtons[0].onclick();

                minigameSubmitButton.disabled = false;
                minigameSubmitButton.textContent = "Submit Results";

                getLobbyTimeout(0);
            }
        }
        else if (ServerStatus == "RESULTS"){
            TriggerResultsAnimation(data, false);
        }
    }
}

const PodiumPosition = { x: 4, y: 4 };
var ResultsData;
var resultsAnimLightTargets = [];
var resultsAnimEndTime = 0;
function TriggerResultsAnimation(data, skipAnim){
    ResultsData = data;

    for (var i = 0; i < ResultsData.data.length - 1; i++){
        for (var j = 0; j < ResultsData.data.length - i - 1; j++){
            if (ResultsData.data[j].stars < ResultsData.data[j+1].stars || (ResultsData.data[j].stars == ResultsData.data[j+1].stars && ResultsData.data[j].coins < ResultsData.data[j+1].coins)){
                let temp = ResultsData.data[j];
                ResultsData.data[j] = ResultsData.data[j+1];
                ResultsData.data[j+1] = temp;
            }
        }
    }

    turnStep = "results-anim";
    UIState = "override";

    animTimer = 10;

    for (const [key, value] of Object.entries(UIPanels)){
        value.style.display = "none";
    }

    document.getElementsByClassName("game-ui")[0].style.display = "none";

    Renderer.domElement.style.filter = "";

    Scene.remove(Player);
    Scene.remove(light);
    ambient.intensity = 0.1;
    //Scene.background = DARK_SKYBOX_TEX;
    Scene.backgroundIntensity = 0.01;

    //Set up Podium
    var Block1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffbf00 }));
    var Block2 = new THREE.Mesh(new THREE.BoxGeometry(1, 2 / 3, 1), new THREE.MeshStandardMaterial({ color: 0xc0c0c0 }));
    var Block3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1 / 3, 1), new THREE.MeshStandardMaterial({ color: 0xCD7F32 }));
    Block1.receiveShadow = true;
    Block1.castShadow = true;
    Block2.receiveShadow = true;
    Block2.castShadow = true;
    Block3.receiveShadow = true;
    Block3.castShadow = true;
    Block1.position.set(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 0.5, PodiumPosition.y);
    Block2.position.set(PodiumPosition.x + 1, getHeightTile(PodiumPosition.x + 1, PodiumPosition.y) + (1 / 3), PodiumPosition.y);
    Block3.position.set(PodiumPosition.x - 1, getHeightTile(PodiumPosition.x - 1, PodiumPosition.y) + (1 / 6), PodiumPosition.y);
    Scene.add(Block1, Block2, Block3);

    //Put players on podium
    var Player1 = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[0].character), alphaTest: 0.5, side: THREE.DoubleSide}));
    var Player2 = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[1].character), alphaTest: 0.5, side: THREE.DoubleSide}));
    var Player3 = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[2].character), alphaTest: 0.5, side: THREE.DoubleSide}));
    Player1.castShadow = true;
    Player2.castShadow = true;
    Player3.castShadow = true;
    Player1.position.set(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 1 + 0.375, PodiumPosition.y);
    Player2.position.set(PodiumPosition.x + 1, getHeightTile(PodiumPosition.x + 1, PodiumPosition.y) + (2 / 3) + 0.375, PodiumPosition.y);
    Player3.position.set(PodiumPosition.x - 1, getHeightTile(PodiumPosition.x - 1, PodiumPosition.y) + (1 / 3) + 0.375, PodiumPosition.y);
    Scene.add(Player1, Player2, Player3);

    //Lights
    var light1 = new THREE.SpotLight(0xff0000, 1000, 0, Math.PI / 40);
    light1.castShadow = true;
    var light2 = new THREE.SpotLight(0x00ff00, 1000, 0, Math.PI / 40);
    light2.castShadow = true;
    var light3 = new THREE.SpotLight(0x0000ff, 1000, 0, Math.PI / 40);
    light3.castShadow = true;
    light1.position.set(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 20, PodiumPosition.y + 10);
    light2.position.set(PodiumPosition.x + 10, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 20, PodiumPosition.y + 7.5);
    light3.position.set(PodiumPosition.x - 10, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 20, PodiumPosition.y + 7.5);
    resultsAnimLightTargets.push(new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D());
    Scene.add(resultsAnimLightTargets[0], resultsAnimLightTargets[1], resultsAnimLightTargets[2]);
    light1.target = resultsAnimLightTargets[0];
    light2.target = resultsAnimLightTargets[1];
    light3.target = resultsAnimLightTargets[2];
    Scene.add(light1, light2, light3);
    Renderer.shadowMap.type = THREE.PCFShadowMap;

    if (skipAnim){
        GenerateResultsPage(ResultsData);
        resultsAnimEndTime = Date.now();
        let targetPos = new THREE.Vector3(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y), PodiumPosition.y);
        resultsAnimLightTargets[0].position.set(targetPos.x, targetPos.y + 1, targetPos.z);
        resultsAnimLightTargets[1].position.set(targetPos.x, targetPos.y + 1, targetPos.z);
        resultsAnimLightTargets[2].position.set(targetPos.x, targetPos.y + 1, targetPos.z);
    }
}
const ResultsAnimCamPos = [
    new THREE.Vector3(15, 5, 35),
    new THREE.Vector3(15, 4, 25),
    new THREE.Vector3(20, 3.5, 20),
    new THREE.Vector3(12.5, 3, 17.5),
    new THREE.Vector3(5, 1, 12.5),
    new THREE.Vector3(-5, 2, 10),
    new THREE.Vector3(0, 2.5, 5),
    new THREE.Vector3(0, 1.25, 2.5),
    new THREE.Vector3(0, 1.25, 2.5),
];
function ResultsAnimation(){
    const animLength = 10;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y), PodiumPosition.y);

    if (animTimer > 0){
        let i = Math.floor((animLength - animTimer) / animLength * (ResultsAnimCamPos.length - 2)) + 1;
        let t = (animLength - animTimer) / animLength * (ResultsAnimCamPos.length - 2) % 1;
        let lightDist = animTimer / animLength * 6;

        resultsAnimLightTargets[0].position.set(targetPos.x + (Math.cos(animTimer) * lightDist), targetPos.y + 1, targetPos.z + (Math.sin(animTimer) * lightDist));
        resultsAnimLightTargets[1].position.set(targetPos.x + (Math.cos(animTimer + (Math.PI / 1.5)) * lightDist), targetPos.y + 1, targetPos.z + (Math.sin(animTimer + (Math.PI / 1.5)) * lightDist));
        resultsAnimLightTargets[2].position.set(targetPos.x + (Math.cos(animTimer - (Math.PI / 1.5)) * lightDist), targetPos.y + 1, targetPos.z + (Math.sin(animTimer - (Math.PI / 1.5)) * lightDist));

        let line1 = lerpVector(lerpVector(ResultsAnimCamPos[i - 1], ResultsAnimCamPos[i], 0.5), ResultsAnimCamPos[i], t);
        let line2 = lerpVector(ResultsAnimCamPos[i], lerpVector(ResultsAnimCamPos[i + 1], ResultsAnimCamPos[i], 0.5), t);
        let line = lerpVector(line1, line2, t);

        Camera.position.set(targetPos.x + line.x, targetPos.y + line.y, targetPos.z + line.z);
        Camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);
    }
    else{
        Camera.position.set(targetPos.x + 0, targetPos.y + 1.25, targetPos.z + 2.5);
        Camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);
        resultsAnimLightTargets[0].position.set(targetPos.x, targetPos.y + 1, targetPos.z);
        resultsAnimLightTargets[1].position.set(targetPos.x, targetPos.y + 1, targetPos.z);
        resultsAnimLightTargets[2].position.set(targetPos.x, targetPos.y + 1, targetPos.z);

        transitionValues.filter = 0;
        transitionValues.cameraPos = Camera.position;
        transitionValues.cameraRot = new THREE.Euler().setFromQuaternion(Camera.quaternion, "YXZ");
        
        resultsAnimEndTime = Date.now();

        GenerateResultsPage(ResultsData);
    }
}

function GenerateResultsPage(data){
    document.getElementById("wait-minigame-map").style.display = "none";
    UIPanels.minigame.style.display = "none";
    UIPanels.checkin.style.display = "none";
    UIPanels.connecting.style.display = "none";
    UIPanels.login.style.display = "none";
    UIPanels.waitMinigame.style.display = "none";
    UIPanels.waitTurn.style.display = "none";
    document.getElementById("results").style.display = "initial";
    UIPanels.globalLeaderboard.style.display = "none";
    document.getElementsByClassName("leaderboard-button")[0].style.display = "none";
    document.getElementsByClassName("player-data")[0].style.display = "none";
    document.getElementById("turn-counter").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
    
    if (!confettiRunning){
        document.getElementsByClassName("confetti-wrapper")[0].style.display = "initial";
        StartConfetti();
    }

    UIState = "podium";
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
    podiumAvatars[0].setAttribute("src", GeneratePlayerURL(data.data[0].character));
    podiumAvatars[1].setAttribute("src", GeneratePlayerURL(data.data[1].character));
    podiumAvatars[2].setAttribute("src", GeneratePlayerURL(data.data[2].character));

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
        listElement.children[1].setAttribute("src", GeneratePlayerURL(data.data[i].character));
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

document.getElementsByClassName("leaderboard-button")[0].onclick = function(e){
    UIPanels.globalLeaderboard.style.display = UIPanels.globalLeaderboard.style.display == "none" ? "initial" : "none";
};
document.getElementsByClassName("global-leaderboard-close")[0].onclick = function(e){ UIPanels.globalLeaderboard.style.display = "none"; };

var GlobalLeaderboard = document.getElementsByClassName("global-leaderboard-list")[0];
function UpdateGlobalLeaderboard(data){
    //Spawn new leaderboard slots
    for (var i = GlobalLeaderboard.children.length; i < data.data.length; i++){
        let listElement = document.createElement("div");
        listElement.classList.add("results-list-item-" + (i%2==0?"a":"b"));
        if (i == 0) listElement.classList.add("results-list-item-1");
        else if (i == 1) listElement.classList.add("results-list-item-2");
        else if (i == 2) listElement.classList.add("results-list-item-3");
        GlobalLeaderboard.appendChild(listElement);

        listElement.appendChild(document.createElement("span"));
        listElement.children[0].classList.add("results-list-placement");
        //listElement.children[0].textContent = (i + 1) + ". ";
        listElement.appendChild(document.createElement("img"));
        //listElement.children[1].setAttribute("src", PlayerAvatars[stringToIndex(data.data[i].ign) % PlayerAvatars.length]);
        listElement.children[1].classList.add("results-list-avatar");
        listElement.appendChild(document.createElement("span"));
        listElement.children[2].classList.add("results-list-username");
        //listElement.children[2].textContent = data.data[i].ign.split("#")[0];
        listElement.appendChild(document.createElement("span"));
        listElement.children[3].classList.add("results-list-info-coins");
        listElement.appendChild(document.createElement("span"));
        listElement.children[4].classList.add("results-list-info-stars");

        listElement.children[4].appendChild(document.createElement("span"));
        listElement.children[4].children[0].classList.add("results-list-stars");
        //listElement.children[3].children[0].textContent = data.data[i].stars + " ";
        listElement.children[4].appendChild(document.createElement("img"));
        listElement.children[4].children[1].classList.add("results-list-text-img");
        listElement.children[4].children[1].setAttribute("src", "resources/textures/squid_star.svg");
        //listElement.children[3].appendChild(document.createElement("div"));
        //listElement.children[3].children[2].style.display = "inline-block";
        //listElement.children[3].children[2].style.width = "5px";
        listElement.children[3].appendChild(document.createElement("span"));
        listElement.children[3].children[0].classList.add("results-list-coins");
        //listElement.children[3].children[3].textContent = data.data[i].coins + " ";
        listElement.children[3].appendChild(document.createElement("img"));
        listElement.children[3].children[1].classList.add("results-list-text-img");
        listElement.children[3].children[1].setAttribute("src", "resources/textures/squid_coin.svg");
    }

    for (var i = 0; i < data.data.length; i++){
        GlobalLeaderboard.children[i].children[0].textContent = (i + 1) + ". ";
        GlobalLeaderboard.children[i].children[1].setAttribute("src", GeneratePlayerURL(data.data[i].character));
        GlobalLeaderboard.children[i].children[2].textContent = data.data[i].ign.split("#")[0];
        GlobalLeaderboard.children[i].children[4].children[0].textContent = data.data[i].stars + " ";
        GlobalLeaderboard.children[i].children[3].children[0].textContent = data.data[i].coins + " ";
    }
}

var EndTurnServerTimeout;
function endTurnTimeout(index, message){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    EndTurnServerTimeout = setTimeout(() => {endTurnTimeout(i+1, message)}, 3000);
    Socket.send(message);
}
function end_turn_server(data){
    clearTimeout(EndTurnServerTimeout);
    if (!data.success){
        //Mod Flag issue
        confirmMod(data);
        
    }
}

const minigamePopupPlayers = document.getElementsByClassName("new-minigame-player");
var GetLobbyServerTimeout;
var CurrentMinigame = "null";
var CurrentMinigameLobby = [];
var CurrentMinigameSetApartPlayers = [];
var ServerDuelBet = false;
var ServerSteal = false;
var ServerBattle = false;
function getLobbyTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    GetLobbyServerTimeout = setTimeout(() => {getLobbyTimeout(i+1)}, 3000);
    Socket.send(JSON.stringify({ method: "get_lobby", token: TOKEN }));
}
const teamBackgroundColors = ["rgba(0, 30, 255, 0.25)", "rgba(255, 132, 0, 0.25)", "rgba(0, 255, 34, 0.25)", "rgba(234, 0, 255, 0.25)"];
const throwerBackgroundColor = "rgba(255, 0, 0, 0.25)";
const placementText = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const battleMinigameRewards = [
    [],
    [0],
    [10, -10],
    [10, 0, -10],
    [10, 5, -5, -10]
];
const battleMinigameTieReward = 3;
function isCoopTie(resultArray){
    let target = resultArray[0];
    for (let i = 1; i < resultArray.length; i++){
        if (resultArray[i] != target) return false;
    }
    return true;
}
function get_lobby_server(data){
    clearTimeout(GetLobbyServerTimeout);

    if (data.success){
        NotifSFX.currentTime = 0;
        NotifSFX.play();

        document.getElementsByClassName("roll-display")[0].style.transform = "scale(0)";
        document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
        document.getElementsByClassName("roll-inputs")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementsByClassName("item-toss-menu")[0].style.display = "none";
        if (Object.hasOwn(mapData[PlayerData.position.y][PlayerData.position.x], "popup")){
            document.getElementById(mapData[PlayerData.position.y][PlayerData.position.x].popup).style.display = "none";
        }

        document.getElementById("minigame-end-time").textContent = new Date(data.endTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});
        document.getElementById("minigame-start-time").textContent = new Date(data.startTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});

        if (turnStep == "map") CloseMap();
        turnStep = "minigame";

        document.getElementById("wait-minigame-map").style.display = "none";
        document.getElementsByClassName("map-overlay")[0].style.display = "none";

        document.getElementById("leaderboard").style.display = "none";
        //document.getElementById("turn-counter").style.display = "none";
        document.getElementById("turn-timer").textContent = "";

        document.getElementById("minigame-interactive").style.display = "inline-block";
        document.getElementById("minigame-waiting").style.display = "none";
        document.getElementById("minigame-pool-pass-box").style.display = data.lobby.length > 1 ? "initial" : "none";

        CurrentMinigame = data.minigame;
        CurrentMinigameLobby = data.lobby;
        CurrentMinigameSetApartPlayers = data.setApartPlayers;

        UIPanels.connecting.style.display = "none";
        UIPanels.waitMinigame.style.display = "none";
        UIPanels.login.style.display = "none";
        UIPanels.checkin.style.display = "none";
        UIPanels.minigame.style.display = "initial";
        
        for (let i = 0; i < minigamePopupPlayers.length; i++){
            if (i < data.lobby.length && MinigameData[CurrentMinigame].teams == 0){
                minigamePopupPlayers[i].style.display = "inline-block";
                minigamePopupPlayers[i].style.backgroundColor = "";
                minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-ign")[0].innerHTML = data.lobby[i].ign.split("#", 2).join("<br>#");
                minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].style.display = MinigameData[data.minigame].type == "vs" ? "initial" : "none";
                minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coop")[0].style.display = MinigameData[data.minigame].type == "coop" ? "initial" : "none";
                minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coin")[0].style.display = MinigameData[data.minigame].type == "coin" ? "initial" : "none";
                let ranks = minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].children;
                for (let n = 0; n < ranks.length; n++){
                    ranks[n].style.display = n < data.lobby.length ? "initial" : "none";
                }
            }
            else if (i < MinigameData[CurrentMinigame].teams){
                if (!Object.hasOwn(MinigameData[CurrentMinigame], "setApartPlayers") || MinigameData[CurrentMinigame].setApartPlayers % MinigameData[CurrentMinigame].teams == 0){
                    //Split the set apart players across the teams
                    minigamePopupPlayers[i].style.display = "inline-block";
                    minigamePopupPlayers[i].style.backgroundColor = teamBackgroundColors[i];
                    let usernameText = "<b><u>" + MinigameData[CurrentMinigame].teamText[i] + "</u></b>";
                    let setApartSkips = 0;
                    for (let n = 0; n < data.lobby.length; n++){
                        if (data.setApartPlayers.includes(n)) setApartSkips++;
                        else if ((n - setApartSkips) % MinigameData[CurrentMinigame].teams == i){
                            //Initial part of added text is to NOT add a break for the first player
                            usernameText += "<br>" + data.lobby[n].ign.split("#", 2).join(" <small>#") + "</small>";
                        }
                    }
                    for (let n = 0; n < data.setApartPlayers.length; n++){
                        if (n % MinigameData[CurrentMinigame].teams == i) usernameText += "<br><text style=\"color: red;\">" + data.lobby[data.setApartPlayers[n]].ign.split("#", 2).join("</text> <small style=\"color: rgba(255, 0, 0, 0.5);\">#") + "</small>";
                    }
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-ign")[0].innerHTML = usernameText;
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].style.display = MinigameData[data.minigame].type == "vs" ? "initial" : "none";
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coop")[0].style.display = MinigameData[data.minigame].type == "coop" ? "initial" : "none";
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coin")[0].style.display = MinigameData[data.minigame].type == "coin" ? "initial" : "none";
                    let ranks = minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].children;
                    for (let n = 0; n < ranks.length; n++){
                        ranks[n].style.display = n < MinigameData[CurrentMinigame].teams ? "initial" : "none";
                    }
                }
                else{
                    minigamePopupPlayers[i].style.display = "inline-block";
                    let usernameText = "<b><u>" + MinigameData[CurrentMinigame].teamText[i] + "</u></b>";
                    //Set apart players are their own team
                    if (i % MinigameData[CurrentMinigame].teams == 0){
                        //Set apart players
                        minigamePopupPlayers[i].style.backgroundColor = throwerBackgroundColor;
                        for (let n = 0; n < data.setApartPlayers.length; n++){
                            usernameText += "<br>" + data.lobby[data.setApartPlayers[n]].ign.split("#", 2).join(" <small>#") + "</small>";
                        }
                    }
                    else{
                        //Normal players
                        minigamePopupPlayers[i].style.backgroundColor = teamBackgroundColors[i - 1];
                        let setApartSkips = 0;
                        for (let n = 0; n < data.lobby.length; n++){
                            if (data.setApartPlayers.includes(n)) setApartSkips++;
                            else if ((n - setApartSkips) % (MinigameData[CurrentMinigame].teams - 1) == i - 1){
                                //Initial part of added text is to NOT add a break for the first player
                                usernameText += "<br>" + data.lobby[n].ign.split("#", 2).join(" <small>#") + "</small>";
                            }
                        }
                    }
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-ign")[0].innerHTML = usernameText;
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].style.display = MinigameData[data.minigame].type == "vs" ? "initial" : "none";
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coop")[0].style.display = MinigameData[data.minigame].type == "coop" ? "initial" : "none";
                    minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-coin")[0].style.display = MinigameData[data.minigame].type == "coin" ? "initial" : "none";
                    let ranks = minigamePopupPlayers[i].getElementsByClassName("new-minigame-player-result-vs")[0].children;
                    for (let n = 0; n < ranks.length; n++){
                        ranks[n].style.display = n < MinigameData[CurrentMinigame].teams ? "initial" : "none";
                    }
                }
            }
            else{
                minigamePopupPlayers[i].style.display = "none";
            }
        }

        minigameNavButtons[1].style.display = data.lobby.length > 1 ? "initial" : "none";

        document.getElementsByClassName("minigame-pool")[0].textContent = "Pool: " + data.pool;
        document.getElementsByClassName("minigame-pass")[0].textContent = "Pass: " + data.pass;

        document.getElementsByClassName("minigame-title")[0].textContent = MinigameData[data.minigame].title;
        
        let descrip = MinigameData[data.minigame].description;
        for (let i = 0; i < data.setApartPlayers.length; i++){
            descrip = descrip.replace("{Player}", data.lobby[data.setApartPlayers[i]].ign);
        }
        document.getElementById("new-minigame-description").innerHTML = descrip;

        //Special Minigame Types STUFF
        let rewardOptions = document.getElementsByClassName("new-minigame-reward-option");
        if (Object.hasOwn(data, "bet")){
            //DUEL
            ServerDuelBet = data.bet;
            ServerSteal = false;
            ServerBattle = false;
            document.getElementById("minigame-type-title").textContent = "Duel Minigame";
            document.getElementById("new-minigame-description").innerHTML = "This is a duel minigame. A player has waged their coins or star to initiate a duel. The winner of the duel gains a reward from the loser.<br><br>" + document.getElementById("new-minigame-description").innerHTML;

            //Set rewards
            for (let i = 0; i < rewardOptions.length; i++){
                rewardOptions[i].style.display = i < 2 ? "inline-block" : "none";
            }
            rewardOptions[0].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Win";
            rewardOptions[1].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Lose";
            rewardOptions[0].getElementsByClassName("new-minigame-reward-coins")[0].textContent = ServerDuelBet.amount;
            rewardOptions[1].getElementsByClassName("new-minigame-reward-coins")[0].textContent = -ServerDuelBet.amount;
            rewardOptions[0].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/" + (ServerDuelBet.type == "coins" ? "squid_coin.svg" : "squid_star.svg"));
            rewardOptions[1].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/" + (ServerDuelBet.type == "coins" ? "squid_coin.svg" : "squid_star.svg"));
        }
        else if (Object.hasOwn(data, "steal")){
            //STAR STEAL
            ServerSteal = data.steal;
            ServerDuelBet = false;
            ServerBattle = false;
            document.getElementById("minigame-type-title").textContent = "Star Steal Minigame";
            document.getElementById("new-minigame-description").innerHTML = "This is a star steal minigame. A player has paid coins to have a chance at stealing a star. They will steal a star if they win this minigame.<br><br>" + document.getElementById("new-minigame-description").innerHTML;

            for (let i = 0; i < rewardOptions.length; i++){
                rewardOptions[i].style.display = i < 2 ? "inline-block" : "none";
            }
            let yourUsernameIndex = -1;
            for (let i = 0; i < data.lobby.length; i++) if (data.lobby[i].ign == COOKIES["ign"]) yourUsernameIndex = i;
            if (yourUsernameIndex == -1) throw new Error("Could not find user in minigame");
            rewardOptions[0].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Win";
            rewardOptions[1].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Lose";
            rewardOptions[0].getElementsByClassName("new-minigame-reward-coins")[0].textContent = ServerSteal.includes(yourUsernameIndex) ? 1 : 10;
            rewardOptions[1].getElementsByClassName("new-minigame-reward-coins")[0].textContent = (ServerSteal.length == 2 || !ServerSteal.includes(yourUsernameIndex)) ? -1 : 0;
            rewardOptions[0].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/" + (ServerSteal.includes(yourUsernameIndex) ? "squid_star.svg" : "squid_coin.svg"));
            rewardOptions[1].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/" + ((ServerSteal.length == 2 || !ServerSteal.includes(yourUsernameIndex)) ? "squid_star.svg" : "squid_coin.svg"));
        }
        else if (Object.hasOwn(data, "battle")){
            //BATTLE
            ServerDuelBet = false;
            ServerSteal = false;
            ServerBattle = data.battle;
            document.getElementById("minigame-type-title").textContent = "Battle Minigame";
            document.getElementById("new-minigame-description").innerHTML = "This is a battle minigame. Winners of this minigame will steal coins from the losers.<br><br>" + document.getElementById("new-minigame-description").innerHTML;

            for (let i = 0; i < rewardOptions.length; i++){
                rewardOptions[i].style.display = i < (MinigameData[data.minigame].type == "coop" ? 3 : data.lobby.length) ? "inline-block" : "none";
                if (i < (MinigameData[data.minigame].type == "coop" ? 3 : data.lobby.length)){
                    rewardOptions[i].getElementsByClassName("new-minigame-reward-placement")[0].textContent = MinigameData[data.minigame].type == "coop" ? (i == 0 ? "Win" : (i == 1 ? "Lose" : "Tie")) : placementText[i];
                    rewardOptions[i].getElementsByClassName("new-minigame-reward-coins")[0].textContent = (MinigameData[data.minigame].type == "coop" && i == 2) ? battleMinigameTieReward : battleMinigameRewards[(MinigameData[data.minigame].type == "coop" ? 2 : data.lobby.length)][i];
                    rewardOptions[i].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                }
            }
        }
        else{
            //NORMAL
            ServerDuelBet = false;
            ServerSteal = false;
            ServerBattle = false;
            document.getElementById("minigame-type-title").textContent = "Minigame";

            //Set rewards
            if (MinigameData[CurrentMinigame].type == "coin"){
                for (let i = 0; i < rewardOptions.length; i++){
                    rewardOptions[i].style.display = i == 0 ? "inline-block" : "none";
                }
                rewardOptions[0].getElementsByClassName("new-minigame-reward-placement")[0].textContent = MinigameData[CurrentMinigame].rewardText;
                rewardOptions[0].getElementsByClassName("new-minigame-reward-coins")[0].textContent = 1;
                rewardOptions[0].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/squid_coin.svg");
            }
            else if (MinigameData[CurrentMinigame].type == "vs"){
                for (let i = 0; i < rewardOptions.length; i++){
                    if (i < data.lobby.length){
                        rewardOptions[i].style.display = "inline-block";
                        rewardOptions[i].getElementsByClassName("new-minigame-reward-placement")[0].textContent = placementText[i];
                        rewardOptions[i].getElementsByClassName("new-minigame-reward-coins")[0].textContent = MinigameData[CurrentMinigame].rewards[Math.min(i, MinigameData[CurrentMinigame].rewards.length - 1)];
                        rewardOptions[i].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                    }
                    else{
                        rewardOptions[i].style.display = "none";
                    }
                }
            }
            else if (MinigameData[CurrentMinigame].type == "coop"){
                for (let i = 0; i < rewardOptions.length; i++){
                    rewardOptions[i].style.display = i < 2 ? "inline-block" : "none";
                }
                rewardOptions[0].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Win";
                rewardOptions[1].getElementsByClassName("new-minigame-reward-placement")[0].textContent = "Lose";
                rewardOptions[0].getElementsByClassName("new-minigame-reward-coins")[0].textContent = MinigameData[CurrentMinigame].rewards[0];
                rewardOptions[1].getElementsByClassName("new-minigame-reward-coins")[0].textContent = MinigameData[CurrentMinigame].rewards[1];
                rewardOptions[0].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                rewardOptions[1].getElementsByTagName("img")[0].setAttribute("src", "resources/textures/squid_coin.svg");
            }
        }

        //Chat Stuff
        document.getElementById("new-minigame-chat").innerHTML = "";
        minigameChatNotification.style.display = "none";
        MinigameChatHistory = data.chatHistory;
        for (let i = 0; i < MinigameChatHistory.length; i++){
            if (MinigameChatHistory[i].sender == "SERVER"){
                let p = document.createElement("p");
                if (Object.hasOwn(MinigameChatHistory[i], "subject")){
                    p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[MinigameChatHistory[i].message].replace("{subject}", MinigameChatHistory[i].subject.split("#")[0]) + "</b>";
                }
                else{
                    p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[MinigameChatHistory[i].message] + "</b>";
                }
                document.getElementById("new-minigame-chat").appendChild(p);

                if (MinigameChatHistory[i].message == "submit"){
                    minigameSubmitButton.disabled = MinigameChatHistory[i].subject == COOKIES["ign"];
                    minigameSubmitButton.textContent = MinigameChatHistory[i].subject == COOKIES["ign"] ? "Submitted" : "Submit Results";
                }
                else if (MinigameChatHistory[i].message == "confirm"){
                    document.getElementById("wait-minigame-map").style.display = "initial";

                    minigameSubmitButton.disabled = true;
                    minigameSubmitButton.textContent = "Score Locked";
                    
                    document.getElementById("minigame-interactive").style.display = "none";
                    document.getElementById("minigame-waiting").style.display = "initial";

                    //Waiting screen podiums
                    let podiums = document.getElementsByClassName("minigame-podium");
                    let maxReward = 0;
                    for (let j = 0; j < MinigameChatHistory[i].result.length; j++){
                        if (ServerDuelBet){
                            maxReward = Math.max(maxReward, MinigameChatHistory[i].result[j] == 0 ? ServerDuelBet.amount * 2 : 0);
                        }
                        else if (ServerSteal){
                            maxReward = 0;
                        }
                        else if (ServerBattle){
                            maxReward = 20;
                        }
                        else if (MinigameData[CurrentMinigame].type == "coin"){
                            maxReward = Math.max(maxReward, Math.floor(MinigameData[CurrentMinigame].rewards * MinigameChatHistory[i].result[j]));
                        }
                        else{
                            maxReward = Math.max(maxReward, MinigameData[CurrentMinigame].rewards[MinigameChatHistory[i].result[j]]);
                        }
                    }
                    for (let j = 0; j < podiums.length; j++){
                        if (j < MinigameChatHistory[i].result.length){
                            podiums[j].style.display = "inline-block";
                            if (ServerDuelBet){
                                let tie = MinigameChatHistory[i].result[0] == MinigameChatHistory[i].result[1];
                                podiums[j].children[0].style.height = tie ? "55px" : lerp(20, 90, (MinigameChatHistory[i].result[j] == 0 ? ServerDuelBet.amount * 2 : 0) / maxReward) + "px";
                                podiums[j].children[0].children[1].children[0].textContent = tie ? "0" : (MinigameChatHistory[i].result[j] == 0 ? "+" + ServerDuelBet.amount : -ServerDuelBet.amount);
                                podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", ServerDuelBet.type == "stars" ? "resources/textures/squid_star.svg" : "resources/textures/squid_coin.svg");
                            }
                            else if (ServerSteal){
                                podiums[j].children[0].style.height = MinigameChatHistory[i].result[j] == 0 ? "90px" : "20px";
                                podiums[j].children[0].children[1].children[0].textContent = ServerSteal.includes(j) ? (MinigameChatHistory[i].result[j] == 0 ? "+1" : (ServerSteal.length == 2 ? "-1" : "0")) : (MinigameChatHistory[i].result[j] == 0 ? "+10" : "-1");
                                podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/" + (ServerSteal.includes(j) ? "squid_star.svg" : (MinigameChatHistory[i].result[j] == 0 ? "squid_coin.svg" : "squid_star.svg")));
                            }
                            else if (ServerBattle){
                                let reward = isCoopTie(MinigameChatHistory[i].result) ? battleMinigameTieReward : battleMinigameRewards[MinigameData[CurrentMinigame].type == "coop" ? 2 : MinigameChatHistory[i].result.length][MinigameChatHistory[i].result[j]];
                                podiums[j].children[0].style.height = lerp(20, 90, (reward + 10) / maxReward) + "px";
                                podiums[j].children[0].children[1].children[0].textContent = (reward > 0 ? "+" : "") + reward;
                                podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                            }
                            else if (MinigameData[CurrentMinigame].type == "coin"){
                                podiums[j].children[0].style.height = lerp(20, 90, Math.floor(MinigameData[CurrentMinigame].rewards * MinigameChatHistory[i].result[j]) / maxReward) + "px";
                                podiums[j].children[0].children[1].children[0].textContent = "+" + Math.floor(MinigameData[CurrentMinigame].rewards * MinigameChatHistory[i].result[j]);
                                podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                            }
                            else{
                                podiums[j].children[0].style.height = lerp(20, 90, MinigameData[CurrentMinigame].rewards[MinigameChatHistory[i].result[j]] / maxReward) + "px";
                                podiums[j].children[0].children[1].children[0].textContent = "+" + MinigameData[CurrentMinigame].rewards[MinigameChatHistory[i].result[j]];
                                podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                            }
                            podiums[j].children[0].children[0].setAttribute("src", GeneratePlayerURL(CurrentMinigameLobby[j].character));
                            podiums[j].children[0].children[2].textContent = CurrentMinigameLobby[j].ign.split("#")[0];
                        }
                        else{
                            podiums[j].style.display = "none";
                        }
                    }
                }
            }
            else{
                let p = document.createElement("p");
                p.innerHTML = "<b>" + MinigameChatHistory[i].sender.split("#")[0] + ": </b>" + MinigameChatHistory[i].message;
                document.getElementById("new-minigame-chat").appendChild(p);
            }
        }
        MinigameChatElement.scrollTop = MinigameChatElement.scrollHeight - MinigameChatElement.clientHeight;
    }
    else{
        if (Object.hasOwn(data, "checkedIn")) checkedIn = data.checkedIn;

        document.getElementsByClassName("roll-display")[0].style.transform = "scale(0)";
        document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
        document.getElementsByClassName("roll-inputs")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementsByClassName("item-toss-menu")[0].style.display = "none";

        for (const [key, value] of Object.entries(UIPanels)) value.style.display = "none";

        if (checkedIn){
            UIPanels.waitTurn.style.display = "initial";
        }
        else if (SignedIn){
            UIPanels.checkin.style.display = "initial";
            UIState = "menu";
            UIPanels.checkin.children[0].children[2].textContent = "You missed your turn and have been removed from the game.";
            document.getElementById("checkinbtn").disabled = false;
            document.getElementById("checkinbtn").textContent = "Join Back";
        }
        else{
            UIPanels.login.style.display = "initial";
            UIState = "menu";
        }
    }
}

var checkedIn = false;
var SignInServerTimeout;
function signInTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    SignInServerTimeout = setTimeout(() => {signInTimeout(i+1)}, 3000);
    Socket.send(JSON.stringify({ method:"sign_in", token: TOKEN }));
}
function sign_in_server(data){
    clearTimeout(SignInServerTimeout);
    if (data.success){
        SignedIn = true;
        UIState = "menu";
        checkedIn = data.checkedIn;

        Player.material.map = GeneratePlayerTexture(data.character);
        //PlayerAvatarsTex[stringToIndex(COOKIES["ign"]) % PlayerAvatarsTex.length];

        UIPanels.checkin.children[0].children[0].textContent = "Game starts " + new Date(data.startTime * 1000).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short" });
        UIPanels.connecting.style.display = "none";
        UIPanels.checkin.style.display = "initial";

        UpdatePlayerUI();
    }
    else{
        SignedIn = false;
        UIPanels.login.style.display = "initial";
        UIPanels.connecting.style.display = "none";
        document.getElementById("login-error-message").innerHTML = "There was a problem signing up / logging in";
    }

    ServerStatus = "null";

    getStatusTimeout(0);
}

var RegisterServerTimeout;
function registerTimeout(discord, ign, char, i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method: "register", discord: discord, ign: ign, character: char }));
    RegisterServerTimeout = setTimeout(() => {registerTimeout(discord, ign, char, i+1);}, 3000);
}
let registerDiscord, registerIGN;
function loginSubmit(loginType){
    if (Socket.readyState == Socket.OPEN || true){
        let discord, ign;
        if (loginType == "normal"){
            discord = document.getElementById("login_discord_input").value;
            ign = document.getElementById("login_ign_input").value;
        }
        else if (loginType == "sendou"){
            let sendouURL = document.getElementById("login_sendou_input").value;

            if (sendouURL == null || sendouURL == ""){
                //Blank error
                document.getElementById("login-error-message").innerHTML = "Please fill out all fields";
                return;
            }
            if (!sendouURL.includes("sendou.ink/u/")){
                //Not a sendou url
                //Check if it's a profile id
                sendouURL = "https://sendou.ink/u/" + sendouURL;
            }
            if (!sendouURL.includes("https://")){
                sendouURL = "https://" + sendouURL;
            }
            if (sendouURL.includes("www.sendou.ink")){
                sendouURL.replace("www.sendou.ink", "sendou.ink");
            }

            let request = new XMLHttpRequest();
            request.open("GET", "https://corsproxy.io/?url=" + sendouURL, false);
            request.send(null);

            if (request.status === 200){
                let xml = new DOMParser().parseFromString(request.responseText, "text/html").body;
                let scripts = xml.getElementsByTagName("script");
                let data = scripts[scripts.length - 2].textContent.replace("window.__remixContext = ", "");
                data = JSON.parse(data.slice(0, data.length - 1));
                ign = data.state.loaderData["features/user-page/routes/u.$identifier.index"].user.inGameName;
                discord = data.state.loaderData["features/user-page/routes/u.$identifier.index"].user.discordUniqueName;
                
                if (ign == null || discord == null){
                    document.getElementById("login-error-message").innerHTML = "Cannot sign up with sendou profile.<br>Please sign up with discord and username instead.";
                    return;
                }
            }
            else{
                //Failed to get profile error
                document.getElementById("login-error-message").innerHTML = "Sendou profile does not exist";
                return;
            }
        }

        if (discord.length == 0 || ign.length == 0){
            document.getElementById("login-error-message").innerHTML = "Please fill out all fields";
            return;
        }

        let testIGN = ign.split("#");
        if (testIGN.length != 2){
            //Error, must contain numbers at end
            document.getElementById("login-error-message").innerHTML = "Splatoon Username must contain profile numbers<br>(e.g. Username<b>#1234</b>)";
            return;
        }

        document.cookie = "ign=" + ign + "; expires=" + new Date(2999, 12, 30).toUTCString();
        document.cookie = "discord=" + discord + "; expires=" + new Date(2999, 12, 30).toUTCString();
        loadCookies();

        registerDiscord = discord;
        registerIGN = ign;

        UIState = "menu";
        UIPanels.login.style.display = "none";
        UIPanels.characterCreator.style.display = "initial";
    }
}
document.getElementById("login-form").onsubmit = function(e){
    e.preventDefault();
    loginSubmit("normal");
    return false;
};
document.getElementById("login-sendou-form").onsubmit = function(e){
    e.preventDefault();
    loginSubmit("sendou");
    return false;
};
document.getElementsByClassName("login-form-swap")[0].onclick = function(e){
    document.getElementById("login-form").style.display = "none";
    document.getElementById("login-sendou-form").style.display = "initial";
};
document.getElementsByClassName("login-form-swap")[1].onclick = function(e){
    document.getElementById("login-form").style.display = "initial";
    document.getElementById("login-sendou-form").style.display = "none";
};
function register_server(data){
    clearTimeout(RegisterServerTimeout);
    if (data.success){
        TOKEN = data.token;
        saveCookies(new Date(data.startTime * 1000 + 86400000));//1 day after start time
        
        signInTimeout(0);
    }
    else{
        //ERROR POP UP
        //PLEASE CONTACT A MOD
        UIPanels.connecting.style.display = "none";
        UIPanels.login.style.display = "initial";
        document.getElementById("login-error-message").innerHTML = "Could not sign up player,<br>please put a message in help-desk in the discord."
    }
}

var CheckInServerTimeout;
function check_in_server(data){
    clearTimeout(CheckInServerTimeout);
    if (data.success){
        checkedIn = true;
        document.getElementById("checkinbtn").disabled = true;
        document.getElementById("checkinbtn").textContent = "Checked-In";
        UIPanels.checkin.children[0].children[2].textContent = "You are checked-in!";

        if (ServerStatus == "TURN"){
            turnStep = "menu";
            UIState = "player";

            UIPanels.checkin.style.display = "none";
            
            ServerStatus = "NULL";
            getStatusTimeout(0);
        }
        else if (ServerStatus == "MINIGAME"){
            UIPanels.checkin.style.display = "none";
            UIPanels.connecting.style.display = "initial";
            getLobbyTimeout(0);
        }
    }
}
document.getElementById("checkinbtn").onclick = function(e){
    Socket.send(JSON.stringify({ method:"check_in", token: TOKEN }));
    document.getElementById("checkinbtn").disabled = true;
    document.getElementById("checkinbtn").textContent = "Please Wait";
    CheckInServerTimeout = setTimeout(() => {checkInTimeout(0);}, 3000);
}
function checkInTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method:"check_in", token: TOKEN }));
    CheckInServerTimeout = setTimeout(() => {checkInTimeout(i+1)}, 3000);
}

var minigameCoinGiveCheck = false;
var GetPlayerDataServerTimeout;
function getPlayerDataTimeout(i){
    if (i > TIMEOUT_LIMIT) { disconnectError(); return; }
    Socket.send(JSON.stringify({ method: "get_player_data", token: TOKEN }));
    GetPlayerDataServerTimeout = setTimeout(() => {getPlayerDataTimeout(i + 1)}, 3000);
}
function get_player_data_server(data){
    clearTimeout(GetPlayerDataServerTimeout);
    if (minigameCoinGiveCheck){
        if (data.data.stars < PlayerData.stars){
            PlayerData.stars = data.data.stars;
            TriggerStarLoseAnimation();
        }
        else if (data.data.stars > PlayerData.stars){
            TriggerStarGetAnimation(false, data.data.stars - PlayerData.stars);
            PlayerData.stars = data.data.stars;
        }
        else TriggerCoinSpaceAnimation(data.data.coins - PlayerData.coins);
    }
    else{
        //TODO!!! Mod Check Verify Here!
        //Don't think this is needed anymore because PlayerData is stored on the server now
    }
}

var MinigameChatHistory = [];
document.getElementById("new-minigame-chat-form").onsubmit = (e) => {
    let message = document.getElementById("new-minigame-message-textbox").value;
    document.getElementById("new-minigame-message-textbox").value = "";
    if (message == "" || message == null) return;

    Socket.send(JSON.stringify({ method: "send_message", token: TOKEN, message: message }));

    return false;
};
var minigameChatNotification = document.getElementsByClassName("new-minigame-chat-notification")[0];
var ServerMessages = {
    submit: "{subject} has reported the score. Waiting for a second player to confirm the score.",
    confirm: "{subject} has locked in the score.",
    warnStart: "Start playing your minigame NOW to finish it in time.",
    warn3min: "There are 3 minutes left to submit the results for your minigame.",
    warn1min: "There is 1 minute left to submit the results for your minigame."
};
var minigameSubmitButton = document.getElementById("new-minigame-submit-button");
function send_message_server(data){
    MinigameChatHistory.push(data.data);

    if (data.data.sender == "SERVER"){
        let p = document.createElement("p");
        if (Object.hasOwn(data.data, "subject")){
            p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[data.data.message].replace("{subject}", data.data.subject.split("#")[0]) + "</b>";
        }
        else{
            p.innerHTML = "<b style=\"color:rgba(255,255,255,0.75);\">" + ServerMessages[data.data.message] + "</b>";
        }
        document.getElementById("new-minigame-chat").appendChild(p);

        if (data.data.message == "submit"){
            minigameSubmitButton.disabled = data.data.subject == COOKIES["ign"];
            minigameSubmitButton.textContent = data.data.subject == COOKIES["ign"] ? "Submitted" : "Submit Results";
        }
        else if (data.data.message == "confirm"){
            document.getElementById("wait-minigame-map").style.display = "initial";

            minigameSubmitButton.disabled = true;
            minigameSubmitButton.textContent = "Score Locked";

            document.getElementById("minigame-interactive").style.display = "none";
            document.getElementById("minigame-waiting").style.display = "initial";

            //Minigame wait podiums
            let podiums = document.getElementsByClassName("minigame-podium");
            let maxReward = 0;
            for (let j = 0; j < data.data.result.length; j++){
                if (ServerDuelBet){
                    maxReward = Math.max(maxReward, data.data.result[j] == 0 ? ServerDuelBet.amount * 2 : 0);
                }
                else if (ServerSteal){
                    maxReward = 0;
                }
                else if (ServerBattle){
                    maxReward = 20;
                }
                else if (MinigameData[CurrentMinigame].type == "coin"){
                    maxReward = Math.max(maxReward, Math.floor(MinigameData[CurrentMinigame].rewards * data.data.result[j]));
                }
                else{
                    maxReward = Math.max(maxReward, MinigameData[CurrentMinigame].rewards[data.data.result[j]]);
                }
            }
            for (let j = 0; j < podiums.length; j++){
                if (j < data.data.result.length){
                    podiums[j].style.display = "inline-block";
                    if (ServerDuelBet){
                        let tie = data.data.result[0] == data.data.result[1];
                        podiums[j].children[0].style.height = tie ? "55px" : lerp(20, 90, (data.data.result[j] == 0 ? ServerDuelBet.amount * 2 : 0) / maxReward) + "px";
                        podiums[j].children[0].children[1].children[0].textContent = tie ? "0" : (data.data.result[j] == 0 ? "+" + ServerDuelBet.amount : -ServerDuelBet.amount);
                        podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", ServerDuelBet.type == "stars" ? "resources/textures/squid_star.svg" : "resources/textures/squid_coin.svg");
                    }
                    else if (ServerSteal){
                        podiums[j].children[0].style.height = data.data.result[j] == 0 ? "90px" : "20px";
                        podiums[j].children[0].children[1].children[0].textContent = ServerSteal.includes(j) ? (data.data.result[j] == 0 ? "+1" : (ServerSteal.length == 2 ? "-1" : "0")) : (data.data.result[j] == 0 ? "+10" : "-1");
                        podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/" + (ServerSteal.includes(j) ? "squid_star.svg" : (data.data.result[j] == 0 ? "squid_coin.svg" : "squid_star.svg")));
                    }
                    else if (ServerBattle){
                        let reward = isCoopTie(data.data.result) ? battleMinigameTieReward : battleMinigameRewards[MinigameData[CurrentMinigame].type == "coop" ? 2 : data.data.result.length][data.data.result[j]];
                        podiums[j].children[0].style.height = lerp(20, 90, (reward + 10) / maxReward) + "px";
                        podiums[j].children[0].children[1].children[0].textContent = (reward > 0 ? "+" : "") + reward;
                        podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                    }
                    else if (MinigameData[CurrentMinigame].type == "coin"){
                        podiums[j].children[0].style.height = lerp(20, 90, Math.floor(MinigameData[CurrentMinigame].rewards * data.data.result[j]) / maxReward) + "px";
                        podiums[j].children[0].children[1].children[0].textContent = "+" + Math.floor(MinigameData[CurrentMinigame].rewards * data.data.result[j]);
                        podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                    }
                    else{
                        podiums[j].children[0].style.height = lerp(20, 90, MinigameData[CurrentMinigame].rewards[data.data.result[j]] / maxReward) + "px";
                        podiums[j].children[0].children[1].children[0].textContent = "+" + MinigameData[CurrentMinigame].rewards[data.data.result[j]];
                        podiums[j].getElementsByClassName("minigame-podium-coins-image")[0].setAttribute("src", "resources/textures/squid_coin.svg");
                    }
                    podiums[j].children[0].children[0].setAttribute("src", GeneratePlayerURL(CurrentMinigameLobby[j].character));
                    podiums[j].children[0].children[2].textContent = CurrentMinigameLobby[j].ign.split("#")[0];
                }
                else{
                    podiums[j].style.display = "none";
                }
            }
        }
    }
    else{
        let p = document.createElement("p");
        p.innerHTML = "<b>" + data.data.sender.split("#")[0] + ": </b>" + data.data.message;
        document.getElementById("new-minigame-chat").appendChild(p);
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

var leaderboardPlaces = document.getElementsByClassName("leaderboard-player");
function update_player_data_server(data){
    //Sort the data
    for (var i = 0; i < data.data.length - 1; i++){
        for (var j = 0; j < data.data.length - i - 1; j++){
            if (data.data[j].stars < data.data[j+1].stars || (data.data[j].stars == data.data[j+1].stars && data.data[j].coins < data.data[j+1].coins)){
                let temp = data.data[j];
                data.data[j] = data.data[j+1];
                data.data[j+1] = temp;
            }
        }
    }

    //Update leaderboard
    for (var i = 0; i < leaderboardPlaces.length; i++){
        if (i < data.data.length){
            leaderboardPlaces[i].style.display = "block";
            leaderboardPlaces[i].children[1].textContent = data.data[i].ign.split("#")[0];
            leaderboardPlaces[i].children[3].textContent = data.data[i].stars;
            leaderboardPlaces[i].children[5].textContent = data.data[i].coins;
        }
        else{
            leaderboardPlaces[i].style.display = "none";
        }
    }

    UpdateGlobalLeaderboard(data);
}


function disconnectError(){
    alert("Could not connect to server! Check your internet and refresh the page.");
}

var confettiRunning = false;
function StartConfetti(){
    confettiRunning = true;
    const confettiWrapper = document.querySelector('.confetti-wrapper');
    // Generate confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.setProperty('--fall-duration', `${Math.random() * 3 + 3}s`);
        confetti.style.setProperty('--confetti-color', getRandomColor());
        confettiWrapper.appendChild(confetti);
    }
    function getRandomColor() {
        const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}










function debugSetState(state){
    UIState = state;
}

const debugSet = document.getElementsByClassName("debug-set");
for (let i = 0; i < debugSet.length; i++){
    debugSet[i].onclick = (e) => {debugSetState(debugSet[i].textContent);};
}


//TODO!!! Low quality version of webpage (no animations, no lighting, no filters)
//Will have to see if anyone complains about performance

window.onerror = function(e){
    document.getElementById("debug-2").textContent += "\n" + e;
};