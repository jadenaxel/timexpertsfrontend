import type { JSX, FC } from "react";

const PeopleNotFound: FC = (): JSX.Element => {
	return (
		<div className="text-center py-12">
			<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
			<p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you're looking for.</p>
		</div>
	);
};

export default PeopleNotFound;
