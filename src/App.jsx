/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import images from './assets/images';
import './App.css';

function App() {
  const elementsRef = useRef([]);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);

    if (!open) {
      document.querySelector('.navbar .content-list').style.visibility = "visible"
      anime({
        targets: ".navbar .content-list",
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
    } else {
      anime({
        targets: ".navbar .content-list",
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
          document.querySelector('.navbar .content-list').style.visibility = "hidden";
        }
      });
    }
  }

  function fitElementToParent(el, padding) {
    let timeout = null;
    function resize() {
      if (timeout) clearTimeout(timeout);
      anime.set(el, { scale: 1 });
      const pad = padding || 0;
      const parentEl = el.parentNode;
      const elOffsetWidth = el.offsetWidth - pad;
      const parentOffsetWidth = parentEl.offsetWidth;
      const ratio = parentOffsetWidth / elOffsetWidth;
      timeout = setTimeout(() => anime.set(el, { scale: ratio }), 10);
    }
    resize();
    window.addEventListener('resize', resize);
  }

  useEffect(() => {
    const sphereEl = document.querySelector('.sphere-animation');
    if (!sphereEl) return;

    const spherePathEls = sphereEl.querySelectorAll('.sphere path');
    const pathLength = spherePathEls.length;
    const animations = [];

    fitElementToParent(sphereEl);

    const breathAnimation = anime({
      begin: function() {
        for (let i = 0; i < pathLength; i++) {
          animations.push(anime({
            targets: spherePathEls[i],
            stroke: { value: ['rgba(255,75,75,1)', 'rgba(80,80,80,.35)'], duration: 500 },
            translateX: [2, -4],
            translateY: [2, -4],
            easing: 'easeOutQuad',
            autoplay: false
          }));
        }
      },
      update: function(ins) {
        animations.forEach(function(animation, i) {
          const percent = (1 - Math.sin((i * .35) + (.0022 * ins.currentTime))) / 2;
          animation.seek(animation.duration * percent);
        });
      },
      duration: Infinity,
      autoplay: false
    });

    const introAnimation = anime.timeline({
      autoplay: false
    })
    .add({
      targets: spherePathEls,
      strokeDashoffset: {
        value: [anime.setDashoffset, 0],
        duration: 3900,
        easing: 'easeInOutCirc',
        delay: anime.stagger(190, { direction: 'reverse' })
      },
      duration: 2000,
      delay: anime.stagger(60, { direction: 'reverse' }),
      easing: 'linear'
    }, 0);

    const shadowAnimation = anime({
      targets: '#sphereGradient',
      x1: '25%',
      x2: '25%',
      y1: '0%',
      y2: '75%',
      duration: 30000,
      easing: 'easeOutQuint',
      autoplay: false
    });

    const rightToLeftAnimation = anime({
      targets: '.rightToLeft',
      translateX: ['0', '-100%'],
      duration: 25000,
      easing: 'linear',
      loop: true,
    });
  
    const leftToRightAnimation = anime({
      targets: '.leftToRight',
      translateX: ['-100%', '0'],
      duration: 25000,
      easing: 'linear',
      loop: true,
    });

    const handleScroll = () => {
      elementsRef.current.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          if (!element.classList.contains('animated')) {
            anime({
              targets: element,
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1000,
              easing: 'easeOutExpo',
              delay: 500
            });
            element.style.width = '30%';
            element.classList.add('animated');  

            if (window.matchMedia('(max-width: 720px)').matches) {
              element.style.width = '100%';
            }
          }
        }
      });
    };

    function init() {
      introAnimation.play();
      breathAnimation.play();
      shadowAnimation.play();
      rightToLeftAnimation.play();
      leftToRightAnimation.play();
    }

    init();

    const pauseAnimation = () => {
      if (window.scrollY >= window.innerHeight) {
        breathAnimation.pause();
        shadowAnimation.pause();
      } else {
        breathAnimation.play();
        shadowAnimation.play();
      }
    }

    const pauseAndResumeAnimation = [handleScroll, pauseAnimation]

    pauseAndResumeAnimation.forEach(element => {
      window.addEventListener('scroll', element);
    })
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }

  }, []);

  const setRef = (element) => {
    if (element && !elementsRef.current.includes(element)) {
      elementsRef.current.push(element);
    }
  }

  return (
    <>
      <nav className='navbar'>
        <h1>D</h1>
        <div className={`content-list`}>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#credits">Contacts</a>
        </div>
        <button className='menu-toggle' onClick={toggleMenu}>☰</button>
      </nav>
      <div className='heighting-banner'>
      <div className='banner'>
      <div className="animation-wrapper">
        <div className="sphere-animation">
          <svg className="sphere" viewBox="0 0 440 440" stroke="rgba(80,80,80,.35)">
            <defs>
              <linearGradient id="sphereGradient" x1="5%" x2="5%" y1="0%" y2="15%">
                <stop stopColor="#373734" offset="0%"/>
                <stop stopColor="#242423" offset="50%"/>
                <stop stopColor="#0D0D0C" offset="100%"/>
              </linearGradient>
            </defs>
            <path d="M361.604 361.238c-24.407 24.408-51.119 37.27-59.662 28.727-8.542-8.543 4.319-35.255 28.726-59.663 24.408-24.407 51.12-37.269 59.663-28.726 8.542 8.543-4.319 35.255-28.727 59.662z"/>
            <path d="M360.72 360.354c-35.879 35.88-75.254 54.677-87.946 41.985-12.692-12.692 6.105-52.067 41.985-87.947 35.879-35.879 75.254-54.676 87.946-41.984 12.692 12.692-6.105 52.067-41.984 87.946z"/>
            <path d="M357.185 356.819c-44.91 44.91-94.376 68.258-110.485 52.149-16.11-16.11 7.238-65.575 52.149-110.485 44.91-44.91 94.376-68.259 110.485-52.15 16.11 16.11-7.239 65.576-52.149 110.486z"/>
            <path d="M350.998 350.632c-53.21 53.209-111.579 81.107-130.373 62.313-18.794-18.793 9.105-77.163 62.314-130.372 53.209-53.21 111.579-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z"/>
            <path d="M343.043 342.677c-59.8 59.799-125.292 91.26-146.283 70.268-20.99-20.99 10.47-86.483 70.269-146.282 59.799-59.8 125.292-91.26 146.283-70.269 20.99 20.99-10.47 86.484-70.27 146.283z"/>
            <path d="M334.646 334.28c-65.169 65.169-136.697 99.3-159.762 76.235-23.065-23.066 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z"/>
            <path d="M324.923 324.557c-69.806 69.806-146.38 106.411-171.031 81.76-24.652-24.652 11.953-101.226 81.759-171.032 69.806-69.806 146.38-106.411 171.031-81.76 24.652 24.653-11.953 101.226-81.759 171.032z"/>
            <path d="M312.99 312.625c-73.222 73.223-153.555 111.609-179.428 85.736-25.872-25.872 12.514-106.205 85.737-179.428s153.556-111.609 179.429-85.737c25.872 25.873-12.514 106.205-85.737 179.429z"/>
            <path d="M300.175 299.808c-75.909 75.909-159.11 115.778-185.837 89.052-26.726-26.727 13.143-109.929 89.051-185.837 75.908-75.908 159.11-115.778 185.837-89.051 26.726 26.726-13.143 109.928-89.051 185.836z"/>
            <path d="M284.707 284.34c-77.617 77.617-162.303 118.773-189.152 91.924-26.848-26.848 14.308-111.534 91.924-189.15C265.096 109.496 349.782 68.34 376.63 95.188c26.849 26.849-14.307 111.535-91.923 189.151z"/>
            <path d="M269.239 267.989c-78.105 78.104-163.187 119.656-190.035 92.807-26.849-26.848 14.703-111.93 92.807-190.035 78.105-78.104 163.187-119.656 190.035-92.807 26.849 26.848-14.703 111.93-92.807 190.035z"/>
            <path d="M252.887 252.52C175.27 330.138 90.584 371.294 63.736 344.446 36.887 317.596 78.043 232.91 155.66 155.293 233.276 77.677 317.962 36.521 344.81 63.37c26.85 26.848-14.307 111.534-91.923 189.15z"/>
            <path d="M236.977 236.61C161.069 312.52 77.867 352.389 51.14 325.663c-26.726-26.727 13.143-109.928 89.052-185.837 75.908-75.908 159.11-115.777 185.836-89.05 26.727 26.726-13.143 109.928-89.051 185.836z"/>
            <path d="M221.067 220.7C147.844 293.925 67.51 332.31 41.639 306.439c-25.873-25.873 12.513-106.206 85.736-179.429C200.6 53.786 280.931 15.4 306.804 41.272c25.872 25.873-12.514 106.206-85.737 179.429z"/>
            <path d="M205.157 204.79c-69.806 69.807-146.38 106.412-171.031 81.76-24.652-24.652 11.953-101.225 81.759-171.031 69.806-69.807 146.38-106.411 171.031-81.76 24.652 24.652-11.953 101.226-81.759 171.032z"/>
            <path d="M189.247 188.881c-65.169 65.169-136.696 99.3-159.762 76.235-23.065-23.065 11.066-94.593 76.235-159.762s136.697-99.3 159.762-76.235c23.065 23.065-11.066 94.593-76.235 159.762z"/>
            <path d="M173.337 172.971c-59.799 59.8-125.292 91.26-146.282 70.269-20.991-20.99 10.47-86.484 70.268-146.283 59.8-59.799 125.292-91.26 146.283-70.269 20.99 20.991-10.47 86.484-70.269 146.283z"/>
            <path d="M157.427 157.061c-53.209 53.21-111.578 81.108-130.372 62.314-18.794-18.794 9.104-77.164 62.313-130.373 53.21-53.209 111.58-81.108 130.373-62.314 18.794 18.794-9.105 77.164-62.314 130.373z"/>
            <path d="M141.517 141.151c-44.91 44.91-94.376 68.259-110.485 52.15-16.11-16.11 7.239-65.576 52.15-110.486 44.91-44.91 94.375-68.258 110.485-52.15 16.109 16.11-7.24 65.576-52.15 110.486z"/>
            <path d="M125.608 125.241c-35.88 35.88-75.255 54.677-87.947 41.985-12.692-12.692 6.105-52.067 41.985-87.947C115.525 43.4 154.9 24.603 167.592 37.295c12.692 12.692-6.105 52.067-41.984 87.946z"/>
            <path d="M109.698 109.332c-24.408 24.407-51.12 37.268-59.663 28.726-8.542-8.543 4.319-35.255 28.727-59.662 24.407-24.408 51.12-37.27 59.662-28.727 8.543 8.543-4.319 35.255-28.726 59.663z"/>
          </svg>
        </div>
        </div>
        <div className='text-container'>
          <span>Hall</span>
          <h1>I am creating high-quality, user-centric web applications</h1>
        </div>
      </div>
      </div>
      <div id='about'>
        <h1>Who am I?</h1>
        <div className='profile'>
          <div className='text-profile-container'>
          <h2>Nice to meet you, I am Dauzan</h2>
          <p>A full-stack developer from Indonesia who is passionate about web development. With experience in creating dynamic, responsive web applications, and committed to continuously learning more about this field. I am also open to exploring other fields related to computer science.</p>
          <p>As an autodidact, I am eager to contribute to impactful projects and collaborate with like-minded professionals in the tech industry.</p>
          <span className='dividing-line'></span>
          <h2>How may I speak with you?</h2>
          <p>I am very interested in connecting with people worldwide, and that curiosity encourages me to learn a foreign language other than English as it would boost my career growth and beyond.</p>
          <ul className='language-container'>
            <li className='language'>Indonesia</li>
            <li className='language'>English</li>
            <li className='language'>Netherlands</li>
            <li className='language'>German</li>
          </ul>
          </div>
          <img src={images.avatarPhoto} alt="photo" />
        </div>
        <h1>Speciality</h1>
        <div className='skills-web-dev'>
          <p>Strong focus on front-end technologies with a solid understanding of back-end developments. I possess all the basics required for web development and have the ability to continue developing and contributing to other projects. I am also very interested in learning more about and expanding my skills in cloud computing.</p>
          <div className='basic-skills-container'>
            <div className='rightToLeft-container'>
              <div className='rightToLeft'>
                <p>- HTML CSS Javascript PHP -</p>
              </div>
              <div className='rightToLeft'>
                <p>- HTML CSS Javascript PHP -</p>
              </div>
              <div className='rightToLeft'>
                <p>- HTML CSS Javascript PHP -</p>
              </div>
            </div>
            <div className='leftToRight-container'>
              <div className='leftToRight'>
                <p>- PHP Javascript CSS HTML -</p>
              </div>
              <div className='leftToRight'>
                <p>- PHP Javascript CSS HTML -</p>
              </div>
              <div className='leftToRight'>
                <p>- PHP Javascript CSS HTML -</p>
              </div>
            </div>
          </div>
          <div className='skill-container'>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>React</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Node.js</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Laravel</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Express.js</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Vite</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Jest</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Hapi.js</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Axios.js</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>jQuery</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Bootstrap</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>MySQL</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>MongoDB</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>SQLite</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>AWS</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Azure</h2>
            </div>
            <div>
              <img src={images.arrowIcon} alt="Arrow Icon" />
              <h2>Python</h2>
            </div>
          </div>
        </div>
      </div>
      <div id='projects'>
        <h1>My Projects</h1>
        <div className='box'>
          <div>
            <h2>V'tha Cookies Website</h2>
            <p>Created a visually appealing and user-friendly website for a local bakery to showcase their products and allow customers to place orders online. display their menu, promote special offers, and allow customers to place orders for pickup or delivery.</p>
            <ul className='language-container'>
              <li className='language'>HTML5</li>
              <li className='language'>CSS3</li>
              <li className='language'>Javascript</li>
            </ul>
          </div>
          <img src={images.vthaCookiesLogo} alt="V'tha Cookies Logo" ref={setRef} style={{width : 0}} />
        </div>
        <div className='box'>
          <div>
            <h2>Simple-Tube</h2>
            <p>Developed a custom video streaming platform inspired by YouTube, allowing view and interact with videos. The project aimed to replicate core features of YouTube with added customization and personal touches.</p>
            <ul className='language-container'>
              <li className='language'>React</li>
              <li className='language'>Vite</li>
            </ul>
          </div>
          <img src={images.stubeLogo} alt="STube Logo" ref={setRef} style={{width : 0}} />
        </div>
        <div className='box'>
          <div>
            <h2>Chatty</h2>
            <p>Developed a real-time chat application using Laravel to facilitate instant messaging between users. The project focuses on providing a reliable and interactive chat experience with features such as user authentication, private and and real-time notifications.</p>
            <ul className='language-container'>
              <li className='language'>Laravel</li>
              <li className='language'>SQlite</li>
            </ul>
          </div>
          <img src={images.chattyLogo} alt="Chatty Logo" ref={setRef} style={{width : 0}} />
        </div>
        <div className='box'>
          <div>
            <h2>Bank-Website Design</h2>
            <p>Designed and developed a modern, professional bank website with a strong emphasis on user-centered design. The project prioritized creating a visually appealing and intuitive interface to enhance the overall user experience.</p>
            <ul className='language-container'>
              <li className='language'>HTML5</li>
              <li className='language'>CSS3</li>
              <li className='language'>Javascript</li>
            </ul>
          </div>
          <img src={images.bankbluesLogo} alt="BankSafe Logo" ref={setRef} style={{width : 0}} />
        </div>
        <span className='dividing-line'><p>There is much more to come!</p></span>
      </div>
      <div id='credits'>
        <h1>Interested to know me more? Get in touch</h1>
        <div className='contact-box'>
          <img src={images.gmailIcon} alt="Gmail Icon" />
          <p>dauzanzaldys@gmail.com</p>
        </div>
        <div className='contact-box'>
          <a href="https://www.linkedin.com/in/dauzan-zaldy-s-225aba316/"><img src={images.linkedinIcon} alt="" /> Linkedin</a>
        </div>
      </div>
      <footer className='site-footer'>
        <h1>@ 2024 Dauzan Zaldy Saputro. This website made in the midnight with a cup of coffe ☕</h1>
      </footer>
    </>
  );
}

export default App;
