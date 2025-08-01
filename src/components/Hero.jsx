import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

const Hero = () => {
  const videoRef = useRef();

  //   set what size mobile is
  const isMobile = useMediaQuery({ maxWidth: "767px" });

  useGSAP(() => {
    // splits the title classes into characters and words
    const heroSplit = new SplitText(".title", { type: "chars, words" });

    // splits the subtitle classes by lines
    const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

    // forEach on each character now
    // oldschool vanilla DOM adding class
    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out", // smooth springy feel
      stagger: 0.05,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.05,
      delay: 1, // animate in the paragraphs 1 second after the mojito title
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      .to(".right-leaf", { y: 200 }, 0) // moves up
      .to(".left-leaf", { y: -200 }, 0); // moves down

    //   where animation will start and end

    // mobile: when top of video reaches 50% down screen animation starts
    // desktop: when center of video reaches 60% down the screen
    const startValue = isMobile ? "top 50%" : "center 60%";

    // mobile: when top of video goes 120% past top of screen, end animation
    // desktop: when bottom of video reaches top of screen animation ends
    const endValue = isMobile ? "120% top" : "bottom top";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "video",
        start: startValue,
        end: endValue,
        scrub: true, // start on scroll
        pin: true, // keeps video pinned
      },
    });

    videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current.duration,
      });
    };
  }, []);

  return (
    <>
      {/* noisy apply's a bg image */}
      <section id="hero" className="noisy">
        <h1 className="title">MOJITO</h1>
        <img
          src="/images/hero-left-leaf.png"
          alt="left-leaf"
          className="left-leaf"
        />
        <img
          src="/images/hero-right-leaf.png"
          alt="right-leaf"
          className="right-leaf"
        />
        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Cool. Crisp. Classic.</p>
              <p className="subtitle">
                Sip the Spirit <br /> of Summer
              </p>
            </div>
            <div className="view-cocktails">
              <p className="subtitle">
                Every cocktail on our menu is a blend of premium ingredients,
                creative flair, and timeless recipes - designed to delight your
                senses
              </p>
              <a href="#cocktails">View Cocktails</a>
            </div>
          </div>
        </div>
      </section>

      {/* video div does not interact with other elements */}
      <div className="video absolute inset-0">
        <video
          src="/videos/output.mp4"
          ref={videoRef}
          muted
          playsInline
          preload="auto"
        />
      </div>
    </>
  );
};

export default Hero;
