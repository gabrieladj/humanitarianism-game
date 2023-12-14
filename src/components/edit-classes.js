import { useState, useEffect } from "react";
import { withSessionSsr } from "@/lib/session";
import { getAllCourseSections } from "@/lib/courseSection";
import axios from "axios";
import "@/pages/global.css";
import React from "react";
import { data } from "browserslist";
import { useRouter } from 'next/navigation'

function EditClasses({ sections }) {
  const router = useRouter()
  //const [courseSection, setCourseSection] = useState({data});

  // make a deep copy of sections
  const [editedSections, setEditedSections] = useState(JSON.parse(JSON.stringify(sections)));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const resetDBStats = async (index) => {
    const confirmed = window.confirm('Are you sure you want to reset this section\'s stats?');
    if (confirmed) {
      try {
        const response = await axios.post("/api/reset-stats", {
          courseSectionId: editedSections[index].id,
        });
        setSuccessMessage("Section's stats reset successfully!");
        console.log("Section's stats reset successfully!");
      } catch (error) {
        setErrorMessage(error.response.data.message)
        console.error("Error resetting section:", error);
      }
    }
  };

  const deleteSection = (index) => {
    const updatedSections = [...editedSections];
    updatedSections.splice(index, 1);
    setEditedSections(updatedSections);
  }

  const handleInputChange = (index, field, value) => {
    const updatedSections = [...editedSections];
    updatedSections[index][field] = value;
    setEditedSections(updatedSections);
  };

  const save = async () => {
    try {
      const response = await axios.post("/api/edit-classes", {
        sections: editedSections,
      });
      console.log("Sections updated successfully!");
      router.refresh();
    } catch (error) {
      setErrorMessage(error.response.data.message)
      console.error("Error updating sections:", error);
    }
  };

  const revertChanges = async () => {
    setEditedSections(JSON.parse(JSON.stringify(sections)));
  };

  const addNewSection = () => {
    const newSection = {
      id: "",
      name: "New Class",
      description: "Description",
    };
    setEditedSections([...editedSections, newSection]);
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-5">
      <h3 className="text-xl font-bold">Edit Class Sections</h3>
      {errorMessage && (
        <h2 className="text-red-500">{errorMessage}</h2>
      )}
      {successMessage && (
        <h2 className="text-green-500">{successMessage}</h2>
      )}
      {editedSections.map((section, index) => (
        <div className="flex flex-col w-64" key={section.id}>
          {/*
          <label className="mb-2">
            ID
            <input
              className="border border-gray-300 p-1 rounded w-full"
              value={section.id}
              disabled
            />
          </label>
          */}
          
          <label className="mb-2">
            Name
            <input
              className="border border-gray-300 p-1 rounded w-full"
              value={section.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
          </label>
          <label className="mb-2">
            Description
            <input
              className="border border-gray-300 p-1 rounded w-full"
              value={section.description}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
            />
          </label>
          {/*
          <label className="mb-2">
            URL Path (ex: class-1)
            <input
              className="border border-gray-300 p-1 rounded w-full"
              value={section.path}
              onChange={(e) => handleInputChange(index, "path", e.target.value)}
            />
          </label>
            */}
          <div className="flex flex-row justify-between w-full mt-4">
          <button
              className="bg-red-500 text-white px-4 py-2 rounded w-1/2 mr-2"
              onClick={() => {deleteSection(index)}}
            >
              Delete
            </button>
            {editedSections[index].id && (
            <button
               className="bg-red-500 text-white px-4 py-2 rounded w-1/2 ml-2"
              onClick={() => {
                resetDBStats(index);
              }}
            >
              Reset Stats
            </button>
            )}
          </div>
        </div>
      ))}
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={addNewSection}
      >
        New Class
      </button>

      <div className="flex justify-between w-full mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          type="submit"
          onClick={save}
        >
          Save
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          type="submit"
          onClick={revertChanges}
        >
          Revert
        </button>
      </div>
    </div>
  );
}

export default EditClasses;