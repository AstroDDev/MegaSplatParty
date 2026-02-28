import * as THREE from "three"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const TIMEOUT_LIMIT = 5;
var MAP = "wahoo-world";

var VOLUME = 1;
var MUSIC_VOLUME = 1;
var REDUCED_MOTION = false;
var HIDE_ROOM_CODE = false;

const RankThresholds = { F: 0, D: 100, C: 250, B: 500, A: 1000, S: 2000, SPlus: 5000, X: 10000, VIP: -9999 };
function getRank(rank){
    let closestRank = "VIP";
    for (const [key, value] of Object.entries(RankThresholds)){
        if (rank >= value && (rank - RankThresholds[closestRank]) > (rank - value)) closestRank = key;
    }
    return closestRank;
}
function getNextRank(rank){
    let closestRank = "X";
    for (const [key, value] of Object.entries(RankThresholds)){
        if (rank < value && (RankThresholds[closestRank] - rank) > (value - rank)) closestRank = key;
    }
    console.log(closestRank);
    return closestRank == "X" || rank < 0 ? null : closestRank;
}

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
function inverseLerp(a, b, n) { return (n - a) / (b - a); }
function lerpVector(a, b, t) { return new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t)); }
function wrapAngleDeg(a) {
    while (a < -180) a += 360;
    while (a > 180) a -= 360;
    return a;
}
function lerpRotationDeg(a, b, t){
    let diff = wrapAngleDeg(b - a);
    return wrapAngleDeg(a + (diff * t));
}
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

function saveCookies(){
    if (TOKEN == "") return;
    document.cookie = "playerToken=" + TOKEN + "; expires=" + new Date(2999, 0, 0).toUTCString();
    document.cookie = "volume=" + VOLUME + "; expires=" + new Date(2999, 0, 0).toUTCString();
    document.cookies = "music=" + MUSIC_VOLUME + "; expires=" + new Date(2999, 0, 0).toUTCString();
    document.cookie = "reducedMotion=" + REDUCED_MOTION + "; expires=" + new Date(2999, 0, 0).toUTCString();
    document.cookie = "hideRoomCode=" + HIDE_ROOM_CODE + "; expires=" + new Date(2999, 0, 0).toUTCString();
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
const MusicPlaylist = [
    new Audio("resources/music/ThisSongIsIn15-8Time.mp3"),
    new Audio("resources/music/ThisSongIsIn15-8Time2.mp3"),
    new Audio("resources/music/a-recurring-rival-remix.mp3"),
    new Audio("resources/music/ThisSongIsIn7-4Time.mp3")
];
var PlaylistOrder = [];
var CurrentSong = 0;
for (let i = 0; i < MusicPlaylist.length; i++){
    MusicPlaylist[i].loop = true;
    PlaylistOrder.push(i);
}
//Shuffle Playlist
for (let i = 0; i < MusicPlaylist.length; i++){
    let rng = Math.floor(Math.random() * MusicPlaylist.length);
    let temp = PlaylistOrder[i];
    PlaylistOrder[i] = PlaylistOrder[rng];
    PlaylistOrder[rng] = temp;
}

if (Object.hasOwn(COOKIES, "volume")){
    VOLUME = Number.parseFloat(COOKIES.volume);
    NotifSFX.volume = VOLUME;
    StartTurnSFX.volume = VOLUME;
    document.getElementById("volume").value = VOLUME;
}
if (Object.hasOwn(COOKIES, "music")){
    MUSIC_VOLUME = Number.parseFloat(COOKIES.music);
    for (let i = 0; i < MusicPlaylist.length; i++){
        MusicPlaylist[i].volume = MUSIC_VOLUME;
    }
    document.getElementById("music").value = MUSIC_VOLUME;
}
if (Object.hasOwn(COOKIES, "reducedMotion")){
    REDUCED_MOTION = typeof COOKIES.reducedMotion == "string" ? COOKIES.reducedMotion === "true" : COOKIES.reducedMotion;
    document.getElementById("reduced-motion").checked = REDUCED_MOTION;
}
else{
    REDUCED_MOTION = false;
    document.getElementById("reduced-motion").checked = false;
}
const roomCodeCopyElems = document.getElementsByClassName("room-code-copy");
if (Object.hasOwn(COOKIES, "hideRoomCode")){
    HIDE_ROOM_CODE = typeof COOKIES.hideRoomCode == "string" ? COOKIES.hideRoomCode == "true" : COOKIES.reducedMotion;
    if (HIDE_ROOM_CODE){
        for (let i = 0; i < roomCodeCopyElems.length; i++){
            roomCodeCopyElems[i].textContent = "******";
        }
    }
    document.getElementById("hide-room-code").checked = HIDE_ROOM_CODE;
}

var Scene = new THREE.Scene();
const Camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const Renderer = new THREE.WebGLRenderer({powerPreference: "high-performance"});
Renderer.shadowMap.enabled = true;
Renderer.shadowMap.type = THREE.BasicShadowMap;
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("world").appendChild(Renderer.domElement);

window.onresize = function(e){ 
    Renderer.setSize(window.innerWidth, window.innerHeight);
    Renderer.setPixelRatio(window.devicePixelRatio);
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
    //Scene.add(Dice[i]);
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

var UsernameFont;
fontLoader.load("resources/fonts/Digits/Digits_Regular.json", function(font){
    UsernameFont = font;
});

var MapAnimations = null;
function loadMap(playerList){
    fetch("resources/maps/" + MAP + "/map.json").then(res => res.json()).then(async res => {
        mapData = res.data;
        tutorialStarPos = res.tutorialStar.pos;
        tutorialStarRot = res.tutorialStar.rot;
        tutorialShopPos = res.tutorialShop.pos;
        tutorialShopRot = res.tutorialShop.rot;
        ShopWarpTiles = res.shopWarpTiles;
        StarWarpLocation = res.starWarpTile;
        StartingTile = res.startingTile;
        PlayerData.position = StartingTile;
        for (let i = 0; i < res.skybox.length; i++) res.skybox[i] = "resources/maps/" + MAP + "/" + res.skybox[i];
        SKYBOX_TEX = CubeTexLoader.load(res.skybox);
        SKYBOX_TEX.colorSpace = THREE.SRGBColorSpace;
        ATLAS = TexLoader.load("resources/maps/" + MAP + "/" + res.atlas);
        ATLAS.colorSpace = THREE.SRGBColorSpace;
        ATLAS.wrapS = THREE.RepeatWrapping;
        ATLAS.wrapT = THREE.RepeatWrapping;
        ATLAS.magFilter = THREE.NearestFilter;
        ATLAS.minFilter = THREE.NearestFilter;
        MapMat = new THREE.MeshStandardMaterial({map: ATLAS});
        PodiumPosition = res.podiumPosition;

        ResultsAnimCamPos = [];
        for (let i = 0; i < res.resultsAnimCamPoses.length; i++){
            ResultsAnimCamPos.push(new THREE.Vector3(res.resultsAnimCamPoses[i].x, res.resultsAnimCamPoses[i].y, res.resultsAnimCamPoses[i].z));
        }

        if (res.animations){
            MapAnimations = res.animations;
            for (const key of Object.keys(MapAnimations)){
                for (let i = 0; i < MapAnimations[key].states.length; i++){
                    if (!Object.hasOwn(MapAnimations[key].states[i], "duration")) Object.defineProperty(MapAnimations[key].states[i], "duration", { value: 1 });
                    if (!Object.hasOwn(MapAnimations[key].states[i], "rotation")) Object.defineProperty(MapAnimations[key].states[i], "rotation", { value: 0 });
                    if (!Object.hasOwn(MapAnimations[key].states[i], "translation")) Object.defineProperty(MapAnimations[key].states[i], "translation", { value: { x: 0, y: 0, z: 0 } });
                }
            }
            if (Object.keys(MapAnimations).length == 0) MapAnimations = null;
        }
        else{
            MapAnimations = null;
        }

        for (const [key, value] of Object.entries(EntityTiles)){
            Scene.remove(value.mesh);
            delete EntityTiles[key];
        }

        //Generate Shops
        let shopsParent = document.getElementById("shops");
        let shopsPreviews = document.getElementById("shop-previews");
        while(shopsParent.children.length > 0) shopsParent.removeChild(shopsParent.children[0]);
        while(shopsPreviews.children.length > 0) shopsPreviews.removeChild(shopsPreviews.children[0]);
        for (const [key, value] of Object.entries(res.shops)){
            //Shop Map Preview
            let mapElem = document.createElement("div");
            shopsPreviews.appendChild(mapElem);
            mapElem.id = key + "-preview";
            mapElem.classList.add("map-shop");
            mapElem.style.display = "none";

            mapElem.appendChild(document.createElement("h2"));
            mapElem.children[0].textContent = "Shop Preview";

            //Actual Shop UI
            let shopElem = document.createElement("div");
            shopElem.id = key;
            shopElem.classList.add("popup");
            shopElem.classList.add("shop-popup");
            shopElem.style.display = "none";

            shopElem.appendChild(document.createElement("div"));
            shopElem.children[0].classList.add("popup-inset");
            shopElem.children[0].appendChild(document.createElement("h1"));
            shopElem.children[0].children[0].textContent = "Shop";
            shopElem.children[0].appendChild(document.createElement("br"));

            let shopContent = document.createElement("div");
            shopElem.children[0].appendChild(shopContent);
            shopContent.classList.add("popup-shop");

            for (let i = 0; i < value.length; i++){
                //Actual Shop
                let shopItem = document.createElement("div");
                shopContent.appendChild(shopItem);
                shopItem.classList.add("shop-item");

                shopItem.appendChild(document.createElement("button"));
                shopItem.children[0].classList.add("shop-button");
                shopItem.children[0].setAttribute("item", value[i]);
                shopItem.children[0].style.backgroundImage = "url('" + ItemData[value[i]].url + "')";

                shopItem.appendChild(document.createElement("br"));

                shopItem.appendChild(document.createElement("h3"));
                shopItem.children[2].innerHTML = ItemData[value[i]].price + ' <img class="coin-shop-image" src="resources/textures/squid_coin.svg">';

                //Shop Map Preview
                let mapShopItem = document.createElement("div");
                mapElem.appendChild(mapShopItem);
                mapShopItem.classList.add("map-shop-item");

                mapShopItem.appendChild(document.createElement("img"));
                mapShopItem.children[0].classList.add("map-shop-item-image");
                mapShopItem.children[0].src = ItemData[value[i]].url;

                mapShopItem.appendChild(document.createElement("h3"));
                mapShopItem.children[1].classList.add("map-shop-price");
                mapShopItem.children[1].innerHTML = ItemData[value[i]].price + ' <img src="resources/textures/squid_coin.svg" width="18px" height="18px">';
            }

            let description = document.createElement("p");
            description.classList.add("shop-description");
            description.textContent = "Hover over an item to learn about it";
            shopContent.appendChild(description);

            shopContent.appendChild(document.createElement("br"));

            let leavebutton = document.createElement("button");
            leavebutton.classList.add("shop-leave-button");
            leavebutton.textContent = "Leave";
            shopContent.appendChild(leavebutton);

            shopsParent.appendChild(shopElem);
        }

        shopItems = document.getElementsByClassName("shop-button");
        for (let i = 0; i < shopItems.length; i++){
            let shopItem = shopItems[i].getAttribute("item");
            shopItems[i].onmouseover = (e) => {
                let descriptions = document.getElementsByClassName("shop-description");
                for (let j = 0; j < descriptions.length; j++) document.getElementsByClassName("shop-description")[j].innerHTML = "<b>" + ItemData[shopItem].name + ":</b> " + ItemData[shopItem].description;
            }
            shopItems[i].onmouseout = (e) => {
                let descriptions = document.getElementsByClassName("shop-description");
                for (let j = 0; j < descriptions.length; j++) document.getElementsByClassName("shop-description")[j].innerHTML = "Hover over an item to learn about it";
            }
            shopItems[i].onclick = (e) => {
                PurchaseItem(shopItem);
            }
        }
        shopLeaveButtons = document.getElementsByClassName("shop-leave-button");
        for (let i = 0; i < shopLeaveButtons.length; i++){
            shopLeaveButtons[i].onclick = LeaveShop;
        }

        Scene.background = SKYBOX_TEX;

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

        if (playerList){
            ClearPlayers();
            for (let i = 0; i < playerList.length; i++) AddPlayer(playerList[i]);
        }

        buildMap();
    });
}

const rad2Deg = 180 / Math.PI;
const deg2Rad = Math.PI / 180;
function generateMapAnimationMasks(){
    for (const [key, value] of Object.entries(EntityTiles)){
        let masks = [];
        let maskIndices = [];
        let baseMask = [];
        //Generate Mask without transformation
        for (let y = 0; y < mapData.length; y++){
            baseMask.push([]);
            for (let x = 0; x < mapData[y].length; x++){
                if (mapData[y][x].animation && mapData[y][x].animation.id == key){
                    baseMask[y].push(true);
                }
                else{
                    baseMask[y].push(false);
                }
            }
        }
        let anchor = MapAnimations[key].anchor;
        //Generate Transformed Masks
        for (let i = 0; i < MapAnimations[key].states.length; i++){
            let rotation = MapAnimations[key].states[i].rotation * deg2Rad;
            let translation = MapAnimations[key].states[i].translation;
            let mask = [];
            //Generate Blank Mask
            for (let y = 0; y < baseMask.length; y++){
                mask.push([]);
                for (let x = 0; x < baseMask[y].length; x++){
                    mask[y].push(null);
                }
            }
            //Fill mask with transformed tiles
            for (let y = 0; y < baseMask.length; y++){
                for (let x = 0; x < baseMask[y].length; x++){
                    if (baseMask[y][x]){
                        let angle = Math.atan2(y - anchor.y, x - anchor.x) + rotation;
                        let dist = Math.sqrt(Math.pow(x - anchor.x, 2) + Math.pow(y - anchor.y, 2));
                        let transformed = { x: Math.round(Math.cos(angle) * dist + anchor.x) + translation.x, y: Math.round(Math.sin(angle) * dist + anchor.y) + translation.z };
                        mask[transformed.y][transformed.x] = { x: x, y: y };
                    }
                }
            }
            //Add index of mask same number of times as it's duration
            masks.push(mask);
            for (let j = 0; j < MapAnimations[key].states[i].duration; j++){
                maskIndices.push(masks.length - 1);
            }
        }
        EntityTiles[key].masks = masks;
        EntityTiles[key].maskIndices = maskIndices;
    }
}

var MapMesh = null;
var BlockList = null;
var KeyDoors = null;
const LockTex = TexLoader.load("./resources/textures/lock.png");
LockTex.colorSpace = THREE.SRGBColorSpace;
LockTex.minFilter = THREE.NearestFilter;
LockTex.magFilter = THREE.NearestFilter;
const LockMat = new THREE.MeshBasicMaterial({ map: LockTex, alphaTest: 0.5 });
var MapLocks = new THREE.Group();
var EntityTiles = {};
function buildMap(){
    //Make sure everything is loaded first
    if (SilverStar == null || Star == null || KeyGateModel == null || GreenPipe == null || GoldPipe == null || DiceFont == null || UsernameFont == null ||
        AvatarDecorationsLoaded < AvatarDecorations.hair.length + AvatarDecorations.hat.length + AvatarDecorations.skin.length + AvatarDecorations.shirt.length
    ){
        console.log("Waiting for resources to load...");
        setTimeout(() => buildMap(), 100);
        return;
    }

    Star.children[1].material.envMap = SKYBOX_TEX;
    SilverStar.children[1].material.envMap = SKYBOX_TEX;

    let isReload = false;
    if (MapMesh != null){
        MapMesh.clear();
        Scene.remove(MapMesh);
        isReload = true;
    }
    if (BlockList != null){
        BlockList.clear();
        Scene.remove(BlockList);
        isReload = true;
    }
    if (KeyDoors != null){
        Scene.remove(KeyDoors);
        isReload = true;
    }
    MapMesh = null;
    BlockList = new THREE.Group();
    KeyDoors = new THREE.Group();
    MapLocks.clear();

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
        let animID = null;
        let extraHeight = 0;
        let anchor = null;
        if (mapData[y][x].animation){
            animID = mapData[y][x].animation.id;

            for (let i = 0; i < MapAnimations[animID].states.length; i++){
                let tempHeight = MapAnimations[animID].states[i].translation.y;
                if (tempHeight > extraHeight) extraHeight = tempHeight;
            }

            anchor = MapAnimations[animID].anchor;
        }

        let indexStart = animID == null ? vertices.length / 3 : entityGeometries[animID].vertices.length / 3;

        if (animID == null){
            if (ramp){
                let maxHeight = Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg);
                let minHeight = Math.min(mapData[y][x].height.pos, mapData[y][x].height.neg);
                let segments = Math.ceil(minHeight);
                let lastSegment = minHeight % 1;
                lastSegment = lastSegment == 0 ? 1 : lastSegment;

                if (dirX == -1){
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.w);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.w[0] : mapData[y][x].wallMaterial.w;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x - 0.5, minHeight, y - 0.5);
                    vertices.push(x - 0.5, minHeight, y + 0.5);
                    vertices.push(x - 0.5, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5));
                    uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    indices.push(indexStart, indexStart + 1, indexStart + 2);
                    indexStart += 3;

                    for (let i = segments - 1; i >= 0; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.w[Math.min(segments - i, mapData[y][x].wallMaterial.w.length - 1)] : mapData[y][x].wallMaterial.w;
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
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.e);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.e[0] : mapData[y][x].wallMaterial.e;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x + 0.5, minHeight, y - 0.5);
                    vertices.push(x + 0.5, minHeight, y + 0.5);
                    vertices.push(x + 0.5, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5));
                    uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    indices.push(indexStart, indexStart + 2, indexStart + 1);
                    indexStart += 3;    

                    for (let i = segments - 1; i >= 0; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.e[Math.min(segments - i, mapData[y][x].wallMaterial.e.length - 1)] : mapData[y][x].wallMaterial.e;
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
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.n);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.n[0] : mapData[y][x].wallMaterial.n;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};
                        
                    vertices.push(x - 0.5, minHeight, y - 0.5);
                    vertices.push(x + 0.5, minHeight, y - 0.5);
                    vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5), maxHeight, y - 0.5);
                    uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    indices.push(indexStart, indexStart + 2, indexStart + 1);
                    indexStart += 3;

                    for (let i = segments - 1; i >= 0; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.n[Math.min(segments - i, mapData[y][x].wallMaterial.n.length - 1)] : mapData[y][x].wallMaterial.n;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

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
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.s);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.s[0] : mapData[y][x].wallMaterial.s;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    vertices.push(x - 0.5, minHeight, y + 0.5);
                    vertices.push(x + 0.5, minHeight, y + 0.5);
                    vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5), maxHeight, y + 0.5);
                    uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    indices.push(indexStart, indexStart + 1, indexStart + 2);
                    indexStart += 3;

                    for (let i = segments - 1; i >= 0; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.s[Math.min(segments - i, mapData[y][x].wallMaterial.s.length - 1)] : mapData[y][x].wallMaterial.s;
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
                        if (x != 0 &&
                            ((!mapData[y][x-1].ramp && mapData[y][x-1].height >= i) || (mapData[y][x-1].ramp && Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg) >= i)) &&
                            !mapData[y][x-1].animation) break;
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
                        if (x != mapSize.x - 1 &&
                            ((!mapData[y][x+1].ramp && mapData[y][x+1].height >= i) || (mapData[y][x+1].ramp && Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg) >= i)) &&
                            !mapData[y][x+1].animation) break;
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
                        if (y != 0 &&
                            ((!mapData[y-1][x].ramp && mapData[y-1][x].height >= i) || (mapData[y-1][x].ramp && Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg) >= i)) &&
                            !mapData[y-1][x].animation) break;
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
                        if (y != mapSize.y - 1 &&
                            ((!mapData[y+1][x].ramp && mapData[y+1][x].height >= i) || (mapData[y+1][x].ramp && Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg) >= i)) &&
                            !mapData[y+1][x].animation) break;
                    }
                }
            }
        }
        else{
            if (ramp){
                let maxHeight = Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg);
                let minHeight = Math.min(mapData[y][x].height.pos, mapData[y][x].height.neg);
                let segments = Math.ceil(minHeight);
                let lastSegment = minHeight % 1;
                lastSegment = lastSegment == 0 ? 1 : lastSegment;

                if (dirX == -1){
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.w);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.w[0] : mapData[y][x].wallMaterial.w;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, minHeight, y - 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, minHeight, y + 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5) - anchor.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 2);
                    indexStart += 3;

                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.w[Math.min(segments - i, mapData[y][x].wallMaterial.w.length - 1)] : mapData[y][x].wallMaterial.w;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + (ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1)));
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 3);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 2);
                        indexStart += 4;
                    }
                }
                else if (dirX == 1){
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.e);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.e[0] : mapData[y][x].wallMaterial.e;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, minHeight, y - 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, minHeight, y + 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, maxHeight, y + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5) - anchor.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 1);
                    indexStart += 3;    

                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.e[Math.min(segments - i, mapData[y][x].wallMaterial.e.length - 1)] : mapData[y][x].wallMaterial.e;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 1);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 3);
                        indexStart += 4;
                    }
                }
                else if (dirY == -1){
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.n);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.n[0] : mapData[y][x].wallMaterial.n;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};
                        
                    entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, minHeight, y - 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, minHeight, y - 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5) - anchor.x, maxHeight, y - 0.5 - anchor.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? 0 : ATLAS_UV_SIZE.x), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 1);
                    indexStart += 3;

                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.n[Math.min(segments - i, mapData[y][x].wallMaterial.n.length - 1)] : mapData[y][x].wallMaterial.n;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 1);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 3);
                        indexStart += 4;
                    }
                }
                else if (dirY == 1){
                    let isArray = Array.isArray(mapData[y][x].wallMaterial.s);
                    let firstMatIndex = isArray ? mapData[y][x].wallMaterial.s[0] : mapData[y][x].wallMaterial.s;
                    let first_atlas_coord = {x: (firstMatIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(firstMatIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                    entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, minHeight, y + 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, minHeight, y + 0.5 - anchor.y);
                    entityGeometries[animID].vertices.push(x + (mapData[y][x].height.pos == maxHeight ? 0.5 : -0.5) - anchor.x, maxHeight, y + 0.5 - anchor.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + ATLAS_UV_SIZE.x, first_atlas_coord.y);
                    entityGeometries[animID].uvs.push(first_atlas_coord.x + (mapData[y][x].height.pos == maxHeight ? ATLAS_UV_SIZE.x : 0), first_atlas_coord.y + (ATLAS_UV_SIZE.y * Math.min(1, maxHeight - minHeight)));
                    entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 2);
                    indexStart += 3;

                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = isArray ? mapData[y][x].wallMaterial.s[Math.min(segments - i, mapData[y][x].wallMaterial.s.length - 1)] : mapData[y][x].wallMaterial.s;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 3);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 2);
                        indexStart += 4;
                    }
                }
            }
            else{
                let segments = Math.ceil(mapData[y][x].height);
                let lastSegment = mapData[y][x].height % 1;
                lastSegment = lastSegment == 0 ? 1 : lastSegment;
                if (dirX == -1){
                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = Array.isArray(mapData[y][x].wallMaterial.w) ? mapData[y][x].wallMaterial.w[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.w.length - 1)] : mapData[y][x].wallMaterial.w;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + (ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1)));
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 3);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 2);
                        indexStart += 4;
                    }
                }
                else if (dirX == 1){
                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = Array.isArray(mapData[y][x].wallMaterial.e) ? mapData[y][x].wallMaterial.e[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.e.length - 1)] : mapData[y][x].wallMaterial.e;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 1);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 3);
                        indexStart += 4;
                    }
                }
                else if (dirY == -1){
                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = Array.isArray(mapData[y][x].wallMaterial.n) ? mapData[y][x].wallMaterial.n[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.n.length - 1)] : mapData[y][x].wallMaterial.n;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};
                        
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y - 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 1);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 2, indexStart + 3);
                        indexStart += 4;
                    }
                }
                else if (dirY == 1){
                    for (let i = segments - 1; i >= -extraHeight; i--){
                        let matIndex = Array.isArray(mapData[y][x].wallMaterial.s) ? mapData[y][x].wallMaterial.s[Math.min(segments - 1 - i, mapData[y][x].wallMaterial.s.length - 1)] : mapData[y][x].wallMaterial.s;
                        let atlas_coord = {x: (matIndex % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: (Math.floor(matIndex / ATLAS_SIZE.x) / ATLAS_SIZE.y) + EPSILON};

                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i, y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x - 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].vertices.push(x + 0.5 - anchor.x, i + (i == segments-1 ? lastSegment : 1), y + 0.5 - anchor.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
                        entityGeometries[animID].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y * (i == segments-1 ? lastSegment : 1));
                        entityGeometries[animID].indices.push(indexStart, indexStart + 1, indexStart + 3);
                        entityGeometries[animID].indices.push(indexStart, indexStart + 3, indexStart + 2);
                        indexStart += 4;
                    }
                }
            }
        }
    }

    let entityGeometries = {};
    function buildEntityTile(x, y){
        let id = mapData[y][x].animation.id;
        let anchor = MapAnimations[id].anchor;

        if (!Object.hasOwn(entityGeometries, id)){
            Object.defineProperty(entityGeometries, id, { writable: true, enumerable: true, configurable: true, value: {
                vertices: [],
                indices: [],
                uvs: []
            }});
        }

        let indexStart = entityGeometries[id].vertices.length / 3;
        let atlas_coord = {x: (mapData[y][x].material % ATLAS_SIZE.x) / ATLAS_SIZE.x + EPSILON, y: Math.floor(mapData[y][x].material / ATLAS_SIZE.x) / ATLAS_SIZE.y + EPSILON};

        if (mapData[y][x].ramp){
            let dirV = mapData[y][x].height.dir == "v";
            entityGeometries[id].vertices.push(x - 0.5 - anchor.x, mapData[y][x].height["neg"], y - 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x + 0.5 - anchor.x, mapData[y][x].height[dirV ? "neg" : "pos"], y - 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x - 0.5 - anchor.x, mapData[y][x].height[dirV ? "pos" : "neg"], y + 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x + 0.5 - anchor.x, mapData[y][x].height["pos"], y + 0.5 - anchor.y);
            entityGeometries[id].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y);
            entityGeometries[id].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y);
            entityGeometries[id].uvs.push(atlas_coord.x, atlas_coord.y);
            entityGeometries[id].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
            entityGeometries[id].indices.push(indexStart, indexStart + 3, indexStart + 1);
            entityGeometries[id].indices.push(indexStart, indexStart + 2, indexStart + 3);

            let avg = Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg);

            if (dirV && (x == 0 || 
                (!mapData[y][x-1].ramp && avg > mapData[y][x-1].height) || 
                (mapData[y][x-1].ramp && avg > (mapData[y][x-1].height.pos + mapData[y][x-1].height.neg) / 2) ||
                !mapData[y][x-1].animation)){
                buildWall(x, y, -1, 0, true);
            }
            if (dirV && (x == mapSize.x - 1 || 
                (!mapData[y][x+1].ramp && avg > mapData[y][x+1].height) || 
                (mapData[y][x+1].ramp && avg > (mapData[y][x+1].height.pos + mapData[y][x+1].height.neg) / 2) ||
                !mapData[y][x-1].animation)){
                buildWall(x, y, 1, 0, true);
            }
            if (!dirV && (y == 0 || 
                (!mapData[y-1][x].ramp && avg > mapData[y-1][x].height) || 
                (mapData[y-1][x].ramp && avg > (mapData[y-1][x].height.pos + mapData[y-1][x].height.neg) / 2) ||
                !mapData[y][x-1].animation)){
                buildWall(x, y, 0, -1, true);
            }
            if (!dirV && (y == mapSize.y - 1 || 
                (!mapData[y+1][x].ramp && avg > mapData[y+1][x].height) || 
                (mapData[y+1][x].ramp && avg > (mapData[y+1][x].height.pos + mapData[y+1][x].height.neg) / 2) ||
                !mapData[y][x-1].animation)){
                buildWall(x, y, 0, 1, true);
            }
        }
        else {
            entityGeometries[id].vertices.push(x - 0.5 - anchor.x, mapData[y][x].height, y - 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x + 0.5 - anchor.x, mapData[y][x].height, y - 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x - 0.5 - anchor.x, mapData[y][x].height, y + 0.5 - anchor.y);
            entityGeometries[id].vertices.push(x + 0.5 - anchor.x, mapData[y][x].height, y + 0.5 - anchor.y);
            entityGeometries[id].uvs.push(atlas_coord.x, atlas_coord.y + ATLAS_UV_SIZE.y);
            entityGeometries[id].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y + ATLAS_UV_SIZE.y);
            entityGeometries[id].uvs.push(atlas_coord.x, atlas_coord.y);
            entityGeometries[id].uvs.push(atlas_coord.x + ATLAS_UV_SIZE.x, atlas_coord.y);
            entityGeometries[id].indices.push(indexStart, indexStart + 3, indexStart + 1);
            entityGeometries[id].indices.push(indexStart, indexStart + 2, indexStart + 3);

            if (x == 0 || 
                (!mapData[y][x-1].ramp && mapData[y][x].height > mapData[y][x-1].height) || 
                (mapData[y][x-1].ramp && mapData[y][x].height > Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg)) ||
                !mapData[y][x-1].animation){
                buildWall(x, y, -1, 0, false);
            }
            if (x == mapSize.x - 1 || 
                (!mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height) || 
                (mapData[y][x+1].ramp && mapData[y][x].height > Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg)) ||
                !mapData[y][x+1].animation){
                buildWall(x, y, 1, 0, false);
            }
            if (y == 0 || 
                (!mapData[y-1][x].ramp && mapData[y][x].height > mapData[y-1][x].height) || 
                (mapData[y-1][x].ramp && mapData[y][x].height > Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg)) ||
                !mapData[y-1][x].animation){
                buildWall(x, y, 0, -1, false);
            }
            if (y == mapSize.y - 1 || 
                (!mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height) || 
                (mapData[y+1][x].ramp && mapData[y][x].height > Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg)) ||
                !mapData[y+1][x].animation){
                buildWall(x, y, 0, 1, false);
            }
        }
    }

    EntityTiles = {};
    if (MapAnimations){
        for (const [key, value] of Object.entries(MapAnimations)){
            Object.defineProperty(EntityTiles, key, { writable: true, enumerable: true, configurable: true, value: {
                mesh: null,
                masks: null,
                maskIndices: null
            }});
        }
        generateMapAnimationMasks();
    }

    for (let y = 0; y < mapData.length; y++){
        for (let x = 0; x < mapData[y].length; x++){
            if (mapData[y][x].height == 0) continue;

            if (Object.hasOwn(mapData[y][x], "animation")){
                buildEntityTile(x, y);
                continue;
            }

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

                if (x == 0 || 
                    (!mapData[y][x-1].ramp && mapData[y][x].height > mapData[y][x-1].height) || 
                    (mapData[y][x-1].ramp && mapData[y][x].height > Math.min(mapData[y][x-1].height.pos, mapData[y][x-1].height.neg)) ||
                    mapData[y][x-1].animation){
                    buildWall(x, y, -1, 0, false);
                }
                if (x == mapSize.x - 1 || 
                    (!mapData[y][x+1].ramp && mapData[y][x].height > mapData[y][x+1].height) || 
                    (mapData[y][x+1].ramp && mapData[y][x].height > Math.min(mapData[y][x+1].height.pos, mapData[y][x+1].height.neg)) ||
                    mapData[y][x+1].animation){
                    buildWall(x, y, 1, 0, false);
                }
                if (y == 0 || 
                    (!mapData[y-1][x].ramp && mapData[y][x].height > mapData[y-1][x].height) || 
                    (mapData[y-1][x].ramp && mapData[y][x].height > Math.min(mapData[y-1][x].height.pos, mapData[y-1][x].height.neg)) ||
                    mapData[y-1][x].animation){
                    buildWall(x, y, 0, -1, false);
                }
                if (y == mapSize.y - 1 || 
                    (!mapData[y+1][x].ramp && mapData[y][x].height > mapData[y+1][x].height) || 
                    (mapData[y+1][x].ramp && mapData[y][x].height > Math.min(mapData[y+1][x].height.pos, mapData[y+1][x].height.neg)) ||
                    mapData[y+1][x].animation){
                    buildWall(x, y, 0, 1, false);
                }
            }
            
            if ((mapData[y][x].connections.n || mapData[y][x].connections.s || mapData[y][x].connections.e || mapData[y][x].connections.w) && !mapData[y][x].animation){
                //Block placements
                if (x > 0 && !mapData[y][x].connections.w && !mapData[y][x].ramp){
                    //Place a block there
                    let height1 = getHeightTile(x, y);
                    let height2 = getHeightTile(x-1, y);
                    if (height1 > height2){
                        let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                        block.position.set(x - 0.5 + 1/16, mapData[y][x].height + 1/16, y);
                        block.castShadow = true;
                        block.receiveShadow = true;
                        BlockList.add(block);
                    }
                    else if (height1 == height2){
                        let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                        block.position.set(x - 0.5, mapData[y][x].height + 1/16, y);
                        block.castShadow = true;
                        block.receiveShadow = true;
                        BlockList.add(block);
                    }
                }
                if (x < mapSize.x - 1 && !mapData[y][x].connections.e && !mapData[y][x].ramp && getHeightTile(x, y) > getHeightTile(x+1, y)){
                    //Place a block there
                    let block = new THREE.Mesh(new THREE.BoxGeometry(1/8, 1/8, 1), BlockMat.clone());
                    block.position.set(x + 0.5 - 1/16, mapData[y][x].height + 1/16, y);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    BlockList.add(block);
                }
                if (y > 0 && !mapData[y][x].connections.n && !mapData[y][x].ramp){
                    //Place a block there
                    let height1 = getHeightTile(x, y);
                    let height2 = getHeightTile(x, y-1);
                    if (height1 > height2){
                        let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/8, 1/8), BlockMat.clone());
                        block.position.set(x, mapData[y][x].height + 1/16, y - 0.5 + 1/16);
                        block.castShadow = true;
                        block.receiveShadow = true;
                        BlockList.add(block);
                    }
                    else if (height1 == height2){
                        let block = new THREE.Mesh(new THREE.BoxGeometry(1, 1/8, 1/8), BlockMat.clone());
                        block.position.set(x, mapData[y][x].height + 1/16, y - 0.5);
                        block.castShadow = true;
                        block.receiveShadow = true;
                        BlockList.add(block);
                    }
                }
                if (y < mapSize.y - 1 && !mapData[y][x].connections.s && !mapData[y][x].ramp && getHeightTile(x, y) > getHeightTile(x, y+1)){
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
                        let angle = Math.atan2(mapData[y][x].height.pos - mapData[y][x].height.neg, 1);
                        if (x > 0 && mapData[y][x-1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                            let v = Math.sin(-angle/2);
                            extension += Math.abs(v) / 16;
                        }
                        if (x < mapSize.x - 1 && mapData[y][x+1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                            let v = Math.sin(-angle/2);
                            extension += Math.abs(v) / 16;
                        }
                        block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat.clone());
                        block.position.set(
                            x + ((1/32 - (extension/2)) * Math.sin(angle)),
                            (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)),
                            y - 0.5 + 1/32);
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
                        let angle = Math.atan2(mapData[y][x].height.pos - mapData[y][x].height.neg, 1);
                        if (x > 0 && mapData[y][x-1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                            let v = Math.sin(-angle/2);
                            extension += Math.abs(v) / 16;
                        }
                        if (x < mapSize.x - 1 && mapData[y][x+1].height == Math.max(mapData[y][x].height.pos, mapData[y][x].height.neg)){
                            let v = Math.sin(-angle/2);
                            extension += Math.abs(v) / 16;
                        }
                        block = new THREE.Mesh(new THREE.BoxGeometry(Math.sqrt(Math.pow(mapData[y][x].height.pos - mapData[y][x].height.neg, 2) + 1) + extension, 1/16, 1/16), TrimMat.clone());
                        block.position.set(
                            x + ((1/32 - (extension/2)) * Math.sin(angle)),
                            (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 + ((1/32 + (extension/2)) * Math.cos(angle)),
                            y + 0.5 - 1/32);
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

    for (const [key, value] of Object.entries(entityGeometries)){
        let entityGeometry = new THREE.BufferGeometry();
        entityGeometry.setIndex(value.indices);
        entityGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(value.vertices), 3));
        entityGeometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(value.uvs), 2));
        entityGeometry.computeVertexNormals();
        let entityMesh = new THREE.Mesh(entityGeometry, MapMat);
        entityMesh.castShadow = true;
        entityMesh.receiveShadow = true;
        Scene.add(entityMesh);
        entityMesh.position.set(MapAnimations[key].anchor.x, 0, MapAnimations[key].anchor.y);

        EntityTiles[key].mesh = entityMesh;
    }
    generateMapAnimationMasks();
    SetMapAnimationTransforms();
    
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.computeVertexNormals();

    MapMesh = new THREE.Mesh(geometry, MapMat);
    MapMesh.castShadow = true;
    MapMesh.receiveShadow = true;

    Scene.add(MapMesh);
    Scene.add(BlockList);
    Scene.add(KeyDoors);

    if (UIState != "editor"){
        Renderer.domElement.style.filter = "blur(10px) opacity(50%)";
        let angle = Date.now() / 10000;
        Camera.position.set(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        Camera.lookAt(new THREE.Vector3(mapSize.x / 2, 2.5, mapSize.y / 2));
    }

    if (UIState == "editor"){
        if (lastUIState != "editor") update();
    }
    else{
        if (!isReload){
            InitializeSocket();
            update();
        }
        else{
            getStatusTimeout(0);
        }
    }

    mapLoaded = true;
}

loadMap();

var ItemData = {
    doubledice: {
        name: "Double Dice",
        description: "Roll 2 dice and move their total value",
        url: "resources/textures/doubledice.png",
        price: 6,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/doubledice.png")
    },
    tripledice: {
        name: "Triple Dice",
        description: "Roll 3 dice and move their total value",
        url: "resources/textures/tripledice.png",
        price: 12,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/tripledice.png")
    },
    pipe: {
        name: "Warp Pipe",
        description: "Warps you to a random tile on the board",
        url: "resources/textures/pipe.png",
        price: 6,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/pipe.png")
    },
    goldpipe: {
        name: "Gold Pipe",
        description: "Warps you directly to the star",
        url: "resources/textures/goldpipe.png",
        price: 20,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/goldpipe.png")
    },
    customdice: {
        name: "Custom Dice",
        description: "Choose any number between 1 and 10 to roll",
        url: "resources/textures/customdice.png",
        price: 5,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/customdice.png")
    },
    tacticooler: {
        name: "Tacticooler",
        description: "Add 3 onto your next roll",
        url: "resources/textures/tacticooler.png",
        price: 3,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/tacticooler.png")
    },
    shophopbox: {
        name: "Shop Hop Box",
        description: "Warp to a random shop",
        url: "resources/textures/shophopbox.png",
        price: 6,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/shophopbox.png")
    },
    inkjet: {
        name: "Ink Jet",
        description: "Use to reach previously inaccessible areas",
        url: "resources/textures/inkjet.png",
        price: 3,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/inkjet.png")
    },
    key: {
        name: "Skeleton Key",
        description: "Can be used at locked gates to open them",
        url: "resources/textures/key.png",
        price: 3,
        usable: false,
        discardable: true,
        image: TexLoader.load("resources/textures/key.png")
    },
    duelingglove: {
        name: "KO Glove",
        description: "Choose someone to play a minigame to steal a star from",
        url: "resources/textures/duelingglove.png",
        price: 20,
        usable: true,
        discardable: true,
        image: TexLoader.load("resources/textures/duelingglove.png")
    },
    loadstone: {
        name: "Loadstone",
        description: "A rock that can't be discarded until used",
        url: "resources/textures/loadstone.png",
        price: 2,
        usable: true,
        discardable: false,
        image: TexLoader.load("resources/textures/loadstone.png")
    }
};

for (var [key, value] of Object.entries(ItemData)){
    value.image.colorSpace = THREE.SRGBColorSpace;
    value.image.minFilter = THREE.NearestFilter;
    value.image.magFilter = THREE.NearestFilter;
}

var keys = {};
window.onkeydown = function(e){ 
    keys[e.key] = true; 

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
    
    if (e.key == "t"){
        console.log(getMapTile(PlayerData.position.x, PlayerData.position.y));
    }

    if (e.keyCode == 27 && UIState == "editor"){
        //ESC
        navigator.clipboard.writeText(JSON.stringify(mapData, null, "\t"));
        console.log("COPY!!!!");
    }
}
window.onkeyup = function(e){ keys[e.key] = false; }

var StartingTile = { x: 15, y: 30 };
var ShopWarpTiles = [];

var PlayerData = {
    position: {
        x: 0,
        y: 0
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
    signup: document.getElementById("sign-up"),
    characterCreator: document.getElementById("character-creator"),
    checkin: document.getElementById("private-checkin"),
    waitMinigame: document.getElementById("waiting-minigame"),
    waitTurn: document.getElementById("waiting-turn"),
    minigame: document.getElementById("new-minigame"),
    globalLeaderboard: document.getElementById("global-leaderboard"),
    disconnected: document.getElementById("disconnected"),
    gameSelect: document.getElementById("game-select"),
    createGame: document.getElementById("create-game"),
    joinGame: document.getElementById("join-game")
};

const MinigameChatElement = document.getElementById("new-minigame-chat");
var isMinigameChatScrolledToBottom = true;
var DeltaTime = 0;
var mapLoaded = false;
function update(){
    if (mapLoaded){

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

        UpdatePlayerPositions();

        if (UIState == "editor") TestOrbitControls();

        Renderer.render(Scene, Camera);
    }

    requestAnimationFrame(update);
}

var TestOrbitRot = new THREE.Euler(0, 0, 0, "YXZ");
function TestOrbitControls(){
    Renderer.domElement.style.filter = "";
    if (!keys["Tab"]) return;
    if (keys["ArrowLeft"]){
        TestOrbitRot.y += DeltaTime * 3;
    }
    if (keys["ArrowRight"]){
        TestOrbitRot.y -= DeltaTime * 3;
    }
    if (keys["ArrowUp"]){
        TestOrbitRot.x += DeltaTime * 3;
    }
    if (keys["ArrowDown"]){
        TestOrbitRot.x -= DeltaTime * 3;
    }

    let xChange = 0;
    let yChange = 0;
    let hChange = 0;

    if (keys["a"]) xChange -= 10;
    if (keys["d"]) xChange += 10;
    if (keys["w"]) yChange -= 10;
    if (keys["s"]) yChange += 10;
    if (keys["Shift"]) hChange -= 5;
    if (keys[" "]) hChange += 5;

    Camera.setRotationFromEuler(TestOrbitRot);
    Camera.position.set(
        Camera.position.x + (Math.cos(TestOrbitRot.y) * DeltaTime * xChange * 1) + (Math.sin(TestOrbitRot.y) * DeltaTime * yChange),
        Camera.position.y + hChange * DeltaTime,
        Camera.position.z - (Math.sin(TestOrbitRot.y) * DeltaTime * xChange * 1) + (Math.cos(TestOrbitRot.y) * DeltaTime * yChange)
    );
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

    if (UIState == "override" || UIState == "editor"){
        if (lastUIState != "editor" && UIState == "editor"){
            Scene.add(mapSelectorBox);
            turnStep = "map";
            document.getElementsByClassName("debug-box")[0].style.display = "initial";
            document.getElementsByClassName("popups")[0].style.display = "none";
        }
        lastUIState = UIState;
        return;
    }

    if (UIState == "menu"){
        let playerTileHeight = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 1;
        let angle = REDUCED_MOTION ? Math.PI / 4 : Date.now() / 10000 % (Math.PI * 2);
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        cameraRot = new THREE.Euler(-Math.PI / 12, Math.PI / 2 - angle, 0, "YXZ");
    }
    else if (UIState == "orbit"){
        let playerTileHeight = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        let angle = Date.now() / 10000 % (Math.PI * 2);
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        cameraRot = new THREE.Euler(-Math.PI / 12, Math.PI / 2 - angle, 0, "YXZ");
    }
    else if (UIState == "player"){
        let playerTileHeight = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 0.125, Player.position.z + 1.5);
        cameraRot = new THREE.Euler(0, 0, 0, "YXZ");
    }
    else if (UIState == "roll"){
        let playerTileHeight = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 0.5, Player.position.z + 1.75);
        cameraRot = new THREE.Euler(0, 0, 0, "YXZ");
    }
    else if (UIState == "above"){
        let playerTileHeight = getMaxHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        playerRot = new THREE.Euler(-Math.PI / 2, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.02, PlayerData.position.y);
        cameraPos = new THREE.Vector3(Player.position.x, Player.position.y + 5, Player.position.z);
        cameraRot = new THREE.Euler(-Math.PI / 2, 0, 0, "YXZ");
    }
    else if (UIState == "map"){
        let playerTileHeight = getMaxHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        playerRot = new THREE.Euler(-Math.PI / 2, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.02, PlayerData.position.y);
        cameraPos = new THREE.Vector3(mapSize.x / 2 - 0.5, 32, mapSize.y / 2 - 0.5);
        cameraRot = new THREE.Euler(-Math.PI / 2, 0, 0, "YXZ");
    }
    else if (UIState == "doorn"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y - 1) + 0.4, PlayerData.position.y - 1 + 1.5);
        cameraRot = new THREE.Euler(0, 0, 0, "YXZ");
    }
    else if (UIState == "doors"){
        filter = 0;
        playerRot = new THREE.Euler(0, Math.PI, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y + 1) + 0.4, PlayerData.position.y + 1 - 1.5);
        cameraRot = new THREE.Euler(0, Math.PI, 0, "YXZ");
    }
    else if (UIState == "doore"){
        filter = 0;
        playerRot = new THREE.Euler(0, -Math.PI / 2, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x + 1 - 1.5, getHeightTile(PlayerData.position.x + 1, PlayerData.position.y) + 0.4, PlayerData.position.y);
        cameraRot = new THREE.Euler(0, -Math.PI / 2, 0, "YXZ");
    }
    else if (UIState == "doorw"){
        filter = 0;
        playerRot = new THREE.Euler(0, Math.PI / 2, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(PlayerData.position.x - 1 + 1.5, getHeightTile(PlayerData.position.x - 1, PlayerData.position.y) + 0.4, PlayerData.position.y);
        cameraRot = new THREE.Euler(0, Math.PI / 2, 0, "YXZ");
    }
    else if (UIState == "podium"){
        filter = 1;
        let angle = REDUCED_MOTION ? Math.PI / 2 : (Date.now() - resultsAnimEndTime) / 10000 % (Math.PI * 2) + (Math.PI / 2);
        cameraPos = new THREE.Vector3(PodiumPosition.x + (Math.cos(angle) * 2.5), getHeightTile(PodiumPosition.x, PodiumPosition.y) + 1.25, PodiumPosition.y + (Math.sin(angle) * 2.5));
        cameraRot = new THREE.Euler(-0.09966865249116202, Math.PI / 2 - angle, 0, "YXZ");
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(0, 0, 0);
    }
    else if (UIState == "tutorialstar"){
        let playerTileHeight = getHeightTile(PlayerData.position.x, PlayerData.position.y);
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(tutorialStarPos.x, tutorialStarPos.y, tutorialStarPos.z);
        cameraRot = new THREE.Euler(tutorialStarRot.x, tutorialStarRot.y, tutorialStarRot.z, "YXZ");
    }
    else if (UIState == "tutorialshop"){
        filter = 0;
        playerRot = new THREE.Euler(0, 0, 0);
        playerPos = new THREE.Vector3(PlayerData.position.x, playerTileHeight + 0.375, PlayerData.position.y);
        cameraPos = new THREE.Vector3(tutorialShopPos.x, tutorialShopPos.y, tutorialShopPos.z);
        cameraRot = new THREE.Euler(tutorialShopRot.x, tutorialShopRot.y, tutorialShopRot.z, "YXZ");
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

const OpponentMoveSpeed = 10;
function UpdatePlayerPositions(){
    let i = 0;
    let length = Object.values(OpponentPlayers).length;
    for (const [key, value] of Object.entries(OpponentPlayers)){
        i++;
        let targetPos;
        if (UIState == "above" || UIState == "map"){
            targetPos = new THREE.Vector3(value.position.x, getMaxHeightTile(value.position.x, value.position.y), value.position.y);
            targetPos.y += lerp(0.005, 0.015, i / length);
        }
        else{
            targetPos = new THREE.Vector3(value.position.x, 0, value.position.y);
            targetPos.z -= lerp(0.005, 0.2, i / length);
            targetPos.y = getVariableHeightTile(targetPos.x, targetPos.z) + 0.375;
        } 

        let dist = Math.sqrt(Math.pow(targetPos.x - value.object.position.x, 2) + Math.pow(targetPos.z - value.object.position.z, 2));
        value.object.setRotationFromEuler(Player.rotation);
        if (dist > 1.5){
            //TP them to position
            value.object.position.set(targetPos.x, targetPos.y, targetPos.z);
        }
        else if (dist > EPSILON) {
            let t = Math.max(Math.min(OpponentMoveSpeed * DeltaTime / dist, 1), 0);
            value.object.position.set(
                lerp(value.object.position.x, targetPos.x, t),
                lerp(value.object.position.y, targetPos.y, t),
                lerp(value.object.position.z, targetPos.z, t)
            );
        }
    }
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
        ss.children[0].material = SilverStar.children[0].material.clone();
        ss.children[1].material = SilverStar.children[1].material.clone();
        Scene.add(ss);
        PlayerSilverStarObjs.push(ss);
    }

    for (var i = 0; i < ServerSilverStars.length; i++){
        let starPos = getPositionTile(ServerSilverStars[i].x, ServerSilverStars[i].y);
        if (Math.round(starPos.x) == PlayerData.position.x && Math.round(starPos.z) == PlayerData.position.y){
            CollectSilverStar(i);
        }
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
    let starPos = getPositionTile(silverStar.x, silverStar.y);
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
        
        
        if (Math.round(starPos.x) == PlayerData.position.x && Math.round(starPos.z) == PlayerData.position.y){
            CollectSilverStar(ServerSilverStars.length - 1);
        }

        if (silverStarCameFromMinigame){
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
        let tilePos = getPositionTile(ServerSilverStars[i].x, ServerSilverStars[i].y);
        if (UIState == "map" || (UIState == "override" && turnStep == "step-map-anim")){
            pos = new THREE.Vector3(tilePos.x, tilePos.y + 0.2, tilePos.z);
            rot = new THREE.Euler(-Math.PI / 2, 0, Math.sin(Date.now() / 887 + ServerSilverStars[i].offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.002, 0.002, 0.002);
        }
        else if (UIState == "above"){
            pos = new THREE.Vector3(tilePos.x, tilePos.y + 0.2, tilePos.z);
            rot = new THREE.Euler(-Math.PI / 2, 0, Math.sin(Date.now() / 887 + ServerSilverStars[i].offset) * 0.1, "YXZ");
            scale = new THREE.Vector3(0.0015, 0.0015, 0.0015);
        }
        else{
            pos = new THREE.Vector3(tilePos.x, tilePos.y + (Math.sin(Date.now() / 750 + ServerSilverStars[i].offset) * 0.075) + 0.35, tilePos.z);
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

function SetMapAnimationTransforms(turn){
    if (turn < 0) return;
    for (const [key, value] of Object.entries(EntityTiles)){
        let index = getAnimTurnIndex(key, turn);
        value.mesh.position.set(
            MapAnimations[key].anchor.x + MapAnimations[key].states[index].translation.x,
            MapAnimations[key].states[index].translation.y,
            MapAnimations[key].anchor.y + MapAnimations[key].states[index].translation.z
        );
        value.mesh.setRotationFromEuler(new THREE.Euler(0, -MapAnimations[key].states[index].rotation * deg2Rad, 0));
    }
}

var playerTileAnim = null;
var playerTileHeight = null;
function TriggerStepMapAnimation(){
    animTimer = 4;
    UIState = "map";
    turnStep = "step-map-anim";
    let standingOnTile = getMapTile(PlayerData.position.x, PlayerData.position.y, ServerTurn);
    playerTileHeight = standingOnTile.ramp ? (standingOnTile.height.pos + standingOnTile.height.neg) / 2 : standingOnTile.height;
    playerTileAnim = standingOnTile.animation ? standingOnTile.animation.id : null;
    Scene.remove(PlayerObjects);
}
function StepMapAnimation(){
    const animLength = 4;
    animTimer -= DeltaTime;

    if (animTimer > animLength - 1){
        UIState = "map";
    }
    else if (animTimer > animLength - 3){
        let t = 1 - ((animTimer - animLength + 3) / 2);
        let eio = easeInOut(t);
        UIState = "override";
        if (playerTileAnim != null){
            let oldIndex = getAnimTurnIndex(playerTileAnim, ServerTurn);
            let newIndex = getAnimTurnIndex(playerTileAnim, ServerTurn + 1);
            let oldRot = MapAnimations[playerTileAnim].states[oldIndex].rotation;
            let rotation = (lerpRotationDeg(oldRot, MapAnimations[playerTileAnim].states[newIndex].rotation, eio) - oldRot) * deg2Rad;
            let translationX = lerp(MapAnimations[playerTileAnim].states[oldIndex].translation.x, MapAnimations[playerTileAnim].states[newIndex].translation.x, eio);
            let translationY = lerp(MapAnimations[playerTileAnim].states[oldIndex].translation.y, MapAnimations[playerTileAnim].states[newIndex].translation.y, eio);
            let translationZ = lerp(MapAnimations[playerTileAnim].states[oldIndex].translation.z, MapAnimations[playerTileAnim].states[newIndex].translation.z, eio);
            let angle = Math.atan2(PlayerData.position.y - MapAnimations[playerTileAnim].anchor.y, PlayerData.position.x - MapAnimations[playerTileAnim].anchor.x) + rotation;
            let dist = Math.sqrt(Math.pow(PlayerData.position.x - MapAnimations[playerTileAnim].anchor.x, 2) + Math.pow(PlayerData.position.y - MapAnimations[playerTileAnim].anchor.y, 2));
            Player.position.set(
                Math.cos(angle) * dist + MapAnimations[playerTileAnim].anchor.x + translationX,
                playerTileHeight + translationY + 0.02,
                Math.sin(angle) * dist + MapAnimations[playerTileAnim].anchor.y + translationZ
            );
        }
        for (const [key, value] of Object.entries(EntityTiles)){
            let oldIndex = getAnimTurnIndex(key, ServerTurn);
            let newIndex = getAnimTurnIndex(key, ServerTurn + 1);
            value.mesh.position.set(
                MapAnimations[key].anchor.x + lerp(MapAnimations[key].states[oldIndex].translation.x, MapAnimations[key].states[newIndex].translation.x, eio),
                lerp(MapAnimations[key].states[oldIndex].translation.y, MapAnimations[key].states[newIndex].translation.y, eio) - EPSILON,
                MapAnimations[key].anchor.y + lerp(MapAnimations[key].states[oldIndex].translation.z, MapAnimations[key].states[newIndex].translation.z, eio)
            );
            value.mesh.setRotationFromEuler(new THREE.Euler(0, -lerpRotationDeg(MapAnimations[key].states[oldIndex].rotation, MapAnimations[key].states[newIndex].rotation, eio) * deg2Rad, 0));
        }
    }
    else if (animTimer > animLength - 4){
        for (const [key, value] of Object.entries(EntityTiles)){
            let newIndex = getAnimTurnIndex(key, ServerTurn + 1);
            value.mesh.position.set(
                MapAnimations[key].anchor.x + MapAnimations[key].states[newIndex].translation.x,
                MapAnimations[key].states[newIndex].translation.y,
                MapAnimations[key].anchor.y + MapAnimations[key].states[newIndex].translation.z
            );
            value.mesh.setRotationFromEuler(new THREE.Euler(0, -MapAnimations[key].states[newIndex].rotation * deg2Rad, 0));
        }
    }
    else{
        UIState = "player";
        turnStep = "map-anim-end-turn";
        transitionValues.playerPos = Player.position;
        transitionValues.playerRot = Player.rotation;
        PlayerData.position = { x: Math.round(Player.position.x), y: Math.round(Player.position.z) };
        Scene.add(PlayerObjects);
    }
}

var mergedTurnAnimMasks = {};
function getMergedMapAnimMask(turn){
    if (!turn) turn = ServerTurn;
    if (Object.hasOwn(mergedTurnAnimMasks, turn)){
        return mergedTurnAnimMasks[turn];
    }
    else{
        let mergedMask = [];
        for (let y = 0; y < mapSize.y; y++){
            mergedMask.push([]);
            for (let x = 0; x < mapSize.x; x++){
                mergedMask[y].push(null);
            }
        }
        for (const [key, value] of Object.entries(EntityTiles)){
            let turnIndex = getAnimTurnIndex(key, turn);
            for (let y = 0; y < mapSize.y; y++){
                for (let x = 0; x < mapSize.x; x++){
                    if (value.masks[value.maskIndices[turnIndex]]) mergedMask[y][x] = value.masks[value.maskIndices[turnIndex]][y][x];
                }
            }
        }
        Object.defineProperty(mergedTurnAnimMasks, turn, {writable: true, enumerable: true, configurable: true, value: mergedMask});
        return mergedMask;
    }
}

function getMapTile(x, y, turn){
    if (MapAnimations != null && (mapData[y][x].animation || mapData[y][x].height == 0)){
        let mask = getMergedMapAnimMask(turn !== undefined ? turn : ServerTurn);
        if (mask[y][x]){
            return mapData[mask[y][x].y][mask[y][x].x];
        }
    }
    return mapData[y][x];
}

function getAnimTurnIndex(id, turn){
    if (turn !== undefined) return EntityTiles[id].maskIndices[(turn - 1) % EntityTiles[id].maskIndices.length];
    else return EntityTiles[id].maskIndices[(ServerTurn - 1) % EntityTiles[id].maskIndices.length];
}

function getHeightTile(x, y){
    let tile = getMapTile(x, y);
    return extractHeightTile(tile);
}

function extractHeightTile(tile){
    let baseHeight = tile.ramp ? (tile.height.pos + tile.height.neg) / 2 : tile.height;
    return baseHeight + (tile.animation ? MapAnimations[tile.animation.id].states[getAnimTurnIndex(tile.animation.id)].translation.y : 0);
}

function getMaxHeightTile(x, y){
    let tile = getMapTile(x, y);
    let baseHeight = tile.ramp ? Math.max(tile.height.pos, tile.height.neg) : tile.height;
    return baseHeight + (tile.animation ? MapAnimations[tile.animation.id].states[getAnimTurnIndex(tile.animation.id)].translation.y : 0);
}

function getVariableHeightTile(x, y){
    let tileX = Math.round(x);
    let tileY = Math.round(y);
    let tx = x - tileX + 0.5;
    let ty = y - tileY + 0.5;
    let tile = getMapTile(tileX, tileY);
    let baseHeight = tile.ramp ? (tile.height.dir == "v" ? lerp(tile.height.neg, tile.height.pos, ty) : lerp(tile.height.neg, tile.height.pos, tx)) : tile.height;
    return baseHeight + (tile.animation ? MapAnimations[tile.animation.id].states[getAnimTurnIndex(tile.animation.id)].translation.y : 0);
}

var tilePositions = {};
function getPositionTile(x, y){
    let tile = getMapTile(x, y);
    if (tile.animation){
        let mesh = EntityTiles[tile.animation.id].mesh;
        let height = (mapData[y][x].ramp ? (mapData[y][x].height.pos + mapData[y][x].height.neg) / 2 : mapData[y][x].height);
        let transformed = mesh.localToWorld(new THREE.Vector3(x - mesh.position.x, height, y - mesh.position.z));
        return { x: transformed.x, y: transformed.y, z: transformed.z };
    }
    return { x: x, y: getHeightTile(x, y), z: y };
}

function canMoveToTile(x, y, dirX, dirY){
    let newX = x + dirX;
    let newY = y + dirY;
    if (newX < 0 || newX >= mapSize.x || newY < 0 || newY >= mapSize.y) return false;
    let newTile = getMapTile(newX, newY);
    let newTileHeight = extractHeightTile(newTile);
    if (newTile.height == 0) return false;
    let oldTile = getMapTile(x, y);

    function connectionCheck(dir){
        let connection = oldTile.connections[dir];
        if (Array.isArray(connection)){
            for (let i = 0; i < connection.length; i++){
                if (connection[i].height){
                    if (newTileHeight == connection[i].height) return true;
                }
                else{
                    if (newTile.animation){
                        let animationMask = getMergedMapAnimMask();
                        if (animationMask[newY][newX] && animationMask[newY][newX].x == connection.x && animationMask[newY][newX].y == connection.y){
                            return true;
                        }
                    }
                    else{
                        if (newX == connection[i].x && newY == connection[i].y) return true;
                    }
                }
            }
            return false;
        }
        return connection == true || (connection == "lock" && doorUnlocked(x, y, dir));
    }

    if (oldTile.animation){
        let stateIndex = getAnimTurnIndex(oldTile.animation.id);
        if (Object.hasOwn(oldTile.animation.states[stateIndex], "connections")){
            return (dirX == -1 && oldTile.animation.states[stateIndex].connections.w == true) ||
                (dirX == 1 && oldTile.animation.states[stateIndex].connections.e == true) ||
                (dirY == -1 && oldTile.animation.states[stateIndex].connections.n == true) ||
                (dirY == 1 && oldTile.animation.states[stateIndex].connections.s == true);
        }
    }

    return (dirX == -1 && connectionCheck("w")) || 
        (dirX == 1 && connectionCheck("e")) ||
        (dirY == -1 && connectionCheck("n")) ||
        (dirY == 1 && connectionCheck("s"));

    /*return (dirX == -1 && (oldTile.connections.w == true || (oldTile.connections.w == "lock" && doorUnlocked(x, y, "w")))) ||
        (dirX == 1 && (oldTile.connections.e == true || (oldTile.connections.e == "lock" && doorUnlocked(x, y, "e")))) ||
        (dirY == -1 && (oldTile.connections.n == true || (oldTile.connections.n == "lock" && doorUnlocked(x, y, "n")))) ||
        (dirY == 1 && (oldTile.connections.s == true || (oldTile.connections.s == "lock" && doorUnlocked(x, y, "s"))));*/
}


var RollClick = false;
document.getElementsByClassName("roll-canvas-button")[0].onclick = function(e){
    RollClick = true;
}
document.getElementById("roll-button").onclick = function(e){
    if (turnStep == "menu"){
        turnStep = "roll";
        UIState = "roll";
        Scene.add(Dice[rollsRemaining - 1]);
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
const luckyItemOptions = ["doubledice", "tripledice", "tacticooler", "customdice", "shophopbox", "pipe", "key", "duelingglove"];
var luckyRouletteItems = [];
var cohoOptions = document.getElementsByClassName("coho-option");
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
                            Scene.add(Dice[rollsRemaining - 1]);
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
                    if (rollBonus){
                        lastAnimTimer += DeltaTime;
                    }
                    else{
                        for (var i = 0; i < Dice.length; i++){
                            Dice[i].scale.set(0, 0, 0);
                            Scene.remove(Dice[i]);
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
        var intersections = raycaster.intersectObjects(Scene.children, true);
        if (intersections.length > 0){
            //DO STUFF HERE!!!
            let intersectPos = new THREE.Vector2(Math.round(intersections[0].point.x), Math.round(intersections[0].point.z));
            if (intersectPos.x < 0 || intersectPos.x >= mapSize.x || intersectPos.y < 0 || intersectPos.y >= mapSize.y) return;
            DistanceAwayMap(intersectPos.x, intersectPos.y);
            mapSelectorBox.scale.set(1, 1, 1);
            
            let hitTile = getMapTile(intersectPos.x, intersectPos.y);
            if (!hitTile.ramp){
                mapSelectorBox.position.set(intersectPos.x, extractHeightTile(hitTile) + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(-Math.PI / 2, 0, 0);
                mapSelectorBox.scale.set(1, 1, 1);
            }
            else if (hitTile.height.dir == "v"){
                let angle = -Math.atan2(hitTile.height.pos - hitTile.height.neg, 1);
                mapSelectorBox.position.set(intersectPos.x, extractHeightTile(hitTile) + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(angle - (Math.PI / 2), 0, 0);
                mapSelectorBox.scale.set(1, Math.sqrt(Math.pow(hitTile.height.pos - hitTile.height.neg, 2) + 1), 1);
            }
            else{
                let angle = -Math.atan2(hitTile.height.pos - hitTile.height.neg, 1);
                mapSelectorBox.position.set(intersectPos.x, extractHeightTile(hitTile) + 0.05, intersectPos.y);
                mapSelectorBox.rotation.set(-Math.PI / 2, angle, 0);
                mapSelectorBox.scale.set(Math.sqrt(Math.pow(hitTile.height.pos - hitTile.height.neg, 2) + 1), 1, 1);
            }

            if (Object.hasOwn(hitTile, "popup") && hitTile.walkOver){
                if (hitTile.popup != openShopPreview){
                    if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
                    openShopPreview = hitTile.popup;
                    document.getElementById(openShopPreview + "-preview").style.display = "initial";

                    document.getElementsByClassName("leaderboard-button")[0].style.display = "none";
                    document.getElementsByClassName("help-button")[0].style.display = "none";
                    document.getElementsByClassName("options-button")[0].style.display = "none";
                }
            }
            else{
                if (openShopPreview != "") document.getElementById(openShopPreview + "-preview").style.display = "none";
                openShopPreview = "";

                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                document.getElementsByClassName("help-button")[0].style.display = "initial";
                document.getElementsByClassName("options-button")[0].style.display = "initial";
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
    else if (turnStep == "shop-hop-box-anim"){
        ShopHopBoxAnimation();
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
    else if (turnStep == "step-map-anim"){
        StepMapAnimation();
    }
    else if (turnStep == "results-anim"){
        ResultsAnimation();
    }
    else if (turnStep == "tutorial-give-anim"){
        TutorialGiveAnimation();
    }
    else if (turnStep == "loadstone-anim"){
        LoadstoneAnimation();
    }
    else if (turnStep == "popup"){
        let popup = getMapTile(PlayerData.position.x, PlayerData.position.y).popup;
        if (popup == "lucky-space"){
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
        else if (popup == "cohozuna-space"){
            if (cohoRoulette.style.display != "none"){
                luckyTimer += luckyClickTimer == -1 ? DeltaTime : DeltaTime * lerp(0, 0.85, Math.max(Math.min(luckyClickTimer - 1, 2), 0) / 2);
                let selectedIndex = Math.floor(luckyTimer * 15) % cohoOptions.length;
                for (var i = 0; i < cohoOptions.length; i++){
                    cohoOptions[i].classList.remove("coho-selected");
                    if (selectedIndex == i){
                        cohoOptions[i].classList.add("coho-selected");
                    }
                }
                luckyClickTimer = luckyClickTimer == -1 ? -1 : Math.max(0, luckyClickTimer - DeltaTime);
                if (luckyClickTimer == 0){
                    let cohoIndex = Number.parseInt(cohoOptions[selectedIndex].getAttribute("index"));
                    document.getElementById("cohozuna-roulette").style.display = "none";
                    document.getElementById("cohozuna-punishment").style.display = "initial";
                    document.getElementById("cohozuna-punishement-text").innerHTML = cohozunaPunishments[cohoIndex].punishmentText;
                    cohoNextFunction = cohozunaPunishments[cohoIndex].trigger;
                }
            }
        }
    }
    else if (turnStep == "end-turn" || turnStep == "map-anim-end-turn"){
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
};

document.getElementsByClassName("coho-stop-button")[0].onclick = function(e){
    document.getElementsByClassName("coho-stop-button")[0].disabled = true;
    luckyClickTimer = lerp(2, 4, Math.random());
};

const cohoRoulette = document.getElementById("cohozuna-roulette");
const cohozunaPunishments = [
    {
        losingWeight: 1.5,
        winningWeight: 0.5,
        wheelText: "Lose <b>10</b> <img class='coin-lucky-img' src='resources/textures/squid_coin.svg'>",
        punishmentText: "Looks like it's a shakedown for lunch money!<br>Give me 10 Coins!",
        cannotText: "What? You don't have any Coins!<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.coins == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[0].cannotText;
            }
            else{
                document.getElementById("coho-anim-container").innerHTML = '<span id="coho-text-anim" class="coho-lose-anim">-' +
                Math.min(PlayerData.coins, 10) +
                '<img src="resources/textures/coin_low_res.png" style="padding-left: 0.25vmin; width: 8vmin; height: 8vmin; image-rendering: pixelated;"></span>';
                PlayerData.coins = Math.max(PlayerData.coins - 10, 0);
                UpdatePlayerUI();
                UpdateLeaderboards();
                Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 0.5,
        winningWeight: 1.5,
        wheelText: "Lose <b>20</b> <img class='coin-lucky-img' src='resources/textures/squid_coin.svg'>",
        punishmentText: "Time for your deposit at the Coho Bank!<br>Fork over 20 Coins!",
        cannotText: "What? You don't have any Coins!<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.coins == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[1].cannotText;
            }
            else{
                document.getElementById("coho-anim-container").innerHTML = '<span id="coho-text-anim" class="coho-lose-anim">-' +
                Math.min(PlayerData.coins, 20) +
                '<img src="resources/textures/coin_low_res.png" style="padding-left: 0.25vmin; width: 8vmin; height: 8vmin; image-rendering: pixelated;"></span>';
                PlayerData.coins = Math.max(PlayerData.coins - 20, 0);
                UpdatePlayerUI();
                UpdateLeaderboards();
                Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 1,
        winningWeight: 1,
        wheelText: "Lose <b>Half</b> <img class='coin-lucky-img' src='resources/textures/squid_coin.svg'>",
        punishmentText: "Alright, pay up the 50% Coho tax!<br>Give me your Coins!",
        cannotText: "What? You don't have any Coins!<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.coins == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[2].cannotText;
            }
            else{
                let loss = Math.ceil(PlayerData.coins / 2);
                document.getElementById("coho-anim-container").innerHTML = '<span id="coho-text-anim" class="coho-lose-anim">-' +
                loss +
                '<img src="resources/textures/coin_low_res.png" style="padding-left: 0.25vmin; width: 8vmin; height: 8vmin; image-rendering: pixelated;"></span>';
                PlayerData.coins -= loss;
                UpdatePlayerUI();
                UpdateLeaderboards();
                Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 0,
        winningWeight: 1,
        wheelText: "Lose a <img class='coin-lucky-img' src='resources/textures/squid_star.svg'>",
        punishmentText: "Must suck to be you.<br>Hand over your Star!",
        cannotText: "What? You don't have a Star!<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.stars == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[3].cannotText;
            }
            else{
                document.getElementById("coho-anim-container").innerHTML = '<img id="coho-item-anim" class="coho-lose-anim" src="resources/textures/squid_star.svg">';
                PlayerData.stars -= 1;
                UpdatePlayerUI();
                UpdateLeaderboards();
                Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, stars: PlayerData.stars }));
                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 1,
        winningWeight: 1,
        wheelText: "Fill up on <b>Lodestones</b>",
        punishmentText: "I've got a present for you!<br>Make sure you take it with you!",
        cannotText: "What? You're full on Items!<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.items.length == 3){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[4].cannotText;
            }
            else{
                let html = "";
                let i = 0;
                while (PlayerData.items.length < 3){
                    i++;
                    PlayerData.items.push("loadstone");
                    html += '<img id="coho-item-anim" class="coho-get-anim coho-get-anim-'+i+'" src="resources/textures/loadstone.png">';
                }
                document.getElementById("coho-anim-container").innerHTML = html;
                UpdatePlayerUI();
                UpdateItemUI();

                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 1.5,
        winningWeight: 0.5,
        wheelText: "Lose an <b>Item</b>",
        punishmentText: "A birthday present for me?<br>Hand over an Item!",
        cannotText: "What! You don't have any Items?<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.items.length == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[5].cannotText;
            }
            else{
                let removeItem = PlayerData.items.splice(Math.floor(Math.random() * PlayerData.items.length), 1);
                document.getElementById("coho-anim-container").innerHTML = '<img id="coho-item-anim" class="coho-lose-anim" src="' + ItemData[removeItem].url + '">';
                UpdatePlayerUI();
                UpdateItemUI();

                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 0.5,
        winningWeight: 1.5,
        wheelText: "Lose All <b>Items</b>",
        punishmentText: "Turn inside out your pockets and give me everything!<br>Dump your Items on the ground!",
        cannotText: "What! You don't have any Items?<br>Get out of here!",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            if (PlayerData.items.length == 0){
                document.getElementById("cohozuna-cannot").style.display = "initial";
                document.getElementById("cohozuna-cannot-text").innerHTML = cohozunaPunishments[6].cannotText;
            }
            else{
                let html = '';
                for (let i = 0; i < PlayerData.items.length; i++){
                    html += '<img id="coho-item-anim" class="coho-lose-anim coho-lose-anim-'+(i+1)+'" src="' + ItemData[PlayerData.items[i]].url + '">'
                }
                PlayerData.items = [];
                document.getElementById("coho-anim-container").innerHTML = html;
                UpdatePlayerUI();
                UpdateItemUI();

                setTimeout(() => {
                    document.getElementById("cohozuna-goodbye").style.display = "initial";
                }, 3000);
            }
        }
    },
    {
        losingWeight: 1,
        winningWeight: 0,
        wheelText: "Gain <b>100</b> <img class='coin-lucky-img' src='resources/textures/squid_star.svg'>",
        punishmentText: "100 Stars?<br>Uh, uh... Look over THERE!",
        cannotText: "",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            CloseCohozuna();
        }
    },
    {
        losingWeight: 1,
        winningWeight: 0,
        wheelText: "Gain <b>1000</b> <img class='coin-lucky-img' src='resources/textures/squid_coin.svg'>",
        punishmentText: "1000 Coins?<br>Uh, uh... Look over THERE!",
        cannotText: "",
        trigger: function(){
            document.getElementById("cohozuna-punishment").style.display = "none";
            CloseCohozuna();
        }
    },
    {
        losingWeight: 1,
        winningWeight: 1,
        wheelText: "Warp to a Random Space",
        punishmentText: "Enjoy your forced free relocation!<br>Bwah ha ha!",
        cannotText: "",
        trigger: function(){
            PlayerData.position = RandomMapSpace();
            document.getElementById("cohozuna-punishment").style.display = "none";
            CloseCohozuna();
        }
    }
];

function CohoGenerateWheel(){
    let placementNRM = yourPlacement / (Object.keys(OpponentPlayers).length + 1);
    let totalWeight = 0;

    for (let i = 0; i < cohozunaPunishments.length; i++){
        totalWeight += lerp(cohozunaPunishments[i].winningWeight, cohozunaPunishments[i].losingWeight, placementNRM);
    }

    let usedIndicies = [];
    
    while (usedIndicies.length < cohoOptions.length){
        let random = Math.random() * totalWeight;
        let checkedWeight = 0;
        for (let i = 0; i < cohozunaPunishments.length; i++){
            checkedWeight += lerp(cohozunaPunishments[i].winningWeight, cohozunaPunishments[i].losingWeight, placementNRM);
            if (checkedWeight >= random && !usedIndicies.includes(i)){
                usedIndicies.push(i);
                break;
            }
        }
    }

    for (let i = 0; i < usedIndicies.length; i++){
        cohoOptions[i].innerHTML = cohozunaPunishments[usedIndicies[i]].wheelText;
        cohoOptions[i].setAttribute("index", usedIndicies[i]);
    }
}

function CloseCohozuna(){
    document.getElementById("cohozuna-space").style.animation = "cohozuna-close linear 2s";
    let cohoTextBoxes = document.getElementsByClassName("cohozuna-text-boxes")[0];
    for (let i = 0; i < cohoTextBoxes.children.length; i++){
        cohoTextBoxes.children[i].style.display = "none";
    }
    setTimeout(() => {
        EndTurn();
    }, 2000);
}

var cohoNextFunction = () => {};
const cohoNextButtons = document.getElementsByClassName("cohozuna-next");
for (let i = 0; i < cohoNextButtons.length; i++) cohoNextButtons[i].onclick = () => cohoNextFunction();

const cohoLeaveButtons = document.getElementsByClassName("coho-leave-button");
for (let i = 0; i < cohoLeaveButtons.length; i++) cohoLeaveButtons[i].onclick = CloseCohozuna;

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
            let thisTile = getMapTile(check.x, check.y);
            if (check.x == tx && check.y == ty){
                found = true;
                break;
            }
            else if (!checkedTiles[check.y][check.x]){
                checkedTiles[check.y][check.x] = true;
                let lowXTile = check.x > 0 ? getMapTile(check.x - 1, check.y) : null;
                let highXTile = check.x < mapSize.x - 1 ? getMapTile(check.x + 1, check.y) : null;
                let lowYTile = check.y > 0 ? getMapTile(check.x, check.y - 1) : null;
                let highYTile = check.y < mapSize.y - 1 ? getMapTile(check.x, check.y + 1) : null;
                if (lowXTile && (thisTile.animation ? thisTile.animation.states[getAnimTurnIndex(thisTile.animation.id)].connections.w : thisTile.connections.w) && lowXTile.height !== 0){
                    checkList.push({x: check.x - 1, y: check.y});
                }
                if (highXTile && (thisTile.animation ? thisTile.animation.states[getAnimTurnIndex(thisTile.animation.id)].connections.e : thisTile.connections.e) && highXTile.height !== 0){
                    checkList.push({x: check.x + 1, y: check.y});
                }
                if (lowYTile && (thisTile.animation ? thisTile.animation.states[getAnimTurnIndex(thisTile.animation.id)].connections.n : thisTile.connections.n) && lowYTile.height !== 0){
                    checkList.push({x: check.x, y: check.y - 1});
                }
                if (highYTile && (thisTile.animation ? thisTile.animation.states[getAnimTurnIndex(thisTile.animation.id)].connections.s : thisTile.connections.s) && highYTile.height !== 0){
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
    UpdateMusicPlaylist();

    if (UIState == "editor" && keys["Tab"]){
        raycaster.setFromCamera(pointer, Camera);
        var intersections = raycaster.intersectObjects(Scene.children, false);

        if (intersections.length > 0){
            let intersectPos = new THREE.Vector2(Math.round(intersections[0].point.x), Math.round(intersections[0].point.z));
            if (intersectPos.x < 0 || intersectPos.x >= mapSize.x || intersectPos.y < 0 || intersectPos.y >= mapSize.y) return;
            //let newMat = Number.parseInt(prompt("Enter New Material", mapData[intersectPos.y][intersectPos.x].material));
            //let spawnable = window.confirm("Spawnable? " + mapData[intersectPos.y][intersectPos.x].silverStarSpawnable);

            document.getElementById("debug-text-input").value = JSON.stringify(mapData[intersectPos.y][intersectPos.x], null, "\t");
            targetDebugPos = intersectPos;
            console.log(intersectPos);
        }
    }
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
        document.getElementsByClassName("left-move-button")[0].style.display = canMoveToTile(PlayerData.position.x, PlayerData.position.y, -1, 0) ? "initial" : "none";
        document.getElementsByClassName("right-move-button")[0].style.display = canMoveToTile(PlayerData.position.x, PlayerData.position.y, 1, 0) ? "initial" : "none";
        document.getElementsByClassName("up-move-button")[0].style.display = canMoveToTile(PlayerData.position.x, PlayerData.position.y, 0, -1) ? "initial" : "none";
        document.getElementsByClassName("down-move-button")[0].style.display = canMoveToTile(PlayerData.position.x, PlayerData.position.y, 0, 1) ? "initial" : "none";
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
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        
        if (x < 0 || y < 0 || x > mapSize.x - 1 || y > mapSize.y - 1) return;

        if (canMoveToTile(PlayerData.position.x, PlayerData.position.y, xOffset, yOffset)){
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
            let newTile = getMapTile(PlayerData.position.x, PlayerData.position.y);
            spacesMoved++;
            SetMoveUI();
            
            //Test if space has a silver star on it
            for (let i = 0; i < ServerSilverStars.length; i++){
                if (PlayerData.collectedSilverStars.includes(i)) continue;
                let silverStarTilePos = getPositionTile(ServerSilverStars[i].x, ServerSilverStars[i].y);
                if (Math.round(silverStarTilePos.x) == PlayerData.position.x && Math.round(silverStarTilePos.z) == PlayerData.position.y){
                    //Collect it
                    CollectSilverStar(i);
                    break;
                }
            }

            if (Object.hasOwn(newTile, "popup") && newTile.walkOver){
                //Trigger Popup
                OpenPopup();
            }

            Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, position: PlayerData.position }));
        }
        else if (PlayerData.items.includes("key") && 
        ((xOffset == -1 && tile.connections.w == "lock") || 
        (xOffset == 1 && tile.connections.e == "lock") ||
        (yOffset == -1 && tile.connections.n == "lock") ||
        (yOffset == 1 && tile.connections.s == "lock"))){
            UIState = xOffset == 0 ? (yOffset == 1 ? "doors" : "doorn") : (xOffset == 1 ? "doore" : "doorw");
            turnStep = "key";
            document.getElementById("key-door").style.display = "initial";
            targetLockedDoor = { x: PlayerData.position.x, y: PlayerData.position.y, 
                dir: (tile.connections.w == "lock" ? "w" : (tile.connections.e == "lock" ? "e" : (tile.connections.n == "lock" ? "n" : "s"))), 
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
        Scene.remove(Dice[rollsRemaining - 1]);
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
        let updatePlayerMessage = { method: "update_player", token: TOKEN, position: data.position };
        spacesMoved--;
        PlayerData.position = data.position;
        if (PlayerData.stars != data.stars){
            PlayerData.stars = data.stars;
            Object.defineProperty(updatePlayerMessage, "stars", { writable: true, enumerable: true, configurable: true, value: PlayerData.stars });
        }
        if (PlayerData.coins != data.coins){
            PlayerData.coins = data.coins;
            Object.defineProperty(updatePlayerMessage, "coins", { writable: true, enumerable: true, configurable: true, value: PlayerData.coins });
        }
        PlayerData.items = data.items;
        if (PlayerData.collectedSilverStars > data.collectedSilverStars) UncollectLatestSilverStar();
        unlockedDoors = data.unlockedDoors;
        PlayerData.canDuel = data.canDuel;
        PlayerData.canSteal = data.canSteal;
        PlayerData.isStealing = data.isStealing;
        UpdatePlayerUI();
        UpdateItemUI();
        SetMoveUI();

        Socket.send(JSON.stringify(updatePlayerMessage));
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
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementById(tile.popup).style.display = "initial";
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
        itemElems[i].disabled = !(PlayerData.items.length > i) || (!ItemData[PlayerData.items[i]].usable && turnStep != "popup") || (!ItemData[PlayerData.items[i]].discardable && turnStep == "popup");
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
    itemElems[0].disabled = !ItemData[item4].discardable;
    itemElems[0].style.backgroundImage = "url(\"" + ItemData[item4].url + "\")";
    for (var i = 1; i < 4; i++){
        itemElems[i].disabled = !ItemData[PlayerData.items[i - 1]].discardable;
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
                    TriggerShopHopBoxAnimation(loc);
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, position: loc, items: PlayerData.items }));
                    break;
                case "duelingglove":
                    document.getElementById("duel-select").style.display = "initial";
                    document.getElementById("duel-select-list-page").style.display = "none";
                    document.getElementById("duel-select-wait-page").style.display = "block";
                    document.getElementById("duel-select-sub-text").textContent = "Choose a player to steal a star from";
                    Socket.send(JSON.stringify({ method: "get_target_list" }));
                    break;
                case "loadstone":
                    //TODO!!!
                    let amount = Math.floor(Math.random() * 3) + 1;
                    PlayerData.coins += amount;
                    TriggerLoadstoneAnimation(amount);
                    Socket.send(JSON.stringify({ method: "set_player_data", token: TOKEN, usedItem: item, items: PlayerData.items, coins: PlayerData.coins }));
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
        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
        UpdateLeaderboards();
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
        case "duelingglove":
            break;
        case "loadstone":
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
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        if (Object.hasOwn(tile, "popup") && !tile.walkOver){
            EndTurnPopup();
        }
        else if (Object.hasOwn(tile, "coins")){
            TriggerCoinSpaceAnimation(tile.coins);
        }
        else{
            EndTurn();
        }
    }
}

var shopItems;
var shopLeaveButtons;

function LeaveShop(){
    ClosePopup();
}

function EndTurn(){
    document.getElementById("roll-button-item-preview").style.display = "none";
    let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
    if (PlayerSilverStarObjs.length >= 5) {
        TriggerSilverStarsToStarAnimation();
    }
    else if (Object.keys(MapAnimations).length > 0 && turnStep != "map-anim-end-turn") {
        if (turnStep == "popup") document.getElementById(tile.popup).style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        TriggerStepMapAnimation();
    }
    else if (PlayerData.roll == spacesMoved) {
        if (turnStep == "popup") document.getElementById(tile.popup).style.display = "none";
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
    }
}

function OpenPopup(){
    let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);

    document.getElementsByClassName("board-inputs")[0].style.display = "none";
    document.getElementById(tile.popup).style.display = "initial";
    document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
    turnStep = "popup";
    UIState = "player";
    document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
    document.getElementsByClassName("move-undo-button")[0].style.display = "none";

    if (tile.popup == "star-1"){
        document.getElementsByClassName("purchase-star-button")[0].textContent = PlayerData.coins >= 20 ? "Yes" : "Not enough coins";
        document.getElementsByClassName("purchase-star-button")[0].disabled = PlayerData.coins < 20;
    }
    else if (tile.popup == "star-1"){
        document.getElementsByClassName("purchase-1-star-button")[0].disabled = PlayerData.coins < 20;
        document.getElementsByClassName("purchase-2-star-button")[0].disabled = PlayerData.coins < 40;
    }
    else if (tile.popup.split("-")[0] == "shop"){
        //Enable/Disable Buttons
        for (var i = 0; i < shopItems.length; i++){
            shopItems[i].disabled = ItemData[shopItems[i].getAttribute("item")].price > PlayerData.coins;
        }
    }
    else if (tile.popup == "duel"){
        duelButtons[0].disabled = PlayerData.coins < 10;
        duelButtons[1].disabled = PlayerData.coins <= 0;
        duelButtons[2].disabled = PlayerData.stars < 1;

        document.getElementById("canduel").style.display = PlayerData.canDuel ? "inline-block" : "none";
        document.getElementById("cantduel").style.display = PlayerData.canDuel ? "none" : "inline-block";
    }
    else if (tile.popup == "star-steal"){
        document.getElementById("star-steal-steal-button").disabled = PlayerData.coins < 20;

        document.getElementById("cansteal").style.display = PlayerData.canSteal ? "inline-block" : "none";
        document.getElementById("cantsteal").style.display = PlayerData.canSteal ? "none" : "inline-block";
    }
}
function ClosePopup(){
    let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
    document.getElementById(tile.popup).style.display = "none";
    if (tile.walkOver){
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
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "initial";
        turnStep = "popup";
        UIState = "player";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";

        if (tile.popup == "lucky-space"){
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
        else if (tile.popup == "cohozuna-space"){
            document.getElementById("cohozuna-space").style.display = "none";
            setTimeout(() => {
                document.getElementById("cohozuna-space").style.display = "initial";
                document.getElementsByClassName("coho-stop-button")[0].disabled = false;
                document.getElementById("cohozuna-space").style.animation = "";
                luckyTimer = 0;
                luckyClickTimer = -1;
                CohoGenerateWheel();
                document.getElementById("cohozuna-player").src = GeneratePlayerURL(PlayerCharacter);
                document.getElementById("cohozuna-greeting-text").innerHTML = cohoGreetings[Math.floor(Math.random() * cohoGreetings.length)];

                if (Math.random() >= lerp(1, CohoGenerosityOdds, yourPlacement / (Object.keys(OpponentPlayers).length + 1) * 2 - 1)){
                    setTimeout(() => {
                        document.getElementById("cohozuna-greeting").style.display = "initial";
                        cohoNextFunction = () => {
                            document.getElementById("cohozuna-greeting").style.display = "none";
                            document.getElementById("cohozuna-charity").style.display = "initial";
                            cohoNextFunction = () => {
                                document.getElementById("cohozuna-charity").style.display = "none";

                                document.getElementById("coho-anim-container").innerHTML = '<span id="coho-text-anim" class="coho-get-anim" style="display: initial;">+10<img src="resources/textures/coin_low_res.png" style="padding-left: 0.25vmin; width: 8vmin; height: 8vmin; image-rendering: pixelated;"></span>';
                                PlayerData.coins += 10;
                                UpdatePlayerUI();
                                UpdateLeaderboards();
                                Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));

                                setTimeout(() => {
                                    document.getElementById("cohozuna-charity-goodbye").style.display = "initial";
                                }, 3000);
                            };
                        };
                    }, 4000);
                }
                else{
                    setTimeout(() => {
                        document.getElementById("cohozuna-greeting").style.display = "initial";
                        cohoNextFunction = () => {
                            document.getElementById("cohozuna-greeting").style.display = "none";
                            document.getElementById("cohozuna-roulette").style.display = "initial";
                        };
                    }, 4000);
                }
            }, 1000);
        }
    }
}

const CohoGenerosityOdds = 0.5;
var cohoGreetings = [
    "Today's your lucky day!<br>You're today's lucky contestant on ol' Coho's gameshow:<br><i>\"Give Me All Your Money!\"</i>",
    "How nice of you to drop by to donate to the<br><i>Coho needs a 17th yacht fund!</i>",
    "I'm feeling generous today,<br>I'll only beat you <i>half</i> to death instead of all the way!",
    "You know, sometimes it gets lonley here, all alone...<br>But then a sucker like you shows up<br>And all of a sudden my day's great!"
];

var shopItemBuffer = "";
function PurchaseItem(item){
    if (turnStep == "popup" && PlayerData.coins >= ItemData[item].price){
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        if (PlayerData.items.length == 3){
            shopItemBuffer = item;
            document.getElementsByClassName("item-menu")[0].style.display = "initial";
            document.getElementById(tile.popup).style.display = "none";
            UpdateItemUI();
        }
        else{
            PlayerData.coins -= ItemData[item].price;
            document.getElementById(tile.popup).style.display = "none";
            //EndTurn();
            //UpdateItemUI();
            UpdatePlayerUI();
            TriggerGiveItemAnimation(item, true);
            Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
            UpdateLeaderboards();
        }
    }
}

function PurchaseStar(){
    if (turnStep == "popup" && PlayerData.coins >= 20){
        PlayerData.coins -= 20;
        PlayerData.stars++;
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "none";
        TriggerStarGetAnimation(true, 1);
        PlayerData.canDuel = true;
        PlayerData.canSteal = true;
        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins, stars: PlayerData.stars }));
        UpdateLeaderboards();
    }
}
function Purchase2Stars(){
    if (turnStep == "popup" && PlayerData.coins >= 40){
        PlayerData.coins -= 40;
        PlayerData.stars += 2;
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "none";
        TriggerStarGetAnimation(true, 2);
        PlayerData.canDuel = true;
        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins, stars: PlayerData.stars }));
        UpdateLeaderboards();
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

    minigameCoinGiveCheck = false;
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

    minigameCoinGiveCheck = false;
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
        let tile = getMapTile(result.x, result.y);
        if (tile.height !== 0 && !(!tile.connections.n && !tile.connections.s && !tile.connections.e && !tile.connections.w)){
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
    Scene.add(GreenPipe);
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
        let eio = easeInOut(t);
        Player.position.set(endPlayerPos.x, 0, endPlayerPos.z);
        GreenPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.1, 0.6, t), startPlayerPos.z);
        Camera.position.set(lerp(startPlayerPos.x, endPlayerPos.x, eio), lerp(startPlayerPos.y + 0.125, endPlayerPos.y + 0.125, eio), lerp(startPlayerPos.z + 1.5, endPlayerPos.z + 1.5, eio));
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
        Scene.remove(GreenPipe);
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

        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, position: PlayerData.position }));
    }
}
var StarWarpLocation = { x: 6, y: 7 };
function TriggerGoldPipeWarpAnimation(){
    UIState = "override";
    turnStep = "gold-pipe-warp-anim";
    animTimer = 6;
    pipeWarpLocation = StarWarpLocation;
    Scene.add(GoldPipe);
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
        let eio = easeInOut(t);
        Player.position.set(endPlayerPos.x, 0, endPlayerPos.z);
        GoldPipe.position.set(startPlayerPos.x, startPlayerPos.y - 0.375 - lerp(0.1, 0.6, t), startPlayerPos.z);
        Camera.position.set(lerp(startPlayerPos.x, endPlayerPos.x, eio), lerp(startPlayerPos.y + 0.125, endPlayerPos.y + 0.125, eio), lerp(startPlayerPos.z + 1.5, endPlayerPos.z + 1.5, eio));
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
        Scene.remove(GoldPipe);
        UIState = "player";
        PlayerData.position = { x: pipeWarpLocation.x, y: pipeWarpLocation.y };
        
        transitionValues.cameraPos = Camera.position;
        transitionValues.cameraRot = Camera.rotation;
        transitionValues.playerPos = Player.position;
        transitionValues.playerRot = Player.rotation;

        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";

        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, position: PlayerData.position }));
    }
}
const shopHopBoxTex = TexLoader.load("./resources/textures/shophopboxmodel.png");
const shopHopBoxTexInner = TexLoader.load("./resources/textures/shophopboxmodelinner.png");
shopHopBoxTex.magFilter = THREE.NearestFilter;
shopHopBoxTex.minFilter = THREE.NearestFilter;
shopHopBoxTex.colorSpace = THREE.SRGBColorSpace;
shopHopBoxTexInner.magFilter = THREE.NearestFilter;
shopHopBoxTexInner.minFilter = THREE.NearestFilter;
shopHopBoxTexInner.colorSpace = THREE.SRGBColorSpace;
const ShopHopBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ map: shopHopBoxTex, alphaTest: 0.5, side: THREE.DoubleSide }));
ShopHopBox.add(new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), new THREE.MeshStandardMaterial({ map: shopHopBoxTexInner })));
function TriggerShopHopBoxAnimation(location){
    UIState = "override";
    turnStep = "shop-hop-box-anim";
    animTimer = 5.4;
    pipeWarpLocation = location;

    Scene.add(ShopHopBox);
    ShopHopBox.scale.set(0, 0, 0);
    ShopHopBox.children[0].scale.set(0, 0, 0);
}
function ShopHopBoxAnimation(){
    const animLength = 5.4;
    animTimer -= DeltaTime;

    let startPlayerPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);
    let endPlayerPos = new THREE.Vector3(pipeWarpLocation.x, getHeightTile(pipeWarpLocation.x, pipeWarpLocation.y) + 0.375, pipeWarpLocation.y);

    if (animTimer > animLength - 0.5){
        let t = 1 - ((animTimer - animLength + 0.5) / 0.5);
        let eo = easeOut(t);
        ShopHopBox.scale.set(lerp(0, 0.4, eo), lerp(0, 0.4, eo), lerp(0, 0.4, eo));
        ShopHopBox.position.set(startPlayerPos.x, startPlayerPos.y + 0.5, startPlayerPos.z);
        Camera.position.set(startPlayerPos.x, startPlayerPos.y + 0.125, startPlayerPos.z + 1.5);
        Camera.setRotationFromEuler(new THREE.Euler(0, 0, 0, "YXZ"));
    }
    else if (animTimer > animLength - 0.75){
        ShopHopBox.scale.set(0.4, 0.4, 0.4);
    }
    else if (animTimer > animLength - 0.9){
        let t = 1 - ((animTimer - animLength + 0.9) / 0.15);
        let eo = easeOut(t);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0, 0.3, t), startPlayerPos.z);
        ShopHopBox.scale.set(lerp(0.4, 0.5, t), lerp(0.4, 0.5, t), lerp(0.4, 0.5, t));
    }
    else if (animTimer > animLength - 1.05){
        let t = 1 - ((animTimer - animLength + 1.05) / 0.15);
        Player.position.set(startPlayerPos.x, startPlayerPos.y + lerp(0.3, 0.5, t), startPlayerPos.z);
        Player.scale.set(lerp(1, 0.4, t), lerp(1, 0.4, t), lerp(1, 0.4, t));
        ShopHopBox.scale.set(lerp(0.5, 0.4, t), lerp(0.5, 0.4, t), lerp(0.5, 0.4, t));
        ShopHopBox.children[0].scale.set(lerp(0, 1, t), lerp(0, 1, t), lerp(0, 1, t));
    }
    else if (animTimer > animLength - 1.25){
        Player.position.set(startPlayerPos.x, startPlayerPos.y + 0.5, startPlayerPos.z);
        Player.scale.set(0, 0, 0);
        ShopHopBox.scale.set(0.4, 0.4, 0.4);
        ShopHopBox.children[0].scale.set(1, 1, 1);
    }
    else if (animTimer > animLength - 1.75){
        let t = 1 - ((animTimer - animLength + 1.75) / 0.5);
        let ei = easeIn(t);
        ShopHopBox.scale.set(lerp(0.4, 0, ei), lerp(0.4, 0, ei), lerp(0.4, 0, ei));
    }
    else if (animTimer > animLength - 3.75){
        let t = 1 - ((animTimer - animLength + 3.75) / 2);
        let eio = easeInOut(t);
        Camera.position.set(lerp(startPlayerPos.x, endPlayerPos.x, eio), lerp(startPlayerPos.y, endPlayerPos.y, eio) + 0.125, lerp(startPlayerPos.z, endPlayerPos.z, eio) + 1.5);
        ShopHopBox.scale.set(0, 0, 0);
    }
    else if (animTimer > animLength - 4.25){
        let t = 1 - ((animTimer - animLength + 4.25) / 0.5);
        let eo = easeOut(t);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + 0.5, endPlayerPos.z);
        Camera.position.set(endPlayerPos.x, endPlayerPos.y + 0.125, endPlayerPos.z + 1.5);
        ShopHopBox.position.set(endPlayerPos.x, endPlayerPos.y + 0.5, endPlayerPos.z);
        ShopHopBox.scale.set(lerp(0, 0.4, eo), lerp(0, 0.4, eo), lerp(0, 0.4, eo));
    }
    else if (animTimer > animLength - 4.5){
        ShopHopBox.scale.set(0.4, 0.4, 0.4);
    }
    else if (animTimer > animLength - 4.65){
        let t = 1 - ((animTimer - animLength + 4.65) / 0.15);
        ShopHopBox.scale.set(lerp(0.4, 0.5, t), lerp(0.4, 0.5, t), lerp(0.4, 0.5, t));
    }
    else if (animTimer > animLength - 4.8){
        let t = 1 - ((animTimer - animLength + 4.8) / 0.15);
        let eo = easeOut(t);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + lerp(0.5, 0.7, eo), endPlayerPos.z);
        Player.scale.set(lerp(0.4, 1, eo), lerp(0.4, 1, eo), lerp(0.4, 1, eo));
        ShopHopBox.scale.set(lerp(0.5, 0.4, t), lerp(0.5, 0.4, t), lerp(0.5, 0.4, t));
        ShopHopBox.children[0].scale.set(lerp(1, 0, t), lerp(1, 0, t), lerp(1, 0, t));
    }
    else if (animTimer > animLength - 5){
        let t = 1 - ((animTimer - animLength + 5) / 0.2);
        let ei = easeIn(t);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + lerp(0.7, 0.4, ei), endPlayerPos.z);
        Player.scale.set(1, 1, 1);
        ShopHopBox.scale.set(lerp(0.4, 0, t), lerp(0.4, 0, t), lerp(0.4, 0, t));
        ShopHopBox.children[0].scale.set(0, 0, 0);
    }
    else if (animTimer > animLength - 5.15){
        let t = 1 - ((animTimer - animLength + 5.15) / 0.15);
        Player.position.set(endPlayerPos.x, endPlayerPos.y + lerp(0.4, 0, t), endPlayerPos.z);
        ShopHopBox.scale.set(0, 0, 0);
    }
    else if (animTimer > animLength - 5.4){
        Player.position.set(endPlayerPos.x, endPlayerPos.y, endPlayerPos.z);
    }
    else{
        Scene.remove(ShopHopBox);
        Player.scale.set(1, 1, 1);

        UIState = "player";
        SetBlockTranparency();
        PlayerData.position = { x: pipeWarpLocation.x, y: pipeWarpLocation.y };

        transitionValues.cameraPos = Camera.position;
        transitionValues.cameraRot = Camera.rotation;
        transitionValues.playerPos = Player.position;
        transitionValues.playerRot = Player.rotation;
        
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";

        Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, position: PlayerData.position }));
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

    let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
    document.getElementById(tile.popup).style.display = "none";
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

    Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
    UpdateLeaderboards();
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

        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);

        if (coinsAnimTurnStepBuffer == "popup"){
            if (tile.popup == "duel" || tile.popup == "star-steal"){
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

var LoadstoneObject = new THREE.Group();
let loadstoneGeoBuffer1 = new THREE.BufferGeometry();
loadstoneGeoBuffer1.setIndex([
    0, 1, 2,
    1, 3, 2
]);
loadstoneGeoBuffer1.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -0.5, -0.5, 0,
    0, -0.5, 0,
    -0.5, 0.5, 0,
    0, 0.5, 0
]), 3));
loadstoneGeoBuffer1.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([
    0, 0,
    0.5, 0,
    0, 1,
    0.5, 1
]), 2));
loadstoneGeoBuffer1.computeVertexNormals();
let loadstoneGeoBuffer2 = new THREE.BufferGeometry();
loadstoneGeoBuffer2.setIndex([
    0, 1, 2,
    1, 3, 2
]);
loadstoneGeoBuffer2.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    0, -0.5, 0,
    0.5, -0.5, 0,
    0, 0.5, 0,
    0.5, 0.5, 0
]), 3));
loadstoneGeoBuffer2.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([
    0.5, 0,
    1, 0,
    0.5, 1,
    1, 1
]), 2));
loadstoneGeoBuffer2.computeVertexNormals();
LoadstoneObject.add(new THREE.Mesh(loadstoneGeoBuffer1, new THREE.MeshBasicMaterial({ map: ItemData["loadstone"].image, transparent: true })));
LoadstoneObject.add(new THREE.Mesh(loadstoneGeoBuffer2, new THREE.MeshBasicMaterial({ map: ItemData["loadstone"].image, transparent: true })));
function TriggerLoadstoneAnimation(amount){
    animTimer = 5;
    turnStep = "loadstone-anim";
    UIState = "player";
    coinsTextWidth = SetCoinText(amount);

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    CoinText.scale.set(0, 0, 0);
    Scene.add(CoinText);
    ItemRingParticle.scale.set(0, 0, 0);
    ItemRingParticle.position.set(targetPos.x, targetPos.y, targetPos.z + 0.05);
    ItemRingParticle.material.color.set(amount < 0 ? 0xff5555 : 0x5555ff);
    Scene.add(ItemRingParticle);

    Scene.add(LoadstoneObject);
    LoadstoneObject.position.set(targetPos.x, targetPos.y + 0.1, targetPos.z + 0.01);
    LoadstoneObject.children[0].position.set(0, 0, 0);
    LoadstoneObject.children[0].rotation.set(0, 0, 0);
    LoadstoneObject.children[0].material.opacity = 0;
    LoadstoneObject.children[1].position.set(0, 0, 0);
    LoadstoneObject.children[1].rotation.set(0, 0, 0);
    LoadstoneObject.children[1].material.opacity = 0;
    LoadstoneObject.scale.set(0.5, 0.5, 0.5);

    coinsAnimFirstTrigger = true;
}
function LoadstoneAnimation(){
    const animLength = 5;
    animTimer -= DeltaTime;

    let targetPos = new THREE.Vector3(PlayerData.position.x, getHeightTile(PlayerData.position.x, PlayerData.position.y) + 0.375, PlayerData.position.y);

    if (animTimer > animLength - 1){
        let t = 1 - ((animTimer - animLength + 1) / 1);
        let eo = easeOut(t);
        LoadstoneObject.position.set(targetPos.x, targetPos.y + lerp(0, 0.65, eo), targetPos.z + 0.01);
        LoadstoneObject.children[0].material.opacity = lerp(0, 1, t);
        LoadstoneObject.children[1].material.opacity = lerp(0, 1, t);
    }
    else if (animTimer > animLength - 1.5){
        let t = 1 - ((animTimer - animLength + 1.5) / 0.5);
        LoadstoneObject.position.set(targetPos.x, targetPos.y + 0.65, targetPos.z + 0.01);
        LoadstoneObject.children[0].material.opacity = 1;
        LoadstoneObject.children[1].material.opacity = 1;
    }
    else if (animTimer > animLength - 2){
        let t = 1 - ((animTimer - animLength + 2) / 0.5);
        let eo = easeOut(t);
        LoadstoneObject.children[0].position.set(lerp(0, -0.4, eo), lerp(0, -0.15, eo), 0);
        LoadstoneObject.children[1].position.set(lerp(0, 0.4, eo), lerp(0, -0.15, eo), 0);
        LoadstoneObject.children[0].rotation.set(0, 0, lerp(0, Math.PI / 4, eo));
        LoadstoneObject.children[1].rotation.set(0, 0, lerp(0, -Math.PI / 4, eo));
        LoadstoneObject.children[0].material.opacity = lerp(1, 0, t);
        LoadstoneObject.children[1].material.opacity = lerp(1, 0, t);
        CoinText.scale.set(lerp(0, 0.85, eo), lerp(0, 0.85, eo), lerp(0, 0.85, eo));
        CoinText.position.set(targetPos.x - (lerp(0, coinsTextWidth, eo) / 2 * 0.85), targetPos.y + lerp(0.575, 0.525, eo), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 2.5){
        CoinText.scale.set(0.85, 0.85, 0.85);
        LoadstoneObject.children[0].material.opacity = 0;
        LoadstoneObject.children[1].material.opacity = 0;
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y + 0.525, targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 3.25){
        let t = 1 - ((animTimer - animLength + 3.25) / 0.75);
        let ei = easeIn(t);
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * 0.85), targetPos.y + lerp(0.525, 0.25, ei), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 4){
        let t = 1 - ((animTimer - animLength + 4) / 0.75);
        let eo = easeOut(t);
        CoinText.scale.set(lerp(0.85, 0.1, eo), lerp(0.85, 0.1, eo), lerp(0.85, 0.1, eo));
        CoinText.position.set(targetPos.x - (coinsTextWidth / 2 * lerp(0.85, 0.1, eo)), targetPos.y + lerp(0.25, 0, eo), targetPos.z + 0.1);
    }
    else if (animTimer > animLength - 5){
        if (coinsAnimFirstTrigger){
            coinsAnimFirstTrigger = false;
            Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, coins: PlayerData.coins }));
            UpdatePlayerUI();
            UpdateLeaderboards();
        }
        let t = 1 - ((animTimer - animLength + 5) / 1);
        CoinText.scale.set(0, 0, 0);
        ItemRingParticle.scale.set(lerp(0.1, 1, t), lerp(0.1, 1, t), lerp(0.1, 1, t));
        ItemRingParticle.material.opacity = lerp(1, 0, t);
    }
    else{
        Scene.remove(LoadstoneObject);
        Scene.remove(ItemRingParticle);
        Scene.remove(CoinText);

        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
    }
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
    Socket.send(JSON.stringify({ method: "update_player", token: TOKEN, stars: PlayerData.stars }));

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
            PlayerSilverStarObjs[i].children[0].material.dispose();
            PlayerSilverStarObjs[i].children[1].material.dispose();
            PlayerSilverStarObjs[i].children[0].geometry.dispose();
            PlayerSilverStarObjs[i].children[1].geometry.dispose();
        }
        PlayerSilverStarObjs.splice(0, 5);

        EndTurn();
    }
}

function UpdatePlayerUI(){
    document.getElementsByClassName("player-stars")[0].textContent = PlayerData.stars;
    document.getElementsByClassName("player-coins")[0].textContent = PlayerData.coins;
    document.getElementsByClassName("player-name")[0].textContent = IGN.split("#")[0];
    document.getElementsByClassName("player-rank")[0].src = "resources/textures/ranks/" + getRank(Rank) + "-Rank.svg";
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
        UIPanels.minigame.style.visibility = "hidden";
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
        document.getElementsByClassName("options-button")[0].style.display = "initial";

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
            UIPanels.minigame.style.visibility = "visible";
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

var settingsElement = document.getElementById("settings");
document.getElementsByClassName("options-button")[0].onclick = function(e){
    settingsElement.style.display = settingsElement.style.display == "initial" ? "none" : "initial";
    document.getElementById("settings-off-click").style.display = settingsElement.style.display;
};
document.getElementsByClassName("settings-close-button")[0].onclick = function(e){
    settingsElement.style.display = "none";
    document.getElementById("settings-off-click").style.display = "none";
};
document.getElementById("volume").onchange = function(e){
    VOLUME = document.getElementById("volume").value;
    NotifSFX.volume = VOLUME;
    StartTurnSFX.volume = VOLUME;
    document.cookie = "volume=" + VOLUME + "; expires=" + new Date(2999, 12, 31).toUTCString();
};
document.getElementById("music").onchange = function(e){
    MUSIC_VOLUME = document.getElementById("music").value;
    for (let i = 0; i < MusicPlaylist.length; i++){
        MusicPlaylist[i].volume = MUSIC_VOLUME;
    }
    document.cookie = "music=" + MUSIC_VOLUME + "; expires=" + new Date(2999, 12, 31).toUTCString();
};
document.getElementById("reduced-motion").onchange = function(e){
    REDUCED_MOTION = document.getElementById("reduced-motion").checked;
    document.cookie = "reducedMotion=" + REDUCED_MOTION + "; expires=" + new Date(2999, 12, 31).toUTCString();
};

function updateAllRoomCodes(code){
    for (let i = 0; i < roomCodeCopyElems.length; i++){
        roomCodeCopyElems[i].textContent = HIDE_ROOM_CODE ? "******" : code;
        roomCodeCopyElems[i].setAttribute("code", code);
    }
}
document.getElementById("hide-room-code").onchange = function(e){
    HIDE_ROOM_CODE = document.getElementById("hide-room-code").checked;
    for (let i = 0; i < roomCodeCopyElems.length; i++){
        roomCodeCopyElems[i].textContent = HIDE_ROOM_CODE ? "******" : roomCodeCopyElems[i].getAttribute("code");
    }
    document.cookie = "hideRoomCode=" + HIDE_ROOM_CODE + "; expires=" + new Date(2999, 0, 0).toUTCString();
};
document.getElementsByClassName("edit-profile")[0].onclick = function(e){
    settingsElement.style.display = "none";
    document.getElementById("settings-off-click").style.display = "none";
    document.getElementById("edit-profile").style.display = "initial";
};
document.getElementsByClassName("sign-out")[0].onclick = function(e){
    TOKEN = null;
    document.cookie = "playerToken=null; expiry=" + new Date(1999, 0).toUTCString();
    window.location.reload();
};
document.getElementsByClassName("leave-game")[0].onclick = function(e){
    Socket.send(JSON.stringify({ method: "leave_game", token: TOKEN }));

    ResetUIToMenu();

    UIPanels.connecting.style.display = "initial";
};

function ResetUIToMenu(){
settingsElement.style.display = "none";
    for (let i = 0; i < MusicPlaylist.length; i++){
        MusicPlaylist[i].pause();
    }

    UIState = "menu";
    for (const [key, value] of Object.entries(UIPanels)){
        value.style.display = "none";
    }

    document.getElementById("settings-room-code").style.display = "none";
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("key-door").style.display = "none";
    let shops = document.getElementById("shops");
    while (shops.children.length > 0) shops.removeChild(shops.children[0]);
    document.getElementById("star-1").style.display = "none";
    document.getElementById("star-2").style.display = "none";
    document.getElementById("duel").style.display = "none";
    document.getElementById("lucky-space").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("global-leaderboard").style.display = "none";

    document.getElementsByClassName("roll-inputs")[0].style.display = "none";
    document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
    document.getElementsByClassName("roll-display")[0].style.transform = "scale(0%)";
    document.getElementsByClassName("move-undo-button")[0].style.display = "none";
    document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
    document.getElementsByClassName("player-inputs")[0].style.display = "none";
    document.getElementsByClassName("board-inputs")[0].style.display = "none";
    document.getElementsByClassName("item-menu")[0].style.display = "none";
    document.getElementsByClassName("item-toss-menu")[0].style.display = "none";
    document.getElementsByClassName("player-data")[0].style.display = "none";
    document.getElementsByClassName("map-overlay")[0].style.display = "none";
    document.getElementById("turn-counter").style.display = "none";
    document.getElementById("wait-minigame-map").style.display = "none";
    document.getElementsByClassName("leaderboard-button")[0].style.display = "none";
}

var duelBet = false;
var duelButtons = document.getElementsByClassName("duel-button");
duelButtons[0].onclick = function(e){ 
    if (PlayerData.coins >= 10 && PlayerData.canDuel){
        duelBet = { type: "coins", amount: 10 };
        UpdatePlayerUI();
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "none";
        TriggerCoinChangeAnimation(-10);
        PlayerData.canDuel = false;
    }
};
duelButtons[1].onclick = function(e){ 
    if (PlayerData.coins > 0 && PlayerData.canDuel){
        duelBet = { type: "coins", amount: PlayerData.coins };
        UpdatePlayerUI();
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "none";
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
    if (PlayerData.coins >= 20 && PlayerData.canSteal){
        PlayerData.isStealing = true;
        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        document.getElementById(tile.popup).style.display = "none";
        TriggerCoinChangeAnimation(-20);
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
    document.getElementById("turn-counter-text").textContent = ServerTurn + "/" + GameLength;
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
var PlayerCharacter = { hat: 0, hair: 0, skin: 0, shirt: 0 };
function CCHatIncrease(e){
    CCHatIndex = (CCHatIndex + 1) % AvatarDecorations.hat.length;
    for (let i = 3; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.hat[CCHatIndex].url;
        CCElements[i].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 13) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 13) + "px)";
    }
};
function CCHatDecrease(e){
    CCHatIndex = (CCHatIndex + AvatarDecorations.hat.length - 1) % AvatarDecorations.hat.length;
    for (let i = 3; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.hat[CCHatIndex].url;
        CCElements[i].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 13) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 13) + "px)";
    }
};
var CCHairIndex = Math.floor(Math.random() * AvatarDecorations.hair.length);
function CCHairIncrease(e){
    CCHairIndex = (CCHairIndex + 1) % AvatarDecorations.hair.length;
    for (let i = 2; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.hair[CCHairIndex];
        CCElements[i + 1].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 13) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 13) + "px)";
    }
};
function CCHairDecrease(e){
    CCHairIndex = (CCHairIndex + AvatarDecorations.hair.length - 1) % AvatarDecorations.hair.length;
    for (let i = 2; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.hair[CCHairIndex];
        CCElements[i + 1].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 13) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 13) + "px)";
    }
};
var CCSkinIndex = Math.floor(Math.random() * AvatarDecorations.skin.length);
function CCSkinIncrease(e){
    CCSkinIndex = (CCSkinIndex + 1) % AvatarDecorations.skin.length;
    for (let i = 0; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.skin[CCSkinIndex];
    }
};
function CCSkinDecrease(e){
    CCSkinIndex = (CCSkinIndex + AvatarDecorations.skin.length - 1) % AvatarDecorations.skin.length;
    for (let i = 0; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.skin[CCSkinIndex];
    }
};
var CCShirtIndex = Math.floor(Math.random() * AvatarDecorations.shirt.length);
function CCShirtIncrease(e){
    CCShirtIndex = (CCShirtIndex + 1) % AvatarDecorations.shirt.length;
    for (let i = 1; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.shirt[CCShirtIndex];
    }
};
function CCShirtDecrease(e){
    CCShirtIndex = (CCShirtIndex + AvatarDecorations.shirt.length - 1) % AvatarDecorations.shirt.length;
    for (let i = 1; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.shirt[CCShirtIndex];
    }
};

for (let i = 0; i < CCIncreaseButtons.length; i++){
    switch(i % 4){
        case 0:
            CCIncreaseButtons[i].onclick = CCHatIncrease;
            CCDecreaseButtons[i].onclick = CCHatDecrease;
            break;
        case 1:
            CCIncreaseButtons[i].onclick = CCHairIncrease;
            CCDecreaseButtons[i].onclick = CCHairDecrease;
            break;
        case 2:
            CCIncreaseButtons[i].onclick = CCSkinIncrease;
            CCDecreaseButtons[i].onclick = CCSkinDecrease;
            break;
        case 3:
            CCIncreaseButtons[i].onclick = CCShirtIncrease;
            CCDecreaseButtons[i].onclick = CCShirtDecrease;
            break;
    }
}

if (Object.hasOwn(COOKIES, "character")){
    let char = JSON.parse(COOKIES.character);
    CCHatIndex = char.hat;
    CCHairIndex = char.hair;
    CCSkinIndex = char.skin;
    CCShirtIndex = char.shirt;
    PlayerCharacter = char;
}

function updateAllCCElements(){
    for (let i = 0; i < CCElements.length; i += 4){
        CCElements[i].src = AvatarDecorations.skin[CCSkinIndex];
        CCElements[i + 1].src = AvatarDecorations.shirt[CCShirtIndex];
        CCElements[i + 2].src = AvatarDecorations.hair[CCHairIndex];
        CCElements[i + 3].src = AvatarDecorations.hat[CCHatIndex].url;
        CCElements[i + 3].style.transform = "translate(calc(-50% + " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].x * 13) + "px), " + (AvatarDecorations.hat[CCHatIndex].offsets[CCHairIndex % AvatarDecorations.hat[CCHatIndex].offsets.length].y * 13) + "px)";
    }
}
updateAllCCElements();

document.getElementById("edit-leave-button").onclick = function(e){
    document.getElementById("edit-profile").style.display = "none";
};

var editPlayerMessageBuffer = null;
var editPlayerSocket;
document.getElementById("edit-change-button").onclick = function(e){
    editPlayerMessageBuffer = { method: "edit_profile", token: TOKEN };

    let newDiscord = document.getElementById("edit-discord-input").value;
    let newIGN = document.getElementById("edit-ign-input").value;
    let newPassword = document.getElementById("edit-password-input").value;
    let newPasswordConfirm = document.getElementById("edit-password-confirm").value;

    if (newPassword.length > 0 && newPassword.length < 8){
        document.getElementById("edit-error-message").textContent = "Password must be at least 8 characters long";
        return;
    }
    else if (newPassword != newPasswordConfirm){
        document.getElementById("edit-error-message").textContent = "Passwords do not match";
        return;
    }
    if (newIGN.length > 0 && (!newIGN.includes("#") || newIGN.split("#")[1].length < 4)){
        document.getElementById("edit-error-message").textContent = "Splatoon Name must include id numbers (e.g. Username#1234)";
        return;
    }

    if (newDiscord.length > 0 && newDiscord != Discord) Object.defineProperty(editPlayerMessageBuffer, "discord", {writable: true, enumerable: true, configurable: true, value: newDiscord});
    if (newIGN.length > 0 && newIGN != IGN) Object.defineProperty(editPlayerMessageBuffer, "ign", {writable: true, enumerable: true, configurable: true, value: newIGN});
    if (newPassword.length > 0) Object.defineProperty(editPlayerMessageBuffer, "password", {writable: true, enumerable: true, configurable: true, value: newPassword});
    if (CCHatIndex != PlayerCharacter.hat || CCHairIndex != PlayerCharacter.hair || CCSkinIndex != PlayerCharacter.skin || CCShirtIndex != PlayerCharacter.shirt) Object.defineProperty(editPlayerMessageBuffer, "character", {writable: true, enumerable: true, configurable: true, value: { hat: CCHatIndex, hair: CCHairIndex, skin: CCSkinIndex, shirt: CCShirtIndex } });

    //editPlayerSocket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:6969" : "wss://msp-server.astrodwarf.space");
    editPlayerSocket = new WebSocket("wss://msp-server.astrodwarf.space");

    UIPanels.connecting.style.display = "initial";
    document.getElementById("edit-profile").style.display = "none";

    editPlayerSocket.onopen = function(e){
        editPlayerTimeout(0);
        UIPanels.connecting.style.display = "initial";
        document.getElementById("edit-profile").style.display = "none";
    };
    editPlayerSocket.onmessage = function(e){
        let data = JSON.parse(e.data);
        console.log(data);
        if (data.method == "edit_profile" && data.success){
            clearTimeout(editTimeout);
            TOKEN = data.token;
            saveCookies();
            window.location.reload();
        }
        else if (!data.success){
            UIPanels.connecting.style.display = "none";
            document.getElementById("edit-profile").style.display = "initial";
        }
    };
};
var editTimeout;
function editPlayerTimeout(i){
    if (i > TIMEOUT_LIMIT) disconnectError();
    editPlayerSocket.send(JSON.stringify(editPlayerMessageBuffer));
    editTimeout = setTimeout(() => editPlayerTimeout(i+1), 500);
}

const PlayerObjects = new THREE.Group();
Scene.add(PlayerObjects);

var OpponentPlayers = {};

function UpdatePlayer(data){
    if (data.ign == IGN) return;
    if (Object.hasOwn(OpponentPlayers, data.ign)){
        let leaderboardUpdate = false;
        if (Object.hasOwn(data, "stars") && OpponentPlayers[data.ign].stars != data.stars) {
            OpponentPlayers[data.ign].stars = data.stars;
            leaderboardUpdate = true;
        }
        if (Object.hasOwn(data, "coins") && OpponentPlayers[data.ign].coins != data.coins) {
            OpponentPlayers[data.ign].coins = data.coins;
            leaderboardUpdate = true;
        }
        if (Object.hasOwn(data, "character") && CharacterToInt(OpponentPlayers[data.ign].character) != CharacterToInt(data.character)){
            OpponentPlayers[data.ign].character = data.character;
            OpponentPlayers[data.ign].object.material.map = GeneratePlayerTexture(data.character);
        }
        if (Object.hasOwn(data, "rank")) OpponentPlayers[data.ign].rank = data.rank;
        if (Object.hasOwn(data, "position")) OpponentPlayers[data.ign].position = data.position;
        if (leaderboardUpdate) UpdateLeaderboards();
    }
    else{
        AddPlayer(data);
    }
}

function ClearPlayers(){
    PlayerObjects.clear();
    for (const key of Object.keys(OpponentPlayers)){
        delete OpponentPlayers[key];
    }
    OpponentPlayers = {};
}

function AddPlayer(data){
    if (data.ign == IGN) return;
    if (Object.hasOwn(OpponentPlayers, data.ign)){
        UpdatePlayer(data);
    }
    else{
        if (Object.hasOwn(data, "coins") && Object.hasOwn(data, "stars") && Object.hasOwn(data, "ign") && Object.hasOwn(data, "character") && Object.hasOwn(data, "rank") && Object.hasOwn(data, "position")){
            Object.defineProperty(OpponentPlayers, data.ign, { writable: true, enumerable: true, configurable: true, value: { 
                stars: data.stars,
                coins: data.coins,
                character: data.character,
                rank: data.rank,
                object: new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(data.character), alphaTest: 0.5, side: THREE.DoubleSide})),
                position: data.position
            }});
            PlayerObjects.add(OpponentPlayers[data.ign].object);
            OpponentPlayers[data.ign].object.castShadow = true;
            OpponentPlayers[data.ign].object.receiveShadow = false;

            let innerText = new TextGeometry(data.ign.split("#")[0], { font: UsernameFont, size: 0.1, depth: 0.01, curveSegments: 1 });
            innerText.computeBoundingBox();
            let xMid = -0.5 * (innerText.boundingBox.max.x - innerText.boundingBox.min.x);
            let innerTextObject = new THREE.Mesh(innerText, new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
            OpponentPlayers[data.ign].object.add(innerTextObject);
            innerTextObject.position.add(new THREE.Vector3(xMid, 0.375, 0));
            let outerText = new TextGeometry(data.ign.split("#")[0], { font: UsernameFont, size: 0.1, depth: 0, curveSegments: 1, bevelEnabled: true, bevelThickness: 0, bevelSize: 0.02, bevelOffset: 0, bevelSegments: 1 });
            let outerTextObject = new THREE.Mesh(outerText, new THREE.MeshBasicMaterial({color: 0x000000}));
            OpponentPlayers[data.ign].object.add(outerTextObject);
            outerTextObject.position.add(new THREE.Vector3(xMid, 0.375, 0));

            if (mapLoaded) OpponentPlayers[data.ign].object.position.set(data.position.x, getHeightTile(data.position.x, data.position.y) + 0.375, data.position.y - 0.1);
            UpdateLeaderboards();
        }
    }
}

function RemovePlayer(data){
    if (data.ign == IGN && Object.hasOwn(data, "kick")){
        //You are getting kicked
        window.location.reload();
    }
    if (Object.hasOwn(OpponentPlayers, data.ign)){
        PlayerObjects.remove(OpponentPlayers[data.ign].object);
        delete OpponentPlayers[data.ign];
        UpdateLeaderboards();
    }
}

var leaderboardPlaces = document.getElementsByClassName("leaderboard-player");
var GlobalLeaderboard = document.getElementsByClassName("global-leaderboard-list")[0];
var yourPlacement = 0;
function UpdateLeaderboards(){
    let data = [{ ign: IGN, coins: PlayerData.coins, stars: PlayerData.stars, character: PlayerCharacter, rank: Rank }];

    for (const [key, value] of Object.entries(OpponentPlayers)){
        data.push({
            ign: key,
            coins: value.coins,
            stars: value.stars,
            character: value.character,
            rank: value.rank
        });
    }

    let rankings = getRankingsList({ data: data });

    //Top 8 Leaderboard
    for (var i = 0; i < leaderboardPlaces.length; i++){
        if (i < rankings.length){
            leaderboardPlaces[i].style.display = "block";
            leaderboardPlaces[i].id = "place-" + (rankings[i].placement + 1);
            leaderboardPlaces[i].children[0].textContent = (rankings[i].placement + 1) + ".";
            leaderboardPlaces[i].children[1].src = "resources/textures/ranks/" + getRank(rankings[i].rank) + "-Rank.svg";
            leaderboardPlaces[i].children[2].textContent = rankings[i].ign.split("#")[0];
            leaderboardPlaces[i].children[4].textContent = rankings[i].stars;
            leaderboardPlaces[i].children[6].textContent = rankings[i].coins;
        }
        else{
            leaderboardPlaces[i].style.display = "none";
        }
    }

    //Global Leaderboard
    //Spawn new leaderboard slots
    while (GlobalLeaderboard.children.length > rankings.length){
        GlobalLeaderboard.removeChild(GlobalLeaderboard.children[0]);
    }

    while (GlobalLeaderboard.children.length < rankings.length){
        let listElement = document.createElement("div");
        //listElement.classList.add("results-list-item-" + (i%2==0?"a":"b"));
        /*if (i == 0) listElement.classList.add("results-list-item-1");
        else if (i == 1) listElement.classList.add("results-list-item-2");
        else if (i == 2) listElement.classList.add("results-list-item-3");*/
        GlobalLeaderboard.appendChild(listElement);

        listElement.appendChild(document.createElement("span"));
        listElement.children[0].classList.add("results-list-placement");
        //listElement.children[0].textContent = (i + 1) + ". ";
        listElement.appendChild(document.createElement("img"));
        //listElement.children[1].setAttribute("src", PlayerAvatars[stringToIndex(data.data[i].ign) % PlayerAvatars.length]);
        listElement.children[1].classList.add("results-list-avatar");
        listElement.appendChild(document.createElement("img"));
        listElement.children[2].classList.add("results-list-rank");
        listElement.appendChild(document.createElement("span"));
        listElement.children[3].classList.add("results-list-username");
        //listElement.children[2].textContent = data.data[i].ign.split("#")[0];

        listElement.appendChild(document.createElement("button"));
        listElement.children[4].classList.add("global-leaderboard-kick-button");
        listElement.children[4].textContent = "Kick";
        listElement.children[4].onclick = () => kickRegisteredPlayer(listElement.children[4].getAttribute("ign"));

        listElement.appendChild(document.createElement("span"));
        listElement.children[5].classList.add("results-list-info-coins");
        listElement.appendChild(document.createElement("span"));
        listElement.children[6].classList.add("results-list-info-stars");

        listElement.children[6].appendChild(document.createElement("span"));
        listElement.children[6].children[0].classList.add("results-list-stars");
        //listElement.children[3].children[0].textContent = data.data[i].stars + " ";
        listElement.children[6].appendChild(document.createElement("img"));
        listElement.children[6].children[1].classList.add("results-list-text-img");
        listElement.children[6].children[1].setAttribute("src", "resources/textures/squid_star.svg");
        //listElement.children[3].appendChild(document.createElement("div"));
        //listElement.children[3].children[2].style.display = "inline-block";
        //listElement.children[3].children[2].style.width = "5px";
        listElement.children[5].appendChild(document.createElement("span"));
        listElement.children[5].children[0].classList.add("results-list-coins");
        //listElement.children[3].children[3].textContent = data.data[i].coins + " ";
        listElement.children[5].appendChild(document.createElement("img"));
        listElement.children[5].children[1].classList.add("results-list-text-img");
        listElement.children[5].children[1].setAttribute("src", "resources/textures/squid_coin.svg");
    }

    for (var i = 0; i < rankings.length; i++){
        GlobalLeaderboard.children[i].classList.remove("results-list-item-a", "results-list-item-b", "results-list-item-1", "results-list-item-2", "results-list-item-3");
        GlobalLeaderboard.children[i].classList.add("results-list-item-" + (i%2==0?"a":"b"));
        if (rankings[i].placement == 0) GlobalLeaderboard.children[i].classList.add("results-list-item-1");
        else if (rankings[i].placement == 1) GlobalLeaderboard.children[i].classList.add("results-list-item-2");
        else if (rankings[i].placement == 2) GlobalLeaderboard.children[i].classList.add("results-list-item-3");
        GlobalLeaderboard.children[i].children[0].textContent = (rankings[i].placement + 1) + ". ";
        GlobalLeaderboard.children[i].children[1].setAttribute("src", GeneratePlayerURL(rankings[i].character));
        GlobalLeaderboard.children[i].children[2].setAttribute("src", "resources/textures/ranks/" + getRank(rankings[i].rank) + "-Rank.svg");
        GlobalLeaderboard.children[i].children[2].title = rankings[i].rank < 0 ? getRank(rankings[i].rank) : rankings[i].rank + "XP";
        GlobalLeaderboard.children[i].children[3].textContent = rankings[i].ign.split("#")[0];
        GlobalLeaderboard.children[i].children[4].style.display = IsOwner ? "initial" : "none";
        GlobalLeaderboard.children[i].children[4].disabled = RoomOwners.includes(rankings[i].ign);
        GlobalLeaderboard.children[i].children[4].setAttribute("ign", rankings[i].ign);
        GlobalLeaderboard.children[i].children[6].children[0].textContent = rankings[i].stars + " ";
        GlobalLeaderboard.children[i].children[5].children[0].textContent = rankings[i].coins + " ";

        if (rankings[i].ign == IGN) yourPlacement = rankings[i].placement;
    }
}

document.getElementsByClassName("duel-cancel")[0].onclick = function(e){
    PlayerData.items.push("duelingglove");
    document.getElementById("duel-select").style.display = "none";
    turnStep = "menu";
    document.getElementsByClassName("player-inputs")[0].style.display = "flex";
    document.getElementById("items-button").disabled = false;
};

var duelingList = document.getElementsByClassName("duel-list")[0];
function GenerateDuelingGlovePage(data){
    document.getElementById("duel-select-list-page").style.display = "block";
    document.getElementById("duel-select-wait-page").style.display = "none";

    let list = [];

    for (const [key, value] of Object.entries(OpponentPlayers)){
        if (data.data[key]){
            list.push({
                ign: key,
                coins: value.coins,
                stars: value.stars,
                character: value.character,
                rank: value.rank
            });
        }
    }

    let rankings = getRankingsList({ data: list });

    while (duelingList.children.length > rankings.length) duelingList.removeChild(duelingList.children[0]);
    while (duelingList.children.length < rankings.length){
        let listElement = document.createElement("div");
        listElement.classList.add("target-list-element");
        listElement.onclick = () => duelTargetPlayer(listElement.getAttribute("ign"));
        duelingList.appendChild(listElement);

        listElement.appendChild(document.createElement("span"));
        listElement.children[0].classList.add("results-list-placement");
        listElement.appendChild(document.createElement("img"));
        listElement.children[1].classList.add("results-list-avatar");
        listElement.appendChild(document.createElement("img"));
        listElement.children[2].classList.add("results-list-rank");
        listElement.appendChild(document.createElement("span"));
        listElement.children[3].classList.add("results-list-username");

        listElement.appendChild(document.createElement("span"));
        listElement.children[4].classList.add("results-list-info-coins");
        listElement.appendChild(document.createElement("span"));
        listElement.children[5].classList.add("results-list-info-stars");

        listElement.children[5].appendChild(document.createElement("span"));
        listElement.children[5].children[0].classList.add("results-list-stars");
        listElement.children[5].appendChild(document.createElement("img"));
        listElement.children[5].children[1].classList.add("results-list-text-img");
        listElement.children[5].children[1].setAttribute("src", "resources/textures/squid_star.svg");
        listElement.children[4].appendChild(document.createElement("span"));
        listElement.children[4].children[0].classList.add("results-list-coins");
        listElement.children[4].appendChild(document.createElement("img"));
        listElement.children[4].children[1].classList.add("results-list-text-img");
        listElement.children[4].children[1].setAttribute("src", "resources/textures/squid_coin.svg");
    }

    for (var i = 0; i < rankings.length; i++){
        duelingList.children[i].setAttribute("ign", rankings[i].ign);
        duelingList.children[i].classList.remove("results-list-item-a", "results-list-item-b", "results-list-item-1", "results-list-item-2", "results-list-item-3");
        duelingList.children[i].classList.add("results-list-item-" + (i%2==0?"a":"b"));
        duelingList.children[i].children[0].textContent = (rankings[i].placement + 1) + ". ";
        duelingList.children[i].children[1].setAttribute("src", GeneratePlayerURL(rankings[i].character));
        duelingList.children[i].children[2].setAttribute("src", "resources/textures/ranks/" + getRank(rankings[i].rank) + "-Rank.svg");
        duelingList.children[i].children[2].title = rankings[i].rank < 0 ? getRank(rankings[i].rank) : rankings[i].rank + "XP";
        duelingList.children[i].children[3].textContent = rankings[i].ign.split("#")[0];
        duelingList.children[i].children[5].children[0].textContent = rankings[i].stars + " ";
        duelingList.children[i].children[4].children[0].textContent = rankings[i].coins + " ";
    }
}

var duelTargetBuffer = null;
function duelTargetPlayer(ign){
    duelTargetBuffer = ign;
    document.getElementById("duel-select-list-page").style.display = "none";
    document.getElementById("duel-select-wait-page").style.display = "block";
    Socket.send(JSON.stringify({ method: "duel_glove", token: TOKEN, ign: ign }));
}

//NETWORKING!!!
var Socket;
var SignedIn = false;
var socketHasConnected = false;
var IGN, Discord, Rank;
function InitializeSocket(){
    socketHasConnected = false;
    //Changes the Socket connection based on if it's local hosted or not
    //Also checks if the url search parameter has a unique url for the socket
    Socket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:6969" : "wss://msp-server.astrodwarf.space");
    //Socket = new WebSocket("wss://msp-server.astrodwarf.space");

    Socket.onopen = function(e){
        socketHasConnected = true;
        document.getElementById("settings-room-code").style.display = "none";
        if (TOKEN != null){
            Socket.send(JSON.stringify({ method: "test_token", token: TOKEN }));
        }
        else{
            //Fail to login without sending packets
            test_token_main_server({ method: "test_token", success: false });
        }
    };

    Socket.onclose = function(e){
        console.log("Socket closed");

        if (!socketHasConnected){
            ResetUIToMenu();
            UIPanels.disconnected.style.display = "initial";
        }
        else{
            setTimeout(() => {
                Socket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:6969" : "wss://msp-server.astrodwarf.space");
            }, 10);
        }
    };

    Socket.onmessage = function(e){
        let data;
        
        try { data = JSON.parse(e.data); }
        catch(e) { return; }

        console.log(data);

        switch(data.method){
            case "test_token":
                test_token_main_server(data);
                break;
            case "register":
                register_main_server(data);
                break;
            case "login":
                login_main_server(data);
                break;
            case "join_game":
                join_game_main_server(data);
                break;
            case "create_game":
                create_game_main_server(data);
                break;
        }
    };
}

var tempServer = "";
var tempCode = "";
var isAdmin = false;
function test_token_main_server(data){
    if (data.success){
        let searchParams = new URLSearchParams(window.location.search);

        isAdmin = Object.hasOwn(data, "admin");
        document.getElementById("admin-options").style.display = isAdmin ? "initial" : "none";

        IGN = data.ign;
        Discord = data.discord;
        Rank = data.rank;

        CCHatIndex = data.character.hat;
        CCHairIndex = data.character.hair;
        CCSkinIndex = data.character.skin;
        CCShirtIndex = data.character.shirt;
        PlayerCharacter = data.character;
        updateAllCCElements();
        Player.material.map = GeneratePlayerTexture(data.character);

        SignedIn = true;

        document.getElementsByClassName("edit-profile")[0].disabled = false;
        document.getElementsByClassName("sign-out")[0].disabled = false;
        document.getElementsByClassName("leave-game")[0].disabled = true;

        if (Object.hasOwn(data, "publicStartTime")){
            document.getElementById("public-game-button").style.display = "initial";
            document.getElementById("public-game-button").textContent = "Tournament (" + new Date(data.publicStartTime * 1000).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" }) + ")";
            document.getElementById("public-game-break").style.display = "initial";
        }
        else{
            document.getElementById("public-game-button").style.display = "none";
            document.getElementById("public-game-break").style.display = "none";
        }

        if (Object.hasOwn(data, "server")){
            let code = null;
            if (searchParams.has("roomCode")) code = searchParams.get("roomCode").toUpperCase();
            if (code != null && code.length == 6 && data.code.toUpperCase()){
                UIPanels.gameSelect.style.display = "none";
                UIPanels.connecting.style.display = "none";
                document.getElementById("game-options").style.display = "initial";
                tempServer = data.server;
                tempCode = data.code;
            }
            else{
                //In a game already
                Socket.onclose = null;
                Socket.close();
                ServerStatus = "null";
                updateAllRoomCodes(data.code);

                ConnectToServer(data.server);
            }
        }
        else{
            UIPanels.connecting.style.display = "none";
            UIPanels.gameSelect.style.display = "initial";

            if (searchParams.has("roomCode")){
                let code = searchParams.get("roomCode");
                if (code.length == 6){
                    UIPanels.gameSelect.style.display = "none";
                    UIPanels.connecting.style.display = "initial";

                    window.history.pushState(null, document.title, window.location.pathname);

                    Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: code.toUpperCase() }));
                }
            }
        }
    }
    else{
        //Token does not exist
        TOKEN = null;
        UIPanels.connecting.style.display = "none";
        UIPanels.signup.style.display = "initial";
    }
}

function register_main_server(data){
    if (data.success){
        let searchParams = new URLSearchParams(window.location.search);

        IGN = data.ign;
        Discord = data.discord;
        Rank = data.rank;

        document.getElementsByClassName("edit-profile")[0].disabled = false;
        document.getElementsByClassName("sign-out")[0].disabled = false;
        document.getElementsByClassName("leave-game")[0].disabled = true;

        PlayerCharacter = { hat: CCHatIndex, hair: CCHairIndex, skin: CCSkinIndex, shirt: CCSkinIndex };
        Player.material.map = GeneratePlayerTexture(PlayerCharacter);

        SignedIn = true;
        TOKEN = data.token;
        saveCookies();

        UIPanels.connecting.style.display = "none";
        UIPanels.gameSelect.style.display = "initial";

        if (Object.hasOwn(data, "publicStartTime")){
            document.getElementById("public-game-button").style.display = "initial";
            document.getElementById("public-game-button").textContent = "Tournament (" + new Date(data.publicStartTime * 1000).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" }) + ")";
            document.getElementById("public-game-break").style.display = "initial";
        }
        else{
            document.getElementById("public-game-button").style.display = "none";
            document.getElementById("public-game-break").style.display = "none";
        }

        if (searchParams.has("roomCode")){
            let code = searchParams.get("roomCode").toUpperCase();
            if (code.length == 6){
                UIPanels.gameSelect.style.display = "none";
                UIPanels.connecting.style.display = "initial";

                window.history.pushState(null, document.title, window.location.pathname);

                Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: code.toUpperCase() }));
            }
        }
    }
    else{
        UIPanels.connecting.style.display = "none";
        UIPanels.signup.style.display = "initial";
        document.getElementById("signup-error-message").textContent = data.error;
    }
}

function login_main_server(data){
    if (data.success){
        let searchParams = new URLSearchParams(window.location.search);

        isAdmin = Object.hasOwn(data, "admin");
        document.getElementById("admin-options").style.display = isAdmin ? "initial" : "none";

        IGN = data.ign;
        Discord = data.discord;
        Rank = data.rank;
        
        CCHatIndex = data.character.hat;
        CCHairIndex = data.character.hair;
        CCSkinIndex = data.character.skin;
        CCShirtIndex = data.character.shirt;
        PlayerCharacter = data.character;
        updateAllCCElements();
        Player.material.map = GeneratePlayerTexture(data.character);

        document.getElementsByClassName("edit-profile")[0].disabled = false;
        document.getElementsByClassName("sign-out")[0].disabled = false;
        document.getElementsByClassName("leave-game")[0].disabled = true;

        SignedIn = true;
        TOKEN = data.token;
        saveCookies();

        if (Object.hasOwn(data, "publicStartTime")){
            document.getElementById("public-game-button").style.display = "initial";
            document.getElementById("public-game-button").textContent = "Tournament (" + new Date(data.publicStartTime * 1000).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" }) + ")";
            document.getElementById("public-game-break").style.display = "initial";
        }
        else{
            document.getElementById("public-game-button").style.display = "none";
            document.getElementById("public-game-break").style.display = "none";
        }

        if (Object.hasOwn(data, "server")){
            let code = null;
            if (searchParams.has("roomCode")) code = searchParams.get("roomCode").toUpperCase();
            if (code != null && code.length == 6 && data.code.toUpperCase()){
                UIPanels.gameSelect.style.display = "none";
                UIPanels.connecting.style.display = "none";
                document.getElementById("game-options").style.display = "initial";
                tempServer = data.server;
                tempCode = data.code;
            }
            else{
                //In a game already
                Socket.onclose = null;
                Socket.close();
                ServerStatus = "null";
                ConnectToServer(data.server);
                updateAllRoomCodes(data.code);
                document.getElementById("settings-room-code").style.display = "initial";
            }
        }
        else{
            UIPanels.connecting.style.display = "none";
            UIPanels.gameSelect.style.display = "initial";

            if (searchParams.has("roomCode")){
                let code = searchParams.get("roomCode");
                if (code.length == 6){
                    UIPanels.gameSelect.style.display = "none";
                    UIPanels.connecting.style.display = "initial";

                    window.history.pushState(null, document.title, window.location.pathname);

                    Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: code.toUpperCase() }));
                }
            }
        }
    }
    else {
        UIPanels.connecting.style.display = "none";
        UIPanels.login.style.display = "initial";
        document.getElementById("login-error-message").textContent = data.error;
    }
}

document.getElementById("url-error-new").onclick = function(e){
    let code = new URLSearchParams(window.location.search).get("roomCode").toUpperCase();

    window.history.pushState(null, document.title, window.location.pathname);

    document.getElementById("game-options").style.display = "none";
    UIPanels.connecting.style.display = "initial";
    Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: code }));

    updateAllRoomCodes(code);
};
document.getElementById("url-error-old").onclick = function(e){
    window.history.pushState(null, document.title, window.location.pathname);

    document.getElementById("game-options").style.display = "none";
    UIPanels.connecting.style.display = "initial";

    Socket.onclose = null;
    Socket.close();
    ServerStatus = "null";
    updateAllRoomCodes(tempCode);

    ConnectToServer(tempServer);
};

function join_game_main_server(data){
    if (data.success){
        updateAllRoomCodes(tempCode);

        Socket.onclose = null;
        Socket.close();
        ServerStatus = "null";
        ConnectToServer(data.server);
    }
    else{
        UIPanels.connecting.style.display = "none";
        UIPanels.joinGame.style.display = "initial";
        document.getElementById("join-game-error").style.display = "initial";
        document.getElementById("join-game-error").innerHTML = data.error + "<br>";
    }
}

function create_game_main_server(data){
    if (data.success){
        Socket.onclose = null;
        Socket.close();
        ServerStatus = "null";
        updateAllRoomCodes(data.code);
        //Needs half second delay otherwise on published server, it tries to connect before server is ready
        setTimeout(() => ConnectToServer(data.server), 500);
    }
    else{
        UIPanels.connecting.style.display = "none";
        UIPanels.createGame.style.display = "initial";
        document.getElementById("create-game-error").style.display = "initial";
        document.getElementById("create-game-error").innerHTML = data.error + "<br>";
    }
}

document.getElementById("join-game-button").onclick = function(e){
    UIPanels.joinGame.style.display = "initial";
    UIPanels.gameSelect.style.display = "none";
    document.getElementById("join-game-error").style.display = "none";
    document.getElementById("join-game-code").value = "";
};

document.getElementById("create-game-button").onclick = function(e){
    UIPanels.createGame.style.display = "initial";
    UIPanels.gameSelect.style.display = "none";
    document.getElementById("create-game-error").style.display = "none";
};

document.getElementById("join-game-back-button").onclick = function(e){
    UIPanels.joinGame.style.display = "none";
    UIPanels.gameSelect.style.display = "initial";
    document.getElementById("join-game-error").style.display = "none";
    document.getElementById("join-game-code").value = "";
};

document.getElementById("create-game-back-button").onclick = function(e){
    UIPanels.createGame.style.display = "none";
    UIPanels.gameSelect.style.display = "initial";
    document.getElementById("create-game-error").style.display = "none";
};

document.getElementById("join-game-join-button").onclick = function(e){
    let code = document.getElementById("join-game-code").value;
    tempCode = code;

    if (code.length != 6){
        document.getElementById("join-game-error").innerHTML = "Invalid Code<br>";
        document.getElementById("join-game-error").style.display = "initial";
        return;
    }

    UIPanels.joinGame.style.display = "none";
    UIPanels.connecting.style.display = "initial";

    Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: code.toUpperCase() }));
};

document.getElementById("create-game-create-button").onclick = function(e){
    let settings = {
        map: document.getElementById("create-game-map").value,
        gameLength: Number.parseInt(document.getElementById("create-game-game-length").value),
        generateSilverStars: document.getElementById("create-game-generate-silver-stars").checked,
        battleMinigamesEnabled: document.getElementById("create-game-do-battle-minigames").checked,
        enableTimers: document.getElementById("create-game-enable-timer").checked
    };

    if (isAdmin && document.getElementById("create-game-is-public").checked){
        Object.defineProperty(settings, "startTime", {writable: true, enumerable: true, configurable: true,
            value: new Date(document.getElementById("create-game-start-time").value).valueOf() / 1000 });
        Socket.send(JSON.stringify({ method: "create_public", token: TOKEN, settings: settings }));
        setTimeout(() => window.location.reload(), 500);
    }
    else{
        Socket.send(JSON.stringify({ method: "create_game", token: TOKEN, settings: settings }));
    }

    UIPanels.createGame.style.display = "none";
    UIPanels.connecting.style.display = "initial";
};

document.getElementById("public-game-button").onclick = function(e){
    UIPanels.gameSelect.style.display = "none";
    UIPanels.connecting.style.display = "initial";

    tempCode = "PUBLIC";

    Socket.send(JSON.stringify({ method: "join_game", token: TOKEN, code: "PUBLIC" }));
};


document.getElementById("private-checkin-leave-game").onclick = function(e){
    Socket.send(JSON.stringify({ method: "leave_game", token: TOKEN }));

    UIPanels.checkin.style.display = "none";
    UIPanels.connecting.style.display = "initial";
};

document.getElementById("private-checkin-play-game").onclick = function(e){
    if (checkedIn){
        Socket.send(JSON.stringify({ method: "start_game", token: TOKEN }));

        document.getElementById("private-checkin-play-game").disabled = true;
        document.getElementById("private-checkin-play-game").textContent = "Please Wait";
    }
    else{
        //Game is already running, you are checked out
        Socket.send(JSON.stringify({ method: "check_in", token: TOKEN }));

        UIPanels.checkin.style.display = "none";
        UIPanels.connecting.style.display = "initial";
    }
};


for (let i = 0; i < roomCodeCopyElems.length; i++){
    roomCodeCopyElems[i].onclick = function(e){
        navigator.clipboard.writeText(roomCodeCopyElems[i].getAttribute("code"));
    };
}


const debugPortMap = { server0: 6970, server1: 6971, server2: 6972, server3: 6973, server4: 6974, server5: 6975, server6: 6976, server7: 6977, server8: 6978, server9: 6979, server_public: 6980 };
var connectedGameServer;
function ConnectToServer(server){
    socketHasConnected = false;
    connectedGameServer = server;
    console.log("Connecting to server: " + server);

    Socket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:" + debugPortMap[server] : "wss://msp.astrodwarf.space/" + server);
    //Socket = new WebSocket("wss://msp.astrodwarf.space/" + server);

    Socket.onmessage = function(e){
        if (e.data == "pong" || e.data == "ping") return;

        try{
            var data = JSON.parse(e.data);
        }
        catch {return;}

        console.log(data);

        if (!Object.hasOwn(data, "method") && Object.hasOwn(data, "ign")) UpdatePlayer(data);

        switch (data.method){
            case "player_add":
                player_add_server(data);
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
            case "registered_players":
                registered_players_server(data);
                break;
            case "leave_game":
                leave_game_server(data);
                break;
            case "init":
                init_server(data);
                break;
            case "player_remove":
                RemovePlayer(data);
                break;
            case "get_target_list":
                get_target_list_server(data);
                break;
            case "duel_glove":
                duel_glove_server(data);
                break;
        }
    };

    Socket.onopen = function(e){
        socketHasConnected = true;
        document.getElementById("settings-room-code").style.display = "inline-block";
        Socket.send(JSON.stringify({ method: "init", token: TOKEN }));
    };

    Socket.onclose = function(e){
        console.log("Socket Closed");

        if (!socketHasConnected){
            turnStep = "dc";
            
            ResetUIToMenu();
            UIPanels.disconnected.style.display = "initial";
        }
        else{
            setTimeout(() => {
                Socket = new WebSocket(window.location.hostname == "127.0.0.1" ? "ws://localhost:" + debugPortMap[connectedGameServer] : "wss://msp.astrodwarf.space/" + connectedGameServer);
            }, 10);
        }
    };

    Socket.onerror = function(e){
        console.log("Socket Error");
        console.log(e);
    };
}

function duel_glove_server(data){
    if (data.success){
        document.getElementById("duel-select").style.display = "none";
        turnStep = "menu";
        document.getElementsByClassName("player-inputs")[0].style.display = "flex";
        PlayerData.isStealing = duelTargetBuffer;
    }
    else{
        document.getElementById("duel-select-list-page").style.display = "none";
        document.getElementById("duel-select-wait-page").style.display = "block";
        document.getElementById("duel-select-sub-text").textContent = "Cannot duel selected player";
        Socket.send({ method: "get_target_list" });
    }
}

function get_target_list_server(data){
    if (document.getElementById("duel-select").style.display == "initial"){
        //Dueling Glove Item
        GenerateDuelingGlovePage(data);
    }
    else {
        //Star Steal
        //TODO!!! Steal steal select your target
        //IDK, maybe just refund coins if someone ends up getting dueled but is trying to steal
    }
}

function player_add_server(data){
    if (!Object.hasOwn(data, "coins")) Object.defineProperty(data, "coins", { writable: true, enumerable: true, configurable: true, value: 10 });
    if (!Object.hasOwn(data, "stars")) Object.defineProperty(data, "stars", { writable: true, enumerable: true, configurable: true, value: 0 });
    if (!Object.hasOwn(data, "position")) Object.defineProperty(data, "position", { writable: true, enumerable: true, configurable: true, value: StartingTile });
    AddPlayer(data);
}

var RoomOwners = [];
var GameLength = 15;
var initTimeout;
function initServerTimeout(i){
    if (i > TIMEOUT_LIMIT) disconnectError();
    initTimeout = setTimeout(() => initServerTimeout(i+1), 500);
    Socket.send(JSON.stringify({ method: "init", token: TOKEN }));
}
function init_server(data){
    MAP = data.map;
    mapLoaded = false;
    checkedIn = data.checkedIn;
    GameLength = data.gameLength;
    document.getElementsByClassName("leave-game")[0].disabled = false;
    IsOwner = data.owners.includes(IGN);
    RoomOwners = data.owners;
    document.getElementsByClassName("player-name")[0].textContent = IGN.split("#")[0];
    document.getElementsByClassName("player-rank")[0].src = "./resources/textures/ranks/" + getRank(Rank) + "-Rank.svg";
    loadMap(data.players);
}

function leave_game_server(data){
    if (data.success){
        UIState = "menu";
        PlayerObjects.clear();
        for (let i = 0; i < ServerSilverStars.length; i++){
            Scene.remove(ServerSilverStars[i].obj);
        }
        if (ServerStatus == "RESULTS"){
            clearTimeout(endGameFailTimeout);
            window.location.reload();
        }
        Socket.onclose = null;
        Socket.close();
        ServerStatus = "null";
        InitializeSocket();
        spacesMoved = 0;
        currentRoll = 0;
        rollsRemaining = 1;
        PlayerData.roll = 0;
    }
    else{
        throw new Error(data.error);
    }
}

function registered_players_server(data){
    generateRegisteredPlayersUI(data);

    for (let i = 0; i < data.registeredPlayers.length; i++){
        AddPlayer({
            coins: 10,
            stars: 0,
            position: StartingTile,
            character: data.registeredPlayers[i].character,
            ign: data.registeredPlayers[i].ign,
            rank: data.registeredPlayers[i].rank,
        });
    }
}
var IsOwner = false;
const registeredPlayersList = document.getElementById("private-checkin-player-list");
function generateRegisteredPlayersUI(data){
    while (registeredPlayersList.children.length > data.registeredPlayers.length){
        registeredPlayersList.removeChild(registeredPlayersList.children[registeredPlayersList.children.length - 1]);
    }
    while (registeredPlayersList.children.length < data.registeredPlayers.length){
        let playerElem = document.createElement("div");
        playerElem.classList.add("private-checkin-player");

        let rankIMG = document.createElement("img");
        rankIMG.classList.add("private-checkin-rank");
        let nameSpan = document.createElement("span");
        nameSpan.classList.add("private-checkin-player-name");
        let avatarIMG = document.createElement("img");
        avatarIMG.classList.add("private-checkin-avatar");
        let kickBtn = document.createElement("button");
        kickBtn.classList.add("private-checkin-kick-player");
        kickBtn.textContent = "Kick";
        kickBtn.setAttribute("index", registeredPlayersList.children.length);
        kickBtn.onclick = () => kickRegisteredPlayer(kickBtn.getAttribute("ign"));
        playerElem.append(rankIMG, nameSpan, avatarIMG, kickBtn);
        registeredPlayersList.append(playerElem);
    }

    for (let i = 0; i < data.registeredPlayers.length; i++){
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-rank")[0].src = "resources/textures/ranks/" + getRank(data.registeredPlayers[i].rank) + "-Rank.svg";
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-rank")[0].title = data.registeredPlayers[i].rank < 0 ? getRank(data.registeredPlayers[i].rank) : data.registeredPlayers[i].rank + "XP";
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-player-name")[0].textContent = data.registeredPlayers[i].ign;
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-avatar")[0].src = GeneratePlayerURL(data.registeredPlayers[i].character);
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-kick-player")[0].style.display = IsOwner ? "initial" : "none";
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-kick-player")[0].disabled = Object.hasOwn(data.registeredPlayers[i], "owner");
        registeredPlayersList.children[i].getElementsByClassName("private-checkin-kick-player")[0].setAttribute("ign", data.registeredPlayers[i].ign);
    }

    document.getElementById("private-checkin-signed-up-players").textContent = "Signed Up Players: " + data.registeredPlayers.length;

    document.getElementById("private-checkin-play-game").textContent = IsOwner ? "Play Game" : "Please Wait";
    document.getElementById("private-checkin-play-game").disabled = !IsOwner;
}

function kickRegisteredPlayer(ign){
    Socket.send(JSON.stringify({ method: "kick_player", token: TOKEN, ign: ign }));
}

var pingLoop;
function startPingLoop(){
    pingLoop = setInterval(() => {
        if (Socket != null && Socket.readyState == WebSocket.OPEN){
            Socket.send("ping");
        }
    }, 60000);
}
function endPingLoop(){
    if (pingLoop != null) clearInterval(pingLoop);
}
startPingLoop();

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
    let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
    if (Object.hasOwn(tile, "popup")) document.getElementById(tile.popup).style.display = "none";
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
var ServerTurn = 1;
function get_status_server(data){
    clearTimeout(GetStatusServerTimeout);

    if (Object.hasOwn(data, "turn")){
        ServerTurn = data.turn;
        document.getElementById("turn-counter-text").textContent = ServerTurn + "/" + GameLength;
        SetMapAnimationTransforms(ServerTurn);
    }
    if (Object.hasOwn(data, "endTime")) document.getElementById("turn-timer").textContent = new Date(data.endTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});

    if (Object.hasOwn(data, "registeredPlayers")) generateRegisteredPlayersUI(data);

    if (Object.hasOwn(data, "data")){
        if (data.status == "RESULTS"){
            TriggerResultsAnimation(data, true);
        }
        else if (data.status == "REGISTRATION"){
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
        }
        else{
            rollsRemaining = 1;
            if (PlayerData.coins != data.data.coins || PlayerData.stars != data.data.stars || !arraysEqual(PlayerData.items, data.data.items) || PlayerData.position.x != data.data.position.x || PlayerData.position.y != data.data.position.y|| PlayerData.tutorial != data.data.tutorial){
                let tile = getMapTile(PlayerData.position.x, PlayerData.position.x);
                if (Object.hasOwn(tile, "popup")) document.getElementById(tile.popup).style.display = "none";
                
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

                UpdateItemUI();
                UpdatePlayerUI();
            }
            UpdateLeaderboards();
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
                checkedIn = true;
                UIPanels.connecting.style.display = "none";
                UIPanels.checkin.style.display = "initial";
                break;
            /*case "CHECK_IN":
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
                break;*/
            case "TURN":
                checkedIn = data.checkedIn;
                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                UIPanels.connecting.style.display = "none";
                UIPanels.checkin.style.display = "none";
                UIPanels.login.style.display = "none";
                UIPanels.minigame.style.display = "none";
                UIPanels.waitMinigame.style.display = "none";

                if (!checkedIn){
                    UIState = "menu";
                    UIPanels.checkin.style.display = "initial";
                    UIPanels.checkin.children[0].children[0].textContent = "Game is running";
                    document.getElementById("private-checkin-play-game").disabled = false;
                    document.getElementById("private-checkin-play-game").textContent = "Start Playing";
                }
                else if (PlayerData.tutorial){
                    UIState = "player";
                    turnStep = "tutorial";
                    document.getElementById("leaderboard").style.display = "initial";
                    document.getElementById("turn-counter").style.display = "initial";
                    document.getElementById("tutorial").style.display = "initial";
                    PlayerData.roll = data.data.roll;
                }
                else{
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
                    }
                    else{
                        document.getElementsByClassName("player-inputs")[0].style.display = "none";
                        PlayerData.roll = data.data.roll;
                        turnStep = "move";
                        UIState = "above";
                        document.getElementsByClassName("roll-display")[0].style.transform = "scale(100%)";
                        document.getElementsByClassName("board-inputs")[0].style.display = "initial";
                        SetMoveUI();
                    }
                    
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
                UIState = "menu";
                document.getElementById("leaderboard").style.display = "none";
                checkedIn = data.checkedIn;
                document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";
                if (!checkedIn){
                    UIPanels.connecting.style.display = "none";
                    UIPanels.checkin.style.display = "initial";
                    UIPanels.checkin.children[0].children[0].textContent = "Game is running";
                    document.getElementById("private-checkin-play-game").disabled = false;
                    document.getElementById("private-checkin-play-game").textContent = "Start Playing";
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
    UpdateMusicPlaylist();
}

function announcement_server(data){
    if (Object.hasOwn(data, "status")){
        let lastStatus = ServerStatus;
        ServerStatus = data.status;
        animTimer = 0;
        if (Object.hasOwn(data, "turn")){
            ServerTurn = data.turn;
            SetMapAnimationTransforms(ServerTurn);
            document.getElementById("turn-counter-text").textContent = ServerTurn + "/" + GameLength;
        }
        if (Object.hasOwn(data, "endTime")) document.getElementById("turn-timer").textContent = new Date(data.endTime * 60000).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});
        if (Object.hasOwn(data, "players")) {
            for (let i = 0; i < data.players.length; i++){
                UpdatePlayer(data.players[i]);
            }
        }

        if (ServerStatus == "CHECK_IN"){
            if (SignedIn){
                UIPanels.checkin.children[0].children[2].textContent = checkedIn ? "You are checked-in!" : "Check-in is live";
                document.getElementById("checkinbtn").disabled = checkedIn;
                document.getElementById("checkinbtn").textContent = checkedIn ? "Checked-In" : "Check-in";
            }
        }
        else if (ServerStatus == "TURN"){
            document.getElementsByClassName("leaderboard-button")[0].style.display = "initial";

            if (checkedIn){
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

            UIPanels.minigame.style.animation = "";
            document.getElementById("minigame-title").style.animation = "";
            document.getElementsByClassName("new-minigame-rewards")[0].style.animation = "";
            document.getElementsByClassName("new-minigame-window")[0].style.animation = "";
            document.getElementsByClassName("new-minigame-timer-text")[0].style.animation = "";
            let battleFlair = document.getElementsByClassName("battle-minigame-flair-img");
            let starStealFlair = document.getElementsByClassName("star-steal-minigame-flair-img");
            let duelFlair = document.getElementsByClassName("duel-minigame-flair-img");
            let coinFlair = document.getElementsByClassName("coin-minigame-flair-img");
            for (let i = 0; i < battleFlair.length; i++) battleFlair[i].style.animation = "";
            for (let i = 0; i < starStealFlair.length; i++) starStealFlair[i].style.animation = "";
            for (let i = 0; i < duelFlair.length; i++) duelFlair[i].style.animation = "";
            for (let i = 0; i < coinFlair.length; i++) coinFlair[i].style.animation = "";
            
            if (checkedIn){
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
    UpdateMusicPlaylist();
}

function UpdateMusicPlaylist(){
    if (!checkedIn || !SignedIn || Socket.readyState != WebSocket.OPEN){
        MusicPlaylist[PlaylistOrder[CurrentSong]].pause();
    }
    else if (ServerStatus == "MINIGAME"){
        if (document.getElementById("minigame-waiting").style.display == "initial" || UIPanels.waitMinigame.style.display == "initial"){
            MusicPlaylist[PlaylistOrder[CurrentSong]].play();
        }
        else{
            MusicPlaylist[PlaylistOrder[CurrentSong]].pause();
            CurrentSong = (CurrentSong + 1) % MusicPlaylist.length;
            MusicPlaylist[PlaylistOrder[CurrentSong]].currentTime = 0;
        }
    }
    else if (ServerStatus == "RESULTS"){
        MusicPlaylist[PlaylistOrder[CurrentSong]].pause();
    }
    else if (ServerStatus == "TURN"){
        MusicPlaylist[PlaylistOrder[CurrentSong]].play();
    }
}

var PodiumPosition = { x: 4, y: 4 };
var ResultsData;
var resultsAnimLightTargets = [];
var resultsAnimEndTime = 0;
var ResultsTempObjects = new THREE.Group();
Scene.add(ResultsTempObjects);
function TriggerResultsAnimation(data, skipAnim){
    ResultsData = data;

    for (let i = 0; i < ResultsData.data.length - 1; i++){
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

    for (let i = 0; i < ServerSilverStars.length; i++){
        Scene.remove(ServerSilverStars[i].obj);
    }

    document.getElementsByClassName("game-ui")[0].style.display = "none";

    Renderer.domElement.style.filter = "";

    Scene.remove(Player);
    PlayerObjects.clear();
    Scene.remove(light);
    ambient.intensity = 0.1;
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
    ResultsTempObjects.add(Block1, Block2, Block3);

    //Put players on podium
    if (data.data.length > 0){
        var Player1 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[0].character), alphaTest: 0.5, side: THREE.DoubleSide}));
        Player1.castShadow = true;
        Player1.position.set(PodiumPosition.x, getHeightTile(PodiumPosition.x, PodiumPosition.y) + 1 + 0.375, PodiumPosition.y);
        ResultsTempObjects.add(Player1);
    }
    if (data.data.length > 1){
        var Player2 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[1].character), alphaTest: 0.5, side: THREE.DoubleSide}));
        Player2.castShadow = true;
        Player2.position.set(PodiumPosition.x + 1, getHeightTile(PodiumPosition.x + 1, PodiumPosition.y) + (2 / 3) + 0.375, PodiumPosition.y);
        ResultsTempObjects.add(Player2);
    }
    if (data.data.length > 2){
        var Player3 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.75), new THREE.MeshStandardMaterial({map: GeneratePlayerTexture(ResultsData.data[2].character), alphaTest: 0.5, side: THREE.DoubleSide}));
        Player3.castShadow = true;
        Player3.position.set(PodiumPosition.x - 1, getHeightTile(PodiumPosition.x - 1, PodiumPosition.y) + (1 / 3) + 0.375, PodiumPosition.y);
        ResultsTempObjects.add(Player3);
    }

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
    ResultsTempObjects.add(resultsAnimLightTargets[0], resultsAnimLightTargets[1], resultsAnimLightTargets[2]);
    light1.target = resultsAnimLightTargets[0];
    light2.target = resultsAnimLightTargets[1];
    light3.target = resultsAnimLightTargets[2];
    ResultsTempObjects.add(light1, light2, light3);
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
var ResultsAnimCamPos = [
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
    Socket.onclose = null;
    if (roomCodeCopyElems[0].getAttribute("code") == "PUBLIC"){
        Socket.close();
    }

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

    PlayerObjects.clear();
    
    if (!confettiRunning){
        document.getElementsByClassName("confetti-wrapper")[0].style.display = "initial";
        StartConfetti();
    }

    UIState = "podium";
    turnStep = "results";

    let rankings = getRankingsList(data);

    //Set Podium Players
    let podiumNames = document.getElementsByClassName("results-podium-name");
    let podiumStars = document.getElementsByClassName("results-podium-stars");
    let podiumCoins = document.getElementsByClassName("results-podium-coins");
    let podiumAvatars = document.getElementsByClassName("results-podium-image");
    let podiumBases = document.getElementsByClassName("results-podium-blank");

    if (rankings.length > 0){
        let changeInRank = rankings[0].rank < 0 ? 0 : Math.floor((rankings.length - rankings[0].placement) / rankings.length * GameLength * 10);
        let newRank = rankings[0].rank + changeInRank;
        let currentRank = getRank(newRank);
        let rankText = rankings[0].rank < 0 ? currentRank : newRank + "XP";
        podiumNames[0].innerHTML = "<img style=\"transform: translateY(4px);\" width=\"20px\" src=\"resources/textures/ranks/" + currentRank + "-Rank.svg\" title=\"" + rankText + "\">" + rankings[0].ign.split("#")[0];
        podiumCoins[0].textContent = rankings[0].coins;
        podiumStars[0].textContent = rankings[0].stars;
        podiumAvatars[0].setAttribute("src", GeneratePlayerURL(rankings[0].character));
        podiumBases[0].classList.add("results-podium-" + (rankings[0].placement + 1));
    }
    else podiumBases[0].style.display = "none";
    if (rankings.length > 1){
        let changeInRank = rankings[1].rank < 0 ? 0 : Math.floor((rankings.length - rankings[1].placement) / rankings.length * GameLength * 10);
        let newRank = rankings[1].rank + changeInRank;
        let currentRank = getRank(newRank);
        let rankText = rankings[1].rank < 0 ? currentRank : newRank + "XP";
        podiumNames[1].innerHTML = "<img style=\"transform: translateY(4px);\" width=\"20px\" src=\"resources/textures/ranks/" + currentRank + "-Rank.svg\" title=\"" + rankText + "\">" + rankings[1].ign.split("#")[0];
        podiumCoins[1].textContent = rankings[1].coins;
        podiumStars[1].textContent = rankings[1].stars;
        podiumAvatars[1].setAttribute("src", GeneratePlayerURL(rankings[1].character));
        podiumBases[1].classList.add("results-podium-" + (rankings[1].placement + 1));
    }
    else podiumBases[1].style.display = "none";
    if (rankings.length > 2){
        let changeInRank = rankings[2].rank < 0 ? 0 : Math.floor((rankings.length - rankings[2].placement) / rankings.length * GameLength * 10);
        let newRank = rankings[2].rank + changeInRank;
        let currentRank = getRank(newRank);
        let rankText = rankings[2].rank < 0 ? currentRank : newRank + "XP";
        podiumNames[2].innerHTML = "<img style=\"transform: translateY(4px);\" width=\"20px\" src=\"resources/textures/ranks/" + currentRank + "-Rank.svg\" title=\"" + rankText + "\">" + rankings[2].ign.split("#")[0];
        podiumCoins[2].textContent = rankings[2].coins;
        podiumStars[2].textContent = rankings[2].stars;
        podiumAvatars[2].setAttribute("src", GeneratePlayerURL(rankings[2].character));
        podiumBases[2].classList.add("results-podium-" + (rankings[2].placement + 1));
    }
    else podiumBases[2].style.display = "none";

    //Generate scrollable leaderboard
    let foundYou = false;
    let resultsList = document.getElementsByClassName("results-list")[0];
    for (var i = 0; i < rankings.length; i++){
        let changeInRank = rankings[i].rank < 0 ? 0 : Math.floor((rankings.length - rankings[i].placement) / rankings.length * GameLength * 10);
        let newRank = rankings[i].rank + changeInRank;
        let currentRank = getRank(newRank);

        let listElement = document.createElement("div");
        listElement.classList.add("results-list-item-" + (i%2==0?"a":"b"));
        if (rankings[i].placement == 0) listElement.classList.add("results-list-item-1");
        else if (rankings[i].placement == 1) listElement.classList.add("results-list-item-2");
        else if (rankings[i].placement == 2) listElement.classList.add("results-list-item-3");
        resultsList.appendChild(listElement);

        listElement.appendChild(document.createElement("span"));
        listElement.children[0].classList.add("results-list-placement");
        listElement.children[0].textContent = (rankings[i].placement + 1) + ". ";
        listElement.appendChild(document.createElement("img"));
        listElement.children[1].setAttribute("src", GeneratePlayerURL(rankings[i].character));
        listElement.children[1].classList.add("results-list-avatar");
        listElement.appendChild(document.createElement("img"));
        listElement.children[2].setAttribute("src", "resources/textures/ranks/" + currentRank + "-Rank.svg");
        listElement.children[2].title = rankings[i].rank < 0 ? getRank(rankings[i].rank) : newRank + "XP";
        listElement.children[2].classList.add("results-list-rank");
        listElement.appendChild(document.createElement("span"));
        listElement.children[3].classList.add("results-list-username");
        listElement.children[3].textContent = rankings[i].ign.split("#")[0];
        listElement.appendChild(document.createElement("span"));
        listElement.children[4].classList.add("results-list-info");

        listElement.children[4].appendChild(document.createElement("span"));
        listElement.children[4].children[0].classList.add("results-list-stars");
        listElement.children[4].children[0].textContent = rankings[i].stars + " ";
        listElement.children[4].appendChild(document.createElement("img"));
        listElement.children[4].children[1].classList.add("results-list-text-img");
        listElement.children[4].children[1].setAttribute("src", "resources/textures/squid_star.svg");
        listElement.children[4].appendChild(document.createElement("div"));
        listElement.children[4].children[2].style.display = "inline-block";
        listElement.children[4].children[2].style.width = "5px";
        listElement.children[4].appendChild(document.createElement("span"));
        listElement.children[4].children[3].classList.add("results-list-coins");
        listElement.children[4].children[3].textContent = rankings[i].coins + " ";
        listElement.children[4].appendChild(document.createElement("img"));
        listElement.children[4].children[4].classList.add("results-list-text-img");
        listElement.children[4].children[4].setAttribute("src", "resources/textures/squid_coin.svg");

        if (rankings[i].ign == IGN){
            //THIS IS YOU
            document.getElementsByClassName("results-you")[0].style.display = "inline-block";
            document.getElementsByClassName("results-you-username")[0].textContent = IGN.split("#")[0];
            document.getElementsByClassName("results-you-stars")[0].textContent = rankings[i].stars;
            document.getElementsByClassName("results-you-coins")[0].textContent = rankings[i].coins;
            document.getElementsByClassName("results-you-placement")[0].textContent = (rankings[i].placement+1) + ". ";
            foundYou = true;

            //Rank stuff
            let nextRank = getNextRank(newRank);
            if (nextRank != null){
                document.getElementsByClassName("results-rank-to")[0].textContent = newRank + "XP (" + (RankThresholds[nextRank] - newRank) + " to go)";
                document.getElementsByClassName("results-rank-change")[0].textContent = "+" + changeInRank;
                document.getElementsByClassName("results-rank-progress-bar-value")[0].style.width = (inverseLerp(RankThresholds[currentRank], RankThresholds[nextRank], newRank) * 100) + "%";
                document.getElementsByClassName("results-previous-rank-img")[0].src = "resources/textures/ranks/" + currentRank + "-Rank.svg";
                document.getElementsByClassName("results-next-rank-img")[0].src = "resources/textures/ranks/" + nextRank + "-Rank.svg";
                document.getElementsByClassName("results-next-rank-img")[0].style.display = "initial";
            }
            else{
                document.getElementsByClassName("results-rank-to")[0].textContent = newRank + "XP";
                document.getElementsByClassName("results-rank-change")[0].textContent = "+" + changeInRank;
                document.getElementsByClassName("results-rank-progress-bar-value")[0].style.width = "100%";
                document.getElementsByClassName("results-previous-rank-img")[0].src = "resources/textures/ranks/" + currentRank + "-Rank.svg";
                document.getElementsByClassName("results-next-rank-img")[0].style.display = "none";
                if (rankings[i].rank < 0) document.getElementsByClassName("results-rank-gain")[0].style.display = "none";
            }
        }
    }
}

document.getElementsByClassName("leaderboard-button")[0].onclick = function(e){
    UIPanels.globalLeaderboard.style.display = UIPanels.globalLeaderboard.style.display == "none" ? "initial" : "none";
};
document.getElementsByClassName("global-leaderboard-close")[0].onclick = function(e){ UIPanels.globalLeaderboard.style.display = "none"; };


var EndTurnServerTimeout;
function endTurnTimeout(i, message){
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

        UIPanels.minigame.style.visibility = "visible";

        document.getElementsByClassName("roll-display")[0].style.transform = "scale(0)";
        document.getElementsByClassName("custom-dice-input")[0].style.display = "none";
        document.getElementsByClassName("roll-inputs")[0].style.display = "none";
        document.getElementsByClassName("move-undo-button")[0].style.display = "none";
        document.getElementsByClassName("move-end-turn-button")[0].style.display = "none";
        document.getElementsByClassName("player-inputs")[0].style.display = "none";
        document.getElementsByClassName("board-inputs")[0].style.display = "none";
        document.getElementsByClassName("item-menu")[0].style.display = "none";
        document.getElementsByClassName("item-toss-menu")[0].style.display = "none";

        let tile = getMapTile(PlayerData.position.x, PlayerData.position.y);
        if (Object.hasOwn(tile, "popup")){
            document.getElementById(tile.popup).style.display = "none";
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
        
        let yourIndex = 0;
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

            if (i < data.lobby.length && data.lobby[i].ign == IGN){
                yourIndex = i;
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
        if (Object.hasOwn(MinigameData[data.minigame], "random")){
            let rng = mulberry32((data.startTime / 20000000 * (yourIndex + i) * ServerTurn ** 32) >>> 0);
            descrip = descrip.replaceAll("{random}", MinigameData[data.minigame].random[Math.floor(rng() * MinigameData[data.minigame].random.length)]);
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
            document.getElementById("battle-minigame-flair").style.display = "none";
            document.getElementById("star-steal-minigame-flair").style.display = "none";
            document.getElementById("duel-minigame-flair").style.display = "block";
            document.getElementById("coin-minigame-flair").style.display = "none";

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
            document.getElementById("battle-minigame-flair").style.display = "none";
            document.getElementById("star-steal-minigame-flair").style.display = "block";
            document.getElementById("duel-minigame-flair").style.display = "none";
            document.getElementById("coin-minigame-flair").style.display = "none";

            for (let i = 0; i < rewardOptions.length; i++){
                rewardOptions[i].style.display = i < 2 ? "inline-block" : "none";
            }
            let yourUsernameIndex = -1;
            for (let i = 0; i < data.lobby.length; i++) if (data.lobby[i].ign == IGN) yourUsernameIndex = i;
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
            document.getElementById("battle-minigame-flair").style.display = "block";
            document.getElementById("star-steal-minigame-flair").style.display = "none";
            document.getElementById("duel-minigame-flair").style.display = "none";
            document.getElementById("coin-minigame-flair").style.display = "none";

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
            document.getElementById("minigame-type-title").textContent = MinigameData[CurrentMinigame].type == "coin" ? "Coin Minigame" : "Minigame";
            document.getElementById("battle-minigame-flair").style.display = "none";
            document.getElementById("star-steal-minigame-flair").style.display = "none";
            document.getElementById("duel-minigame-flair").style.display = "none";
            document.getElementById("coin-minigame-flair").style.display = MinigameData[CurrentMinigame].type == "coin" ? "block" : "none";

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
                    minigameSubmitButton.disabled = MinigameChatHistory[i].subject == IGN;
                    minigameSubmitButton.textContent = MinigameChatHistory[i].subject == IGN ? "Submitted" : "Submit Results";
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
            document.getElementById("private-checkin-play-game").disabled = false;
            document.getElementById("private-checkin-play-game").textContent = "Join Back";
        }
        else{
            UIPanels.login.style.display = "initial";
            UIState = "menu";
        }
    }

    UpdateMusicPlaylist();
}

var checkedIn = false;

function loginSubmit(){
    if (Socket.readyState == Socket.OPEN){
        let discord = document.getElementById("login_discord").value;
        let password = document.getElementById("login_password").value;

        if (discord.length == 0 || password.length == 0){
            document.getElementById("login-error-message").innerHTML = "Please fill out all fields";
            return;
        }

        //document.cookie = "ign=" + ign + "; expires=" + new Date(2999, 12, 30).toUTCString();
        document.cookie = "discord=" + discord + "; expires=" + new Date(2999, 12, 30).toUTCString();
        loadCookies();

        UIPanels.login.style.display = "none";
        UIPanels.connecting.style.display = "initial";

        Socket.send(JSON.stringify({ method: "login", discord: discord, password: password }));
    }
}
function signupSubmit(){
    if (Socket.readyState == Socket.OPEN){
        let ign = document.getElementById("signup_ign_input").value;
        let discord = document.getElementById("signup_discord_input").value;
        let password = document.getElementById("signup_password_input").value;
        let passwordConfirm = document.getElementById("signup_password_confirm").value;
        let character = { hat: CCHatIndex, hair: CCHairIndex, skin: CCSkinIndex, shirt: CCShirtIndex };
        PlayerCharacter = character;

        if (ign.length == 0 || discord.length == 0 || password.length == 0 || passwordConfirm.length == 0){
            document.getElementById("signup-error-message").innerHTML = "Please fill out all fields";
            return;
        }

        if (password.length < 8){
            document.getElementById("signup-error-message").innerHTML = "Password must be at least 8 characters long";
            return;
        }

        if (password != passwordConfirm){
            document.getElementById("signup-error-message").innerHTML = "Passwords do not match";
            return;
        }

        let testIGN = ign.split("#");
        if (testIGN.length != 2){
            //Error, must contain numbers at end
            document.getElementById("signup-error-message").innerHTML = "Splatoon Username must contain profile numbers<br>(e.g. Username<b>#1234</b>)";
            return;
        }

        document.cookie = "ign=" + ign + "; expires=" + new Date(2999, 12, 30).toUTCString();
        document.cookie = "discord=" + discord + "; expires=" + new Date(2999, 12, 30).toUTCString();
        loadCookies();

        UIPanels.signup.style.display = "none";
        UIPanels.connecting.style.display = "initial";

        Socket.send(JSON.stringify({ method: "register", ign: ign, discord: discord, password: password, character: character }));
    }
}
document.getElementById("login-form").onsubmit = function(e){
    e.preventDefault();
    loginSubmit();
    return false;
};
//document.getElementById("loginbtn").onclick = (e) => loginSubmit();
/*document.getElementById("signup-form").onsubmit = function(e){
    e.preventDefault();
    signupSubmit();
    return false;
};*/
document.getElementById("signupbtn").onclick = (e) => signupSubmit();
document.getElementsByClassName("login-form-swap")[0].onclick = function(e){
    UIPanels.login.style.display = "none";
    UIPanels.signup.style.display = "initial";
};
document.getElementsByClassName("signup-form-swap")[0].onclick = function(e){
    UIPanels.login.style.display = "initial";
    UIPanels.signup.style.display = "none";
};

var CheckInServerTimeout;
function check_in_server(data){
    clearTimeout(CheckInServerTimeout);
    if (data.success){
        checkedIn = true;

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
            minigameSubmitButton.disabled = data.data.subject == IGN;
            minigameSubmitButton.textContent = data.data.subject == IGN ? "Submitted" : "Submit Results";
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

    UpdateMusicPlaylist();
}

function getRankingsList(data){
    //Sort them
    for (var i = 0; i < data.data.length - 1; i++){
        for (var j = 0; j < data.data.length - i - 1; j++){
            if (data.data[j].stars < data.data[j+1].stars || (data.data[j].stars == data.data[j+1].stars && data.data[j].coins < data.data[j+1].coins)){
                let temp = data.data[j];
                data.data[j] = data.data[j+1];
                data.data[j+1] = temp;
            }
        }
    }

    let rankings = [];
    let currentRank = 0;
    let nextRank = 0;
    while (data.data.length > 0){
        currentRank = nextRank;
        let highestCoins = data.data[0].coins;
        let highestStars = data.data[0].stars;

        for (let i = data.data.length - 1; i >= 0; i--){
            if (data.data[i].coins == highestCoins && data.data[i].stars == highestStars){
                nextRank++;
                rankings.push({ ign: data.data[i].ign, coins: highestCoins, stars: highestStars, character: data.data[i].character, rank: data.data[i].rank, placement: currentRank });
                data.data.splice(i, 1);
            }
        }
    }
    return rankings;
}

var endGameFailTimeout;
document.getElementById("results-leave-game-button").onclick = function(e) {
    if (Socket.readyState == WebSocket.OPEN){
        Socket.send(JSON.stringify({ method: "leave_game", token: TOKEN }));
        document.getElementById("results-leave-game-button").disabled = true;
        document.getElementById("results-leave-game-button").textContent = "Please Wait";
        settingsElement.style.display = "none";

        endGameFailTimeout = setTimeout(() => {
            document.getElementById("results-leave-game-button").disabled = false;
            document.getElementById("results-leave-game-button").textContent = "Leave Game";
        }, 5000);
    }
    else{
        window.location.reload();
    }
}

document.getElementById("settings-off-click").onclick = function(e){
    settingsElement.style.display = "none";
    document.getElementById("settings-off-click").style.display = "none";
};

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

function ClearConfetti(){
    confettiRunning = false;
    const confettiWrapper = document.querySelector('.confetti-wrapper');
    while (confettiWrapper.children.length > 0){
        confettiWrapper.removeChild(confettiWrapper.children[0]);
    }
}










function debugSetState(state){
    UIState = state;
}

const debugSet = document.getElementsByClassName("debug-set");
for (let i = 0; i < debugSet.length; i++){
    debugSet[i].onclick = (e) => {debugSetState(debugSet[i].textContent);};
}