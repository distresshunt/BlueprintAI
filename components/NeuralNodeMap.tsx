'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Database, Layout, Server, FileCode2, Workflow } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NeuralNodeMapProps {
  blueprintData: string;
}

const CustomNode = ({ data, selected }: any) => {
  const Icon = data.icon || FileCode2;
  return (
    <div className={`px-4 py-2 rounded-md border transition-all duration-300 bg-zinc-950 ${
      selected 
        ? 'border-zinc-500 bg-zinc-900' 
        : 'border-zinc-800 hover:border-zinc-600'
    }`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-zinc-800 border-none" />
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-zinc-400" />
        <div className="text-sm font-medium text-white whitespace-nowrap">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-zinc-800 border-none" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export function NeuralNodeMap({ blueprintData }: NeuralNodeMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  useEffect(() => {
    if (!blueprintData) return;

    // Parse Markdown into nodes
    const sections: { title: string; content: string; type: string }[] = [];
    
    // We look for any ## or ### headers
    const regex = /(?:^|\n)(#{2,3})\s+(.*?)\n([\s\S]*?)(?=(?:^|\n)#{2,3}\s+|$)/g;
    let match;
    
    while ((match = regex.exec(blueprintData)) !== null) {
      const title = match[2].trim().replace(/\[.*?\]/g, '').trim(); // Clean up [NEW] tags
      const content = match[3].trim();
      
      if (!title || !content) continue;

      let type = 'config';
      if (title.toLowerCase().includes('database') || title.toLowerCase().includes('schema') || title.toLowerCase().includes('supabase')) type = 'database';
      else if (title.toLowerCase().includes('frontend') || title.toLowerCase().includes('ui') || title.toLowerCase().includes('page')) type = 'frontend';
      else if (title.toLowerCase().includes('api') || title.toLowerCase().includes('backend') || title.toLowerCase().includes('route')) type = 'backend';
      else if (title.toLowerCase().includes('phase')) type = 'workflow';

      sections.push({ title, content, type });
    }

    if (sections.length === 0) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Layout configuration
    const startX = 250;
    const startY = 50;
    const xOffset = 300;
    const yOffset = 120;

    // Root Node
    newNodes.push({
      id: 'root',
      type: 'custom',
      position: { x: startX, y: startY },
      data: { 
        label: 'OKF Bundle Root', 
        typeLabel: 'Entry Point',
        icon: Workflow,
        color: 'bg-emerald-500/20 text-emerald-400'
      }
    });

    let x = 50;
    let y = startY + yOffset;

    sections.forEach((section, index) => {
      const id = `node-${index}`;
      
      let icon = FileCode2;
      let color = 'bg-zinc-500/20 text-zinc-400';
      let typeLabel = 'Document';

      if (section.type === 'database') {
        icon = Database; color = 'bg-purple-500/20 text-purple-400'; typeLabel = 'Database';
      } else if (section.type === 'frontend') {
        icon = Layout; color = 'bg-blue-500/20 text-blue-400'; typeLabel = 'Frontend';
      } else if (section.type === 'backend') {
        icon = Server; color = 'bg-zinc-800 text-zinc-300'; typeLabel = 'Backend';
      } else if (section.type === 'workflow') {
        icon = Workflow; color = 'bg-zinc-800 text-zinc-300'; typeLabel = 'Workflow';
      }

      newNodes.push({
        id,
        type: 'custom',
        position: { x, y },
        data: { 
          label: section.title.length > 25 ? section.title.substring(0, 25) + '...' : section.title, 
          typeLabel,
          icon,
          color,
          fullTitle: section.title,
          content: section.content
        }
      });

      newEdges.push({
        id: `e-root-${id}`,
        source: 'root',
        target: id,
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2, opacity: 0.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      });

      // Wrap layout
      x += xOffset;
      if (x > startX + xOffset * 2) {
        x = 50;
        y += yOffset;
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);

    // Select first node by default
    if (sections.length > 0) {
      setSelectedTitle(sections[0].title);
      setSelectedContent(sections[0].content);
    }
  }, [blueprintData, setNodes, setEdges]);

  const onNodeClick = useCallback((event: any, node: Node) => {
    if (node.id === 'root') return;
    setSelectedTitle(node.data.fullTitle);
    setSelectedContent(node.data.content);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top half: React Flow Canvas */}
      <div className="h-[50%] w-full border-b border-zinc-800 bg-zinc-950/50 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-grid-zinc-900/50"
        >
          <Background color="#27272a" gap={20} size={1} />
          <Controls className="!bg-zinc-900 !border-zinc-800 !text-zinc-400" />
        </ReactFlow>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-zinc-300" />
          <span className="text-sm font-bold text-white tracking-widest uppercase">Neural Node Map</span>
        </div>
      </div>

      {/* Bottom half: Code/Content Viewer */}
      <div className="h-[50%] w-full bg-[#0a0a0f] overflow-y-auto custom-scrollbar p-6">
        {selectedTitle && (
          <div className="mb-4 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{selectedTitle}</h3>
          </div>
        )}
        {selectedContent ? (
          <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
            <ReactMarkdown>{selectedContent}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
            Select a node to view contents
          </div>
        )}
      </div>
    </div>
  );
}
