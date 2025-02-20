import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const Write = () => {
  const state = useLocation().state || {};
  const navigate = useNavigate();

  const [title, setTitle] = useState(state.title || "");
  const [value, setValue] = useState(state.desc || "");
  const [img, setImg] = useState(null);
  const [cat, setCat] = useState(state.cat || "");
  const [status, setStatus] = useState('Draft');
  const [visibility, setVisibility] = useState('Public');

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!img) return state.img || '';

    try {
      const formData = new FormData();
      formData.append('file', img);
      const res = await axios.post('/api/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgUrl = await uploadImage();

    try {
      if (state.id) {
        await axios.put(`/api/posts/${state.id}`, {
          title,
          desc: value,
          cat,
          img: imgUrl || state.img,
        });
      } else {
        await axios.post('/api/posts/', {
          title,
          desc: value,
          cat,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          status,
          visibility,
        });
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='add'>
      <div className='content'>
        <input
          type="text"
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className='editorContainer'>
          <ReactQuill
            className='editor'
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className='publish'>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>

        <label>Visibility:</label>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        <label>Upload Image:</label>
        <input type="file" onChange={handleImageChange} />

        <button onClick={handleSubmit}>Publish</button>
        <button>Save as Draft</button>
        {state.id && <button>Update</button>}
      </div>

      <div className='menu'>
        <h1>Category</h1>
        <div>
          <input
            type="radio"
            checked={cat === "art"}
            id="art"
            name="category"
            value="art"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="art">Art</label>
        </div>
        <div>
          <input
            type="radio"
            checked={cat === "science"}
            id="science"
            name="category"
            value="science"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="science">Science</label>
        </div>
        <div>
          <input
            type="radio"
            checked={cat === "technology"}
            id="technology"
            name="category"
            value="technology"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="technology">Technology</label>
        </div>
        <div>
          <input
            type="radio"
            checked={cat === "cinema"}
            id="cinema"
            name="category"
            value="cinema"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="cinema">Cinema</label>
        </div>
        <div>
          <input
            type="radio"
            checked={cat === "design"}
            id="design"
            name="category"
            value="design"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="design">Design</label>
        </div>
        <div>
          <input
            type="radio"
            checked={cat === "food"}
            id="food"
            name="category"
            value="food"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="food">Food</label>
        </div>
      </div>
    </div>
  );
};

export default Write;
