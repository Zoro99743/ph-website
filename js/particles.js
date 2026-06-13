// Three.js Magical Board Game Particle Field
const canvas = document.getElementById('three-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Helper to generate board game icon textures
    function createIconTexture(iconText) {
        const size = 64;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        
        // Add a soft magical glow
        ctx.shadowColor = 'rgba(233, 182, 94, 0.8)';
        ctx.shadowBlur = 8;
        
        ctx.fillStyle = '#e9b65e'; // Golden primary color
        ctx.font = '40px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(iconText, size/2, size/2 + 2);
        
        return new THREE.CanvasTexture(c);
    }

    const gameIcons = ['⚅', '♞', '♠', '♦', '⚂']; // Dice, Knight, Spade, Diamond, Dice 3
    const particleMeshes = [];
    const basePositions = [];
    const particleVelocities = []; // For physics
    const particlesPerGroup = 40; 
    const totalGroups = gameIcons.length;

    for (let j = 0; j < totalGroups; j++) {
        const geometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particlesPerGroup * 3);
        const basePos = new Float32Array(particlesPerGroup * 3);
        const velArray = new Float32Array(particlesPerGroup * 3);
        
        for(let i = 0; i < particlesPerGroup * 3; i+=3) {
            // Random position
            posArray[i] = (Math.random() - 0.5) * 20; // x
            posArray[i+1] = (Math.random() - 0.5) * 20; // y
            posArray[i+2] = (Math.random() - 0.5) * 20; // z
            
            basePos[i] = posArray[i];
            basePos[i+1] = posArray[i+1];
            basePos[i+2] = posArray[i+2];
            
            // Random initial velocity
            velArray[i] = (Math.random() - 0.5) * 0.05; // vx
            velArray[i+1] = -0.05 - Math.random() * 0.05; // vy (falling downwards)
            velArray[i+2] = (Math.random() - 0.5) * 0.05; // vz
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.4, // Larger size to clearly see the icons
            map: createIconTexture(gameIcons[j]),
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
        particleMeshes.push(mesh);
        basePositions.push(basePos);
        particleVelocities.push(velArray);
    }
    
    camera.position.z = 5;
    
    // Interaction Tracking
    let mouseWorld = new THREE.Vector3(9999, 9999, 9999);
    let isActive = false;
    let interactionTimeout;
    
    function updateInteraction(clientX, clientY) {
        const vec = new THREE.Vector3();
        vec.set(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        vec.unproject(camera);
        vec.sub(camera.position).normalize();
        const distance = -camera.position.z / vec.z;
        mouseWorld.copy(camera.position).add(vec.multiplyScalar(distance));
        
        isActive = true;
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => { isActive = false; }, 3000);
    }

    document.addEventListener('mousemove', (e) => updateInteraction(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) updateInteraction(e.touches[0].clientX, e.touches[0].clientY);
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        for (let j = 0; j < totalGroups; j++) {
            const mesh = particleMeshes[j];
            const positions = mesh.geometry.attributes.position.array;
            const velocities = particleVelocities[j];
            
            for(let i = 0; i < particlesPerGroup; i++) {
                const i3 = i * 3;
                
                // 1. Gravity & Falling Physics
                velocities[i3 + 1] -= 0.0005; // constant downward pull
                
                // Apply velocity to position
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];
                
                // Add subtle horizontal drift
                velocities[i3] += Math.sin(elapsedTime + i) * 0.001;
                
                // 2. Reset if they fall off screen (wrap around to top)
                if (positions[i3 + 1] < -12) {
                    positions[i3] = (Math.random() - 0.5) * 20; // random new X
                    positions[i3 + 1] = 12 + Math.random() * 5; // drop from top
                    positions[i3 + 2] = (Math.random() - 0.5) * 20; // random new Z
                    
                    velocities[i3] = (Math.random() - 0.5) * 0.05;
                    velocities[i3 + 1] = -0.05 - Math.random() * 0.05;
                    velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
                }
                
                // 3. Interactive Effect: The Deflector Shield (Mouse Repulsion)
                if (isActive) {
                    const dx = positions[i3] - mouseWorld.x;
                    const dy = positions[i3 + 1] - mouseWorld.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    // If a piece hits the invisible mouse sphere, blast it away
                    if (dist < 3.5 && dist > 0) {
                        const force = (3.5 - dist) * 0.03; // strength of the blast
                        velocities[i3] += (dx / dist) * force;
                        velocities[i3 + 1] += (dy / dist) * force;
                        velocities[i3 + 2] += (Math.random() - 0.5) * force; // chaotic 3D spin
                    }
                }
                
                // 4. Air Friction (slows down extreme velocities over time)
                velocities[i3] *= 0.98;
                velocities[i3 + 1] *= 0.99; // slightly less friction vertically so gravity wins
                velocities[i3 + 2] *= 0.98;
            }
            mesh.geometry.attributes.position.needsUpdate = true;
        }
        
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
