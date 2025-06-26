import React from "react";

const AddProjectForm = () => {
  // TODO: Implement form state, validation, and submission logic
  return (
    <form className="add-project-form">
      <h2>Add Project</h2>
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <label>
        Description
        <textarea name="description" />
      </label>
      <label>
        Image
        <input type="file" name="image" accept="image/*" />
      </label>
      <label>
        City
        <select name="cityId">{/* TODO: Populate with city options */}</select>
      </label>
      <label>
        Label Direction
        <select name="labelDirection">
          <option value="up">Up</option>
          <option value="down">Down</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </label>
      {/* TODO: Polygon drawing integration */}
      <button type="submit">Add Project</button>
    </form>
  );
};

export default AddProjectForm;
