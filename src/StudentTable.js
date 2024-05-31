import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState([]);
  
  const fetchStudents = async () => {
    try {
      const response = await axios.get('api/students');
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axios.get('api/schools');
      setSchools(response.data.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
  };

  const handleAddStudent = () => {
    // Implement the logic to add a new student
    console.log("Add Student button clicked");
  };

  const filteredStudents = students.filter(student => {
    const { firstName, lastName, gender, currentAddress, city, state } = student.attributes;
    const fullName = `${firstName || ''} ${lastName || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      (gender && gender.toLowerCase().includes(query)) ||
      (currentAddress && currentAddress.toLowerCase().includes(query)) ||
      (city && city.toLowerCase().includes(query)) ||
      (state && state.toLowerCase().includes(query))
    );
  });

  // Use a Set to filter out duplicate full names
  const uniqueStudents = Array.from(new Set(filteredStudents.map(student => {
    const { firstName, lastName } = student.attributes;
    return `${firstName} ${lastName}`.toLowerCase();
  }))).map(uniqueName => {
    return filteredStudents.find(student => {
      const { firstName, lastName } = student.attributes;
      return `${firstName} ${lastName}`.toLowerCase() === uniqueName;
    });
  });

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800 text-center">Students</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select state</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>{school.attributes.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Add Student
        </button>
      </div>

      <div className="mb-4 text-gray-700">
        Total Students: {uniqueStudents.length}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              {['ID', 'First Name', 'Last Name', 'Gender', 'Date of Birth', 'Blood Group', 'Parent Contact', 'Parent Email', 'Current Address', 'Created At', 'Updated At', 'City', 'State', 'Apartment Name'].map((header) => (
                <th key={header} className="border border-blue-600 px-4 py-2 text-left text-sm font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueStudents.map(student => {
              const attributes = student.attributes;
              return (
                <tr key={student.id} className="hover:bg-gray-100 even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{student.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.firstName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.gender}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.dob}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.bloodGroup}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.parentContactNo}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.parentEmailId}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.currentAddress}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{new Date(attributes.createdAt).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{new Date(attributes.updatedAt).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.city}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.state}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{attributes.apartmentName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
