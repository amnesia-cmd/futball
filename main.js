// Scene setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground (pitch)
const groundGeo = new THREE.PlaneGeometry(20, 40);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x0a5c3b });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Goal
const goalGeo = new THREE.BoxGeometry(6, 3, 0.2);
const goalMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const goal = new THREE.Mesh(goalGeo, goalMat);
goal.position.set(0, 1.5, -18);
scene.add(goal);

// Ball
const ballGeo = new THREE.SphereGeometry(0.3, 32, 32);
const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.set(0, 0.3, 10);
scene.add(ball);

// Goalkeeper (simple box = 2D style keeper)
const keeperGeo = new THREE.BoxGeometry(1, 2, 0.5);
const keeperMat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
const keeper = new THREE.Mesh(keeperGeo, keeperMat);
keeper.position.set(0, 1, -17);
scene.add(keeper);

// Camera position
camera.position.set(0, 6, 15);
camera.lookAt(0, 0, -10);

// Ball movement
let shooting = false;
let velocity = new THREE.Vector3(0, 0, 0);

// Click to shoot
window.addEventListener("click", () => {
  if (shooting) return;

  shooting = true;

  // random slight direction for realism
  velocity.set(
    (Math.random() - 0.5) * 0.3,
    0,
    -0.6
  );
});

// Animate keeper left-right
let dir = 1;

// Game loop
function animate() {
  requestAnimationFrame(animate);

  // keeper AI movement
  keeper.position.x += 0.05 * dir;
  if (keeper.position.x > 2) dir = -1;
  if (keeper.position.x < -2) dir = 1;

  // ball movement
  if (shooting) {
    ball.position.add(velocity);

    // collision-ish check with goal line
    if (ball.position.z < -17.5) {
      shooting = false;

      // reset ball
      setTimeout(() => {
        ball.position.set(0, 0.3, 10);
      }, 1000);
    }
  }

  renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});