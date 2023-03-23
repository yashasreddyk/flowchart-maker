import React, {useEffect, useState} from "react";
import Flowchart from "flowchart-react";
import {ConnectionData, NodeData} from "flowchart-react/dist/schema";
const App = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [conns, setConns] = useState<ConnectionData[]>([]);

  function handleDoubleClick(event: React.MouseEvent<SVGGElement, MouseEvent>, zoom: number): void {
    const point = {
      x: event.nativeEvent.offsetX / zoom,
      y: event.nativeEvent.offsetY / zoom,
      id: +new Date(),
    };
    let nodeData: NodeData;
    if (!nodes.find((item) => item.type === "start")) {
      nodeData = {
        type: "start",
        title: "Start",
        ...point,
      };
    } else if (!nodes.find((item) => item.type === "end")) {
      nodeData = {
        type: "end",
        title: "End",
        ...point,
      };
    } else {
      nodeData = {
        ...point,
        title: "New",
        type: "operation",
      };
    }
    setNodes((prevState) => [...prevState, nodeData]);
  }

  function handleNodeDoubleClick(data: NodeData): void {
    const newTitle = window.prompt("Enter a new title for this node:", data.title ? data.title.toString():"");
    if (newTitle !== null) {
      setNodes((prevState) =>
        prevState.map((node) =>
          node.id === data.id ? {...node, title: newTitle || "New Title"} : node
        )
      );
    }
  }
  

  
  const handleSaveClick = () => {
    const data = {nodes, conns};
    const jsonData = JSON.stringify(data);
    const file = new Blob([jsonData], {type: "application/json"});
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = "flowchart.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  
  return (
    <>
    <Flowchart
      onChange={(nodes, connections) => {
        setNodes(nodes);
        setConns(connections);
      }}
      style={{width: 800, height: 600}}
      nodes={nodes}
      connections={conns}
      showToolbar={true}
      onDoubleClick={handleDoubleClick}
      onNodeDoubleClick={handleNodeDoubleClick}
    />
    <button onClick={handleSaveClick}>Save</button>
    </>
  );
};

export default App;
