# Path finding

## Static part

- CHUNK - solid block with size (A=w\*h) and position (x, y) in which area player cannot be present.
- EDGE - line which is connecting 2 nodes (y=k\*x+n).
- NODE - point in space connected by 2 edges (x, y).

> Steps for creating initial system

- 1. If node belongs to only 1 chunk, insert circle, called node-circle, of radius r.
- 2. Group chunks into chunk-groups. For 2 chunks to be in the same group, they must be connected by 1 or more nodes.
- 3. Create ghost-edges. Ghost-edge must connect 2 nodes only, must not intersect the chunk and must not be equal to chunk edge.
- 4. For circles connected with an edge, add tangent line called path-edge. Path-edge will create 2 path-nodes, 1 on each circle.

When avoiding obstacle, player will move on path-edges and will go through path-nodes.

## Dynamic part

Static part can be executed in build-time if obstacle map if static and unchanging. Calculation result can be stored and used for dynamic part. If obstacle map is dynamic (changing over time), static part must be executed every time player moves, in addition to dynamic part. If this is the case, further optimization can be achieved by splitting chunks into static and dynamic and calculating only dynamic chunks but this will not be covered in this document.

- 1. Connect current (P1) and wanted (P2) player position with a line. If line does not intersect and chunks, use it. If line intersects 1 or more chunks move to step 2.
- 2. Going from P1 to P2, find the first intersecting chunk.
- 3. Find all nodes, belonging to the chunk-group, on the side of the line with smaller chunk-group area.
- 4. Draw tangent lines to all node-circles and take the line with a shortest length which is not intersecting an edge.
- 5. Repeat from 1.
