import type { FC, JSX } from "react";
import type { CardPeopleProps } from "@/types";

import { useState, useEffect, useRef } from "react";

import { GetNameInitials, FormatDate } from "@/utils";

const CardPeople: FC<CardPeopleProps> = (props): JSX.Element => {
	const { name, last_name, email = "", status = "Active", role = "User", enabled = true, roles, department } = props;

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
		};

		if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isDropdownOpen]);

	const handleEdit = () => setIsDropdownOpen(false);
	const handleViewDetails = () => setIsDropdownOpen(false);
	const handleToggleStatus = () => setIsDropdownOpen(false);
	const handleDelete = () => setIsDropdownOpen(false);

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200 hover:cursor-pointer">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3 min-w-0 flex-1">
					<div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
						{GetNameInitials(name, last_name)}
					</div>
					<div className="min-w-0">
						<h3 className="font-medium text-gray-900 truncate">
							{name} {last_name}
						</h3>
					</div>
				</div>

				<div className="flex items-center gap-2 flex-shrink-0 w-[190px] flex justify-end">
					<p className="text-xs text-gray-500 truncate">{email ?? ""}</p>
				</div>

				<div className="flex items-center gap-2 flex-shrink-0 w-[160px] flex justify-end">
					<p className="text-xs text-gray-500 truncate">{roles ?? ""}</p>
				</div>

				<div className="flex items-center gap-2 flex-shrink-0 w-[150px] flex justify-end">
					<p className="text-xs text-gray-500 truncate">{department ?? ""}</p>
				</div>

				<div className="flex items-center gap-2 flex-shrink-0 w-[85px]">
					<span className={`px-2 py-1 rounded text-xs font-medium ${status === "Active" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
						{status === "Active" ? "Active" : "Inactive"}
					</span>
				</div>

				<div className="text-sm text-gray-600 flex-shrink-0 w-[150px]">{FormatDate(props["He-hired"])}</div>

				<div className="relative flex-shrink-0 w-[95px]" ref={dropdownRef}>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-150 flex items-center gap-1"
					>
						Actions
						<svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
							<div className="py-1">
								<button
									onClick={handleEdit}
									className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
								>
									Edit
								</button>
								<button
									onClick={handleViewDetails}
									className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
								>
									View Details
								</button>
								<button
									onClick={handleToggleStatus}
									className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
								>
									{enabled ? "Disable" : "Enable"}
								</button>
								<div className="border-t border-gray-200 my-1"></div>
								<button
									onClick={handleDelete}
									className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
								>
									Delete
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CardPeople;
