import type { JSX, FC } from "react";

const PeoplePagination: FC<any> = (props: any): JSX.Element => {
	const { startIndex, endIndex, filteredData, currentPage, setCurrentPage, totalPages } = props;

	return (
		<div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
			<div className="flex items-center gap-2">
				<p className="text-sm text-gray-700">
					Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{" "}
					<span className="font-medium">{filteredData.length}</span> results
				</p>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={() => setCurrentPage((prev: any) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
						currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					Previous
				</button>

				<div className="flex items-center gap-1">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
						const showPage: boolean = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);

						const showEllipsisBefore: boolean = page === currentPage - 2 && currentPage > 3;
						const showEllipsisAfter: boolean = page === currentPage + 2 && currentPage < totalPages - 2;

						if (showEllipsisBefore || showEllipsisAfter) {
							return (
								<span key={page} className="px-2 text-gray-500">
									...
								</span>
							);
						}

						if (!showPage) return null;

						return (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
									currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
								}`}
							>
								{page}
							</button>
						);
					})}
				</div>

				<button
					onClick={() => setCurrentPage((prev: any) => Math.min(prev + 1, totalPages))}
					disabled={currentPage === totalPages}
					className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
						currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default PeoplePagination;
