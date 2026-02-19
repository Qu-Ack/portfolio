import { useState, useCallback, useEffect } from 'react';
import type { BlogPost } from '../../types/blog';
import { RichTextRenderer } from '../blog/RichTextRenderer';
import { Toolbar } from './Toolbar';
import { useAutoSave } from '../../hooks/useAutoSave';
import './Editor.css';

interface EditorProps {
  initialPost?: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
}

const STORAGE_KEY = 'blog_editor_draft';

export const Editor: React.FC<EditorProps> = ({ initialPost, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [featured, setFeatured] = useState(initialPost?.featured || false);
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-generate slug from title
  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  // Auto-generate excerpt from content
  const generateExcerpt = useCallback((text: string) => {
    const plainText = text.replace(/[#*`()[\]>-]/g, '').substring(0, 150);
    return plainText.length >= 150 ? plainText + '...' : plainText;
  }, []);

  // Handle title change with auto-slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialPost?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Handle content change with auto-excerpt
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (!initialPost?.excerpt) {
      setExcerpt(generateExcerpt(newContent));
    }
  };

  // Insert markdown at cursor position
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('editor-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Calculate read time
  const readTime = Math.ceil(content.split(/\s+/).length / 200) || 1;

  // Auto-save draft
  const draftData = {
    title,
    slug,
    content,
    excerpt,
    tags,
    featured,
    status,
    coverImage,
  };

  const { isDirty, lastSaved: autoSavedTime } = useAutoSave(draftData, STORAGE_KEY);

  // Restore draft on mount
  useEffect(() => {
    if (!initialPost) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          setTitle(draft.title || '');
          setSlug(draft.slug || '');
          setContent(draft.content || '');
          setExcerpt(draft.excerpt || '');
          setTags(draft.tags || []);
          setFeatured(draft.featured || false);
          setStatus(draft.status || 'draft');
          setCoverImage(draft.coverImage || '');
        } catch {
          console.error('Failed to restore draft');
        }
      }
    }
  }, [initialPost]);

  // Clear draft when post is saved
  useEffect(() => {
    if (lastSaved) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [lastSaved]);

  const handleSave = async () => {
    if (!title || !slug || !content) {
      setSaveError('Title, slug, and content are required');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      await onSave({
        title,
        slug,
        content,
        excerpt: excerpt || generateExcerpt(content),
        tags,
        featured,
        status,
        coverImage: coverImage || undefined,
        readTime,
      });
      setLastSaved(new Date());
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1 className="editor-title">
          {initialPost ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="editor-actions">
          {isDirty && <span className="unsaved-indicator">Unsaved changes</span>}
          {autoSavedTime && (
            <span className="autosave-indicator">
              Auto-saved {autoSavedTime.toLocaleTimeString()}
            </span>
          )}
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : status === 'published' ? 'Publish' : 'Save Draft'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="editor-error">{saveError}</div>
      )}

      <div className="editor-form">
        <div className="form-row">
          <div className="form-group flex-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter post title"
              className="form-input"
            />
          </div>
          <div className="form-group flex-1">
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-2">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description (auto-generated from content)"
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group flex-1">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="text"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-2">
            <label>Tags</label>
            <div className="tags-input">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="tag-remove">
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag (press Enter)"
                className="tag-input-field"
              />
            </div>
          </div>
          <div className="form-group flex-1 form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured post
            </label>
            <div className="status-toggle">
              <label>Status:</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="form-select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <span className="read-time">{readTime} min read</span>
          </div>
        </div>
      </div>

      <Toolbar onInsert={insertMarkdown} />

      <div className="editor-split">
        <div className="editor-pane">
          <label htmlFor="editor-content" className="pane-label">
            Markdown
          </label>
          <textarea
            id="editor-content"
            value={content}
            onChange={handleContentChange}
            placeholder="Write your post in markdown..."
            className="editor-textarea"
            spellCheck={false}
          />
        </div>
        <div className="editor-pane editor-preview">
          <label className="pane-label">Preview</label>
          <div className="preview-content">
            {content ? (
              <RichTextRenderer content={content} />
            ) : (
              <p className="preview-placeholder">
                Preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
