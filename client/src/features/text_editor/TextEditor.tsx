import React, { useState } from 'react';
/* gitleaks:allow */
import Editor from '@monaco-editor/react';

import { 
  SiJavascript, SiTypescript, SiHtml5, SiCss, SiPython, SiJson, SiReact, SiSass 
} from 'react-icons/si';

import { VscFolder, VscFileCode, VscNewFile, VscNewFolder, VscTerminal, VscSettingsGear, VscSourceControl, VscFiles, VscEdit, VscTrash, VscClose, VscRunAll } from 'react-icons/vsc';
import './textEditor.scss';
/* gitleaks:allow */
const THEME_COLORS = {
  folder: '#dcb67a',
  js: '#f7df1e',
  jsx: '#61dafb',
  ts: '#007acc',
  tsx: '#007acc',
  html: '#e34f26',
  css: '#1572b6',
  scss: '#c6538c',
  py: '#3776ab',
  json: '#cbcb41',
  defaultIcon: '#999',
  terminalLine: '#1e1e1e' 
};

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content: string;
}

const TextEditor: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const roomName = "NEBULA_PREMIUM_ROOM"; 

  const getFileIcon = (fileName: string, type: 'file' | 'folder') => {
    if (type === 'folder') return <VscFolder style={{ color: THEME_COLORS.folder, fontSize: '18px' }} />;
    
    const ext = fileName.split('.').pop()?.toLowerCase();

    
    switch (ext) {
      case 'js': return <SiJavascript style={{ color: THEME_COLORS.js, fontSize: '16px' }} />;
      case 'jsx': return <SiReact style={{ color: THEME_COLORS.jsx, fontSize: '16px' }} />;
      case 'ts': return <SiTypescript style={{ color: THEME_COLORS.ts, fontSize: '16px' }} />;
      case 'tsx': return <SiReact style={{ color: THEME_COLORS.tsx, fontSize: '16px' }} />;
      case 'html': return <SiHtml5 style={{ color: THEME_COLORS.html, fontSize: '16px' }} />;
      case 'css': return <SiCss style={{ color: THEME_COLORS.css, fontSize: '16px' }} />;
      case 'scss': return <SiSass style={{ color: THEME_COLORS.scss, fontSize: '16px' }} />;
      case 'py': return <SiPython style={{ color: THEME_COLORS.py, fontSize: '16px' }} />;
      case 'json': return <SiJson style={{ color: THEME_COLORS.json, fontSize: '16px' }} />;
      default: return <VscFileCode style={{ color: THEME_COLORS.defaultIcon, fontSize: '18px' }} />;
    }
  };

  const handleCreate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newName.trim()) {
      if (editingId) {
        setFiles(files.map(f => f.id === editingId ? { ...f, name: newName } : f));
        setEditingId(null);
      } else {
        const newItem: FileItem = {
          id: Date.now().toString(),
          name: newName,
          type: isCreating!,
          content: '',
        };
        setFiles([...files, newItem]);
        if (isCreating === 'file') setActiveFileId(newItem.id);
      }
      setIsCreating(null);
      setNewName('');
    } else if (e.key === 'Escape') {
      setIsCreating(null);
      setEditingId(null);
    }
  };

  const activeFile = files.find(f => f.id === activeFileId);

  return (
    <div className="nebula-main-container">
    
      <nav className="top-nav">
        <div className="left-brand">
          <span className="logo-icon">🌌</span>
          <span className="logo-text">NEBULA Code Editor</span>
          
        </div>
        
        <div className="nav-right">
          <div className="room-container">
            <span className="label">ACTIVE ROOM</span>
            <span className="value">{roomName}</span>
          </div>
          <button className="run-button">
            <VscRunAll /> RUN
          </button>
        </div>
      </nav>

      <div className="editor-body">
        
        <div className="activity-bar">
          <div className="top-icons">
            <div className={`icon ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}><VscFiles /></div>
            <div className="icon"><VscSourceControl /></div>
          </div>
          <div className="bottom-icons">
            <div className={`icon ${isTerminalVisible ? 'active' : ''}`} onClick={() => setIsTerminalVisible(!isTerminalVisible)}><VscTerminal /></div>
            <div className="icon"><VscSettingsGear /></div>
          </div>
        </div>

        
        <div className={`explorer-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            <span>EXPLORER</span>
            <div className="actions">
              
              <VscNewFile onClick={() => setIsCreating('file')} title="New File" />
              <VscNewFolder onClick={() => setIsCreating('folder')} title="New Folder" />
            </div>
          </div>

          <div className="tree-container">
            {isCreating && (
              <div className="input-row">
                
                {isCreating === 'file' ? <VscFileCode color={THEME_COLORS.defaultIcon}/> : <VscFolder color={THEME_COLORS.folder}/>}
                <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={handleCreate} onBlur={() => setIsCreating(null)} placeholder="Name..." />
              </div>
            )}
            {files.map(file => (
              <div key={file.id} className={`tree-item ${activeFileId === file.id ? 'active' : ''}`} onClick={() => file.type === 'file' && setActiveFileId(file.id)}>
                <div className="item-content">
                  {editingId === file.id ? (
                    <input autoFocus value={newName} onChange={(e)=>setNewName(e.target.value)} onKeyDown={handleCreate} onBlur={()=>setEditingId(null)} className="edit-box" />
                  ) : (
                    <>
                      
                      <span className="file-icon">{getFileIcon(file.name, file.type)}</span>
                      <span className="file-name">{file.name}</span>
                    </>
                  )}
                </div>
                <div className="item-tools">
                  <VscEdit onClick={(e) => { e.stopPropagation(); setEditingId(file.id); setNewName(file.name); }} />
                  <VscTrash onClick={(e) => { e.stopPropagation(); setFiles(files.filter(f => f.id !== file.id)); if (activeFileId === file.id) setActiveFileId(null); }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-editor-area">
          <div className="tab-header">
            {activeFile && (
              <div className="active-tab">
                
                {getFileIcon(activeFile.name, 'file')}
                <span>{activeFile.name}</span>
                <VscClose className="close-icon" onClick={() => setActiveFileId(null)} />
              </div>
            )}
          </div>

          <div className="monaco-box">
            {activeFileId ? (
              <Editor 
                height="100%" 
                theme="vs-dark" 
                language="javascript" 
                options={{ 
                  fontSize: 18, minimap: { enabled: true },
                  placeholder: "Start coding your masterpiece here..." // gitleaks:allow
                  }}
              />
            ) : (
              <div className="empty-placeholder">
                <div className="central-logo">🌌</div>
                <h1>NEBULA</h1>
                <p>Create or select a file to begin coding</p>
              </div>
            )}
          </div>

          <div className={`terminal-panel ${isTerminalVisible ? 'open' : 'closed'}`}>
            <div className="term-header">
              <span>TERMINAL</span>
              <VscClose className="close-term" onClick={() => setIsTerminalVisible(false)} />
            </div>
            <div className="term-body">nebula@user:~/workspace$ _</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;