// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll observers
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    
    // Add active to elements immediately in view (hero section)
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});

// Network Canvas Background
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const PARTICLE_COUNT = Math.min(window.innerWidth / 15, 100);

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow movement for subtle effect
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw lines connecting nearby particles
    const connectionDistance = 140;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                // Opacity based on distance
                const opacity = (1 - distance / connectionDistance) * 0.3;
                ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start animation loop
animate();
