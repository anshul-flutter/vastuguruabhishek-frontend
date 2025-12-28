import React from 'react';
import StudentCard from './StudentCard';

function StudentList({ students }) {
  return (
    <div className="student-grid gap-4">
      {students?.map((student, idx) => (
        <StudentCard
          key={student.id}
          index={idx}
          {...student}
        />
      ))}

      {/* Render the footer only once here */}
      {students?.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4 mt-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Load More
          </button>
          <p className="text-gray-500 text-sm text-center">
            © 2025 Vastu Abhishek. All rights reserved.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentList;
