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
    let nodeName = document.getElementById('node-name').value.trim();
    if (nodeName) {
        if (!nodes.get(nodeName)) {
            nodes.add({ id: nodeName, label: nodeName });
            document.getElementById('node-name').value = '';
        } else {
            alert('A node with this name already exists!');
        }
    } else {
        alert('Please enter a node name!');
    }
}

// Function to add an edge
function addEdge() {
    let fromNode = document.getElementById('edge-from').value.trim();
    let toNode = document.getElementById('edge-to').value.trim();
    if (fromNode && toNode) {
        if (nodes.get(fromNode) && nodes.get(toNode)) {
            edges.add({ from: fromNode, to: toNode });
            document.getElementById('edge-from').value = '';
            document.getElementById('edge-to').value = '';
        } else {
            alert('One or both of the specified nodes do not exist!');
        }
    } else {
        alert('Please enter both from and to node names!');
    }
}

// Function to rename a node
function renameNode() {
    let oldName = document.getElementById('rename-old').value.trim();
    let newName = document.getElementById('rename-new').value.trim();
    if (oldName && newName) {
        if (nodes.get(oldName)) {
            if (!nodes.get(newName)) {
                nodes.update({ id: oldName, label: newName });
                edges.forEach((edge) => {
                    if (edge.from === oldName) {
                        edges.update({ id: edge.id, from: newName });
                    }
                    if (edge.to === oldName) {
                        edges.update({ id: edge.id, to: newName });
                    }
                });
                document.getElementById('rename-old').value = '';
                document.getElementById('rename-new').value = '';
            } else {
                alert('A node with the new name already exists!');
            }
        } else {
            alert('The node to rename does not exist!');
        }
    } else {
        alert('Please enter both old and new node names!');
    }
}

// Function to remove a node
function removeNode() {
    let nodeName = document.getElementById('remove-node').value.trim();
    if (nodeName) {
        if (nodes.get(nodeName)) {
            nodes.remove(nodeName);
            document.getElementById('remove-node').value = '';
        } else {
            alert('The node to remove does not exist!');
        }
    } else {
        alert('Please enter a node name to remove!');
    }
}

// Function to save the current graph
function saveGraph() {
    let data = {
        nodes: nodes.get(),
        edges: edges.get()
    };
    localStorage.setItem('savedGraph', JSON.stringify(data));
    alert('Graph saved!');
}

// Function to load a saved graph
function loadGraph() {
    let savedData = localStorage.getItem('savedGraph');
    if (savedData) {
        let data = JSON.parse(savedData);
        nodes.clear();
        edges.clear();
        nodes.add(data.nodes);
        edges.add(data.edges);
        alert('Graph loaded!');
    } else {
        alert('No saved graph found!');
    }
}

// Add event listeners
document.getElementById('add-node').addEventListener('click', addNode);
document.getElementById('add-edge').addEventListener('click', addEdge);
document.getElementById('rename-node').addEventListener('click', renameNode);
document.getElementById('remove-node-btn').addEventListener('click', removeNode);
document.getElementById('save-graph').addEventListener('click', saveGraph);
document.getElementById('load-graph').addEventListener('click', loadGraph);
