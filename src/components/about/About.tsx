import React from 'react';
import './About.css';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-image-container">
          <img 
            src={`${import.meta.env.BASE_URL}avatar.jpeg`}
            alt="Daksh Sangal"
            className="about-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${import.meta.env.BASE_URL}avatar.jpeg`;
            }}
          />
        </div>
        
        <div className="about-content">
          <h1 className="about-title">About</h1>
          
          <div className="about-text">
            <p className="about-intro">
              I'm Daksh Sangal, a 20-year-old Computer Science and Engineering student in my 3rd year. 
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
              The best way to reach me is on GitHub or X. 
              I'm always interested in discussing new ideas, collaborating on projects, 
              or just chatting about technology.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
