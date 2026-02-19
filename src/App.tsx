import { useState } from 'react';
import type { BlogPost } from './types/blog';
import { BlogPostView } from './components/blog';
import { About } from './components/about';
import { Editor } from './components/editor';
import { Login } from './pages/Login';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { blogCMS } from './data/cms';
import './App.css';

function AppContent() {
  const [posts] = useState<BlogPost[]>(() => blogCMS.getAllPosts());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [view, setView] = useState<'list' | 'post' | 'about' | 'editor' | 'login'>('list');
  const { isAuthenticated, logout, user } = useAuth();

  const handlePostClick = (slug: string) => {
    const post = blogCMS.getPostBySlug(slug);
    if (post) {
      setSelectedPost(post);
      setView('post');
      window.scrollTo(0, 0);
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setView('list');
    window.scrollTo(0, 0);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('about');
    window.scrollTo(0, 0);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setView('editor');
    } else {
      setView('login');
    }
    window.scrollTo(0, 0);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('login');
    window.scrollTo(0, 0);
  };

  const handleSavePost = async (post: Partial<BlogPost>) => {
    // For now, just log it. Later connect to API
    console.log('Saving post:', post);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return to list
    setView('list');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to content</a>
      
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <div className="nav-links">
            <a 
              href="#" 
              className={`nav-link ${view === 'list' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleBackToList();
              }}
            >
              Posts
            </a>
            <a 
              href="#about" 
              className={`nav-link ${view === 'about' ? 'active' : ''}`}
              onClick={handleAboutClick}
            >
              About
            </a>
            {isAuthenticated ? (
              <a 
                href="#editor" 
                className={`nav-link ${view === 'editor' ? 'active' : ''}`}
                onClick={handleEditorClick}
              >
                New Post
              </a>
            ) : (
              <a 
                href="#login" 
                className={`nav-link ${view === 'login' ? 'active' : ''}`}
                onClick={handleLoginClick}
              >
                Login
              </a>
            )}
          </div>
          <div className="nav-actions">
            {isAuthenticated && user && (
              <span className="nav-user">@{user.username}</span>
            )}
            <ThemeToggle />
            {isAuthenticated && (
              <button onClick={logout} className="nav-logout">
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>

      <main id="main-content">
        {view === 'list' && (
          <>
            <section className="hero-section">
              <img 
                src="/avatar.jpg" 
                alt="Profile avatar" 
                className="hero-avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="hero-content">
                <h1 className="hero-title">
                  <a href="/">Hi, I'm @username.</a>
                </h1>
                <p className="hero-subtitle">
                  Thoughts on software development, tools, and technology.<br />
                  Every commit is open source for you to learn from.
                </p>
                <div className="social-links">
                  <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">X</a>
                  <a href="mailto:hello@example.com" className="social-link">Email</a>
                </div>
              </div>
            </section>

            <hr className="separator" />

            <section className="blog-section">
              <ul className="blog-list-wrapper">
                {posts.map((post) => (
                  <li key={post.id} className="blog-list-item">
                    <article>
                      <a 
                        href={`#${post.slug}`}
                        className="blog-post-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePostClick(post.slug);
                        }}
                      >
                        <h3 className="post-title">{post.title}</h3>
                      </a>
                      <div className="post-meta">
                        <time dateTime={post.publishedAt}>
                          Published: {formatDate(post.publishedAt)}
                        </time>
                        <span className="post-meta-separator">•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      <p className="post-excerpt">{post.excerpt}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="separator" />
          </>
        )}

        {view === 'post' && selectedPost && (
          <BlogPostView post={selectedPost} onBack={handleBackToList} />
        )}

        {view === 'about' && <About />}

        {view === 'editor' && isAuthenticated && (
          <Editor 
            onSave={handleSavePost}
            onCancel={handleBackToList}
          />
        )}

        {view === 'editor' && !isAuthenticated && (
          <Login />
        )}

        {view === 'login' && <Login />}
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com" className="footer-link" target="_blank" rel="noopener noreferrer">X</a>
          <a href="mailto:hello@example.com" className="footer-link">Email</a>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Built with React + TypeScript
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
