gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".container-box"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".container-box" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".container-box", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(".container-box").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

const tl = gsap.timeline({
  defaults: {
    ease: "power3.out",
    clearProps: "opacity,transform"
  }
});
gsap.fromTo(".nav-container",
  { y: -40 },
  {
    y: 0,
    duration: 0.8,
    ease: "power3.out"
  }
);
tl.from(".hero-section h1, .hero-section h2, .hero-section p", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, 
})
.from(".hero-section .project-box a", {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15,
  ease: "power3.out",
  clearProps: "opacity,transform"
}, "-=0.4")

const wrapper = document.querySelector(".hero-section .right-box");
const circleImage = document.querySelector(".hero-section .image-box");

gsap.set(wrapper, { perspective: 1000 });

// 3D Flip Entry 
tl.from(circleImage, {
    rotationY: 90,      // Side se dikhega (invisible jaisa)
    opacity: 0,
    scale: 0.8,
    duration: 1.8,
    ease: "power4.out"  
}, "-=1");


//  Same Mouse Effect
wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const xCenter = (e.clientX - rect.left) / rect.width - 0.5;
    const yCenter = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(circleImage, {
        rotationX: yCenter * 35,
        rotationY: xCenter * -35,
        scale: 1.1,
        boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.5)",
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 500
    });
});

wrapper.addEventListener("mouseleave", () => {
    gsap.to(circleImage, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        boxShadow: "none",
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
    });
});

gsap.to('.page2 h2',{
  transform: "translateX(calc(-100% - 2vw - 4px))",
  scrollTrigger: {
        trigger: '.page2',
        scroller: '.container-box',
        scrub: 2,
    }
})

gsap.from('.page2 p:nth-child(1)', {
  scrollTrigger: {
    trigger: '.page2 p:nth-child(1)',
    scroller: '.container-box',
    start: 'top 70%'
  },
  opacity: 0,
  // duration: 1
})
gsap.from('.page2 .alpha',{
   scrollTrigger: {
    trigger: '.page2 .alpha',
    scroller: '.container-box',
    start: 'top 60%',
    // markers: true
  },
  opacity: 0,
  duration: 1,
})

gsap.from('.skils-box .skill-box', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.skils-box .skill-box',
    scroller: '.container-box',
    // markers: true,
    start: 'top 80%',
  },
  y:20,
  stagger: {
    amount: 2
  }
})
gsap.from('.des-box .skill-box', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.des-box .skill-box',
    scroller: '.container-box',
    // markers: true,
    start: 'top 80%',
  },
  y:20,
  stagger: {
    amount: 1
  }
})

gsap.utils.toArray("#experience .w-full").forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            scroller: ".container-box",
            start: "top 85%",
            end: "top 70%",
            toggleActions: "play none none reverse",
            scrub: 1,
        },
        y: 50,
        opacity: 0,
        duration: 1
    });
});

const projectItems = gsap.utils.toArray("#project .grid > div");

projectItems.forEach((card) => {
  // 1. Card entry animation
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      scroller: ".container-box",
      start: "top 85%",
      end: "top 50%",
      toggleActions: "play none none reverse",
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
// 2. Image parallax effect
  const img = card.querySelector("img"); 
  
  if(img) {
      gsap.fromTo(img, 
        { scale: 1.2 }, 
        {
          scale: 1, 
          scrollTrigger: {
            trigger: card,
            scroller: ".container-box",
            start: "top 100%",
            end: "bottom 0%",
            scrub: 1.5, 
          }
        }
      );
  }
});

// --- MOBILE MENU LOGIC IMPROVED ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');

let isMenuOpen = false;

// Function to toggle menu
const toggleMenu = () => {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    // 1. Open Menu Animation
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.add('mobile-menu-enter-active');
      mobileMenu.classList.remove('mobile-menu-enter');
    }, 10);

    // 2. Button Animation (Lines turn to X)
    // Line 1 rotates 45 deg and moves down
    line1.classList.add('rotate-45', 'translate-y-[4px]');
    // Line 2 rotates -45 deg and moves up
    line2.classList.add('-rotate-45', '-translate-y-[4px]');
    
    // Change button bg when open
    menuBtn.classList.add('bg-indigo-50', 'border-indigo-200');

  } else {
    // 1. Close Menu Animation
    mobileMenu.classList.remove('mobile-menu-enter-active');
    mobileMenu.classList.add('mobile-menu-enter');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);

    // 2. Button Reset (Back to Parallel Lines)
    line1.classList.remove('rotate-45', 'translate-y-[4px]');
    line2.classList.remove('-rotate-45', '-translate-y-[4px]');
    
    // Reset button bg
    menuBtn.classList.remove('bg-indigo-50', 'border-indigo-200');
  }
};

// Event Listeners
menuBtn.addEventListener('click', toggleMenu);

// Close menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (isMenuOpen) toggleMenu();
  });
});

// Scroll effect
      const navContainer = document.querySelector('.nav-container');
      locoScroll.on("scroll", (args) => {
  if (args.scroll.y > 50) {
    navContainer.classList.add("scrolled");
  } else {
    navContainer.classList.remove("scrolled");
  }
});


// --- JELLY / ELASTIC PHYSICS CURSOR ---

const jellyCursor = document.querySelector("#jelly-cursor");

// Variables to track position and velocity
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let scaleX = 1;
let scaleY = 1;

// Mouse position update
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(jellyCursor, { opacity: 1, duration: 0.2 })
});

// Animation Loop (Har frame pe chalega)
gsap.ticker.add(() => {
  // 1. Smooth Follow Logic (Lerp)
  // 0.15 = Speed factor (Jitna kam, utna slow/heavy feel)
  const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
  
  cursorX += (mouseX - cursorX) * dt;
  cursorY += (mouseY - cursorY) * dt;

  // 2. Velocity Calculation (Speed kya hai?)
  const velX = mouseX - cursorX;
  const velY = mouseY - cursorY;
  
  // 3. Stretch Calculation (Jelly Effect)
  // Jitni tez mouse, utna zyada stretch
  const velocity = Math.sqrt(velX * velX + velY * velY);
  const stretch = Math.min(velocity * 0.04, 0.5); // Limit stretch amount
  
  // Angle calculate karo taaki movement ki disha me stretch ho
  const angle = Math.atan2(velY, velX) * (180 / Math.PI);

  scaleX = 1 + stretch; // Lamba hoga
  scaleY = 1 - stretch * 0.5; // Patla hoga (Volume maintain karne ke liye)

  // 4. Apply Transforms
  gsap.set(jellyCursor, {
    x: cursorX,
    y: cursorY,
    rotation: angle,
    scaleX: scaleX,
    scaleY: scaleY,
    xPercent: -50, 
    yPercent: -50
  });
});

// --- HOVER EFFECT (MAGNETIC SNAP) ---
const activeElements = document.querySelectorAll("a, button, .project-box div");

activeElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    // Hover pe bada gola ban jayega
    gsap.to(jellyCursor, {
      width: 60,
      height: 60,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  el.addEventListener("mouseleave", () => {
    // Wapas normal size
    gsap.to(jellyCursor, {
      width: 20,
      height: 20,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});


// --- FIX FOR NAVIGATION LINKS (SCROLL TO) ---
const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      locoScroll.scrollTo(targetSection);
      
      if (isMenuOpen) {
        toggleMenu();
      }
    }
  });
});


function disableContextMenu() {
  // Disable right-click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Disable most dev tool shortcuts (Windows & Mac)
  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    // Common devtool keys
    const key = e.key.toLowerCase();

    if (
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) || // Windows: Ctrl+Shift+I/J/C
      (e.ctrlKey && ["u", "s"].includes(key)) ||                   // Ctrl+U/S
      (isMac && e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) // Mac: Cmd+Opt+I/J/C
    ) {
      e.preventDefault();
      return false;
    }
  });

}

disableContextMenu()
