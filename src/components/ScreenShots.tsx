import type { FC, JSX } from "react";
import type { ScreenShotItem, ScreenShotsCardProps } from "@/types";

import { useState } from "react";

import { EncodeImage, FormatHour, FormatUserName } from "@/../config";
import ImageOverlay from "./ImageOverlay";
import { PeopleIcon } from "./icons";

const ScreenShotsCard: FC<ScreenShotsCardProps> = ({ user, screenshots }): JSX.Element => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	const sortedScreenshots: ScreenShotItem[] = [...screenshots].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	const previewScreenshots: ScreenShotItem[] = sortedScreenshots.slice(0, 4);
	const remainingScreenshots: number = Math.max(sortedScreenshots.length - previewScreenshots.length, 0);

	return (
		<article className="flex w-full max-w-xl flex-col gap-3">
			<div className="flex items-center gap-3">
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white">
					<PeopleIcon className="h-4 w-4" />
				</div>
				<h2 className="text-lg font-semibold text-gray-900">{FormatUserName(user)}</h2>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{previewScreenshots.map((item, index) => {
					const base64: string = EncodeImage(item.image_data);
					const isLastPreview: boolean = index === previewScreenshots.length - 1;

					return (
						<div
							key={item.id ?? item.filename ?? `${user}-${index}`}
							className="relative overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer"
							onClick={() => setSelectedImageIndex(index)}
						>
							{base64 ? (
								<img src={`data:image/png;base64,${base64}`} alt={`Captura de ${user}`} loading="lazy" className="w-[180px] h-[100px] object-cover" />
							) : (
								<div className="flex h-32 items-center justify-center text-xs text-gray-400 sm:h-36">Sin vista previa</div>
							)}
							<span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
								{FormatHour(item.timestamp)}
							</span>
							{isLastPreview && remainingScreenshots > 0 && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">+{remainingScreenshots}</div>
							)}
						</div>
					);
				})}
			</div>

			<ImageOverlay images={sortedScreenshots} selectedIndex={selectedImageIndex ?? -1} onClose={() => setSelectedImageIndex(null)} onIndexChange={setSelectedImageIndex} />
		</article>
	);
};

export default ScreenShotsCard;
