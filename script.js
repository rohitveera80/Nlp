// Three.js and Chart.js CDNs are handled in index.html, so no need to repeat here.

document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Hero Background using Three.js ---
    let scene, camera, renderer, points;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initHero3D() {
        const canvas = document.getElementById('hero-3d-bg');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
        camera.position.z = 1000;

        const positions = [];
        const colors = [];
        const numParticles = 5000;
        const n = 1000, n2 = n / 2; 

        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * n - n2;
            const y = Math.random() * n - n2;
            const z = Math.random() * n - n2;
            positions.push(x, y, z);
            
            const vx = (x / n) + 0.5;
            const vy = (y / n) + 0.5;
            const vz = (z / n) + 0.5;
            // Colors: cyan and magenta
            const color = new THREE.Color();
            color.setRGB(vx, Math.random() * 0.25, vy);
            colors.push(color.r, color.g, color.b);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0f172a, 1); // Match body background

        document.querySelector('.hero-section').addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function animateHero3D() {
        requestAnimationFrame(animateHero3D);
        const time = Date.now() * 0.00005;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        points.rotation.y = time * 0.5;
        renderer.render(scene, camera);
    }
    
    initHero3D();
    animateHero3D();

    // --- Scroll-triggered Animations ---
    const scrollElements = document.querySelectorAll('.scroll-fade-in, .timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => {
        observer.observe(el);
    });

    // --- Demand Analysis Chart.js ---
    const chartCanvas = document.getElementById('demand-chart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const demandChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Global Tech Leaders', 'Indian IT Services', 'AI Startups'],
                datasets: [{
                    data: [0, 0, 0], // Initial data
                    backgroundColor: [
                        'rgba(6, 182, 212, 0.7)',  // Cyan
                        'rgba(217, 70, 239, 0.7)', // Fuchsia
                        'rgba(139, 92, 246, 0.7)'  // Violet
                    ],
                    borderColor: '#1e293b',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1' // Slate 300
                        }
                    }
                }
            }
        });

        const chartObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                demandChart.data.datasets[0].data = [45, 35, 20]; // Final data
                demandChart.update();
                chartObserver.unobserve(chartCanvas);
            }
        }, { threshold: 0.5 });

        chartObserver.observe(chartCanvas);
    }
});
