import { useState } from "react";
import { FaFilePdf, FaFileWord, FaVideo, FaLock } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CourseMaterialsList = ({ materials = [] }) => {
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [numPages, setNumPages] = useState(null);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const onDocumentLoadError = (error) => {
		console.error("Error loading PDF:", error);
	};

	const getIcon = (type) => {
		switch (type) {
			case "pdf":
				return <FaFilePdf className="text-red-500" />;
			case "doc":
				return <FaFileWord className="text-blue-500" />;
			case "video":
				return <FaVideo className="text-purple-500" />;
			default:
				return <FaFilePdf className="text-gray-500" />;
		}
	};

	const handleView = (material) => {
		setNumPages(null);
		setSelectedMaterial(material);
	};

	const renderContent = (material) => {
		if (!material) return null;

		if (material.type === "video") {
			return (
				<div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
					<video
						src={material.url}
						controls
						controlsList="nodownload"
						className="w-full h-full"
						onContextMenu={(e) => e.preventDefault()}
					>
						Your browser does not support the video tag.
					</video>
				</div>
			);
		}

		if (material.type === "pdf") {
			return (
				<div className="w-full h-[80vh] bg-gray-100 rounded-lg overflow-auto flex justify-center p-4">
					<Document
						file={material.url}
						onLoadSuccess={onDocumentLoadSuccess}
						onLoadError={onDocumentLoadError}
						loading={
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
							</div>
						}
						error={
							<div className="text-center py-10 text-red-600">
								<p>Unable to load PDF.</p>
								<p className="text-sm mt-2 text-gray-500">
									The file might be corrupted or inaccessible.
								</p>
							</div>
						}
					>
						{Array.from(new Array(numPages || 0), (el, index) => (
							<Page
								key={`page_${index + 1}`}
								pageNumber={index + 1}
								className="mb-4 shadow-lg"
								width={Math.min(window.innerWidth * 0.7, 800)}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						))}
					</Document>
				</div>
			);
		}

		if (material.type === "doc") {
			// Use Google Docs Viewer for Office documents
			const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
				material.url
			)}&embedded=true`;
			return (
				<div className="w-full h-[80vh] bg-gray-100 rounded-lg overflow-hidden">
					<iframe
						src={viewerUrl}
						className="w-full h-full"
						title={material.title}
					/>
				</div>
			);
		}

		return (
			<div className="text-center py-10">
				<p>This file type cannot be previewed directly.</p>
			</div>
		);
	};

	if (!materials || materials.length === 0) {
		return (
			<div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
				<div className="text-gray-400 text-5xl mb-3">📂</div>
				<h3 className="text-lg font-medium text-gray-900">
					No Materials Available
				</h3>
				<p className="text-gray-500 mt-1">
					The instructor hasn't uploaded any course materials yet.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{materials.map((material) => (
					<div
						key={material._id}
						className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
					>
						<div className="flex items-start justify-between mb-3">
							<div className="p-2 bg-gray-50 rounded-lg">
								<div className="text-2xl">{getIcon(material.type)}</div>
							</div>
							{!material.isPublic && (
								<div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1">
									<FaLock size={10} /> Premium
								</div>
							)}
						</div>
						<h4 className="font-medium text-gray-900 mb-1 line-clamp-2 flex-1">
							{material.title}
						</h4>
						<div className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
							{material.type}
						</div>
						<button
							onClick={() => handleView(material)}
							className="w-full mt-auto bg-indigo-50 text-indigo-700 py-2 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
						>
							View Material
						</button>
					</div>
				))}
			</div>

			{/* Material Viewer Modal */}
			{selectedMaterial && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								{getIcon(selectedMaterial.type)}
								{selectedMaterial.title}
							</h3>
							<button
								onClick={() => {
									setSelectedMaterial(null);
									setNumPages(null);
								}}
								className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
							>
								✕
							</button>
						</div>
						<div className="flex-1 overflow-auto p-4 bg-gray-50">
							{renderContent(selectedMaterial)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CourseMaterialsList;
