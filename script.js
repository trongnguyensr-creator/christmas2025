// Giáng Sinh 2024 - Interactive Website
// Tối ưu hiệu năng với requestAnimationFrame

// Khởi tạo toàn cục
let app = {
    // State
    currentScreen: 'intro',
    correctBtnScale: 1,
    wrongClickCount: 0,
    musicPlaying: false,
    snowEnabled: true,
    
    // Canvas
    snowCanvas: null,
    snowCtx: null,
    snow3dCanvas: null,
    snow3dCtx: null,
    
    // Particles
    snowParticles: [],
    snow3dParticles: [],
    
    // Floating elements
    floatingTexts: [],
    floatingImages: [],
    
    // Audio
    bgMusic: null,
    audioContext: null,
    
    // Animation
    animationId: null,
    lastTime: 0,
    
    // Parallax
    mouseX: 0,
    mouseY: 0
};

// Khởi tạo ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Lấy các phần tử DOM
    app.introScreen = document.getElementById('introScreen');
    app.mainScreen = document.getElementById('mainScreen');
    app.correctBtn = document.getElementById('correctBtn');
    app.wrongBtns = document.querySelectorAll('.wrong-btn');
    app.bgMusic = document.getElementById('bgMusic');
    app.musicToggle = document.getElementById('musicToggle');
    app.snowToggle = document.getElementById('snowToggle');
    app.restartBtn = document.getElementById('restartBtn');
    
    // Khởi tạo canvas
    initCanvas();
    
    // Khởi tạo các phần tử bay
    initFloatingElements();
    
    // Gắn sự kiện
    attachEvents();
    
    // Bắt đầu animation
    startAnimation();
}

// Khởi tạo canvas
function initCanvas() {
    // Canvas cho tuyết 2D (intro)
    app.snowCanvas = document.getElementById('snowCanvas');
    app.snowCtx = app.snowCanvas.getContext('2d');
    
    // Canvas cho tuyết 3D (main)
    app.snow3dCanvas = document.getElementById('snow3dCanvas');
    app.snow3dCtx = app.snow3dCanvas.getContext('2d');
    
    // Thiết lập kích thước canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Tạo các hạt tuyết
    createSnowParticles();
    create3dSnowParticles();
}

// Điều chỉnh kích thước canvas
function resizeCanvas() {
    app.snowCanvas.width = window.innerWidth;
    app.snowCanvas.height = window.innerHeight;
    
    app.snow3dCanvas.width = window.innerWidth;
    app.snow3dCanvas.height = window.innerHeight;
}

// Tạo các hạt tuyết 2D (cho intro)
function createSnowParticles() {
    app.snowParticles = [];
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    
    for (let i = 0; i < particleCount; i++) {
        app.snowParticles.push({
            x: Math.random() * app.snowCanvas.width,
            y: Math.random() * app.snowCanvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            sway: Math.random() * 0.5 - 0.25
        });
    }
}

// Tạo các hạt tuyết 3D (cho main scene)
function create3dSnowParticles() {
    app.snow3dParticles = [];
    const particleCount = Math.min(150, Math.floor(window.innerWidth / 10));
    
    for (let i = 0; i < particleCount; i++) {
        const depth = Math.random() * 0.8 + 0.2; // 0.2 đến 1.0
        
        app.snow3dParticles.push({
            x: Math.random() * app.snow3dCanvas.width,
            y: Math.random() * app.snow3dCanvas.height,
            radius: depth * 4, // Hạt gần to hơn
            speed: depth * 2 + 0.5, // Hạt gần rơi nhanh hơn
            opacity: depth * 0.6 + 0.2,
            sway: Math.random() * 1 - 0.5,
            depth: depth,
            wind: Math.random() * 0.5 - 0.25
        });
    }
}

// Khởi tạo các phần tử bay
function initFloatingElements() {
    // Các dòng chữ bay
    const texts = [
        { id: 'text1', content: '🎄 Merry Christmas' },
        { id: 'text2', content: 'Chúc em một mùa Noel an lành' },
        { id: 'text3', content: 'Ấm áp - Hạnh phúc - Bình yên' },
        { id: 'text4', content: 'Yêu thương ngập tràn' },
        { id: 'text5', content: '❄️ Giáng Sinh vui vẻ ❄️' }
    ];
    
    texts.forEach((text, index) => {
        const element = document.getElementById(text.id);
        if (element) {
            app.floatingTexts.push({
                element: element,
                x: Math.random() * (window.innerWidth - 200) + 100,
                y: Math.random() * (window.innerHeight - 100) + 50,
                speedX: (Math.random() * 0.5 - 0.25) * 0.5,
                speedY: (Math.random() * 0.5 - 0.25) * 0.5,
                angle: Math.random() * Math.PI * 2,
                amplitude: Math.random() * 10 + 5,
                frequency: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.3 + 0.7
            });
            
            // Đặt vị trí ban đầu
            element.style.left = `${app.floatingTexts[index].x}px`;
            element.style.top = `${app.floatingTexts[index].y}px`;
            element.style.opacity = app.floatingTexts[index].opacity;
        }
    });
    
    // Tạo các ảnh bay (sử dụng emoji và màu sắc thay vì ảnh thực)
    const imageContainer = document.querySelector('.floating-image-container');
    const imageCount = 7;
    
    const imageThemes = [
        { emoji: '🎁', bg: 'rgba(255, 51, 102, 0.7)' },
        { emoji: '⛄', bg: 'rgba(255, 255, 255, 0.8)' },
        { emoji: '🦌', bg: 'rgba(139, 69, 19, 0.7)' },
        { emoji: '🔔', bg: 'rgba(255, 204, 0, 0.8)' },
        { emoji: '🕯️', bg: 'rgba(255, 255, 255, 0.9)' },
        { emoji: '🧦', bg: 'rgba(255, 102, 102, 0.7)' },
        { emoji: '🌟', bg: 'rgba(255, 255, 100, 0.8)' }
    ];
    
    for (let i = 0; i < imageCount; i++) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'floating-image';
        imageDiv.innerHTML = imageThemes[i].emoji;
        imageDiv.style.backgroundColor = imageThemes[i].bg;
        
        // Vị trí ngẫu nhiên
        const x = Math.random() * (window.innerWidth - 150) + 75;
        const y = Math.random() * (window.innerHeight - 150) + 75;
        
        imageDiv.style.left = `${x}px`;
        imageDiv.style.top = `${y}px`;
        
        imageContainer.appendChild(imageDiv);
        
        app.floatingImages.push({
            element: imageDiv,
            x: x,
            y: y,
            speedX: (Math.random() * 0.3 - 0.15) * 0.7,
            speedY: (Math.random() * 0.3 - 0.15) * 0.7,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.5 - 0.25) * 0.02,
            scale: Math.random() * 0.3 + 0.7,
            opacity: Math.random() * 0.2 + 0.7,
            timeOffset: Math.random() * Math.PI * 2
        });
    }
}

// Gắn sự kiện
function attachEvents() {
    // Sự kiện cho nút đúng (ANH IU)
    app.correctBtn.addEventListener('click', function() {
        transitionToMain();
    });
    
    // Sự kiện cho các nút sai
    app.wrongBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleWrongClick(this);
        });
        
        // Thêm hiệu ứng hover cho nút sai
        btn.addEventListener('mouseenter', function() {
            // Tăng kích thước nút ANH IU khi hover vào nút sai
            app.wrongClickCount++;
            app.correctBtnScale = 1 + (app.wrongClickCount * 0.1);
            app.correctBtn.style.transform = `scale(${app.correctBtnScale})`;
        });
    });
    
    // Sự kiện cho các nút điều khiển
    app.musicToggle.addEventListener('click', toggleMusic);
    app.snowToggle.addEventListener('click', toggleSnow);
    app.restartBtn.addEventListener('click', restartExperience);
    
    // Sự kiện chuột cho parallax
    document.addEventListener('mousemove', handleMouseMove);
    
    // Sự kiện touch cho mobile
    document.addEventListener('touchmove', handleTouchMove);
    
    // Sự kiện trước khi đóng trang
    window.addEventListener('beforeunload', function() {
        if (app.animationId) {
            cancelAnimationFrame(app.animationId);
        }
    });
}

// Xử lý khi click nút sai
function handleWrongClick(button) {
    // Đếm số lần click sai
    app.wrongClickCount++;
    
    // Tăng kích thước nút đúng
    app.correctBtnScale = 1 + (app.wrongClickCount * 0.15);
    app.correctBtn.style.transform = `scale(${app.correctBtnScale})`;
    
    // Hiệu ứng cho nút sai
    button.style.transform = 'scale(0.8)';
    button.style.opacity = '0.7';
    button.style.transition = 'all 0.3s ease';
    
    // Di chuyển nút đến vị trí ngẫu nhiên
    const maxX = window.innerWidth - button.offsetWidth - 50;
    const maxY = window.innerHeight - button.offsetHeight - 100;
    
    const randomX = Math.max(50, Math.random() * maxX);
    const randomY = Math.max(100, Math.random() * maxY);
    
    button.style.position = 'fixed';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    
    // Đặt lại hiệu ứng sau 300ms
    setTimeout(() => {
        button.style.transform = '';
        button.style.opacity = '';
    }, 300);
}

// Chuyển sang màn hình chính
function transitionToMain() {
    // Phát nhạc
    playMusic();
    
    // Hiệu ứng chuyển cảnh
    app.introScreen.classList.remove('active');
    
    setTimeout(() => {
        app.introScreen.style.display = 'none';
        app.mainScreen.style.display = 'flex';
        
        setTimeout(() => {
            app.mainScreen.classList.add('active');
            app.currentScreen = 'main';
            
            // Hiển thị các phần tử bay
            app.floatingTexts.forEach(text => {
                text.element.style.display = 'block';
            });
            
            // Hiển thị ảnh bay
            app.floatingImages.forEach(img => {
                img.element.style.display = 'flex';
            });
        }, 100);
    }, 800);
}

// Phát nhạc nền
function playMusic() {
    if (app.bgMusic) {
        // Đảm bảo audio context được kích hoạt bởi user interaction
        if (app.audioContext && app.audioContext.state === 'suspended') {
            app.audioContext.resume();
        }
        
        app.bgMusic.volume = 0.5;
        app.bgMusic.play().then(() => {
            app.musicPlaying = true;
            app.musicToggle.classList.add('active');
            app.musicToggle.innerHTML = '<i class="fas fa-volume-up"></i> Nhạc nền';
        }).catch(error => {
            console.log("Audio playback failed:", error);
        });
    }
}

// Dừng nhạc nền
function pauseMusic() {
    if (app.bgMusic) {
        app.bgMusic.pause();
        app.musicPlaying = false;
        app.musicToggle.classList.remove('active');
        app.musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Nhạc nền';
    }
}

// Toggle nhạc
function toggleMusic() {
    if (app.musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Toggle hiệu ứng tuyết
function toggleSnow() {
    app.snowEnabled = !app.snowEnabled;
    
    if (app.snowEnabled) {
        app.snowToggle.classList.add('active');
        app.snowToggle.innerHTML = '<i class="fas fa-snowflake"></i> Tuyết rơi';
    } else {
        app.snowToggle.classList.remove('active');
        app.snowToggle.innerHTML = '<i class="far fa-snowflake"></i> Tuyết rơi';
    }
}

// Restart trải nghiệm
function restartExperience() {
    // Reset state
    app.correctBtnScale = 1;
    app.wrongClickCount = 0;
    
    // Reset nút ANH IU
    app.correctBtn.style.transform = 'scale(1)';
    
    // Reset vị trí các nút sai
    app.wrongBtns.forEach(btn => {
        btn.style.position = '';
        btn.style.left = '';
        btn.style.top = '';
        btn.style.transform = '';
        btn.style.opacity = '';
    });
    
    // Chuyển về màn hình intro
    app.mainScreen.classList.remove('active');
    
    setTimeout(() => {
        app.mainScreen.style.display = 'none';
        app.introScreen.style.display = 'flex';
        
        setTimeout(() => {
            app.introScreen.classList.add('active');
            app.currentScreen = 'intro';
        }, 100);
    }, 800);
}

// Xử lý di chuyển chuột (parallax)
function handleMouseMove(e) {
    app.mouseX = e.clientX;
    app.mouseY = e.clientY;
}

// Xử lý touch cho mobile
function handleTouchMove(e) {
    if (e.touches.length > 0) {
        app.mouseX = e.touches[0].clientX;
        app.mouseY = e.touches[0].clientY;
    }
}

// Bắt đầu animation loop
function startAnimation() {
    app.lastTime = performance.now();
    animate();
}

// Animation loop chính
function animate(currentTime = 0) {
    // Tính delta time
    const deltaTime = currentTime - app.lastTime;
    app.lastTime = currentTime;
    
    // Xóa canvas
    if (app.currentScreen === 'intro') {
        // Vẽ tuyết cho intro
        drawIntroSnow(deltaTime);
    } else if (app.currentScreen === 'main') {
        // Vẽ tuyết 3D cho main
        if (app.snowEnabled) {
            draw3dSnow(deltaTime);
        } else {
            // Xóa canvas nếu tắt hiệu ứng tuyết
            app.snow3dCtx.clearRect(0, 0, app.snow3dCanvas.width, app.snow3dCanvas.height);
        }
        
        // Cập nhật các phần tử bay
        updateFloatingElements(deltaTime);
    }
    
    // Tiếp tục animation loop
    app.animationId = requestAnimationFrame(animate);
}

// Vẽ tuyết cho intro
function drawIntroSnow(deltaTime) {
    const ctx = app.snowCtx;
    const canvas = app.snowCanvas;
    
    // Xóa canvas với hiệu ứng mờ
    ctx.fillStyle = 'rgba(12, 26, 45, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Vẽ các hạt tuyết
    app.snowParticles.forEach(particle => {
        // Cập nhật vị trí
        particle.y += particle.speed * (deltaTime / 16); // Điều chỉnh theo deltaTime
        particle.x += particle.sway;
        
        // Reset nếu ra khỏi màn hình
        if (particle.y > canvas.height) {
            particle.y = 0;
            particle.x = Math.random() * canvas.width;
        }
        
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        
        // Vẽ hạt tuyết
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Hiệu ứng glow nhẹ
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
        ctx.fill();
    });
}

// Vẽ tuyết 3D cho main scene
function draw3dSnow(deltaTime) {
    const ctx = app.snow3dCtx;
    const canvas = app.snow3dCanvas;
    
    // Xóa canvas với hiệu ứng mờ
    ctx.fillStyle = 'rgba(12, 26, 45, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tính toán parallax dựa trên vị trí chuột
    const parallaxX = (app.mouseX / canvas.width - 0.5) * 20;
    const parallaxY = (app.mouseY / canvas.height - 0.5) * 10;
    
    // Vẽ các hạt tuyết 3D
    app.snow3dParticles.forEach(particle => {
        // Cập nhật vị trí với parallax
        particle.y += particle.speed * (deltaTime / 16);
        particle.x += particle.sway + particle.wind + (parallaxX * particle.depth * 0.1);
        
        // Thêm hiệu ứng sway nhẹ
        particle.sway = Math.sin(particle.y * 0.01) * 0.3;
        
        // Reset nếu ra khỏi màn hình
        if (particle.y > canvas.height) {
            particle.y = 0;
            particle.x = Math.random() * canvas.width;
        }
        
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        
        // Tính toán kích thước và độ mờ dựa trên depth
        const radius = particle.radius * particle.depth;
        const opacity = particle.opacity * particle.depth;
        
        // Vẽ hạt tuyết với blur ảo (bằng cách vẽ nhiều lớp)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        // Lớp glow cho hạt gần
        if (particle.depth > 0.7) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
            ctx.fill();
        }
    });
}

// Cập nhật các phần tử bay
function updateFloatingElements(deltaTime) {
    const time = performance.now() * 0.001;
    
    // Cập nhật các dòng chữ bay
    app.floatingTexts.forEach(text => {
        // Tính toán chuyển động lắc lư
        text.angle += text.frequency * (deltaTime / 16);
        const swayX = Math.sin(text.angle) * text.amplitude;
        const swayY = Math.cos(text.angle * 0.7) * text.amplitude * 0.5;
        
        // Cập nhật vị trí
        text.x += text.speedX * (deltaTime / 16);
        text.y += text.speedY * (deltaTime / 16);
        
        // Kiểm tra va chạm với biên
        if (text.x < 50 || text.x > window.innerWidth - 250) {
            text.speedX *= -1;
            text.x = Math.max(50, Math.min(text.x, window.innerWidth - 250));
        }
        
        if (text.y < 50 || text.y > window.innerHeight - 100) {
            text.speedY *= -1;
            text.y = Math.max(50, Math.min(text.y, window.innerHeight - 100));
        }
        
        // Áp dụng vị trí
        text.element.style.left = `${text.x + swayX}px`;
        text.element.style.top = `${text.y + swayY}px`;
        
        // Hiệu ứng opacity nhấp nháy
        const opacity = 0.7 + 0.3 * Math.sin(time * 0.5 + text.angle);
        text.element.style.opacity = opacity;
    });
    
    // Cập nhật các ảnh bay
    app.floatingImages.forEach(img => {
        // Tính toán chuyển động
        img.angle += img.rotationSpeed * (deltaTime / 16);
        
        // Cập nhật vị trí với chuyển động tròn
        img.x += img.speedX * (deltaTime / 16) + Math.sin(time + img.timeOffset) * 0.3;
        img.y += img.speedY * (deltaTime / 16) + Math.cos(time * 0.7 + img.timeOffset) * 0.3;
        
        // Kiểm tra va chạm với biên
        if (img.x < 20 || img.x > window.innerWidth - 140) {
            img.speedX *= -1;
            img.x = Math.max(20, Math.min(img.x, window.innerWidth - 140));
        }
        
        if (img.y < 20 || img.y > window.innerHeight - 140) {
            img.speedY *= -1;
            img.y = Math.max(20, Math.min(img.y, window.innerHeight - 140));
        }
        
        // Áp dụng vị trí và hiệu ứng
        img.element.style.left = `${img.x}px`;
        img.element.style.top = `${img.y}px`;
        
        // Hiệu ứng xoay và scale
        const rotation = Math.sin(time + img.timeOffset) * 5;
        const scale = img.scale + 0.1 * Math.sin(time * 0.5 + img.timeOffset);
        
        img.element.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        // Hiệu ứng opacity
        const opacity = img.opacity + 0.1 * Math.sin(time * 0.3 + img.timeOffset);
        img.element.style.opacity = Math.max(0.6, Math.min(0.95, opacity));
    });
}