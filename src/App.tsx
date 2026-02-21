import { useState, useEffect } from 'react';
import type { BlogPost } from './types/blog';
import { BlogPostView } from './components/blog';
import { About } from './components/about';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { postsService } from './services/postsService';
import './App.css';

function AppContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [view, setView] = useState<'list' | 'post' | 'about'>('list');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postsService.getAllPosts('published');
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = async (slug: string) => {
    try {
      const post = await postsService.getPostBySlug(slug);
      if (post) {
        setSelectedPost(post);
        setView('post');
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
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
          </div>
          <div className="nav-actions">
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main-content">
        {view === 'list' && (
          <>
            <section className="hero-section">
              <img 
                src={`${import.meta.env.BASE_URL}/portfolio/avatar.jpeg`}
                alt="Profile avatar"
                className="hero-avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="hero-content">
                <h1 className="hero-title">
                  <a href="/">Hi, I'm Daksh Sangal.</a>
                </h1>
                <p className="hero-subtitle">
                  Computer Science student exploring software development, tools, and technology.<br />
                  Every commit is open source for you to learn from.
                </p>
                <div className="social-links">
                  <a href="https://github.com/Qu-Ack" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://x.com/SangalDaksh" className="social-link" target="_blank" rel="noopener noreferrer">X</a>
                </div>
              </div>
            </section>

            <hr className="separator" />

            <section className="blog-section">
              {loading && (
                <div className="blog-loading">Loading posts...</div>
              )}
              
              {error && (
                <div className="blog-error">{error}</div>
              )}
              
              {!loading && !error && posts.length === 0 && (
                <div className="blog-empty">
                  <p>No posts yet.</p>
                </div>
              )}
              
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
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <a href="https://github.com/Qu-Ack" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://x.com/SangalDaksh" className="footer-link" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/Qu-Ack/portfolio" className="footer-link" target="_blank" rel="noopener noreferrer">View Source</a>
        </div>
        <p className="footer-copyright">
          It's free, you dummy.
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
