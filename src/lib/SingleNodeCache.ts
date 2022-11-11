import NodeCache from "node-cache";

class SingleNodeCache {
  private static nodeCache: NodeCache;

  private constructor() {}

  static getInstance() {
    if (SingleNodeCache.nodeCache) return SingleNodeCache.nodeCache;
    SingleNodeCache.nodeCache = new NodeCache();
    return SingleNodeCache.nodeCache;
  }
}

export default SingleNodeCache;
