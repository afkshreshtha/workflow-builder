🚀 Visual Workflow Builder
A modern, interactive workflow builder for creating and managing visual flowcharts with drag-and-drop functionality. Built with React and TypeScript as part of a frontend development assignment.
​

![TypeScript](https://img.shields.io/badge/TypeScript-5een 🎨 4 Node Types: Start, Action, Branch (with True/False paths), and End nodes

🔗 Visual Connections: Smooth curved edges with automatic arrow rendering

⚡ Auto-Layout: Intelligent tree-based positioning prevents node overlaps

🖱️ Drag & Drop: Intuitive node positioning with zoom and pan controls

✏️ Inline Editing: Edit node labels directly in the properties panel

🔄 Undo/Redo: Complete history management for all structural changes

🎯 Smart Re-wiring: Insert and delete nodes while maintaining workflow continuity

💾 Save/Export: Export workflow data as JSON to console

🎨 Dark Theme: Modern UI with smooth transitions and hover effects

📱 Responsive: Works on all screen sizes

🎥 Demo
🔗 Live Demo

<details> <summary>📸 Screenshots</summary>
Main Interface
![Main Interface](screenshots Node Example

Properties Panel
![Properties](

</details>
🏗️ Architecture
Component Structure
text
src/
├── components/
│   ├── FlowNode.tsx       # Reusable node component
│   ├── Sidebar.tsx        # Controls & properties panel
│   └── Toolbar.tsx        # Top status bar
├── types.ts               # TypeScript type definitions
├── utils.ts               # Pure functions (layout, edges)
├── App.tsx                # Main application logic
└── App.css                # Global styles
Key Design Decisions
​
Component-based: 3 core components for clarity without over-engineering

Type Safety: TypeScript discriminated unions for node types

Pure Functions: Utility functions separated for testability

State Management: React hooks (useState, useCallback, useEffect)

No External Libraries: Built from scratch per requirements (no React Flow, Material-UI)

🛠️ Tech Stack
Frontend: React 18.2 (Functional components + Hooks)

Language: TypeScript 5.2

Styling: Pure CSS with CSS transforms (no animation libraries)

Build Tool: Vite

Version Control: Git

🚀 Getting Started
Prerequisites
Node.js 16+ and npm/yarn installed

Installation
bash
# Clone the repository
git clone https://github.com/afkshreshtha/workflow-builder.git

# Navigate to project directory
cd workflow-builder

# Install dependencies
npm install

# Start development server
npm run dev
The app will open at http://localhost:5173

Build for Production
bash
npm run build
npm run preview
📖 How to Use
Select a node by clicking on it (highlighted with blue border)

Add nodes using the properties panel:

For Action/Start: Click "Add Action", "Add Branch", or "Add End"

For Branch: Choose which branch (True/False) to add to

Edit labels in the properties panel input field

Delete nodes using the delete button (Start node is protected)

Drag nodes to reposition manually (disables auto-layout)

Zoom/Pan using controls or mouse/trackpad

Undo/Redo with the history buttons

Save workflow to console (JSON format)

🧠 Core Features Explained
Auto-Layout Algorithm
Recursive tree traversal that positions nodes intelligently:

Horizontal spacing: 250px between levels

Vertical spacing: 200px for branch paths

Time complexity: O(n) - each node visited once

Prevents overlaps: Automatic collision-free positioning

Node Insertion Logic
Complex re-wiring maintains workflow continuity:

text
Before: Start → End
Add Action after Start
After:  Start → Action → End
The old End becomes the child of the new Action node.

Edge Rendering
Uses SVG Bézier curves for smooth connections

Dynamic path calculation based on node positions

Animated arrows with hover effects

🎯 Assignment Requirements Met
✅ Data Modeling: Efficient JSON/TypeScript structure with discriminated unions
✅ Component Architecture: Modular, reusable components (FlowNode, Sidebar, Toolbar)
✅ State Management: React hooks for dynamic workflow state
✅ User Experience: Smooth interactions with add/delete/connect nodes
✅ No UI Libraries: Built from scratch without Material-UI, Chakra, etc.
✅ No Animation Libraries: Pure CSS transitions
✅ No Workflow Libraries: No React Flow, GoJS, or joint.js

Bonus Features Implemented
​
✅ Undo/Redo: Full history management

✅ Save: Logs workflow data to console

✅ Interactive UI: Context-sensitive node addition

📊 Data Structure
Node Types
typescript
type Node = StartNode | ActionNode | BranchNode | EndNode;

// Example:
{
  id: 'node-1',
  label: 'Send Email',
  type: 'action',
  x: 400,
  y: 300,
  color: '#3b82f6',
  childId: 'node-2'
}
Workflow Export Format
json
{
  "nodes": [
    {
      "id": "start-node",
      "label": "Start",
      "type": "start",
      "childId": "node-1"
    },
    {
      "id": "node-1",
      "label": "Check Condition",
      "type": "branch",
      "branches": {
        "True": "node-2",
        "False": "node-3"
      }
    }
  ],
  "timestamp": "2025-12-29T11:20:00.000Z"
}
🎨 Design Features
Dark Theme: Modern slate color palette

Smooth Animations: CSS transitions for all interactions

Visual Feedback: Hover effects, selection highlights, connection indicators

Dot Pattern Background: Professional canvas appearance
​

Responsive Layout: Flexbox-based sidebar + main content

## 🔮 **What I Would Add With More Time**

Given this was a 1-day assignment, here's what I'd prioritize next:

- **Persistent Storage**: Save workflows to localStorage or backend
- **Export/Import**: Download as JSON or PNG
- **More Node Types**: Loop, Parallel execution, API calls
- **Keyboard Shortcuts**: Faster workflow editing (Delete key, Ctrl+Z)
- **Better Mobile Support**: Touch-optimized interactions

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
​

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author
Shreshtha Agarwal

GitHub: @afkshreshtha

LinkedIn: https://www.linkedin.com/in/shreshtha-agarwal-211a65279/

Email: shreshthaagarwal1234@gmail.com

🙏 Acknowledgments
Assignment provided by Emitrr

Built as part of frontend developer internship application

Inspired by tools like Figma, Excalidraw, and React Flow

<div align="center">
⭐ Star this repo if you find it useful!

Made with ❤️ and TypeScript

</div>"# workflow-builder" 
