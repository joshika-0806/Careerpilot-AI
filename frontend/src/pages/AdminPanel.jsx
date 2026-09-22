import React, { useState } from "react";

function AdminPanel() {
  const [type, setType] = useState("company");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission to backend
    console.log("Submitting", type, formData);
    alert(`Successfully added ${type}!`);
    setFormData({});
  };

  return (
    <div className="admin-panel-page">
      <h1>Admin Panel</h1>
      
      <div className="admin-tabs">
        <button className={`tab-btn ${type === "company" ? "active" : ""}`} onClick={() => setType("company")}>Add Company</button>
        <button className={`tab-btn ${type === "category" ? "active" : ""}`} onClick={() => setType("category")}>Add Category</button>
        <button className={`tab-btn ${type === "question" ? "active" : ""}`} onClick={() => setType("question")}>Add Question</button>
      </div>

      <div className="admin-form-container">
        <form onSubmit={handleSubmit}>
          {type === "company" && (
            <>
              <input type="text" name="name" placeholder="Company Name" onChange={handleChange} required />
              <input type="text" name="logo_url" placeholder="Logo URL" onChange={handleChange} />
              <select name="difficulty" onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </>
          )}

          {type === "category" && (
            <input type="text" name="name" placeholder="Category Name (e.g. Java, HR)" onChange={handleChange} required />
          )}

          {type === "question" && (
            <>
              <input type="number" name="company_id" placeholder="Company ID" onChange={handleChange} required />
              <input type="number" name="category_id" placeholder="Category ID" onChange={handleChange} required />
              <input type="text" name="title" placeholder="Question Title" onChange={handleChange} required />
              <select name="type" onChange={handleChange} required>
                <option value="coding">Coding</option>
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
              </select>
              <textarea name="problem_statement" placeholder="Problem Statement" rows={5} onChange={handleChange} required />
            </>
          )}

          <button type="submit" className="primary-btn mt-3">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
