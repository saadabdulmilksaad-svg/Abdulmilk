// ===== Service Worker Registration with Update Handling =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js?v=7")
      .then((registration) => {
        console.log(
          "Service Worker registered successfully:",
          registration.scope,
        );

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("Service Worker update found!");

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker installed and waiting
              console.log("New version available! Refresh to update.");
              // Optional: Show update notification to user
              if (confirm("تحديث جديد متاح! هل تريد تحديث الصفحة الآن؟")) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

// ===== Cache Clear Function =====
const clearSiteCache = () => {
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
        console.log("Cache deleted:", cacheName);
      });
    });
  }
  // Also clear localStorage and sessionStorage if needed
  localStorage.clear();
  sessionStorage.clear();
  console.log("All caches cleared!");
};

// Make clearSiteCache available globally for debugging
window.clearSiteCache = clearSiteCache;

// ===== Performance Optimizations =====
// Use passive event listeners for better scroll performance
const passiveSupported = (() => {
  let passive = false;
  try {
    const options = {
      get passive() {
        passive = true;
        return false;
      },
    };
    window.addEventListener("test", null, options);
    window.removeEventListener("test", null, options);
  } catch (err) {
    passive = false;
  }
  return passive;
})();

const eventOptions = passiveSupported ? { passive: true } : false;

// ===== Navigation Scroll Effect =====
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener(
  "scroll",
  function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  },
  eventOptions,
);

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Close mobile menu if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener(
  "scroll",
  function () {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  },
  eventOptions,
);

// ===== Back to Top Button =====
const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  window.addEventListener(
    "scroll",
    function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    },
    eventOptions,
  );

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== Safe Base64 Encoding Function =====
function safeBtoa(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// ===== Handle Missing Images =====
const handleMissingImages = () => {
  const images = document.querySelectorAll('img[src*="images/"]');
  images.forEach((img) => {
    img.addEventListener("error", function () {
      // Create a simple SVG placeholder instead of external URL
      const svgPlaceholder =
        "data:image/svg+xml;base64," +
        safeBtoa(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#4a90e2"/>
          <text x="50%" y="50%" font-family="Cairo, Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">صورة</text>
        </svg>
      `);
      this.src = svgPlaceholder;
      this.alt = "صورة شخصية - يرجى إضافة صورتك في مجلد images";
    });
  });
};

// ===== Animate Progress Bars on Scroll =====
const animateProgressBars = () => {
  const progressBars = document.querySelectorAll(".progress-bar");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = "0%";
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 },
  );

  progressBars.forEach((bar) => observer.observe(bar));
};

// ===== Contact Form Submission with WhatsApp Integration & Validation =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  // Real-time validation
  const formInputs = contactForm.querySelectorAll('.form-control-modern');

  formInputs.forEach(input => {
    input.addEventListener('blur', function () {
      validateField(this);
    });

    input.addEventListener('input', function () {
      if (this.classList.contains('is-invalid')) {
        validateField(this);
      }
    });
  });

  // Validation function
  function validateField(field) {
    const fieldId = field.id;
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous validation classes
    field.classList.remove('is-valid', 'is-invalid');

    // Name validation
    if (fieldId === 'name') {
      if (fieldValue.length === 0) {
        isValid = false;
        errorMessage = 'يرجى إدخال الاسم';
      } else if (fieldValue.length < 3) {
        isValid = false;
        errorMessage = 'الاسم يجب أن يكون 3 أحرف على الأقل';
      } else if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'الاسم يجب أن يحتوي على أحرف فقط';
      }
    }

    // Phone validation
    if (fieldId === 'phone') {
      if (fieldValue.length === 0) {
        isValid = false;
        errorMessage = 'يرجى إدخال رقم الهاتف';
      } else if (!/^[0-9]+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'رقم الهاتف يجب أن يحتوي على أرقام فقط';
      } else if (!/^[0-9]{9,15}$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'رقم الهاتف يجب أن يكون من 9 إلى 15 رقم';
      }
    }

    // Email validation
    if (fieldId === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (fieldValue.length === 0) {
        isValid = false;
        errorMessage = 'يرجى إدخال البريد الإلكتروني';
      } else if (!emailPattern.test(fieldValue)) {
        isValid = false;
        errorMessage = 'البريد الإلكتروني غير صحيح';
      }
    }

    // Subject validation
    if (fieldId === 'subject') {
      if (fieldValue.length === 0) {
        isValid = false;
        errorMessage = 'يرجى إدخال الموضوع';
      } else if (fieldValue.length < 3) {
        isValid = false;
        errorMessage = 'الموضوع يجب أن يكون 3 أحرف على الأقل';
      } else if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'الموضوع يجب أن يحتوي على أحرف فقط (بدون أرقام أو رموز)';
      }
    }

    // Message validation
    if (fieldId === 'message') {
      if (fieldValue.length === 0) {
        isValid = false;
        errorMessage = 'يرجى كتابة رسالة';
      } else if (fieldValue.length < 10) {
        isValid = false;
        errorMessage = `يرجى كتابة 10 أحرف على الأقل (${fieldValue.length}/10)`;
      } else if (!/^[\u0600-\u06FFa-zA-Z\s\.\,\!\؟\،\n\r]+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'الرسالة يجب أن تحتوي على نصوص فقط (بدون أرقام)';
      }
    }

    // Apply validation classes
    if (isValid) {
      field.classList.add('is-valid');
    } else {
      field.classList.add('is-invalid');
      const feedback = field.parentElement.querySelector('.invalid-feedback');
      if (feedback && errorMessage) {
        feedback.textContent = errorMessage;
      }
    }

    return isValid;
  }

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    let formIsValid = true;
    formInputs.forEach(input => {
      if (!validateField(input)) {
        formIsValid = false;
      }
    });

    // If form is not valid, stop here
    if (!formIsValid) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Get button elements
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');

    // Show loading state
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      submitButton.disabled = true;
    }

    // Prepare WhatsApp message
    const whatsappNumber = "967779830449"; // رقم الواتساب (بدون + أو 00)

    // Format the message for WhatsApp
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-YE');
    const timeStr = now.toLocaleTimeString('ar-YE');

    const whatsappMessage = `
🚀 *رسالة جديدة من موقعك الشخصي* 🚀
---------------------------------------
📅 *التاريخ:* ${dateStr}
⏰ *الوقت:* ${timeStr}

👤 *تفاصيل المرسل:*
- *الاسم:* ${name}
- *الهاتف:* ${phone}
- *البريد:* ${email}

📝 *موضوع الرسالة:*
${subject}

💬 *نص المراسلة:*
${message}

---------------------------------------
✨ *تم الإرسال عبر نظام التواصل في موقع عبدالملك سعد*
    `.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Simulate sending (show success then redirect)
    setTimeout(() => {
      // Show success state
      if (btnText && btnLoading) {
        btnLoading.style.display = 'none';
        btnText.innerHTML = '<i class="bi bi-whatsapp me-2"></i>جاري التحويل إلى واتساب...';
        btnText.style.display = 'flex';
        submitButton.style.background = 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)';
      }

      // Log the data (for debugging)
      console.log("Form submitted:", { name, phone, email, subject, message });
      console.log("WhatsApp URL:", whatsappURL);

      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');

        // Reset form
        contactForm.reset();

        // Remove validation classes
        formInputs.forEach(input => {
          input.classList.remove('is-valid', 'is-invalid');
        });

        // Reset button after opening WhatsApp
        setTimeout(() => {
          if (btnText && btnLoading) {
            btnText.innerHTML = '<i class="bi bi-whatsapp me-2"></i>إرسال عبر واتساب';
            btnText.style.display = 'flex';
            submitButton.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
            submitButton.disabled = false;
          }
        }, 2000);
      }, 800);
    }, 1000); // Show loading for 1 second
  });
}

// ===== Generic Scroll Animation Function =====
const createScrollObserver = (selector, threshold = 0.1) => {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: threshold },
  );

  elements.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
};

// Initialize specific animations
const animateProjectCards = () => createScrollObserver(".project-card");
const animateSkillCards = () => createScrollObserver(".skill-card");

// ===== Optimize Project Images =====
const optimizeProjectImages = () => {
  const projectImages = document.querySelectorAll(".project-image img");

  projectImages.forEach((img) => {
    img.addEventListener("error", function () {
      const svgPlaceholder =
        "data:image/svg+xml;base64," +
        safeBtoa(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#4a90e2"/>
          <text x="50%" y="50%" font-family="Cairo, Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">صورة المشروع</text>
        </svg>
      `);

      this.src = svgPlaceholder;
      this.alt = "صورة المشروع";
    });
  });
};

// ===== Typewriter Effect =====
const initTypewriter = () => {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const words = ["مطور مواقع ويب", "مهندس برمجيات", "مصمم واجهات UI/UX", "Freelancer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // سرعة المسح أسرع
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; // سرعة الكتابة عادية
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // انتهت الكلمة، انتظر قليلاً قبل المسح
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      // انتهى المسح، انتقل للكلمة التالية
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing
  setTimeout(type, 1000);
};

// ===== Initialize all animations on page load =====
window.addEventListener("load", function () {
  handleMissingImages();
  animateProgressBars();
  animateProjectCards();
  animateSkillCards();
  optimizeProjectImages();
  initTypewriter();

  // Initialize 3D Engines
  init3DBackground();
  initHero3D();
  init3DTilt();

  // Add loaded class to body
  document.body.classList.add("loaded");

  // Force refresh check - add timestamp to prevent caching during development
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();
  if (lastVisit && now - parseInt(lastVisit) > 3600000) {
    // 1 hour
    console.log("Hourly check - ensuring fresh content");
  }
  localStorage.setItem("lastVisit", now.toString());
});

// ===== Lazy Loading Images (for older browsers) =====
if ("loading" in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
  document.body.appendChild(script);
}

// ===== Debounce function for performance =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== Optimize scroll events =====
const optimizedScroll = debounce(() => {
  // Any additional scroll-based animations can go here
}, 100);

window.addEventListener("scroll", optimizedScroll, eventOptions);

// ==========================================
// ===== 3D Particle Constellation Bg =====
// ==========================================
function init3DBackground() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particles = [];
  const particleCount = Math.min(80, Math.floor((width * height) / 15000));
  const maxDistance = 110;
  const fov = 350;
  
  let mouse = { x: null, y: null, targetX: null, targetY: null, radius: 150 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.targetX = null;
    mouse.targetY = null;
  });
  
  class Particle {
    constructor() {
      this.reset(true);
    }
    
    reset(init = false) {
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.y = (Math.random() - 0.5) * height * 1.5;
      this.z = init ? Math.random() * 800 - 400 : 400;
      
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.vz = (Math.random() - 0.5) * 0.4 - 0.1;
      
      this.baseRadius = Math.random() * 1.5 + 1;
      this.color = `rgba(0, 242, 254, ${Math.random() * 0.35 + 0.15})`;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      
      // Rotate slowly in Y
      const angleY = 0.0003;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const xRot = this.x * cosY - this.z * sinY;
      const zRot = this.z * cosY + this.x * sinY;
      this.x = xRot;
      this.z = zRot;
      
      // Reset if too close or too far
      if (this.z < -fov || Math.abs(this.x) > width * 2 || Math.abs(this.y) > height * 2 || this.z > 600) {
        this.reset(false);
      }
      
      this.scale = fov / (fov + this.z);
      this.projX = this.x * this.scale + width / 2;
      this.projY = this.y * this.scale + height / 2;
      
      // Gravitational push away from cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.projX - mouse.x;
        const dy = this.projY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.projX += (dx / dist) * force * 10 * this.scale;
          this.projY += (dy / dist) * force * 10 * this.scale;
        }
      }
    }
    
    draw() {
      if (this.z <= -fov) return;
      ctx.beginPath();
      ctx.arc(this.projX, this.projY, this.baseRadius * this.scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Smooth mouse movements
    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }
    } else {
      mouse.x = null;
      mouse.y = null;
    }
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Connect particles with 3D lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist3D < maxDistance) {
          const projDx = p1.projX - p2.projX;
          const projDy = p1.projY - p2.projY;
          const dist2D = Math.sqrt(projDx * projDx + projDy * projDy);
          
          if (dist2D < maxDistance * 1.4) {
            const alpha = (1 - dist3D / maxDistance) * 0.1 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.5 * Math.min(p1.scale, p2.scale);
            ctx.stroke();
          }
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ==========================================
// ===== Three.js WebGL Scene in Hero =====
// ==========================================
function initHero3D() {
  if (typeof THREE === 'undefined') {
    console.warn("Three.js is not loaded. Skipping WebGL scene.");
    return;
  }
  
  const container = document.getElementById('hero-3d-webgl');
  if (!container) return;
  
  let width = container.clientWidth || 350;
  let height = container.clientHeight || 350;
  
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = 3.5;
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Particle sphere geometry
  const particleCount = 750;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const color1 = new THREE.Color('#00f2fe'); // Neon Cyan
  const color2 = new THREE.Color('#7f53ac'); // Violet glow
  
  for (let i = 0; i < particleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.35; // Sphere size
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
    
    const mixColor = color1.clone().lerp(color2, (x + r) / (r * 2));
    colors[i * 3] = mixColor.r;
    colors[i * 3 + 1] = mixColor.g;
    colors[i * 3 + 2] = mixColor.b;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Procedural glowing round dot texture
  function createTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 242, 254, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  }
  
  const material = new THREE.PointsMaterial({
    size: 0.065,
    vertexColors: true,
    map: createTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  
  // Track cursor coordinates
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });
  
  window.addEventListener('resize', () => {
    width = container.clientWidth || 350;
    height = container.clientHeight || 350;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    // Smooth interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    
    // Rotate relative to mouse and time
    points.rotation.y = time * 0.08 + mouse.x * 0.3;
    points.rotation.x = time * 0.05 + mouse.y * 0.3;
    
    // Vertex displacement wave
    const positionsAttr = geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      const z = originalPositions[i * 3 + 2];
      
      const wave = Math.sin(x * 2.5 + time * 1.2) * 0.045 + Math.cos(y * 2.5 + time * 1.0) * 0.045;
      
      positionsAttr.setX(i, x * (1.0 + wave));
      positionsAttr.setY(i, y * (1.0 + wave));
      positionsAttr.setZ(i, z * (1.0 + wave));
    }
    positionsAttr.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  
  animate();
}

// ==========================================
// ===== GPU-Accelerated 3D Parallax Tilt =====
// ==========================================
function init3DTilt() {
  if (window.innerWidth < 992) return;
  const elements = document.querySelectorAll('[data-tilt]');
  
  elements.forEach(el => {
    el.classList.add('tilt-element');
    
    // Inject glare overlays
    if (!el.querySelector('.tilt-glare-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'tilt-glare-wrapper';
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      wrapper.appendChild(glare);
      el.appendChild(wrapper);
    }
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      const maxTilt = 12; // tilt degree limit
      const rotateX = (0.5 - yPercent) * maxTilt;
      const rotateY = (xPercent - 0.5) * maxTilt;
      
      // Update transforms directly on GPU
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      const glare = el.querySelector('.tilt-glare');
      if (glare) {
        glare.style.left = `${xPercent * 100}%`;
        glare.style.top = `${yPercent * 100}%`;
      }
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
      const glare = el.querySelector('.tilt-glare');
      if (glare) {
        glare.style.transition = 'none';
        glare.style.opacity = '1';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      
      const glare = el.querySelector('.tilt-glare');
      if (glare) {
        glare.style.transition = 'opacity 0.4s ease';
        glare.style.opacity = '0';
      }
    });
  });
}

// ===========================================================
// ✨ MODERN FEATURES: Reading Progress, Back-To-Top, 
//    Testimonials Carousel, Language Toggle
// ===========================================================

// ===== 1. Reading Progress Bar + Back-To-Top Circular Ring =====
(function () {
  const progressBar = document.getElementById('reading-progress-bar');
  const backToTopBtn = document.getElementById('backToTop');
  const progressCircle = document.getElementById('progressCircle');
  const circumference = 113.1; // 2 * π * r (r=18)

  function updateReadingProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Reading progress bar width
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    // Back-to-top button visibility
    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }

      // SVG circle fill
      if (progressCircle) {
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }
    }
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  updateReadingProgress();

  // Scroll to top on click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// ===== 2. Testimonials Auto-Carousel with Touch Swipe =====
(function () {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialsDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (cards.length === 0) return;

  let current = 0;
  let autoTimer = null;
  let visibleCount = 1;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width;
  }

  function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap || style.columnGap || '24');
  }

  function totalSlides() {
    return Math.max(0, cards.length - visibleCount);
  }

  function goTo(index) {
    visibleCount = getVisibleCount();
    const max = totalSlides();
    current = Math.max(0, Math.min(index, max));
    const offset = current * (getCardWidth() + getGap());
    track.style.transform = `translateX(${document.dir === 'rtl' ? offset : -offset}px)`;
    updateDots();
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    visibleCount = getVisibleCount();
    const count = totalSlides() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot-nav' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `الانتقال للتقييم ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); restartAuto(); });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dot-nav').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() {
    visibleCount = getVisibleCount();
    goTo(current < totalSlides() ? current + 1 : 0);
  }

  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }

  // Init
  visibleCount = getVisibleCount();
  buildDots();
  restartAuto();

  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
    restartAuto();
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else goTo(current > 0 ? current - 1 : totalSlides());
      restartAuto();
    }
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', restartAuto);
})();

// ===== 3. Language Toggle (Arabic / English) =====
(function () {
  const langBtn = document.getElementById('lang-toggle');
  const langIcon = document.getElementById('lang-icon');
  if (!langBtn) return;

  let currentLang = 'ar';

  // All translatable elements
  const translations = {
    navLinks: [
      { selector: 'a[href="#home"].nav-link',       ar: 'الرئيسية',      en: 'Home' },
      { selector: 'a[href="#about"].nav-link',      ar: 'من أنا',        en: 'About' },
      { selector: 'a[href="#skills"].nav-link',     ar: 'المهارات',      en: 'Skills' },
      { selector: 'a[href="#projects"].nav-link',   ar: 'المشاريع',      en: 'Projects' },
      { selector: 'a[href="#contact"].nav-link',    ar: 'اتصل بي',       en: 'Contact' },
    ]
  };

  function applyLanguage(lang) {
    document.body.classList.add('lang-switching');

    setTimeout(() => {
      // Nav links
      translations.navLinks.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) el.textContent = item[lang];
      });

      // All data-ar / data-en attributes
      document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
      });

      // Input placeholders
      const placeholders = {
        ar: { name: 'الاسم الكامل', phone: 'رقم الهاتف (مثال: 779830449)', email: 'البريد الإلكتروني', subject: 'الموضوع', message: 'رسالتك' },
        en: { name: 'Full Name', phone: 'Phone Number (e.g. 779830449)', email: 'Email Address', subject: 'Subject', message: 'Your Message' }
      };
      ['name', 'phone', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.placeholder = placeholders[lang][id];
      });

      // Hero brand
      const brand = document.querySelector('.navbar-brand');
      if (brand) brand.innerHTML = lang === 'ar'
        ? '<i class="bi bi-code-slash me-2"></i>عبدالملك سعد'
        : '<i class="bi bi-code-slash me-2"></i>Abdulmilk Saad';

      // Hero headline
      const heroDesc = document.querySelector('.hero-content > p:not(.lead)');
      if (heroDesc) heroDesc.textContent = lang === 'ar'
        ? 'أنا مطور مواقع ويب من اليمن متخصص في تصميم وتطوير مواقع سريعة، متجاوبة، ومهيأة لمحركات البحث SEO.'
        : 'I am a web developer from Yemen specializing in designing fast, responsive, and SEO-optimized websites.';

      // Buttons
      const projectsBtn = document.querySelector('.hero-buttons a[href="#projects"]');
      if (projectsBtn) projectsBtn.innerHTML = lang === 'ar'
        ? '<i class="bi bi-briefcase me-2"></i>مشاريعي'
        : '<i class="bi bi-briefcase me-2"></i>Projects';

      const contactBtn = document.querySelector('.hero-buttons a[href="#contact"]');
      if (contactBtn) contactBtn.innerHTML = lang === 'ar'
        ? '<i class="bi bi-envelope me-2"></i>تواصل معي'
        : '<i class="bi bi-envelope me-2"></i>Contact Me';

      // Submit button
      const submitBtn = document.querySelector('.btn-text');
      if (submitBtn) submitBtn.innerHTML = lang === 'ar'
        ? '<i class="bi bi-whatsapp me-2"></i>إرسال عبر واتساب'
        : '<i class="bi bi-whatsapp me-2"></i>Send via WhatsApp';

      // HTML dir and lang attribute
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      // Update button label
      langIcon.textContent = lang === 'ar' ? 'EN' : 'عر';

      // Reset and update testimonials carousel direction and layout
      window.dispatchEvent(new Event('resize'));

      document.body.classList.remove('lang-switching');
    }, 150);
  }

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(currentLang);
  });
})();
