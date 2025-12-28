import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentCard from "../components/Admin/StudentCard";
import { useAdminUsersQuery } from "../hooks/useAdminApi";
import LoadingOverlay from "../components/common/LoadingOverlay";

export default function StudentManagement() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: studentData,
		isLoading: isStudentsLoading,
		isFetching: isStudentsFetching,
		isError: isStudentsError,
	} = useAdminUsersQuery({ keepPreviousData: true });

	const students = useMemo(() => studentData?.students ?? [], [studentData]);
	const studentCount = studentData?.count ?? students.length;

	// Filter students by search term
	const filteredStudents = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return students;
		return students.filter((student) => {
			const haystack = [student.name, student.email, student.phone, student._id]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(term);
		});
	}, [students, searchTerm]);

	if (isStudentsLoading) {
		return <LoadingOverlay fullscreen message="Loading students..." />;
	}

	if (isStudentsError) {
		return (
			<div className="mt-10 text-center text-red-600">
				Error loading students. Please try again later.
			</div>
		);
	}

	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						Student Management
					</h3>
					<p className="text-sm text-gray-500">
						{studentCount} enrolled student
						{studentCount === 1 ? "" : "s"}
					</p>
				</div>
				<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search students..."
						className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#BB0E00] focus:outline-none focus:ring-2 focus:ring-[#BB0E00]/30 sm:w-64"
					/>
					{/* <button
						type="button"
						className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
						style={{
							background: "linear-gradient(to right, #BB0E00, #B94400)",
						}}
					>
						+ Add Student
					</button> */}
				</div>
			</div>

			<section className="relative">
				{isStudentsFetching && !isStudentsLoading && (
					<LoadingOverlay message="Refreshing students..." />
				)}
				{filteredStudents.length === 0 ? (
					<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
						{searchTerm
							? "No students found matching your search."
							: "No students found."}
					</p>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
						{filteredStudents.map((student) => (
							<StudentCard
								key={student._id}
								student={student}
								onView={(id) => navigate(`/admin/student-detail/${id}`)}
							/>
						))}
					</div>
				)}
			</section>
		</section>
	);
}
