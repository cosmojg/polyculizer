// Helper functions
const createEdgeId = (from, to) => `${from}-${to}`;
const nodesMap = new Map();
const nodeExists = (nodeId) => nodesMap.has(nodeId);

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Initialize the graph
const { nodes, edges } = new vis.DataSet();

const container = document.getElementById("graph-container");
const data = { nodes, edges };
const options = {
  physics: {
    enabled: true,
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.01,
      damping: 0.09,
      avoidOverlap: 0.1,
    },
  },
  nodes: {
    shape: "circle",
    size: 25,
    font: {
      size: 14,
      color: "#ffffff",
    },
    color: {
      background: "#3498db",
      border: "#2980b9",
      highlight: {
        background: "#2ecc71",
        border: "#27ae60",
      },
    },
    borderWidth: 2,
  },
  edges: {
    width: 2,
    color: {
      color: "#7f8c8d",
      highlight: "#95a5a6",
      hover: "#bdc3c7",
    },
    smooth: {
      type: "continuous",
    },
  },
};
let network;

// Call initializeGraph when the page loads
document.addEventListener("DOMContentLoaded", initializeGraph);

// Function to add a node
function addNode() {
  const nodeName = document.getElementById("node-name").value.trim();
  if (!nodeName) {
    alert("Please enter a node name!");
    return;
  }
  if (nodeExists(nodeName)) {
    alert("A node with this name already exists!");
    return;
  }
  nodes.add({ id: nodeName, label: nodeName });
  document.getElementById("node-name").value = "";
  updateDropdowns();
  saveGraph();
}

// Function to add an edge
function addEdge() {
  const fromNode = document.getElementById("edge-from").value.trim();
  const toNode = document.getElementById("edge-to").value.trim();
  if (!fromNode || !toNode || !nodeExists(fromNode) || !nodeExists(toNode)) {
    alert("Please select valid from and to nodes!");
    return;
  }
  const edgeId = createEdgeId(fromNode, toNode);
  edges.add({ id: edgeId, from: fromNode, to: toNode });
  saveGraph();
}

// Function to rename a node
function renameNode() {
  const oldName = document.getElementById("rename-old").value.trim();
  const newName = document.getElementById("rename-new").value.trim();
  if (!oldName || !newName) {
    alert("Please enter both old and new node names!");
    return;
  }
  if (!nodeExists(oldName)) {
    alert("The node to rename does not exist!");
    return;
  }
  if (nodeExists(newName)) {
    alert("A node with the new name already exists!");
    return;
  }

  nodes.remove(oldName);
  nodes.add({ id: newName, label: newName });

  edges.get().forEach((edge) => {
    let newEdge = { ...edge };
    if (edge.from === oldName) {
      newEdge.from = newName;
      newEdge.id = createEdgeId(newName, edge.to);
    }
    if (edge.to === oldName) {
      newEdge.to = newName;
      newEdge.id = createEdgeId(edge.from, newName);
    }
    if (newEdge.from !== edge.from || newEdge.to !== edge.to) {
      edges.remove(edge.id);
      edges.add(newEdge);
    }
  });

  document.getElementById("rename-old").value = "";
  document.getElementById("rename-new").value = "";
  updateDropdowns();
  saveGraph();
}

// Function to remove a node
function removeNode() {
  const nodeName = document.getElementById("remove-node").value.trim();
  if (!nodeName) {
    alert("Please enter a node name to remove!");
    return;
  }
  if (!nodeExists(nodeName)) {
    alert("The node to remove does not exist!");
    return;
  }

  const edgesToRemove = edges
    .get()
    .filter((edge) => edge.from === nodeName || edge.to === nodeName);
  edges.remove(edgesToRemove.map((edge) => edge.id));
  nodes.remove(nodeName);
  document.getElementById("remove-node").value = "";
  updateDropdowns();
  saveGraph();
}

// Function to encode graph data to URL
function encodeGraphToURL(graphData) {
  const nodesData = graphData.nodes.map((node) => node.id);
  const edgesData = graphData.edges.map((edge) => edge.id);
  return `data=${rison.encode({ nodes: nodesData, edges: edgesData })}`;
}

// Function to update the URL with graph data
const updateURL = async (graphData) => {
  const encodedData = encodeGraphToURL(graphData);
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${encodedData}`,
  );
};

// Function to decode URL parameters
function decodeURLToGraph() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");
    return encodedData ? rison.decode(encodedData) : null;
  } catch (error) {
    console.error("Error decoding URL:", error);
    return null;
  }
}

// Function to save the current graph
async function saveGraph() {
  const graphData = { nodes: nodes.get(), edges: edges.get() };
  await updateURL(graphData);
}

// Function to load a saved graph
function loadGraph() {
  const urlData = decodeURLToGraph();
  if (!urlData) {
    alert("No saved graph found!");
    return;
  }
  nodes.clear();
  edges.clear();
  urlData.nodes.forEach((nodeId) => {
    nodes.add({ id: nodeId, label: nodeId });
  });
  urlData.edges.forEach((edgeId) => {
    const [from, to] = edgeId.split("-");
    edges.add({ id: edgeId, from, to });
  });
  network.fit();
  alert("Graph loaded!");
}

function initializeGraph() {
  const urlData = decodeURLToGraph();
  urlData?.nodes?.forEach((nodeId) => {
    nodes.add({ id: nodeId, label: nodeId });
  });
  urlData?.edges?.forEach((edgeId) => {
    const [from, to] = edgeId.split("-");
    edges.add({ id: edgeId, from, to });
  });
  network = new vis.Network(container, data, options);
  network.on("afterDrawing", saveGraph);
  updateDropdowns();
  setupEnterKeyListeners();
}

// Add event listeners
document.getElementById("controls").addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const action = event.target.id.replace("-btn", "");
    if (typeof window[action] === "function") {
      window[action]();
    }
  }
});

// Setup Enter key listeners
setupEnterKeyListeners();

if (typeof rison === "undefined") {
  console.error(
    "Rison library is not loaded. Make sure to include it in your HTML.",
  );
}
function updateDropdowns() {
  const nodeIds = new Set(nodes.getIds());
  const dropdowns = ["edge-from", "edge-to", "rename-old", "remove-node"];

  dropdowns.forEach((id) => {
    const select = document.getElementById(id);
    select.innerHTML = Array.from(nodeIds)
      .map((nodeId) => `<option value="${nodeId}">${nodeId}</option>`)
      .join("");
  });
}
function handleEnterKey(event, actionFunction) {
  if (event.key === "Enter") {
    actionFunction();
  }
}

function setupEnterKeyListeners() {
  document
    .getElementById("node-name")
    .addEventListener("keyup", (event) => handleEnterKey(event, addNode));
  document
    .getElementById("rename-new")
    .addEventListener("keyup", (event) => handleEnterKey(event, renameNode));
}
