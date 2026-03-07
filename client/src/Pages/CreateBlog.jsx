import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateBlog.css';

export default function CreateBlog() {

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [blocks, setBlocks] = useState([
    { id: Date.now().toString(), type: 'paragraph', content: '' }
  ]);

  const addBlock = (type) => {
    const newBlock = { id: Date.now().toString(), type, content: '' };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, newContent) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content: newContent } : block
    ));
  };

  const removeBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const handleAIGenerateBlock = async (id, type) => {
    const promptText = prompt(`What do you want the AI to write for this ${type}?`);
    if (!promptText) return;
    try {

      updateBlock(id, '✨ Generating...');

      const aiRes = await axios.post('http://localhost:5001/api/blog/aiService', { promptText, type });
      if (aiRes.data.success) {
        const generatedText = aiRes.data.aiText;
        updateBlock(id, generatedText);
      }
    } catch (error) {
      console.error("Error generating content" + error);
    }

  };

  const handleAITagSuggest = async () => {
    if (!title) {
      alert("Please enter a title first so the AI knows what tags to suggest.");
      return;
    }
    const type = 'tag';
    const aiRes = await axios.post('http://localhost:5001/api/blog/aiService', { promptText: title, type });
    if (aiRes.data.success) {
      setTags([...new Set([...tags, ...aiRes.data.aiText])]);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    setIsPublishing(true);


    const blogData = {
      title,
      coverImage: thumbnail,
      tags,
      content: blocks,
      status: 'published'
    };
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to publish a blog.");
      return;
    }
    try {
      const publishRes = await axios.post('http://localhost:5001/api/blog/publish',
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsPublishing(false);
      console.log(publishRes.data.blogSlug);
      if (publishRes.data.success) {
        navigate(`/blog/${publishRes.data.blogSlug}`)
      } else {
        alert("Unable to publish", publishRes.data.message);
      }
    } catch (error) {
      setIsPublishing(false);
      console.error(error);
    }


  };

  return (
    <div className="create-blog-container">
      <header className="editor-header">
        <h1>Draft Your Post</h1>
        <button
          className="publish-btn"
          onClick={handlePublish}
          disabled={isPublishing || !title}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </header>

      <section className="meta-section">
        <input
          type="text"
          className="title-input"
          placeholder="Blog Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="thumbnail-input"
          placeholder="Paste Thumbnail URL here..."
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </section>

      <section className="blocks-section">
        {blocks.map((block) => (
          <div key={block.id} className="block-wrapper">
            <div className="block-controls">
              <span className="block-type-badge">{block.type}</span>
              <div className="block-actions">
                {(block.type === 'paragraph' || block.type === 'code' || block.type === 'quote') && (
                  <button className="ai-btn" onClick={() => handleAIGenerateBlock(block.id, block.type)}>
                    ✨ AI Assist
                  </button>
                )}
                <button className="delete-btn" onClick={() => removeBlock(block.id)}>✕</button>
              </div>
            </div>

            {block.type === 'paragraph' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Write your paragraph..."
              />
            )}
            {block.type === 'heading' && (
              <input
                type="text"
                className="heading-input"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading text..."
              />
            )}
            {block.type === 'image' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Image URL..."
              />
            )}
            {block.type === 'code' && (
              <textarea
                className="code-input"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Paste your code here..."
              />
            )}
            {block.type === 'quote' && (
              <textarea
                className="quote-input"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Enter quote..."
              />
            )}
          </div>
        ))}
      </section>

      <section className="add-block-toolbar">
        <p>Add new section:</p>
        <div className="toolbar-buttons">
          <button onClick={() => addBlock('paragraph')}>Paragraph</button>
          <button onClick={() => addBlock('heading')}>Heading</button>
          <button onClick={() => addBlock('image')}>Image</button>
          <button onClick={() => addBlock('code')}>Code</button>
          <button onClick={() => addBlock('quote')}>Quote</button>
        </div>
      </section>

      <section className="tags-section">
        <div className="tags-header">
          <h3>Tags & Categories</h3>
          <button className="ai-btn" onClick={handleAITagSuggest}>✨ Suggest Tags</button>
        </div>
        <div className="tags-display">
          {tags.map(tag => (
            <span key={tag} className="tag">
              {tag} <button onClick={() => removeTag(tag)}>✕</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </section>
    </div>
  );
}