import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note"
import Banner from "../components/Banner"
import NavBar from "../components/NavBar"
import "../styles/Home.css"

function Home(){
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    getNotes();
  }, [])

  const getNotes = () => {
    api
      .get("/letrajato/notes/")
      .then((res) => res)
      .then((data) => {setNotes(data.data); console.log(data)})
      .catch((err) => alert(err));
  }

  const deleteNote = (id) => {
    api.delete(`/letrajato/notes/delete/${id}/`).then((res) => {
      if(res.status === 204) alert("Note deleted!")
      else alert("Failed to delete note!")
      getNotes()
    }).catch((error) => alert(error))
  }

  const createNote = (e) => {
    e.preventDefault()
    api.post("/letrajato/notes/", {content, title}).then((res) => {
      if(res.status === 201) alert("Note created!")
      else alert("Failed to created note!")
      getNotes()
    }).catch((err) => alert(err));
  }

  return (
    <div className="home-container">
      <NavBar />
      <Banner />
      <div className="content-container">
        <div className="notes-section">
            <h2>Minhas Notas</h2>
            {notes.map((note) => (
                <Note note={note} onDelete={deleteNote} key={note.id} />
            ))}
        </div>
        <div className="create-note-section">
          <h2>Criar Nova Nota</h2>
          <form onSubmit={createNote} className="note-form">
              <div className="form-group">
                <label htmlFor="title">Título:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Conteúdo:</label>
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-textarea"
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Criar Nota</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home
