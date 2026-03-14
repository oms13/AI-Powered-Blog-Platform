import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Type, Heading, Image as ImageIcon, 
  Code, Quote, Trash2, Sparkles, Send, Plus, X 
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

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

  const handleAutoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleAIGenerateBlock = async (id, type) => {
    const promptText = prompt(`What do you want the AI to write for this ${type}?`);
    if (!promptText) return;
    try {
      updateBlock(id, '✨ Generating...');
      const aiRes = await axios.post('http://localhost:5001/api/blog/aiService', { promptText, type });
      if (aiRes.data.success) {
        updateBlock(id, aiRes.data.aiText);
      }
    } catch (error) {
      console.error("Error generating content: " + error);
      updateBlock(id, '❌ Failed to generate content.');
    }
  };

  const handleAITagSuggest = async () => {
    if (!title) {
      alert("Please enter a title first so the AI knows what tags to suggest.");
      return;
    }
    try {
      const aiRes = await axios.post('http://localhost:5001/api/blog/aiService', { promptText: title, type: 'tag' });
      if (aiRes.data.success) {
        setTags([...new Set([...tags, ...aiRes.data.aiText])]);
      }
    } catch (error) {
       console.error("Error suggesting tags: " + error);
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
      setIsPublishing(false);
      return;
    }
    try {
      const publishRes = await axios.post('http://localhost:5001/api/blog/publish',
        blogData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsPublishing(false);
      if (publishRes.data.success) {
        navigate(`/blog/${publishRes.data.blogSlug}`);
      } else {
        alert("Unable to publish: " + publishRes.data.message);
      }
    } catch (error) {
      setIsPublishing(false);
      console.error(error);
      alert("An error occurred while publishing.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-20 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/blog" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Feed
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Added ThemeToggle Here */}
            <ThemeToggle />
            
            <button
              onClick={handlePublish}
              disabled={isPublishing || !title}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 dark:disabled:text-gray-400 text-white font-medium py-2 px-6 rounded-full transition-all flex items-center gap-2 shadow-sm"
            >
              {isPublishing ? 'Publishing...' : (
                <>Publish <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-colors duration-300">
          <input
            type="text"
            className="w-full text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 border-none focus:ring-0 p-0 bg-transparent resize-none outline-none transition-colors"
            placeholder="Blog Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors">
            <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-2" />
            <input
              type="text"
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 outline-none placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Paste Thumbnail Image URL here..."
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>
          {thumbnail && (
             <img src={thumbnail} alt="Cover Preview" className="w-full h-64 object-cover rounded-xl mt-4 border border-gray-100 dark:border-gray-800" />
          )}
        </section>

        <section className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 group relative hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors duration-300">
              
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50 dark:border-gray-800/50">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                  {block.type}
                </span>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(['paragraph', 'code', 'quote'].includes(block.type)) && (
                    <button 
                      className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => handleAIGenerateBlock(block.id, block.type)}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Assist
                    </button>
                  )}
                  <button 
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                    onClick={() => removeBlock(block.id)}
                    title="Remove Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                {block.type === 'paragraph' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    onInput={handleAutoResize}
                    placeholder="Write your paragraph..."
                    className="w-full text-lg text-gray-700 dark:text-gray-300 leading-relaxed bg-transparent border-none focus:ring-0 p-0 resize-none outline-none min-h-[100px] max-h-[280px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-600"
                  />
                )}
                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="Heading text..."
                    className="w-full text-2xl font-semibold text-gray-800 dark:text-gray-100 bg-transparent border-none focus:ring-0 p-0 outline-none placeholder-gray-400 dark:placeholder-gray-600"
                  />
                )}
                {block.type === 'image' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="Image URL..."
                    className="w-full text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  />
                )}
                {block.type === 'code' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    onInput={handleAutoResize}
                    placeholder="Paste your code here..."
                    className="w-full font-mono text-sm text-gray-200 bg-gray-900 dark:bg-gray-950 p-4 rounded-xl border-none focus:ring-0 resize-none outline-none min-h-[120px] max-h-[300px] overflow-y-auto placeholder-gray-600"
                  />
                )}
                {block.type === 'quote' && (
                  <div className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onInput={handleAutoResize}
                      placeholder="Enter quote..."
                      className="w-full text-xl italic text-gray-600 dark:text-gray-400 bg-transparent border-none focus:ring-0 p-0 resize-none outline-none min-h-[80px] max-h-[200px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-center py-8">
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">Add New Section</p>
          <div className="flex flex-wrap justify-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <button onClick={() => addBlock('paragraph')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Type className="w-4 h-4" /> Paragraph
            </button>
            <button onClick={() => addBlock('heading')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Heading className="w-4 h-4" /> Heading
            </button>
            <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <ImageIcon className="w-4 h-4" /> Image
            </button>
            <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Code className="w-4 h-4" /> Code
            </button>
            <button onClick={() => addBlock('quote')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Quote className="w-4 h-4" /> Quote
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tags & Categories</h3>
            <button 
              onClick={handleAITagSuggest}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-4 py-2 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Suggest Tags
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                {tag} 
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full p-0.5 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Type a tag and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-0 p-3 rounded-xl outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </section>

      </main>
    </div>
  );
}