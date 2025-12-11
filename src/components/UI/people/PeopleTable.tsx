import type { JSX, FC } from "react";

const PeopleTable: FC = (): JSX.Element => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 mb-2">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3 min-w-0 flex-1">
					<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Member</span>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0 w-[190px] justify-end">
					<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</span>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0 w-[160px] justify-end">
					<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</span>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0 w-[150px] justify-end">
					<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</span>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0 w-[85px]">
					<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
				</div>
				<div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0 w-[150px]">Date added</div>
				<div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0 w-[95px]">Actions</div>
			</div>
		</div>
	);
};

export default PeopleTable;
