import type { FC, JSX } from "react";
import type { UserSelectorProps } from "@/types";

import { useState, useEffect, useRef, useCallback } from "react";

import { SearchIcon, XIcon, PeopleIcon } from "./icons";
import { FormatUserName } from "@/../config";
import { API_ENPOINT_V1 } from "@/config";
import { getAuthHeader } from "@/utils";

const UserSelector: FC<UserSelectorProps> = ({ users, selectedUserId, onSelect, startDate, endDate, setUserTimeData }): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedUser = users.find(u => u.id_user === selectedUserId);

	const fetchUserTimeData = useCallback(
		async (userId: string) => {
			if (!setUserTimeData || !startDate || !endDate) return;

			const start: string = startDate.toISOString();
			const end: string = endDate.toISOString();

			try {
				const response = await fetch(`${API_ENPOINT_V1.GET_PERSON_BY_ID}${userId}/date`, {
					method: "POST",
					body: JSON.stringify({ from: start, to: end }),
					headers: {
						"Content-Type": "application/json",
						...getAuthHeader()
					}
				});

				if (!response.ok) {
					console.error(`Error fetching time data for ${userId}: ${response.status} ${response.statusText}`);
					setUserTimeData([]);
					return;
				}

				const data = await response.json();
				setUserTimeData(data ?? []);
			} catch (error) {
				console.error("Error fetching time data", error);
				setUserTimeData([]);
			}
		},
		[endDate, setUserTimeData, startDate]
	);

	const handleOnSelectUser = (userId: string) => {
		onSelect(userId);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (!selectedUserId || !startDate || !endDate || !setUserTimeData) return;
		void fetchUserTimeData(selectedUserId);
	}, [endDate, fetchUserTimeData, selectedUserId, setUserTimeData, startDate]);

	const filteredUsers = users.filter((user: any) => {
		const fullName = `${user.name} ${user.last_name}`.toLowerCase();
		const userID = user.id_user.toLowerCase();

		return fullName.includes(searchQuery.toLowerCase()) || userID.includes(searchQuery.toLowerCase());
	});

	return (
		<div className="relative w-full" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full min-w-[260px] items-center justify-between rounded-2xl border border-gray-200 bg-white/95 px-2 py-1 text-left text-sm font-semibold text-gray-700 shadow-[0_15px_35px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 cursor-pointer"
			>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/20 text-blue-600">
						<PeopleIcon className="h-5 w-5" />
					</div>
					<span className="truncate text-sm font-semibold text-gray-900">
						{selectedUser ? FormatUserName(`${selectedUser.name} ${selectedUser.last_name}`) : "Select user"}
					</span>
				</div>
				<svg
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className={`h-4 w-4 text-gray-500 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</button>

			{isOpen && (
				<div
					className="absolute right-0 mt-3 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5"
					style={{ zIndex: 1, maxHeight: "460px" }}
				>
					<div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3">
						<p className="text-sm font-semibold text-gray-900">Team members</p>
						<span className="text-xs text-gray-500">{filteredUsers.length} available</span>
					</div>
					<div className="border-b border-gray-100 px-4 py-3">
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<SearchIcon {...({ className: "h-4 w-4 text-gray-400" } as any)} />
							</div>
							<input
								type="text"
								className="block w-full rounded-2xl border border-blue-100 bg-gray-50 py-2.5 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-500 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
								placeholder="Search members"
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								autoFocus
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute right-0 ml-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
								>
									<XIcon {...({ className: "h-4 w-4" } as any)} />
								</button>
							)}
						</div>
					</div>
					<div className="flex-1 overflow-y-auto px-2 pb-3">
						{filteredUsers.length > 0 ? (
							<div className="flex flex-col gap-1.5">
								{filteredUsers.map(user => {
									const isSelected = user.id_user === selectedUserId;
									return (
										<button
											type="button"
											key={user.id_user}
											onClick={async () => await handleOnSelectUser(user.id_user)}
											className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all cursor-pointer ${
												isSelected
													? "bg-blue-50/80 text-blue-900 ring-1 ring-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
													: "text-gray-700 hover:bg-gray-50/70 hover:text-gray-900"
											}`}
										>
											<div
												className={`flex h-10 w-10 items-center justify-center rounded-full border ${
													isSelected ? "border-blue-100 bg-white text-blue-600 shadow-sm" : "border-transparent bg-blue-50 text-blue-500"
												}`}
											>
												<PeopleIcon className="h-5 w-5" />
											</div>
											<div className="flex min-w-0 flex-col">
												<span className="truncate font-medium">{FormatUserName(`${user.name} ${user.last_name}`)}</span>
												<span className="text-xs text-gray-500">ID: {user.id_user}</span>
											</div>
											<div
												className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border ${
													isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 text-transparent"
												}`}
											>
												{isSelected && (
													<svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M5 10.5l3 3 7-7" />
													</svg>
												)}
											</div>
										</button>
									);
								})}
							</div>
						) : (
							<div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-12 text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
									<PeopleIcon className="h-6 w-6" />
								</div>
								<p className="text-sm font-semibold text-gray-800">No members found</p>
								<p className="text-xs text-gray-500">Try another name or clear the search box.</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default UserSelector;
