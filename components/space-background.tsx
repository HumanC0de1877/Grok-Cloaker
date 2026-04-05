'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface Meteor {
  id: number
  startX: number
  startY: number
  duration: number
  delay: number
}

export const SpaceBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([])
  const [meteors, setMeteors] = useState<Meteor[]>([])

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 120; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 5,
        })
      }
      setStars(newStars)
    }

    // Generate meteors with random intervals
    const generateMeteors = () => {
      const newMeteors: Meteor[] = []
      for (let i = 0; i < 4; i++) {
        newMeteors.push({
          id: i,
          startX: Math.random() * 60 + 40,
          startY: Math.random() * 40 - 20,
          duration: Math.random() * 2 + 1.5,
          delay: Math.random() * 8 + i * 6,
        })
      }
      setMeteors(newMeteors)
    }

    generateStars()
    generateMeteors()

    // Regenerate meteors periodically
    const meteorInterval = setInterval(() => {
      generateMeteors()
    }, 25000)

    return () => clearInterval(meteorInterval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050507]">
      {/* Animated twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 1.5 
              ? `0 0 ${star.size * 2}px rgba(255,255,255,0.6)`
              : 'none',
          }}
        />
      ))}

      {/* Larger bright stars with intense glow */}
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-slow" style={{ left: '12%', top: '20%', boxShadow: '0 0 8px #fff, 0 0 16px rgba(200,220,255,0.5)' }} />
      <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle-slow" style={{ left: '78%', top: '12%', boxShadow: '0 0 10px #fff, 0 0 20px rgba(200,220,255,0.5)', animationDelay: '1s' }} />
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-slow" style={{ left: '88%', top: '58%', boxShadow: '0 0 8px #fff, 0 0 16px rgba(200,220,255,0.5)', animationDelay: '2s' }} />
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-slow" style={{ left: '42%', top: '78%', boxShadow: '0 0 8px #fff, 0 0 16px rgba(200,220,255,0.5)', animationDelay: '0.5s' }} />
      <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle-slow" style={{ left: '65%', top: '45%', boxShadow: '0 0 10px #fff, 0 0 20px rgba(200,220,255,0.5)', animationDelay: '1.5s' }} />
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle-slow" style={{ left: '25%', top: '65%', boxShadow: '0 0 8px #fff, 0 0 16px rgba(200,220,255,0.5)', animationDelay: '2.5s' }} />

      {/* Shooting stars / Meteors */}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="absolute animate-meteor"
          style={{
            left: `${meteor.startX}%`,
            top: `${meteor.startY}%`,
            animationDuration: `${meteor.duration}s`,
            animationDelay: `${meteor.delay}s`,
          }}
        >
          {/* Meteor head */}
          <div 
            className="w-1 h-1 bg-white rounded-full"
            style={{
              boxShadow: `
                0 0 4px #fff,
                0 0 8px rgba(200,230,255,0.8),
                0 0 12px rgba(180,210,255,0.6)
              `
            }}
          />
          {/* Meteor tail */}
          <div 
            className="absolute top-0 left-0 w-24 h-[1px] origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(200,220,255,0.5) 20%, rgba(180,200,255,0.2) 50%, transparent 100%)',
              transform: 'rotate(-45deg)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
