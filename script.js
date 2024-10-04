// Initialize the graph
let nodes = new vis.DataSet();
let edges = new vis.DataSet();

let container = document.getElementById('graph-container');
let data = {
   nodes: nodes,
   edges: edges
};
let options = {
   physics: {
       enabled: true,
       barnesHut: {
           gravitationalConstant: -2000,
           centralGravity: 0.3,
           springLength: 95,
           springConstant: 0.04,
           damping: 0.09,
           avoidOverlap: 0
       }
   }
};
let network = new vis.Network(container, data, options);

// Function to add a node
function addNode() {
   let nodeName = document.getElementById('node-name').value;
   if (nodeName) {
       nodes.add({ id: nodeName, label: nodeName });
       document.getElementById('node-name').value = '';
   }
}

// Function to add an edge
function addEdge() {
   let fromNode = document.getElementById('edge-from').value;
   let toNode = document.getElementById('edge-to').value;
   if (fromNode && toNode) {
       edges.add({ from: fromNode, to: toNode });
       document.getElementById('edge-from').value = '';
       document.getElementById('edge-to').value = '';
   }
}

// Function to rename a node
function renameNode() {
   let oldName = document.getElementById('rename-old').value;
   let newName = document.getElementById('rename-new').value;
   if (oldName && newName) {
       nodes.update({ id: oldName, label: newName });
       document.getElementById('rename-old').value = '';
       document.getElementById('rename-new').value = '';
   }
}

// Function to remove a node
function removeNode() {
   let nodeName = document.getElementById('remove-node').value;
   if (nodeName) {
       nodes.remove(nodeName);
       document.getElementById('remove-node').value = '';
   }
}

// Add event listeners
document.getElementById('add-node').addEventListener('click', addNode);
document.getElementById('add-edge').addEventListener('click', addEdge);
document.getElementById('rename-node').addEventListener('click', renameNode);
document.getElementById('remove-node-btn').addEventListener('click', removeNode);
