let canvasIntro, ctxIntro;
let canvasMain, ctxMain;
let introSnowflakes = [];
let mainSnowflakes = [];
let mouseX = 0, mouseY = 0;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let introActive = true;
let animationId = null;

window.addEventListener('DOMContentLoaded', init);

function init() {
    const openGiftBtn = document.getElementById('open-gift-btn');
    const backBtn = document.getElementById('back-btn');
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    
    openGiftBtn.addEventListener('click', () => switchScreen(introScreen, mainScreen));
    backBtn.addEventListener('click', () => switchScreen(mainScreen, introScreen));
    
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    initCanvas();
    initFloatingTexts();
    animate();
}

function initCanvas() {
    canvasIntro = document.getElementById('snow-intro');
    ctxIntro = canvasIntro.getContext('2d');
    
    canvasMain = document.getElementById('snow-main');
    ctxMain = canvasMain.getContext('2d');
    
    resizeCanvas();
    createIntroSnowflakes();
    createMainSnowflakes();
}

function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvasIntro.width = screenWidth;
    canvasIntro.height = screenHeight;
    
    canvasMain.width = screenWidth;
    canvasMain.height = screenHeight;
    
    createIntroSnowflakes();
    createMainSnowflakes();
}

function handleResize() {
    resizeCanvas();
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!introActive) {
        mainSnowflakes.forEach(snowflake => {
            const dx = mouseX - snowflake.x;
            const dy = mouseY - snowflake.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                snowflake.vx += (dx / distance) * force * 0.5 * 0.5;
                snowflake.vy += (dy / distance) * force * 0.5 * 0.3;
            }
        });
    }
}

function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    
    setTimeout(() => {
        toScreen.classList.add('active');
        introActive = (toScreen.id === 'intro-screen');
        
        mouseX = screenWidth / 2;
        mouseY = screenHeight / 2;
        
        createFireworksEffect();
    }, 500);
}

function createFireworksEffect() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffcc5c', '#45b7d1', '#96ceb4'];
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: screenWidth / 2,
            y: screenHeight / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10 - 5,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 60
        });
    }
    
    function animateFireworks() {
        ctxMain.clearRect(0, 0, screenWidth, screenHeight);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            
            ctxMain.beginPath();
            ctxMain.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctxMain.fillStyle = p.color;
            ctxMain.globalAlpha = p.life / 60;
            ctxMain.fill();
            
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        ctxMain.globalAlpha = 1;
        
        if (particles.length > 0) {
            requestAnimationFrame(animateFireworks);
        } else {
            drawMainSnow();
        }
    }
    
    animateFireworks();
}

function createIntroSnowflakes() {
    introSnowflakes = [];
    
    for (let i = 0; i < 80; i++) {
        introSnowflakes.push({
            x: Math.random() * screenWidth,
            y: Math.random() * screenHeight,
            size: 2 + Math.random() * 4,
            speed: 0.5 * (0.5 + Math.random() * 0.5),
            opacity: 0.3 + Math.random() * 0.6,
            sway: Math.random() * 0.5 - 0.25,
            swaySpeed: 0.01 + Math.random() * 0.02
        });
    }
}

function drawIntroSnow() {
    ctxIntro.clearRect(0, 0, screenWidth, screenHeight);
    
    introSnowflakes.forEach(snowflake => {
        snowflake.y += snowflake.speed;
        snowflake.x += Math.sin(snowflake.sway) * 0.3;
        snowflake.sway += snowflake.swaySpeed;
        
        if (snowflake.y > screenHeight) {
            snowflake.y = -10;
            snowflake.x = Math.random() * screenWidth;
        }
        
        if (snowflake.x > screenWidth + 10) snowflake.x = -10;
        if (snowflake.x < -10) snowflake.x = screenWidth + 10;
        
        ctxIntro.beginPath();
        ctxIntro.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
        ctxIntro.fill();
        
        ctxIntro.beginPath();
        ctxIntro.arc(snowflake.x, snowflake.y, snowflake.size * 1.5, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity * 0.3})`;
        ctxIntro.fill();
    });
}

function createMainSnowflakes() {
    mainSnowflakes = [];
    
    for (let i = 0; i < 200; i++) {
        const depth = Math.random();
        
        mainSnowflakes.push({
            x: Math.random() * screenWidth,
            y: Math.random() * screenHeight,
            z: depth,
            size: 1 + 7 * (1 - depth),
            speed: 0.5 + 2 * (1 - depth),
            opacity: 0.3 + (1 - depth) * 0.7,
            vx: (Math.random() - 0.5) * 0.05,
            vy: 0,
            sway: Math.random() * Math.PI * 2,
            swaySpeed: 0.01 + Math.random() * 0.03
        });
    }
}

function drawMainSnow() {
    ctxMain.clearRect(0, 0, screenWidth, screenHeight);
    
    const sortedSnowflakes = [...mainSnowflakes].sort((a, b) => a.z - b.z);
    
    sortedSnowflakes.forEach(snowflake => {
        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.vx + Math.sin(snowflake.sway) * 0.5;
        snowflake.sway += snowflake.swaySpeed;
        
        if (mouseX !== 0 && mouseY !== 0) {
            const dx = mouseX - snowflake.x;
            const influence = Math.max(0, 1 - Math.abs(dx) / 400);
            snowflake.vx += (dx > 0 ? 0.01 : -0.01) * influence * 0.5;
        }
        
        snowflake.vx = Math.max(-0.5, Math.min(0.5, snowflake.vx * 0.98));
        
        if (snowflake.y > screenHeight + 10) {
            snowflake.y = -10;
            snowflake.x = Math.random() * screenWidth;
            snowflake.vx = (Math.random() - 0.5) * 0.05;
        }
        
        if (snowflake.x > screenWidth + 10) snowflake.x = -10;
        if (snowflake.x < -10) snowflake.x = screenWidth + 10;
        
        const renderSize = snowflake.size * (0.5 + 0.5 * (1 - snowflake.z));
        const renderOpacity = snowflake.opacity * (0.7 + 0.3 * (1 - snowflake.z));
        
        ctxMain.beginPath();
        ctxMain.arc(snowflake.x, snowflake.y, renderSize, 0, Math.PI * 2);
        ctxMain.fillStyle = `rgba(255, 255, 255, ${renderOpacity})`;
        ctxMain.fill();
        
        if (snowflake.z < 0.3) {
            ctxMain.beginPath();
            ctxMain.arc(snowflake.x, snowflake.y, renderSize * 2, 0, Math.PI * 2);
            const gradient = ctxMain.createRadialGradient(
                snowflake.x, snowflake.y, 0,
                snowflake.x, snowflake.y, renderSize * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${renderOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctxMain.fillStyle = gradient;
            ctxMain.fill();
        }
    });
}

function initFloatingTexts() {
    const texts = document.querySelectorAll('.floating-text');
    
    texts.forEach((text, index) => {
        const angle = (index / texts.length) * Math.PI * 2;
        const radius = Math.min(screenWidth, screenHeight) * 0.3;
        
        text.originalX = screenWidth / 2 + Math.cos(angle) * radius;
        text.originalY = screenHeight / 2 + Math.sin(angle) * radius;
        text.currentX = text.originalX;
        text.currentY = text.originalY;
        text.floatAngle = Math.random() * Math.PI * 2;
        text.floatSpeed = 0.003 + Math.random() * 0.004;
        text.floatRadius = 50;
        
        text.style.left = `${text.currentX}px`;
        text.style.top = `${text.currentY}px`;
    });
}

function updateFloatingTexts() {
    const texts = document.querySelectorAll('.floating-text');
    
    texts.forEach(text => {
        text.floatAngle += text.floatSpeed;
        
        const floatX = Math.cos(text.floatAngle) * text.floatRadius;
        const floatY = Math.sin(text.floatAngle * 1.5) * text.floatRadius * 0.7;
        
        text.currentX = text.originalX + floatX;
        text.currentY = text.originalY + floatY;
        
        text.style.left = `${text.currentX}px`;
        text.style.top = `${text.currentY}px`;
        
        const opacity = 0.7 + 0.3 * Math.sin(text.floatAngle * 2);
        text.style.opacity = opacity;
    });
}

function animate() {
    if (introActive) {
        drawIntroSnow();
    } else {
        drawMainSnow();
        updateFloatingTexts();
    }
    
    animationId = requestAnimationFrame(animate);
}

window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});