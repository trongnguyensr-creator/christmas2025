// ========================================
// KHỞI TẠO BIẾN CHUNG
// ========================================
const introScreen = document.getElementById('intro');
const mainScene = document.getElementById('mainScene');
const openGiftBtn = document.getElementById('openGiftBtn');
const introCanvas = document.getElementById('introSnow');
const snow3DCanvas = document.getElementById('snow3D');

// ========================================
// TUYẾT RƠI 2D NHẸ (Intro Screen)
// ========================================
class IntroSnow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snowflakes = [];
        this.resize();
        this.createSnowflakes();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createSnowflakes() {
        // Số lượng tuyết ít - tối ưu hiệu năng
        const count = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 20000));
        
        for (let i = 0; i < count; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.3,
                drift: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(flake => {
            // Vẽ tuyết với blur nhẹ
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Cập nhật vị trí
            flake.y += flake.speed;
            flake.x += flake.drift;
            
            // Reset khi ra khỏi màn hình
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            if (flake.x > this.canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = this.canvas.width;
        });
        
        if (introScreen.classList.contains('active')) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ========================================
// TUYẾT RƠI 3D (Main Scene)
// ========================================
class Snow3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snowflakes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resize();
        this.createSnowflakes();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createSnowflakes() {
        // Nhiều tuyết hơn với 3 lớp (near, mid, far)
        const count = Math.min(200, Math.floor((this.canvas.width * this.canvas.height) / 8000));
        
        for (let i = 0; i < count; i++) {
            const layer = Math.random();
            let depth;
            
            if (layer < 0.3) depth = 'near'; // 30% ở gần
            else if (layer < 0.7) depth = 'mid'; // 40% ở giữa
            else depth = 'far'; // 30% ở xa
            
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: depth,
                radius: this.getRadiusByDepth(depth),
                speed: this.getSpeedByDepth(depth),
                drift: (Math.random() - 0.5) * 0.8,
                opacity: this.getOpacityByDepth(depth),
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }
    
    getRadiusByDepth(depth) {
        switch(depth) {
            case 'near': return Math.random() * 3 + 2;
            case 'mid': return Math.random() * 2 + 1.5;
            case 'far': return Math.random() * 1.5 + 0.8;
        }
    }
    
    getSpeedByDepth(depth) {
        switch(depth) {
            case 'near': return Math.random() * 1.5 + 1.2;
            case 'mid': return Math.random() * 1 + 0.7;
            case 'far': return Math.random() * 0.6 + 0.3;
        }
    }
    
    getOpacityByDepth(depth) {
        switch(depth) {
            case 'near': return Math.random() * 0.4 + 0.6;
            case 'mid': return Math.random() * 0.3 + 0.4;
            case 'far': return Math.random() * 0.2 + 0.2;
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(flake => {
            // Parallax effect dựa trên chuột
            let parallaxX = 0, parallaxY = 0;
            if (flake.z === 'near') {
                parallaxX = this.mouseX * 1.5;
                parallaxY = this.mouseY * 1.5;
            } else if (flake.z === 'mid') {
                parallaxX = this.mouseX * 0.8;
                parallaxY = this.mouseY * 0.8;
            } else {
                parallaxX = this.mouseX * 0.3;
                parallaxY = this.mouseY * 0.3;
            }
            
            // Wobble effect (dao động)
            flake.wobble += flake.wobbleSpeed;
            const wobbleX = Math.sin(flake.wobble) * 2;
            
            // Vẽ tuyết
            this.ctx.beginPath();
            this.ctx.arc(
                flake.x + parallaxX + wobbleX, 
                flake.y + parallaxY, 
                flake.radius, 
                0, 
                Math.PI * 2
            );
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            
            // Blur cho tuyết xa
            if (flake.z === 'far') {
                this.ctx.shadowBlur = 2;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            } else if (flake.z === 'near') {
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Cập nhật vị trí
            flake.y += flake.speed;
            flake.x += flake.drift;
            
            // Reset khi ra ngoài màn hình
            if (flake.y > this.canvas.height + 10) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            if (flake.x > this.canvas.width + 10) flake.x = -10;
            if (flake.x < -10) flake.x = this.canvas.width + 10;
        });
        
        if (mainScene.classList.contains('active')) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ========================================
// KHỞI TẠO VÀ XỬ LÝ SỰ KIỆN
// ========================================

// Khởi tạo tuyết intro
const introSnow = new IntroSnow(introCanvas);
introSnow.animate();

// Xử lý nút "Mở Quà"
openGiftBtn.addEventListener('click', () => {
    // Fade out intro
    introScreen.classList.remove('active');
    
    // Fade in main scene sau 1 giây
    setTimeout(() => {
        mainScene.classList.add('active');
        
        // Khởi tạo và chạy tuyết 3D
        const snow3D = new Snow3D(snow3DCanvas);
        snow3D.animate();
    }, 1000);
});

// Tối ưu: Dừng animation khi tab không active
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Tab bị ẩn - có thể thêm logic pause nếu cần
    } else {
        // Tab được active lại
        if (introScreen.classList.contains('active')) {
            introSnow.animate();
        }
    }
});