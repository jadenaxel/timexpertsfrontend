"use client";

import type { FC, JSX } from "react";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import { NavSide, Nav, ProtectedRoute, Loading, Error, CardPeople, PoepleSearch, PeopleFilter, PeopleTable, PeoplePagination, PeopleNotFound } from "@/components";
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
				const userID = person.id_user.toLowerCase();
				const email = person.email?.toLowerCase() ?? "";

				return fullName.includes(query) || userID.includes(query) || email.includes(query);
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
		return filteredData.sort((a: any, b: any) => a.status.localeCompare(b.status)).slice(startIndex, endIndex);
	}, [filteredData, startIndex, endIndex]);

	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	if (loading) return <Loading full />;
	if (error) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="People">
						<PoepleSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
					</Nav>

					<main className="flex-1 p-8">
						{searchQuery && (
							<p className="mb-4 text-sm text-gray-600">
								Found {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
							</p>
						)}
						<PeopleFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} setCurrentPage={setCurrentPage} />

						{filteredData.length > 0 && <PeopleTable />}

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
									<PeoplePagination
										totalPages={totalPages}
										currentPage={currentPage}
										setCurrentPage={setCurrentPage}
										startIndex={startIndex}
										endIndex={endIndex}
										filteredData={filteredData}
									/>
								)}
							</>
						) : (
							<PeopleNotFound />
						)}
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default People;
