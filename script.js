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
            submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
