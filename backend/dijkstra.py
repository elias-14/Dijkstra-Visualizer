import heapq
from itertools import count



def dijkstra(nodos, aristas, inicio, fin = None, dirigido = True):
    #por implemetar
    if(inicio not in nodos):
        raise ValueError("inic !!")
    if(fin is not None and fin not in nodos):
        raise ValueError("fin !!")
    adj = {nodo: [] for nodo in nodos}

    for u, v, w in aristas:
        #supongamos que da una aristavalida
        if u not in adj or v not in adj:
            raise ValueError("no existe u->v")
        if w < 0:
            raise ValueError("No pesos negativos")
        adj[u].append((v,w))

        if not dirigido:
            adj[v].append((u,w))

    dist = {nodo: float("inf") for nodo in nodos}
    prev = {nodo: None for nodo in nodos}

    dist[inicio] = 0
    queue = [(0,0,inicio)]
    counter = count(1)

    vis = set()
    pasos = []

    def snapshot():
        return {
            node: dis if dis != float("inf") else None
            for node, dis in dist.items()
        }

    while queue:
        dis, _, actual = heapq.heappop(queue)
        if dis != dist[actual] or actual in vis:
            continue
        vis.add(actual)

        pasos.append({
            "tipo" : "vis",
            "actual" : actual,
            "distancias": snapshot(),
            "visitados": list(vis)
        })

        for vecino, w, in adj[actual]:

            nd = dis + w 
            upd = nd < dist[vecino]

            if upd:
                dist[vecino] = nd;
                prev[vecino] = actual
                heapq.heappush(queue, (nd,next(counter), vecino))
                pasos.append({
                "tipo" : "ex_arista",
                "actual" : actual,
                "arista": (actual, vecino, w),
                "actualizado": upd, 
                "distancias": snapshot()
            })

    camino = []

    if fin is not None and dist[fin] != float("inf"):
        cur = fin
        while cur is not None:
            camino.append(cur)
            cur = prev[cur]
        camino.reverse()


    return {
        "distancias":{
            n: d if d != float("inf") else None
            for n,d in dist.items()
        },
        "camino": camino,
        "cost": dist[fin] if fin is not None and dist[fin] != float("inf") else None, "pasos": pasos, "visitados": list(vis)
    }
    

    
