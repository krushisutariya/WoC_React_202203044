import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OpenFile = ({ id }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Prevent unnecessary API calls if no file is selected

    const fetchFileContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:3001/file/getContent", {
          params: { id },
        });

        setContent(res.data.content || ""); // Default to an empty string if content is undefined
      } catch (err) {
        setError("Failed to fetch file content.");
        console.error("Error fetching file content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [id]); // Dependencies list

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3001/file/updateFileContent", { id, content });
    
      toast.success("File saved successfully!");
    } catch (err) {
      toast.error("Failed to save file.");
      console.error("Error saving file:", err);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <textarea value={content} onChange={handleChange} rows={10} cols={50} />
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
};

export default OpenFile;
