
Pathfinder | Dijkstra visualizer 

This project was developed as part of the Operations Research course. It allows users to create graphs, execute Dijkstra's algorithm and visualize each step of tje shorthest path.

Project Structure

Dijkstra
  
  backend
    
    app.py
    dijkstra.py
    requeriments.txt

  frontend

    index.html
    style.css
    script.js

  app_working.png
  
  README.md

------------------------------
  Features
  
    -Create and add nodes
    -Add weighted edges between nodes
    -Support directed and undirected grapgs
    -Select source and sink
    -Visualize the algorithm step by step
    -Play, pause and go through the simulation

--------------------------------

  Requirements

  Python3.9 or higher, pip and internet connection to load Cytoscape.js

  Installation and setup

  1. Clone the repository

  Open a terminal and run:

    git clone https://github.com/elias-14/Dijkstra-Visualizer.git
    
  2. Navigate to the project folder

    cd Dijkstra-Visualizer

  3. Install the dependencies

  Navigate to the backend folder:

    cd backend

  Install the required Python packages:

    pip install -r requirements.txt

  4. Run the application

  Start the Flask server:

    python app.py
    
  If the server starts successfully, you should see a message indicating that Flask is running.

  5. Open the application

  Open your web browser and go to:

    http://127.0.0.1:5000
  

