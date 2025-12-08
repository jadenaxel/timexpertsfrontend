import type { FC, JSX } from "react";
import type { ImageOverlayProps } from "@/types";

import { useState, useEffect } from "react";

import { EncodeImage } from "@/../config";
import { LeftArrowIcon, RightArrowIcon, RowResetIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "./icons";

const ImageOverlay: FC<ImageOverlayProps> = ({ images, selectedIndex, onClose, onIndexChange }): JSX.Element | null => {
	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	useEffect(() => {
		setZoomLevel(1);
		setPan({ x: 0, y: 0 });
	}, [selectedIndex]);

	if (selectedIndex === null || selectedIndex < 0 || !images || !images[selectedIndex]) return null;

	const currentImage = images[selectedIndex];
	const base64: string = EncodeImage(currentImage.image_data);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
			onClick={onClose}
			onWheel={e => {
				e.preventDefault();
				const delta = e.deltaY > 0 ? -0.1 : 0.1;
				setZoomLevel(prev => {
					const newZoom = Math.min(Math.max(0.5, prev + delta), 3);
					if (newZoom === 1) setPan({ x: 0, y: 0 });
					return newZoom;
				});
			}}
		>
			<div className="absolute left-4 top-4 text-lg font-medium text-white">
				{selectedIndex + 1} / {images.length}
			</div>
			<button onClick={onClose} className="absolute right-4 top-4 text-white hover:text-gray-300 cursor-pointer">
				<XIcon />
			</button>

			<div className="absolute right-4 bottom-4 flex flex-col gap-2">
				<button
					onClick={e => {
						e.stopPropagation();
						setZoomLevel(prev => {
							const newZoom = Math.min(prev + 0.25, 3);
							if (prev === 1 && newZoom > 1) setPan({ x: 0, y: 0 });
							return newZoom;
						});
					}}
					className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
					title="Zoom In"
				>
					<ZoomInIcon />
				</button>
				<div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium text-center">{Math.round(zoomLevel * 100)}%</div>
				<button
					onClick={e => {
						e.stopPropagation();
						setZoomLevel(prev => {
							const newZoom = Math.max(prev - 0.25, 0.5);
							if (newZoom === 1) setPan({ x: 0, y: 0 });
							return newZoom;
						});
					}}
					className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
					title="Zoom Out"
				>
					<ZoomOutIcon />
				</button>
				<button
					onClick={e => {
						e.stopPropagation();
						setZoomLevel(1);
						setPan({ x: 0, y: 0 });
					}}
					className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer text-xs"
					title="Reset Zoom"
				>
					<RowResetIcon />
				</button>
			</div>

			{selectedIndex > 0 && (
				<button
					onClick={e => {
						e.stopPropagation();
						onIndexChange(selectedIndex - 1);
					}}
					className="absolute left-4 p-2 text-white hover:text-gray-300 cursor-pointer transition hover:scale-110"
				>
					<LeftArrowIcon />
				</button>
			)}

			<img
				src={`data:image/png;base64,${base64}`}
				alt={`Screenshot ${selectedIndex + 1}`}
				className={`max-h-[90vh] max-w-[80vw] object-contain shadow-2xl transition-transform duration-200 select-none ${
					zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
				}`}
				style={{
					transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
					transformOrigin: "center"
				}}
				onClick={e => e.stopPropagation()}
				onMouseDown={e => {
					if (zoomLevel > 1) {
						e.preventDefault();
						e.stopPropagation();
						setIsDragging(true);
						setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
					}
				}}
				onMouseMove={e => {
					if (isDragging && zoomLevel > 1) {
						e.preventDefault();
						setPan({
							x: e.clientX - dragStart.x,
							y: e.clientY - dragStart.y
						});
					}
				}}
				onMouseUp={() => setIsDragging(false)}
				onMouseLeave={() => setIsDragging(false)}
			/>

			{selectedIndex < images.length - 1 && (
				<button
					onClick={e => {
						e.stopPropagation();
						onIndexChange(selectedIndex + 1);
					}}
					className="absolute right-4 p-2 text-white hover:text-gray-300 cursor-pointer transition hover:scale-110"
				>
					<RightArrowIcon />
				</button>
			)}
		</div>
	);
};

export default ImageOverlay;
