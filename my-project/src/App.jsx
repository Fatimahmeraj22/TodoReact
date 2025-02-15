import React, { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import axios from "axios";
import { baseURL } from "./utils/constant";
import Popup from "./components/Popup";
import { motion } from "framer-motion";

import "./index.css";

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input, setInput] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/get`)
      .then((res) => setToDos(res.data))
      .catch((err) => console.log(err));
  }, [updateUI]);

  const saveToDo = () => {
    if (!input.trim()) return;
    if (editMode) {
      axios
        .put(`${baseURL}/update/${editId}`, { toDo: input })
        .then(() => {
          setUpdateUI((prevState) => !prevState);
          setInput("");
          setEditMode(false);
          setEditId(null);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post(`${baseURL}/save`, { toDo: input })
        .then(() => {
          setUpdateUI((prevState) => !prevState);
          setInput("");
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteToDo = (id) => {
    axios
      .delete(`${baseURL}/delete/${id}`)
      .then(() => setUpdateUI((prevState) => !prevState))
      .catch((err) => console.log(err));
  };

  const editToDo = (id, text) => {
    setInput(text);
    setEditMode(true);
    setEditId(id);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">To-Do App</h1>
        
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Add a new task..."
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={saveToDo}
          >
            {editMode ? "Update" : "Add"}
          </button>
        </div>

        <div className="space-y-3">
          {toDos.map((el) => (
            <motion.div 
              key={el._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center bg-gray-200 p-3 rounded-lg"
            >
              <span>{el.toDo}</span>
              <div className="flex gap-2">
                <button 
                  className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                  onClick={() => editToDo(el._id, el.toDo)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => deleteToDo(el._id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {showPopup && (
        <Popup
          setShowPopup={setShowPopup}
          popupContent={popupContent}
          setUpdateUI={setUpdateUI}
        />
      )}
    </main>
  );
};

export default App;
