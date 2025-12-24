// Khai báo biến toàn cục
let canvasIntro, ctxIntro;
let canvasMain, ctxMain;
let snowflakesIntro = [];
let snowflakesMain = [];
let animationId;
let isMusicPlaying = false;
let lastTime = 0;

// Lấy các phần tử DOM
const introSection = document.getElementById('intro-section');
const mainSection = document.getElementById('main-section');
const openGiftBtn = document.getElementById('open-gift-btn');
const replayBtn = document.getElementById('replay-btn');
const backgroundMusic = document.getElementById('background-music');

// Hàm khởi tạo Canvas
function initCanvas() {
    // Canvas cho phần mở đầu
    canvasIntro = document.getElementById('snow-intro');
    ctxIntro = canvasIntro.getContext('2d');
    
    // Canvas cho phần chính
    canvasMain = document.getElementById('snow-main');
    ctxMain = canvasMain.getContext('2d');
    
    // Đặt kích thước canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Khởi tạo hiệu ứng tuyết rơi
    initSnowIntro();
    initSnowMain();
}

// Hàm đặt kích thước canvas
function resizeCanvas() {
    canvasIntro.width = window.innerWidth;
    canvasIntro.height = window.innerHeight;
    
    canvasMain.width = window.innerWidth;
    canvasMain.height = window.innerHeight;
    
    // Tạo lại các hạt tuyết khi thay đổi kích thước
    if (snowflakesIntro.length === 0) {
        initSnowIntro();
    }
    if (snowflakesMain.length === 0) {
        initSnowMain();
    }
}

// Hàm tạo hạt tuyết cho phần mở đầu (2D)
function initSnowIntro() {
    snowflakesIntro = [];
    const snowflakeCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 5000));
    
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakesIntro.push({
            x: Math.random() * canvasIntro.width,
            y: Math.random() * canvasIntro.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            sway: Math.random() * 0.5 - 0.25,
            swaySpeed: Math.random() * 0.02 + 0.01
        });
    }
}

// Hàm tạo hạt tuyết cho phần chính (3D)
function initSnowMain() {
    snowflakesMain = [];
    const snowflakeCount = Math.min(400, Math.floor(window.innerWidth * window.innerHeight / 2000));
    
    for (let i = 0; i < snowflakeCount; i++) {
        const layer = Math.floor(Math.random() * 3); // 0: near, 1: mid, 2: far
        
        let size, speed, opacity;
        switch(layer) {
            case 0: // Near - lớn, nhanh, rõ
                size = Math.random() * 5 + 3;
                speed = Math.random() * 3 + 2;
                opacity = Math.random() * 0.8 + 0.5;
                break;
            case 1: // Mid - vừa
                size = Math.random() * 3 + 2;
                speed = Math.random() * 2 + 1;
                opacity = Math.random() * 0.6 + 0.3;
                break;
            case 2: // Far - nhỏ, chậm, mờ
                size = Math.random() * 2 + 1;
                speed = Math.random() * 1 + 0.5;
                opacity = Math.random() * 0.4 + 0.2;
                break;
        }
        
        snowflakesMain.push({
            x: Math.random() * canvasMain.width,
            y: Math.random() * canvasMain.height,
            radius: size,
            speed: speed,
            opacity: opacity,
            layer: layer,
            sway: Math.random() * 1 - 0.5,
            swaySpeed: Math.random() * 0.03 + 0.01,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.03 - 0.015)
        });
    }
}

// Hàm vẽ tuyết rơi phần mở đầu
function drawSnowIntro() {
    ctxIntro.clearRect(0, 0, canvasIntro.width, canvasIntro.height);
    
    // Vẽ gradient nền
    const gradient = ctxIntro.createLinearGradient(0, 0, 0, canvasIntro.height);
    gradient.addColorStop(0, '#0a0e17');
    gradient.addColorStop(1, '#1a1f2e');
    ctxIntro.fillStyle = gradient;
    ctxIntro.fillRect(0, 0, canvasIntro.width, canvasIntro.height);
    
    // Vẽ các hạt tuyết
    snowflakesIntro.forEach(flake => {
        // Cập nhật vị trí
        flake.y += flake.speed;
        flake.x += flake.sway * Math.sin(flake.swaySpeed * Date.now() / 1000);
        
        // Nếu hạt tuyết rơi ra ngoài, reset lại
        if (flake.y > canvasIntro.height) {
            flake.y = -10;
            flake.x = Math.random() * canvasIntro.width;
        }
        
        // Vẽ hạt tuyết
        ctxIntro.beginPath();
        ctxIntro.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctxIntro.fill();
        
        // Thêm hiệu ứng lấp lánh
        if (Math.random() > 0.97) {
            ctxIntro.beginPath();
            ctxIntro.arc(flake.x, flake.y, flake.radius * 1.5, 0, Math.PI * 2);
            ctxIntro.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.7})`;
            ctxIntro.fill();
        }
    });
}

// Hàm vẽ tuyết rơi phần chính
function drawSnowMain(timestamp) {
    ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
    
    // Vẽ gradient nền
    const gradient = ctxMain.createRadialGradient(
        canvasMain.width / 2, canvasMain.height / 2, 0,
        canvasMain.width / 2, canvasMain.height / 2, Math.max(canvasMain.width, canvasMain.height) / 2
    );
    gradient.addColorStop(0, 'rgba(10, 14, 23, 0.8)');
    gradient.addColorStop(1, 'rgba(26, 31, 46, 0.9)');
    ctxMain.fillStyle = gradient;
    ctxMain.fillRect(0, 0, canvasMain.width, canvasMain.height);
    
    // Vẽ các hạt tuyết theo thứ tự xa đến gần (tạo chiều sâu)
    const sortedFlakes = [...snowflakesMain].sort((a, b) => b.layer - a.layer);
    
    sortedFlakes.forEach(flake => {
        // Cập nhật vị trí và xoay
        flake.y += flake.speed;
        flake.x += flake.sway * Math.sin(flake.swaySpeed * timestamp / 1000);
        flake.rotation += flake.rotationSpeed;
        
        // Nếu hạt tuyết rơi ra ngoài, reset lại
        if (flake.y > canvasMain.height) {
            flake.y = -10;
            flake.x = Math.random() * canvasMain.width;
        }
        
        // Vẽ hạt tuyết với hiệu ứng xoay
        ctxMain.save();
        ctxMain.translate(flake.x, flake.y);
        ctxMain.rotate(flake.rotation);
        
        // Vẽ hình dạng phức tạp hơn cho hạt tuyết gần
        if (flake.layer === 0) {
            // Hạt tuyết gần - chi tiết
            drawDetailedSnowflake(ctxMain, 0, 0, flake.radius, flake.opacity);
        } else {
            // Hạt tuyết xa - đơn giản
            ctxMain.beginPath();
            ctxMain.arc(0, 0, flake.radius, 0, Math.PI * 2);
            ctxMain.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctxMain.fill();
            
            // Thêm các tia cho hạt tuyết ở giữa
            if (flake.layer === 1) {
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    ctxMain.beginPath();
                    ctxMain.moveTo(0, 0);
                    ctxMain.lineTo(
                        Math.cos(angle) * flake.radius * 1.5,
                        Math.sin(angle) * flake.radius * 1.5
                    );
                    ctxMain.strokeStyle = `rgba(255, 255, 255, ${flake.opacity * 0.7})`;
                    ctxMain.lineWidth = 1;
                    ctxMain.stroke();
                }
            }
        }
        
        ctxMain.restore();
        
        // Thêm hiệu ứng lấp lánh ngẫu nhiên
        if (Math.random() > 0.99) {
            ctxMain.beginPath();
            ctxMain.arc(flake.x, flake.y, flake.radius * 2, 0, Math.PI * 2);
            const sparkleGradient = ctxMain.createRadialGradient(
                flake.x, flake.y, 0,
                flake.x, flake.y, flake.radius * 2
            );
            sparkleGradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity * 0.8})`);
            sparkleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctxMain.fillStyle = sparkleGradient;
            ctxMain.fill();
        }
    });
}

// Hàm vẽ hạt tuyết chi tiết
function drawDetailedSnowflake(ctx, x, y, radius, opacity) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        
        // Nhánh chính
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * radius * 2,
            y + Math.sin(angle) * radius * 2
        );
        
        // Nhánh phụ
        const branchAngle = angle + Math.PI / 6;
        ctx.moveTo(
            x + Math.cos(angle) * radius * 0.7,
            y + Math.sin(angle) * radius * 0.7
        );
        ctx.lineTo(
            x + Math.cos(branchAngle) * radius * 1.2,
            y + Math.sin(branchAngle) * radius * 1.2
        );
        
        // Nhánh phụ đối diện
        const oppositeBranchAngle = angle - Math.PI / 6;
        ctx.moveTo(
            x + Math.cos(angle) * radius * 0.7,
            y + Math.sin(angle) * radius * 0.7
        );
        ctx.lineTo(
            x + Math.cos(oppositeBranchAngle) * radius * 1.2,
            y + Math.sin(oppositeBranchAngle) * radius * 1.2
        );
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Vẽ tâm
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
}

// Hàm animation chính
function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Chỉ vẽ nếu phần đó đang active
    if (introSection.classList.contains('active')) {
        drawSnowIntro();
    } else if (mainSection.classList.contains('active')) {
        drawSnowMain(timestamp);
    }
    
    animationId = requestAnimationFrame(animate);
}

// Hàm chuyển đổi giữa các phần
function switchToMainSection() {
    // Phát nhạc tự động khi chuyển sang phần chính
    if (!isMusicPlaying) {
        backgroundMusic.volume = 0.7;
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            console.log("Nhạc nền đang phát tự động");
        }).catch(error => {
            console.log("Lỗi phát nhạc tự động:", error);
            // Fallback: hiển thị thông báo để người dùng tương tác
            alert("Vui lòng nhấn vào trang để phát nhạc Giáng Sinh!");
        });
    }
    
    // Hiệu ứng chuyển cảnh
    introSection.style.opacity = '0';
    introSection.style.visibility = 'hidden';
    
    setTimeout(() => {
        introSection.classList.remove('active');
        mainSection.classList.add('active');
        mainSection.style.opacity = '1';
        mainSection.style.visibility = 'visible';
    }, 1000);
}

// Hàm quay lại phần mở đầu
function switchToIntroSection() {
    // Dừng nhạc khi quay lại
    if (isMusicPlaying) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        isMusicPlaying = false;
    }
    
    // Hiệu ứng chuyển cảnh
    mainSection.style.opacity = '0';
    mainSection.style.visibility = 'hidden';
    
    setTimeout(() => {
        mainSection.classList.remove('active');
        introSection.classList.add('active');
        introSection.style.opacity = '1';
        introSection.style.visibility = 'visible';
    }, 1000);
}

// Hàm thêm event listener cho click toàn trang để bật nhạc (cho trình duyệt yêu cầu user interaction)
function addGlobalAudioInteraction() {
    document.body.addEventListener('click', function enableAudio() {
        if (!isMusicPlaying && mainSection.classList.contains('active')) {
            backgroundMusic.volume = 0.7;
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                console.log("Nhạc nền đã được bật sau khi click");
            });
        }
        
        // Xóa event listener sau khi đã xử lý
        document.body.removeEventListener('click', enableAudio);
    }, { once: true });
}

// Khởi tạo khi trang tải
window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animate(0);
    
    // Thêm sự kiện cho nút MỞ QUÀ
    openGiftBtn.addEventListener('click', () => {
        // Thêm hiệu ứng cho nút
        openGiftBtn.style.transform = 'scale(0.9)';
        openGiftBtn.style.backgroundColor = 'rgba(230, 57, 70, 0.3)';
        
        setTimeout(() => {
            switchToMainSection();
            // Thêm event listener cho click toàn trang để bật nhạc
            addGlobalAudioInteraction();
        }, 300);
    });
    
    // Thêm sự kiện cho nút XEM LẠI
    replayBtn.addEventListener('click', switchToIntroSection);
    
    // Thêm sự kiện click toàn trang để bật nhạc (dự phòng)
    document.addEventListener('click', function() {
        if (!isMusicPlaying && mainSection.classList.contains('active')) {
            backgroundMusic.volume = 0.7;
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
            }).catch(e => console.log("Không thể phát nhạc:", e));
        }
    });
    
    // Xử lý khi nhạc kết thúc (lặp lại)
    backgroundMusic.addEventListener('ended', () => {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    });
});

// Dọn dẹp khi đóng trang
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (isMusicPlaying) {
        backgroundMusic.pause();
    }
});