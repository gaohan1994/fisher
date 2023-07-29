import { Graph, Node } from '../graph';

interface TestNodeData {
  id: number;
}

function hashFn(node: TestNodeData) {
  return node.id.toString();
}

it('Node should success initilaize', () => {
  const data = { id: 1 };
  const node = new Node(data);

  expect(node.data).toStrictEqual(data);
});

it('should success insert node', () => {
  const data: TestNodeData = { id: 1 };
  const graph = new Graph<TestNodeData>(hashFn);

  expect(graph.lookup(data)).toBeUndefined();
  graph.lookupOrInsertNode(data);
  expect(graph.lookup(data)).toStrictEqual(new Node(data));
});

it('should success remove node', () => {
  const data: TestNodeData = { id: 1 };
  const graph = new Graph<TestNodeData>(hashFn);

  graph.lookupOrInsertNode(data);
  expect(graph.lookup(data)).toStrictEqual(new Node(data));

  graph.removeNode(data);
  expect(graph.lookup(data)).toBeUndefined();
});

it('should success insert edge', () => {
  const graph = new Graph<TestNodeData>(hashFn);

  const dataA: TestNodeData = { id: 1 };
  const dataB: TestNodeData = { id: 2 };

  graph.insertEdge(dataA, dataB);

  const roots = graph.roots();
  expect(roots.length).toEqual(1);

  const root = roots[0];
  expect(root.data).toStrictEqual(dataB);

  const nodeA = graph.lookup(dataA)!;
  const nodeB = graph.lookup(dataB)!;

  expect(nodeA.outgoing.size).toEqual(1);
  expect(nodeB.incoming.size).toEqual(1);
});

it('should find cycle', () => {
  const graph = new Graph<TestNodeData>(hashFn);

  const dataA: TestNodeData = { id: 1 };
  const dataB: TestNodeData = { id: 2 };
  const dataC: TestNodeData = { id: 3 };

  graph.insertEdge(dataA, dataB);
  graph.insertEdge(dataB, dataC);
  graph.insertEdge(dataC, dataA);

  expect(graph.findCycleSlow()).toEqual('1 -> 2 -> 3 -> 1');
});
