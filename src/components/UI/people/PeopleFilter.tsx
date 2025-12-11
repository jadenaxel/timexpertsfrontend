import type { JSX, FC } from "react";

const PeopleFilter: FC<any> = (props: any): JSX.Element => {
	const { statusFilter, setStatusFilter, setCurrentPage } = props;

	return (
		<div className="mb-6 flex items-center gap-3">
			<span className="text-sm font-medium text-gray-700">Filter by status:</span>
			<div className="inline-flex rounded-lg border border-gray-300 bg-white">
				<button
					onClick={() => {
						setStatusFilter("all");
						setCurrentPage(1);
					}}
					className={`px-4 py-2 text-sm font-medium transition-colors rounded-l-lg cursor-pointer ${
						statusFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
					}`}
				>
					All
				</button>
				<button
					onClick={() => {
						setStatusFilter("active");
						setCurrentPage(1);
					}}
					className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer ${
						statusFilter === "active" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
					}`}
				>
					Active
				</button>
				<button
					onClick={() => {
						setStatusFilter("inactive");
						setCurrentPage(1);
					}}
					className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 rounded-r-lg cursor-pointer ${
						statusFilter === "inactive" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
					}`}
				>
					Inactive
				</button>
			</div>
		</div>
	);
};

export default PeopleFilter;
