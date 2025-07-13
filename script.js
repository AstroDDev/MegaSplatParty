import * as THREE from "three"

var COOKIES = {};
function loadCookies(){
    if (document.cookie == "") return;
    var rawCooks = document.cookie.split(";");
    if (rawCooks.length == 0) return;
    for (let i = 0; i < rawCooks.length; i++){
        let d = rawCooks[i].split("=");
        COOKIES[d[0]] = d[1];
    }
}
loadCookies();

function saveCookies(expiry){
    if (TOKEN == "") return;
    document.cookie = "token=" + TOKEN + ";expires=" + expiry.toUTCString();
}

var TOKEN = "";
if (Object.hasOwn(COOKIES, "token")){
    TOKEN = COOKIES.token;
}

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

const ATLAS = new THREE.TextureLoader().load("./resources/textures/atlas.png");
ATLAS.wrapS = THREE.RepeatWrapping;
ATLAS.wrapT = THREE.RepeatWrapping;
ATLAS.magFilter = THREE.NearestFilter;
ATLAS.minFilter = THREE.NearestFilter;
ATLAS.colorSpace = THREE.SRGBColorSpace;

const SKYBOX_TEX = new THREE.CubeTextureLoader().load([
    "./resources/Skyboxes/px.png",
    "./resources/Skyboxes/nx.png",
    "./resources/Skyboxes/py.png",
    "./resources/Skyboxes/ny.png",
    "./resources/Skyboxes/pz.png",
    "./resources/Skyboxes/nz.png"
]);
SKYBOX_TEX.colorSpace = THREE.SRGBColorSpace;

Scene.background = SKYBOX_TEX;

const ATLAS_SIZE = {x: 8, y: 8};
const ATLAS_UV_SIZE = {x: 1 / ATLAS_SIZE.x - (EPSILON * 2), y: 1 / ATLAS_SIZE.y - (EPSILON * 2)};

const PlayerTex = new THREE.TextureLoader().load("./resources/textures/AIRA_Pixel1.png");
PlayerTex.magFilter = THREE.NearestFilter;
PlayerTex.minFilter = THREE.NearestFilter;
PlayerTex.colorSpace = THREE.SRGBColorSpace;

var Player = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({map: PlayerTex, alphaTest: 0.5, side: THREE.DoubleSide}));
Player.castShadow = true;
Player.receiveShadow = false;
Player.position.set(10, 2.875, 15);
Scene.add(Player);

var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
var light = new THREE.DirectionalLight(0xFFFFFF, 2);

light.castShadow = true;
light.position.y = 20;
light.position.z = 10;

//light.shadow.bias = -0.00001;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

light.target = Player;

Player.add(ambient);
Player.add(light);

function loadMap(){
    fetch("./resources/maps/barnacle-and-dime.json").then(res => res.json()).then(async res => {
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
    var mesh = new THREE.Mesh(geometry, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    Scene.add(mesh);

    Camera.position.z = 2;
    Camera.position.y = 0.5;
    //Camera.position.x = 10;

    Camera.rotateX(-15 * Math.PI / 180);

    Renderer.render(Scene, Camera);
}

loadMap();

var keys = {};
window.onkeydown = function(e){ 
    keys[e.keyCode] = true; 
}
window.onkeyup = function(e){ keys[e.keyCode] = false; }

var lastFrameTime = Date.now();
var UIState = "connecting";
const UIPanels = {
    connecting: document.getElementById("connecting"),
    login: document.getElementById("login"),
    checkin: document.getElementById("checkin")
};
function update(){
    var thisFrameTime = Date.now();
    var deltatime = thisFrameTime - lastFrameTime;
    lastFrameTime = thisFrameTime;
    document.getElementsByClassName("debug")[0].textContent = "FPS: " + Math.round(1000 / deltatime);

    //UI STUFF
    if (UIState == "login" || UIState == "connecting" || UIState == "register" || UIState == "checkin"){
        Renderer.domElement.style.filter = "blur(10px) opacity(50%)";
        let angle = Date.now() / 10000;
        Camera.position.set(Math.cos(angle) * 10 + (mapSize.x / 2), 5, Math.sin(angle) * 10 + (mapSize.y / 2));
        Camera.lookAt(new THREE.Vector3(mapSize.x / 2, 2.5, mapSize.y / 2));
    }

    Renderer.render(Scene, Camera);
    requestAnimationFrame(update);
}

update();

//NETWORKING!!!
const Socket = new WebSocket("ws://localhost:6969");

Socket.onopen = function(e){
    console.log("Socket open");
    Socket.send(JSON.stringify({ method: "get_status" }));
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
    }
}

var GetStatusServerTimeout;
function getStatusTimeout(i){

}
var ServerStatus = "null";
function get_status_server(data){
    clearTimeout(GetStatusServerTimeout);
    ServerStatus = data.status;
    switch(data.status){
        case "REGISTRATION":
            if (TOKEN == ""){
                UIState = "register";
                UIPanels.connecting.style.display = "none";
                UIPanels.login.style.display = "initial";
            }
            else{
                Socket.send(JSON.stringify({method: "sign_in", token: TOKEN}));
            }
            break;
        case "CHECK_IN":
            if (TOKEN == ""){
                UIState = "register";
                UIPanels.connecting.style.display = "none";
                UIPanels.login.style.display = "initial";
            }
            else{
                Socket.send(JSON.stringify({method: "sign_in", token: TOKEN}));
            }
            break;
        case "TURN":
            break;
        case "MINIGAME":
            break;
        case "RESULTS":
            break;
    }
}

const TIMEOUT_LIMIT = 10;

function announcement_server(data){

}

function end_turn_server(data){

}

function get_lobby_server(data){

}

var SignInServerTimeout;
function signInTimeout(i){
    if (i > TIMEOUT_LIMIT) disconnectError();
    SignInServerTimeout = setTimeout(() => {signInTimeout(i+1)}, 1000);
    Socket.send({ method:"sign_in", token: TOKEN });
}
function sign_in_server(data){
    //Should probably do get_player_data next instead TODO!!!
    clearTimeout(SignInServerTimeout);
    if (data.success){
        UIState = "checkin";

        UIPanels.checkin.children[0].children[0].textContent = "Tournament starts " + new Date(data.startTime * 1000).toLocaleString("en-CA", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short" });
        if (ServerStatus == "CHECK_IN"){
            UIPanels.checkin.children[0].children[2].textContent = data.checkedIn ? "You are checked-in!" : "Check-in is live";
            document.getElementById("checkinbtn").disabled = data.checkedIn;
            document.getElementById("checkinbtn").textContent = data.checkedIn ? "Checked-In" : "Check-in";
        }
        else {
            UIPanels.checkin.children[0].children[2].textContent = "Check-in opens 1 hour before tournament";
            document.getElementById("checkinbtn").disabled = true;
            document.getElementById("checkinbtn").textContent = "Check-in Closed";
        }

        UIPanels.connecting.style.display = "none";
        UIPanels.checkin.style.display = "initial";
    }
}

var RegisterServerTimeout;
function registerTimeout(discord, ign, i){
    if (i > TIMEOUT_LIMIT) disconnectError();
    Socket.send(JSON.stringify({ method: "register", discord: discord, ign: ign }));
    RegisterServerTimeout = setTimeout(() => {registerTimeout(discord, ign, i+1);}, 1000);
}
document.getElementById("loginbtn").onclick = function(e){
    if (Socket.readyState == Socket.OPEN){
        let discord = document.getElementById("login_discord_input").value;
        let ign = document.getElementById("login_ign_input").value;

        let testIGN = ign.split("#");
        if (testIGN.length != 2){
            //Error must contain numbers at end
            console.log("Error1");
            return;
        }

        Socket.send(JSON.stringify({ method: "register", discord: discord, ign: ign }));
        RegisterServerTimeout = setTimeout(() => {registerTimeout(discord, ign, 0);}, 1000);

        UIState = "connecting";
        UIPanels.login.style.display = "none";
        UIPanels.connecting.style.display = "initial";
    }
}
function register_server(data){
    clearTimeout(RegisterServerTimeout);
    if (data.success){
        TOKEN = data.token;
        saveCookies(new Date(data.startTime * 1000 + 86400000));//1 day after start time
        
        Socket.send(JSON.stringify({ method: "sign_in", token: TOKEN }));
        SignInServerTimeout = setTimeout(() => { signInTimeout(0); }, 1000);
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
    if (i > TIMEOUT_LIMIT) disconnectError();
    Socket.send(JSON.stringify({ method:"check_in", token: TOKEN }));
    CheckInServerTimeout = setTimeout(() => {checkInTimeout(i+1)}, 1000);
}

function disconnectError(){
    alert("Could not connect to server! Check your internet and refresh the page.");
}