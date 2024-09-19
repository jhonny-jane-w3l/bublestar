"use client";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";


const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Optional: Use the container to access particles instance and interact with it
  };

  const options: ISourceOptions = useMemo(() => {
    return {
      name: "bubbleParticles",
      background: {
        color: "#ffffff", // Background color of the canvas
      },
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "bubble", // Enable bubble mode on hover
          },
          onClick: {
            enable: true,
            mode: "push", // Add more particles on click
          },
        },
        modes: {
          bubble: {
            distance: 250, // Distance to trigger the bubble effect
            size: 40, // Size of the bubbles when hovering
            duration: 2, // How long the bubble effect lasts
            opacity: 0.8, // Opacity of the bubbles
          },
          push: {
            quantity: 4, // Number of particles to add on click
          },
        },
      },
      particles: {
        number: {
          value: 50, // Number of particles
          density: {
            enable: true,
            area: 800, // Area where particles are distributed
          },
        },
        color: {
          value: "#ffffff", // Color of the particles
        },
        shape: {
          type: "image", // Shape of the particles
          options:
          {

            image: [
              {
                src: "/images/polkadot.svg",
                width: 100,
                height: 100,
              },
            ]
          }
        },
        
        opacity: {
          value: 0.5, // Base opacity of particles
          random: true, // Randomize the opacity
          animation: {
            enable: true,
            speed: 5,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 5, max: 30 }, // Size of the particles
          random: true, // Randomize the size
          animation: {
            enable: true,
            speed: 20,
            minimumValue: 0.1,
            sync: true,
          },
        },
        move: {
          enable: true,
          speed: 2, // Speed of the particle movement
          direction: "none", // Direction of movement
          random: true, // Random movement
          straight: false, // Don't move in a straight line
          outModes: {
            default: "out", // Particles will bounce off the edge
          },
        },
      },
    };
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          zIndex: -10,
        }}
      />
    );
  }

  return <></>;
};

export default ParticlesComponent;
