export class Node<T> {
  readonly incoming = new Map<string, Node<T>>();
  readonly outgoing = new Map<string, Node<T>>();

  constructor(readonly data: T) {}
}

export class Graph<T> {
  private readonly nodes = new Map<string, Node<T>>();

  constructor(private hashFn: (element: T) => string) {}

  public roots = (): Array<Node<T>> => {
    const result: Array<Node<T>> = [];

    for (const node of this.nodes.values()) {
      if (node.outgoing.size === 0) {
        result.push(node);
      }
    }

    return result;
  };

  /**
   * Remove node and alse remove this node
   * on the others node's incoming and outgoing map
   * @param data
   */
  public removeNode = (data: T): void => {
    const key = this.hashFn(data);
    this.nodes.delete(key);

    for (const node of this.nodes.values()) {
      node.incoming.delete(key);
      node.outgoing.delete(key);
    }
  };

  public lookupOrInsertNode = (data: T): Node<T> => {
    const key = this.hashFn(data);
    let node = this.nodes.get(key);

    if (!node) {
      node = new Node(data);
      this.nodes.set(key, node);
    }

    return node;
  };

  public lookup = (data: T): Node<T> | undefined => {
    const key = this.hashFn(data);
    return this.nodes.get(key);
  };

  public isEmpty = (): boolean => {
    return this.nodes.size === 0;
  };

  public insertEdge = (from: T, to: T): void => {
    const fromNode = this.lookupOrInsertNode(from);
    const toNode = this.lookupOrInsertNode(to);

    fromNode.outgoing.set(this.hashFn(to), toNode);
    toNode.incoming.set(this.hashFn(from), fromNode);
  };

  public findCycleSlow = () => {
    for (const [id, node] of this.nodes) {
      const seen = new Set([id]);
      const value = this.findCycle(node, seen);

      if (value) {
        return value;
      }
    }

    return undefined;
  };

  private findCycle = (node: Node<T>, seen: Set<string>): string | undefined => {
    for (const [id, outgoing] of node.outgoing) {
      if (seen.has(id)) {
        return [...seen, id].join(' -> ');
      }

      seen.add(id);

      const value = this.findCycle(outgoing, seen);

      if (value) {
        return value;
      }

      seen.delete(id);
    }

    return undefined;
  };
}
