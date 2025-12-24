// ============================================
// CẤU HÌNH VÀ BIẾN TOÀN CỤC
// ============================================

// Cấu hình chung
const CONFIG = {
    // Tuyết intro (2D)
    introSnow: {
        count: 80,           // Số lượng hạt tuyết
        speed: 0.5,          // Tốc độ rơi
        size: { min: 2, max: 6 }, // Kích thước
        opacity: { min: 0.3, max: 0.9 }, // Độ mờ
        color: "#FFFFFF"     // Màu sắc
    },
    
    // Tuyết chính (3D)
    mainSnow: {
        count: 200,          // Số lượng hạt tuyết
        speed: { min: 0.5, max: 2.5 }, // Tốc độ
        size: { min: 1, max: 8 }, // Kích thước
        depth: 100,          // Độ sâu 3D
        color: "#FFFFFF",    // Màu sắc
        wind: 0.05,          // Hiệu ứng gió
        parallax: 0.5        // Hiệu ứng parallax
    },
    
    // Chữ bay
    floatingTexts: {
        speed: 0.3,          // Tốc độ di chuyển
        floatRadius: 50,     // Bán kính bay
        floatSpeed: 0.005    // Tốc độ bay
    }
};

// Biến toàn cục
let canvasIntro, ctxIntro;
let canvasMain, ctxMain;
let canvasFireworks, ctxFireworks;
let introSnowflakes = [];
let mainSnowflakes = [];
let fireworks = [];
let mouseX = 0, mouseY = 0;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let introActive = true;
let animationId = null;

// ============================================
// HÀM KHỞI TẠO
// ============================================

// Khởi tạo khi trang web tải xong
window.addEventListener('DOMContentLoaded', init);

function init() {
    // Lấy các phần tử DOM
    const openGiftBtn = document.getElementById('open-gift-btn');
    const backBtn = document.getElementById('back-btn');
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    
    // Thiết lập sự kiện cho nút
    openGiftBtn.addEventListener('click', () => switchScreen(introScreen, mainScreen));
    backBtn.addEventListener('click', () => switchScreen(mainScreen, introScreen));
    
    // Theo dõi vị trí chuột
    document.addEventListener('mousemove', handleMouseMove);
    
    // Xử lý thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);
    
    // Khởi tạo canvas
    initCanvas();
    
    // Khởi tạo hiệu ứng chữ bay
    initFloatingTexts();
    
    // Bắt đầu vòng lặp animation
    animate();
}

// Khởi tạo tất cả canvas
function initCanvas() {
    // Canvas intro (tuyết 2D)
    canvasIntro = document.getElementById('snow-intro');
    ctxIntro = canvasIntro.getContext('2d');
    
    // Canvas main (tuyết 3D)
    canvasMain = document.getElementById('snow-main');
    ctxMain = canvasMain.getContext('2d');
    
    // Canvas pháo hoa
    canvasFireworks = document.getElementById('fireworks');
    ctxFireworks = canvasFireworks.getContext('2d');
    
    // Đặt kích thước canvas
    resizeCanvas();
    
    // Tạo hạt tuyết
    createIntroSnowflakes();
    createMainSnowflakes();
}

// Đặt lại kích thước canvas khi cửa sổ thay đổi
function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvasIntro.width = screenWidth;
    canvasIntro.height = screenHeight;
    
    canvasMain.width = screenWidth;
    canvasMain.height = screenHeight;
    
    canvasFireworks.width = screenWidth;
    canvasFireworks.height = screenHeight;
    
    // Tạo lại hạt tuyết với kích thước mới
    createIntroSnowflakes();
    createMainSnowflakes();
}

// ============================================
// XỬ LÝ SỰ KIỆN
// ============================================

// Xử lý thay đổi kích thước cửa sổ
function handleResize() {
    resizeCanvas();
}

// Xử lý di chuyển chuột
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Hiệu ứng parallax cho tuyết 3D
    if (!introActive) {
        mainSnowflakes.forEach(snowflake => {
            // Tính khoảng cách từ chuột đến hạt tuyết
            const dx = mouseX - snowflake.x;
            const dy = mouseY - snowflake.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Áp dụng hiệu ứng gió nếu chuột gần
            if (distance < 150) {
                const force = (150 - distance) / 150;
                snowflake.vx += (dx / distance) * force * CONFIG.mainSnow.parallax * 0.5;
                snowflake.vy += (dy / distance) * force * CONFIG.mainSnow.parallax * 0.3;
            }
        });
    }
}

// Chuyển đổi giữa các màn hình
function switchScreen(fromScreen, toScreen) {
    // Hiệu ứng pháo hoa khi mở quà
    if (toScreen.id === 'main-screen') {
        createFireworks(5);
    }
    
    // Ẩn màn hình hiện tại, hiện màn hình mới
    fromScreen.classList.remove('active');
    
    setTimeout(() => {
        toScreen.classList.add('active');
        introActive = (toScreen.id === 'intro-screen');
        
        // Đặt lại vị trí chuột
        mouseX = screenWidth / 2;
        mouseY = screenHeight / 2;
    }, 500);
}

// ============================================
// HIỆU ỨNG TUYẾT RƠI (INTRO - 2D)
// ============================================

// Tạo hạt tuyết cho màn hình intro
function createIntroSnowflakes() {
    introSnowflakes = [];
    
    for (let i = 0; i < CONFIG.introSnow.count; i++) {
        introSnowflakes.push({
            x: Math.random() * screenWidth,
            y: Math.random() * screenHeight,
            size: CONFIG.introSnow.size.min + Math.random() * (CONFIG.introSnow.size.max - CONFIG.introSnow.size.min),
            speed: CONFIG.introSnow.speed * (0.5 + Math.random() * 0.5),
            opacity: CONFIG.introSnow.opacity.min + Math.random() * (CONFIG.introSnow.opacity.max - CONFIG.introSnow.opacity.min),
            sway: Math.random() * 0.5 - 0.25, // Dao động ngang nhẹ
            swaySpeed: 0.01 + Math.random() * 0.02
        });
    }
}

// Vẽ tuyết intro
function drawIntroSnow() {
    ctxIntro.clearRect(0, 0, screenWidth, screenHeight);
    
    introSnowflakes.forEach(snowflake => {
        // Cập nhật vị trí
        snowflake.y += snowflake.speed;
        snowflake.x += Math.sin(snowflake.sway) * 0.3;
        snowflake.sway += snowflake.swaySpeed;
        
        // Đặt lại hạt tuyết khi rơi ra khỏi màn hình
        if (snowflake.y > screenHeight) {
            snowflake.y = -10;
            snowflake.x = Math.random() * screenWidth;
        }
        
        if (snowflake.x > screenWidth + 10) snowflake.x = -10;
        if (snowflake.x < -10) snowflake.x = screenWidth + 10;
        
        // Vẽ hạt tuyết
        ctxIntro.beginPath();
        ctxIntro.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
        ctxIntro.fill();
        
        // Hiệu ứng blur nhẹ
        ctxIntro.beginPath();
        ctxIntro.arc(snowflake.x, snowflake.y, snowflake.size * 1.5, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity * 0.3})`;
        ctxIntro.fill();
    });
}

// ============================================
// HIỆU ỨNG TUYẾT RƠI (MAIN - 3D)
// ============================================

// Tạo hạt tuyết 3D cho màn hình chính
function createMainSnowflakes() {
    mainSnowflakes = [];
    
    for (let i = 0; i < CONFIG.mainSnow.count; i++) {
        const depth = Math.random(); // 0 (gần) đến 1 (xa)
        
        mainSnowflakes.push({
            x: Math.random() * screenWidth,
            y: Math.random() * screenHeight,
            z: depth, // Độ sâu 3D
            size: CONFIG.mainSnow.size.min + 
                  (CONFIG.mainSnow.size.max - CONFIG.mainSnow.size.min) * (1 - depth), // Gần thì to, xa thì nhỏ
            speed: CONFIG.mainSnow.speed.min + 
                   (CONFIG.mainSnow.speed.max - CONFIG.mainSnow.speed.min) * (1 - depth), // Gần thì nhanh, xa thì chậm
            opacity: 0.3 + (1 - depth) * 0.7, // Gần thì rõ, xa thì mờ
            vx: (Math.random() - 0.5) * CONFIG.mainSnow.wind, // Vận tốc ngang
            vy: 0,
            sway: Math.random() * Math.PI * 2,
            swaySpeed: 0.01 + Math.random() * 0.03
        });
    }
}

// Vẽ tuyết 3D
function drawMainSnow() {
    ctxMain.clearRect(0, 0, screenWidth, screenHeight);
    
    // Sắp xếp hạt tuyết theo độ sâu (xa trước, gần sau)
    const sortedSnowflakes = [...mainSnowflakes].sort((a, b) => a.z - b.z);
    
    sortedSnowflakes.forEach(snowflake => {
        // Cập nhật vị trí
        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.vx + Math.sin(snowflake.sway) * 0.5;
        snowflake.sway += snowflake.swaySpeed;
        
        // Hiệu ứng gió dựa trên vị trí chuột
        if (mouseX !== 0 && mouseY !== 0) {
            const dx = mouseX - snowflake.x;
            const influence = Math.max(0, 1 - Math.abs(dx) / 400);
            snowflake.vx += (dx > 0 ? 0.01 : -0.01) * influence * CONFIG.mainSnow.parallax;
        }
        
        // Giới hạn vận tốc ngang
        snowflake.vx = Math.max(-0.5, Math.min(0.5, snowflake.vx * 0.98));
        
        // Đặt lại hạt tuyết khi rơi ra khỏi màn hình
        if (snowflake.y > screenHeight + 10) {
            snowflake.y = -10;
            snowflake.x = Math.random() * screenWidth;
            snowflake.vx = (Math.random() - 0.5) * CONFIG.mainSnow.wind;
        }
        
        if (snowflake.x > screenWidth + 10) snowflake.x = -10;
        if (snowflake.x < -10) snowflake.x = screenWidth + 10;
        
        // Tính kích thước và độ mờ dựa trên độ sâu
        const renderSize = snowflake.size * (0.5 + 0.5 * (1 - snowflake.z));
        const renderOpacity = snowflake.opacity * (0.7 + 0.3 * (1 - snowflake.z));
        
        // Vẽ hạt tuyết với hiệu ứng 3D
        ctxMain.beginPath();
        ctxMain.arc(snowflake.x, snowflake.y, renderSize, 0, Math.PI * 2);
        ctxMain.fillStyle = `rgba(255, 255, 255, ${renderOpacity})`;
        ctxMain.fill();
        
        // Hiệu ứng ánh sáng cho hạt tuyết gần
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

// ============================================
// HIỆU ỨNG CHỮ BAY
// ============================================

// Khởi tạo chữ bay
function initFloatingTexts() {
    const texts = document.querySelectorAll('.floating-text');
    
    texts.forEach((text, index) => {
        // Vị trí ngẫu nhiên ban đầu
        const angle = (index / texts.length) * Math.PI * 2;
        const radius = Math.min(screenWidth, screenHeight) * 0.3;
        
        text.originalX = screenWidth / 2 + Math.cos(angle) * radius;
        text.originalY = screenHeight / 2 + Math.sin(angle) * radius;
        text.currentX = text.originalX;
        text.currentY = text.originalY;
        text.floatAngle = Math.random() * Math.PI * 2;
        text.floatSpeed = 0.003 + Math.random() * 0.004;
        text.floatRadius = CONFIG.floatingTexts.floatRadius;
        
        // Đặt vị trí ban đầu
        text.style.left = `${text.currentX}px`;
        text.style.top = `${text.currentY}px`;
    });
}

// Cập nhật vị trí chữ bay
function updateFloatingTexts() {
    const texts = document.querySelectorAll('.floating-text');
    
    texts.forEach(text => {
        // Cập nhật góc bay
        text.floatAngle += text.floatSpeed;
        
        // Tính vị trí mới với chuyển động tròn
        const floatX = Math.cos(text.floatAngle) * text.floatRadius;
        const floatY = Math.sin(text.floatAngle * 1.5) * text.floatRadius * 0.7;
        
        text.currentX = text.originalX + floatX;
        text.currentY = text.originalY + floatY;
        
        // Cập nhật vị trí trên màn hình
        text.style.left = `${text.currentX}px`;
        text.style.top = `${text.currentY}px`;
        
        // Thay đổi độ mờ theo chuyển động
        const opacity = 0.7 + 0.3 * Math.sin(text.floatAngle * 2);
        text.style.opacity = opacity;
    });
}

// ============================================
// HIỆU ỨNG PHÁO HOA
// ============================================

// Tạo pháo hoa
function createFireworks(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const firework = {
                x: Math.random() * screenWidth,
                y: screenHeight + 20,
                targetY: 100 + Math.random() * (screenHeight * 0.5),
                particles: [],
                exploded: false,
                color: `hsl(${Math.random() * 360}, 100%, 70%)`,
                speed: 2 + Math.random() * 3
            };
            
            fireworks.push(firework);
        }, i * 200);
    }
}

// Vẽ pháo hoa
function drawFireworks() {
    ctxFireworks.clearRect(0, 0, screenWidth, screenHeight);
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        
        if (!firework.exploded) {
            // Pháo hoa bay lên
            firework.y -= firework.speed;
            
            // Vẽ đuôi
            ctxFireworks.beginPath();
            ctxFireworks.moveTo(firework.x, firework.y + 10);
            ctxFireworks.lineTo(firework.x, firework.y + 30);
            ctxFireworks.strokeStyle = firework.color;
            ctxFireworks.lineWidth = 2;
            ctxFireworks.stroke();
            
            // Vẽ đầu
            ctxFireworks.beginPath();
            ctxFireworks.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
            ctxFireworks.fillStyle = firework.color;
            ctxFireworks.fill();
            
            // Nổ khi đến độ cao mục tiêu
            if (firework.y <= firework.targetY) {
                firework.exploded = true;
                createExplosion(firework);
            }
        } else {
            // Vẽ các hạt pháo hoa nổ
            for (let j = firework.particles.length - 1; j >= 0; j--) {
                const particle = firework.particles[j];
                
                // Cập nhật vị trí
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.05; // Trọng lực
                particle.life--;
                
                // Vẽ hạt
                ctxFireworks.beginPath();
                ctxFireworks.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctxFireworks.fillStyle = `rgba(${particle.color}, ${particle.life / 100})`;
                ctxFireworks.fill();
                
                // Xóa hạt khi hết tuổi thọ
                if (particle.life <= 0) {
                    firework.particles.splice(j, 1);
                }
            }
            
            // Xóa pháo hoa khi tất cả hạt đã biến mất
            if (firework.particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
    }
}

// Tạo hiệu ứng nổ cho pháo hoa
function createExplosion(firework) {
    const particleCount = 50 + Math.floor(Math.random() * 50);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 5;
        
        firework.particles.push({
            x: firework.x,
            y: firework.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 3,
            color: firework.color.replace('hsl', 'rgb').replace(')', ', 1)').replace('hsl', 'rgb'),
            life: 50 + Math.floor(Math.random() * 50)
        });
    }
}

// ============================================
// VÒNG LẶP ANIMATION CHÍNH
// ============================================

// Hàm animation chính
function animate() {
    // Vẽ hiệu ứng tuyết
    if (introActive) {
        drawIntroSnow();
    } else {
        drawMainSnow();
        updateFloatingTexts();
    }
    
    // Vẽ pháo hoa
    drawFireworks();
    
    // Yêu cầu khung hình tiếp theo
    animationId = requestAnimationFrame(animate);
}

// Dừng animation khi trang đóng
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});