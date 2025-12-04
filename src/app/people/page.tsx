"use client";

import type { FC, JSX } from "react";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import { NavSide, Nav, ProtectedRoute, Loading, Error, CardPeople } from "@/components";
import { useFetch } from "@/hooks";
import { UseFetchResult } from "@/types";
import { API_ENPOINT_V1, ITEMS_PER_PAGE } from "@/../config";

const People: FC = (): JSX.Element => {
	const { data, loading, error }: UseFetchResult<any> = useFetch(API_ENPOINT_V1.GET_PEOPLE);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

	const filteredData = useMemo(() => {
		if (!data) return [];

		let filtered: any[] = data;

		if (searchQuery.trim()) {
			const query: string = searchQuery.toLowerCase();
			filtered = filtered.filter((person: any) => {
				const fullName: string = `${person.name} ${person.last_name}`.toLowerCase();
				return fullName.includes(query);
			});
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((person: any) => {
				const personStatus = person.status?.toLowerCase() || "active";
				return personStatus === statusFilter;
			});
		}

		return filtered;
	}, [data, searchQuery, statusFilter]);

	const totalPages: number = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
	const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex: number = startIndex + ITEMS_PER_PAGE;

	const paginatedData = useMemo(() => {
		return filteredData.slice(startIndex, endIndex);
	}, [filteredData, startIndex, endIndex]);

	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	if (loading) return <Loading />;
	if (error) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="People">
						<div className="relative w-full">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								placeholder="Search by name"
								className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
							/>
							{searchQuery && (
								<button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>
					</Nav>

					<main className="flex-1 p-8">
						{searchQuery && (
							<p className="mb-4 text-sm text-gray-600">
								Found {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
							</p>
						)}
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

						{filteredData.length > 0 && (
							<div className="bg-white border border-gray-200 rounded-lg p-4 mb-2">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Member</span>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0 w-[85px]">
										<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
									</div>
									<div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0 w-[150px]">Date added</div>
									<div className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0 w-[95px]">Actions</div>
								</div>
							</div>
						)}

						{paginatedData.length > 0 ? (
							<>
								{paginatedData.map((person: any, key: number) => {
									return (
										<Link href={`/people/${person.id_user}`} key={key}>
											<CardPeople {...person} />
										</Link>
									);
								})}

								{totalPages > 1 && (
									<div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
										<div className="flex items-center gap-2">
											<p className="text-sm text-gray-700">
												Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
												<span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{" "}
												<span className="font-medium">{filteredData.length}</span> results
											</p>
										</div>

										<div className="flex items-center gap-2">
											<button
												onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
												disabled={currentPage === 1}
												className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
													currentPage === 1
														? "bg-gray-100 text-gray-400 cursor-not-allowed"
														: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
												onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
												disabled={currentPage === totalPages}
												className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
													currentPage === totalPages
														? "bg-gray-100 text-gray-400 cursor-not-allowed"
														: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
												}`}
											>
												Next
											</button>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
								<p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you're looking for.</p>
							</div>
						)}
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default People;
