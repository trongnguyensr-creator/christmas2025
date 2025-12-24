// Khai báo biến toàn cục
let canvasIntro, ctxIntro;
let canvasMain, ctxMain;
let snowflakesIntro = [];
let snowflakesMain = [];
let animationId;
let isMusicPlaying = false;
let lastTime = 0;
let lyricInterval;
let currentLyricIndex = 0;

// Lấy các phần tử DOM
const introSection = document.getElementById('intro-section');
const mainSection = document.getElementById('main-section');
const openGiftBtn = document.getElementById('open-gift-btn');
const backgroundMusic = document.getElementById('background-music');
const lyricLines = document.querySelectorAll('.lyric-line');

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

// Hàm tạo hạt tuyết cho phần mở đầu (nhỏ hơn)
function initSnowIntro() {
    snowflakesIntro = [];
    const snowflakeCount = Math.min(200, Math.floor(window.innerWidth * window.innerHeight / 6000));
    
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakesIntro.push({
            x: Math.random() * canvasIntro.width,
            y: Math.random() * canvasIntro.height,
            radius: Math.random() * 2 + 0.5, // Nhỏ hơn
            speed: Math.random() * 0.8 + 0.3, // Chậm hơn
            opacity: Math.random() * 0.4 + 0.2, // Mờ hơn
            sway: Math.random() * 0.3 - 0.15,
            swaySpeed: Math.random() * 0.015 + 0.005
        });
    }
}

// Hàm tạo hạt tuyết cho phần chính (nhỏ hơn)
function initSnowMain() {
    snowflakesMain = [];
    const snowflakeCount = Math.min(500, Math.floor(window.innerWidth * window.innerHeight / 2500));
    
    for (let i = 0; i < snowflakeCount; i++) {
        const layer = Math.floor(Math.random() * 3); // 0: near, 1: mid, 2: far
        
        let size, speed, opacity;
        switch(layer) {
            case 0: // Near - nhỏ hơn
                size = Math.random() * 2.5 + 1.5;
                speed = Math.random() * 2 + 1.5;
                opacity = Math.random() * 0.6 + 0.4;
                break;
            case 1: // Mid - nhỏ hơn
                size = Math.random() * 1.5 + 1;
                speed = Math.random() * 1.2 + 0.8;
                opacity = Math.random() * 0.4 + 0.25;
                break;
            case 2: // Far - nhỏ hơn
                size = Math.random() * 1 + 0.5;
                speed = Math.random() * 0.6 + 0.3;
                opacity: Math.random() * 0.25 + 0.15;
                break;
        }
        
        snowflakesMain.push({
            x: Math.random() * canvasMain.width,
            y: Math.random() * canvasMain.height,
            radius: size,
            speed: speed,
            opacity: opacity,
            layer: layer,
            sway: Math.random() * 0.4 - 0.2,
            swaySpeed: Math.random() * 0.02 + 0.005,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.02 - 0.01)
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
    
    // Vẽ các hạt tuyết nhỏ
    snowflakesIntro.forEach(flake => {
        // Cập nhật vị trí
        flake.y += flake.speed;
        flake.x += flake.sway * Math.sin(flake.swaySpeed * Date.now() / 1000);
        
        // Nếu hạt tuyết rơi ra ngoài, reset lại
        if (flake.y > canvasIntro.height) {
            flake.y = -5;
            flake.x = Math.random() * canvasIntro.width;
        }
        
        // Vẽ hạt tuyết nhỏ
        ctxIntro.beginPath();
        ctxIntro.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctxIntro.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctxIntro.fill();
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
    gradient.addColorStop(0, 'rgba(10, 14, 23, 0.9)');
    gradient.addColorStop(1, 'rgba(15, 21, 36, 0.95)');
    ctxMain.fillStyle = gradient;
    ctxMain.fillRect(0, 0, canvasMain.width, canvasMain.height);
    
    // Vẽ các hạt tuyết theo thứ tự xa đến gần
    const sortedFlakes = [...snowflakesMain].sort((a, b) => b.layer - a.layer);
    
    sortedFlakes.forEach(flake => {
        // Cập nhật vị trí và xoay
        flake.y += flake.speed;
        flake.x += flake.sway * Math.sin(flake.swaySpeed * timestamp / 1000);
        flake.rotation += flake.rotationSpeed;
        
        // Nếu hạt tuyết rơi ra ngoài, reset lại
        if (flake.y > canvasMain.height) {
            flake.y = -5;
            flake.x = Math.random() * canvasMain.width;
        }
        
        // Vẽ hạt tuyết với hiệu ứng xoay
        ctxMain.save();
        ctxMain.translate(flake.x, flake.y);
        ctxMain.rotate(flake.rotation);
        
        // Vẽ hình dạng đơn giản cho hạt tuyết nhỏ
        if (flake.layer === 0) {
            // Hạt tuyết gần - đơn giản
            drawSimpleSnowflake(ctxMain, 0, 0, flake.radius, flake.opacity);
        } else {
            // Hạt tuyết xa - chỉ là chấm tròn nhỏ
            ctxMain.beginPath();
            ctxMain.arc(0, 0, flake.radius, 0, Math.PI * 2);
            ctxMain.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctxMain.fill();
        }
        
        ctxMain.restore();
    });
}

// Hàm vẽ hạt tuyết đơn giản (nhỏ)
function drawSimpleSnowflake(ctx, x, y, radius, opacity) {
    // Vẽ tâm
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
    
    // Vẽ 4 tia đơn giản (thay vì 6)
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * radius * 1.5,
            y + Math.sin(angle) * radius * 1.5
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }
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

// Hàm bắt đầu hiệu ứng lyric
function startLyricEffect() {
    // Reset tất cả lyric về trạng thái ẩn
    lyricLines.forEach(line => {
        line.classList.remove('active');
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
    });
    
    currentLyricIndex = 0;
    
    // Hiển thị lyric đầu tiên
    if (lyricLines.length > 0) {
        lyricLines[0].classList.add('active');
        lyricLines[0].style.opacity = '1';
        lyricLines[0].style.transform = 'translateY(0)';
    }
    
    // Xóa interval cũ nếu có
    if (lyricInterval) clearInterval(lyricInterval);
    
    // Tạo interval để hiển thị từng lyric
    lyricInterval = setInterval(() => {
        // Ẩn lyric hiện tại
        if (currentLyricIndex < lyricLines.length) {
            lyricLines[currentLyricIndex].classList.remove('active');
            lyricLines[currentLyricIndex].style.opacity = '0.3';
            lyricLines[currentLyricIndex].style.transform = 'translateY(10px) scale(0.95)';
        }
        
        // Chuyển đến lyric tiếp theo
        currentLyricIndex++;
        
        // Nếu đã hiển thị hết, quay lại từ đầu
        if (currentLyricIndex >= lyricLines.length) {
            currentLyricIndex = 0;
        }
        
        // Hiển thị lyric mới
        lyricLines[currentLyricIndex].classList.add('active');
        lyricLines[currentLyricIndex].style.opacity = '1';
        lyricLines[currentLyricIndex].style.transform = 'translateY(0) scale(1)';
        
        // Thêm hiệu ứng nhấp nháy nhẹ cho icon
        const icons = lyricLines[currentLyricIndex].querySelectorAll('.lyric-icon');
        icons.forEach(icon => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'iconFloat 3s infinite ease-in-out';
            }, 10);
        });
        
    }, 3000); // Mỗi 3 giây chuyển lyric
}

// Hàm phát nhạc
function playBackgroundMusic() {
    if (!isMusicPlaying) {
        try {
            // Đặt volume và phát nhạc
            backgroundMusic.volume = 0.6;
            
            // Sử dụng promise để phát nhạc
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    console.log("Nhạc nền đang phát: gsl.mp3");
                }).catch(error => {
                    console.log("Lỗi khi phát nhạc:", error);
                    // Fallback: hiển thị thông báo yêu cầu tương tác
                    showAudioInteractionMessage();
                });
            }
        } catch (error) {
            console.log("Lỗi phát nhạc:", error);
            showAudioInteractionMessage();
        }
    }
}

// Hàm hiển thị thông báo yêu cầu tương tác
function showAudioInteractionMessage() {
    // Tạo một thông báo tạm thời
    const message = document.createElement('div');
    message.id = 'audio-message';
    message.innerHTML = '🎵 Nhấn vào màn hình để bật nhạc Giáng Sinh 🎵';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(168, 218, 220, 0.9);
        color: #0a0e17;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: fadeInOut 5s ease-in-out forwards;
    `;
    
    document.body.appendChild(message);
    
    // Xóa thông báo sau 5 giây
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 5000);
}

// Hàm chuyển đổi giữa các phần
function switchToMainSection() {
    // Thêm hiệu ứng cho nút khi nhấn
    openGiftBtn.style.transform = 'scale(0.95)';
    openGiftBtn.style.background = 'linear-gradient(145deg, rgba(168, 218, 220, 0.25), rgba(10, 14, 23, 0.35))';
    
    setTimeout(() => {
        // Ẩn phần intro
        introSection.style.opacity = '0';
        introSection.style.visibility = 'hidden';
        
        setTimeout(() => {
            introSection.classList.remove('active');
            
            // Hiển thị phần main
            mainSection.classList.add('active');
            mainSection.style.opacity = '1';
            mainSection.style.visibility = 'visible';
            
            // Bắt đầu hiệu ứng lyric
            startLyricEffect();
            
            // Phát nhạc ngay lập tức
            playBackgroundMusic();
            
            // Thêm event listener cho click toàn trang để bật nhạc (dự phòng)
            document.addEventListener('click', handleFirstClickForAudio, { once: true });
            
        }, 300);
    }, 200);
}

// Hàm xử lý click đầu tiên để bật audio (dự phòng)
function handleFirstClickForAudio() {
    if (!isMusicPlaying) {
        playBackgroundMusic();
    }
}

// Khởi tạo khi trang tải
window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animate(0);
    
    // Thêm sự kiện cho nút MỞ QUÀ
    openGiftBtn.addEventListener('click', switchToMainSection);
    
    // Thêm sự kiện click toàn trang để bật nhạc (dự phòng)
    document.addEventListener('click', function() {
        if (!isMusicPlaying && mainSection.classList.contains('active')) {
            playBackgroundMusic();
        }
    });
    
    // Xử lý khi nhạc kết thúc (lặp lại)
    backgroundMusic.addEventListener('ended', () => {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    });
    
    // Xử lý lỗi khi tải nhạc
    backgroundMusic.addEventListener('error', (e) => {
        console.log("Lỗi tải file nhạc gsl.mp3:", e);
        
        // Fallback: sử dụng nhạc online nếu file local không tồn tại
        if (backgroundMusic.src.includes('gsl.mp3')) {
            backgroundMusic.innerHTML = `
                <source src="https://assets.mixkit.co/music/preview/mixkit-christmas-is-here-172.mp3" type="audio/mpeg">
            `;
            backgroundMusic.load();
            console.log("Đã chuyển sang nhạc online dự phòng");
        }
    });
});

// Dọn dẹp khi đóng trang
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (lyricInterval) {
        clearInterval(lyricInterval);
    }
    if (isMusicPlaying) {
        backgroundMusic.pause();
    }
});