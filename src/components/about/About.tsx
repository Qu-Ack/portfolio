import React from 'react';
import './About.css';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-image-container">
          <img 
            src="/dev-photo.jpg" 
            alt="Developer portrait" 
            className="about-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/avatar.jpg';
            }}
          />
        </div>
        
        <div className="about-content">
          <h1 className="about-title">About</h1>
          
          <div className="about-text">
            <p className="about-intro">
              I'm a developer who believes in the power of simplicity. 
              This blog is where I document my journey through code, 
              share what I've learned, and explore the ever-evolving landscape of technology.
            </p>
            
            <p>
              My work focuses on building tools that solve real problems. 
              I enjoy working across the stack—from low-level systems to user interfaces—
              and I'm particularly interested in developer experience, performance optimization, 
              and the intersection of AI and software engineering.
            </p>
            
            <p>
              When I'm not coding, you'll find me reading, exploring new technologies, 
              or contributing to open source projects. I believe in learning in public 
              and sharing knowledge freely.
            </p>
          </div>
          
          <div className="about-section">
            <h2>Currently</h2>
            <ul className="about-list">
              <li>Building developer tools and CLI applications</li>
              <li>Exploring AI-assisted development workflows</li>
              <li>Contributing to open source</li>
              <li>Writing about software engineering</li>
            </ul>
          </div>
          
          <div className="about-section">
            <h2>Connect</h2>
            <p className="about-connect">
              The best way to reach me is via email or on GitHub. 
              I'm always interested in discussing new ideas, collaborating on projects, 
              or just chatting about technology.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
