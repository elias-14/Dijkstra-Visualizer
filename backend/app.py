
from flask import Flask, request, jsonify, send_from_directory
from dijkstra import dijkstra
from pathlib import Path

app = Flask(__name__)

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


@app.route("/api/dijkstra", methods=["POST"])
def calculate_route():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No se recibieron datos."}), 400

        nodes = data["nodes"]
        edges = data["edges"]
        source = data["source"]
        target = data.get("target")
        directed = data.get("directed", True)

        if not isinstance(nodes, list) or not nodes:
            return jsonify({"error": "El grafo debe tener nodos."}), 400

        if len(set(nodes)) != len(nodes):
            return jsonify({"error": "Hay nodos duplicados."}), 400

        result = dijkstra(
            nodes,
            edges,
            source,
            target,
            directed
        )

        return jsonify(result)

    except (KeyError, TypeError, ValueError) as error:
        return jsonify({"error": str(error)}), 400

    except Exception:
        app.logger.exception("Error interno")
        return jsonify({"error": "Error interno del servidor."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
