let spheres = [];
const container = document.getElementById('three-shapes');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, container.offsetWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(container.offsetWidth, 500);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1.2));
camera.position.z = 8;

const positions = [-6, -4, -2, 0, 2, 4, 6];

function createSpheres() {
  spheres.forEach(s => scene.remove(s));
  spheres = [];

  const isDark = document.body.classList.contains('dark-theme');

  positions.forEach((xPos, i) => {
    const geometry = new THREE.SphereGeometry(1.8, 30, 10);
    const color = isDark ? 0xfef8b4 : 0x000000;
    const material = new THREE.MeshBasicMaterial({ color, wireframe: true });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xPos, 0, 0);

    scene.add(mesh);
    spheres.push(mesh);
  });
}

function animate() {
  requestAnimationFrame(animate);
  spheres.forEach((s, i) => {
    s.rotation.x += 0.002 + i * 0.0004;
    s.rotation.y += 0.003 + i * 0.0003;
    s.position.y = 0.5 * Math.sin(Date.now() * 0.001 + i);
  });
  renderer.render(scene, camera);
}


createSpheres();
animate();

// light or dark theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  setTimeout(createSpheres, 100); // Wait for DOM to update
});
window.addEventListener('resize', () => {
  camera.aspect = container.offsetWidth / 400;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, 400);
});

//intersection observer
const sections = document.querySelectorAll('section');

// Options for the observer
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      console.log(`Entered: ${entry.target.className || entry.target.tagName}`);
    } else {
      entry.target.classList.remove('in-view');
      console.log(`Left: ${entry.target.className || entry.target.tagName}`);
    }
  });
}, options);

// Observe each section
sections.forEach(section => {
  observer.observe(section);
});


document.addEventListener('DOMContentLoaded', () => {
  const blogCards = document.querySelectorAll('.blog-card');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(blogCards).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.3}s`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  blogCards.forEach(card => observer.observe(card));
});

//cursor glow follower
const cursor = document.querySelector('.cursor-circle');

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});


// light or dark theme toggle
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});



window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('initial-loader');
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');

    if (!hasSeenLoader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
          loader.remove();
        }, 700);
      }, 1200);

      sessionStorage.setItem('hasSeenLoader', 'true');
    } else {
      loader.style.display = 'none';
    }
  });