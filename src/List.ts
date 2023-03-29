export type INode<T> = T & {
  next?: INode<T> | null;
  prev?: INode<T> | null;
};

export class List<T> {
  public head: INode<T> | null = null;
  public tail: INode<T> | null = null;

  public add(node: INode<T>) {
    if (!this.head) {
      this.head = this.tail = node;
      node.next = node.prev = null;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      node.next = null;
      this.tail = node;
    }
  }

  public remove(node: INode<T>) {
    if (this.head === node) {
      this.head = this.head.next!;
    }

    if (this.tail === node) {
      this.tail = this.tail.prev!;
    }

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  public removeAll() {
    while (this.head) {
      const node = this.head;
      this.head = node.next!;
      node.prev = null;
      node.next = null;
    }
    this.tail = null;
  }

  public get empty(): boolean {
    return this.head === null;
  }

  *[Symbol.iterator]() {
    for (let node = this.head; node; node = node.next!) {
      yield node;
    }
  }

  public find(node: INode<T>) {
    for (let cur = this.head; cur; cur = cur.next!) {
      if (cur == node) {
        return true;
      }
    }

    return false;
  }
}
