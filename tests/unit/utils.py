def strip_node_shape(node):
    node.pop("nodeSvgShape")
    for child in node["children"]:
        strip_node_shape(child)
    return node
