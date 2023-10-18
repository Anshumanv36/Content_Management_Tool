import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const CustomDropzone = ({ width, height, setImageState }) => {
	const [selectedImage, setSelectedImage] = useState(null);

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			const reader = new FileReader();

			reader.onload = () => {
				setSelectedImage(reader.result);
				// Update the state with the selected image
				setImageState(reader.result);
			};

			reader.readAsDataURL(file);
		},
		[setImageState]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: "image/*",
		onDrop,
	});

	return (
		<div
			{...getRootProps()}
			style={{
				width,
				height,
				border: "2px dashed #ccc",
				borderRadius: "4px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
				overflow: "hidden",
			}}
		>
			<input {...getInputProps()} />
			{selectedImage ? (
				<img
					src={selectedImage}
					alt="Selected"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						maxWidth: "100%",
						maxHeight: "100%",
					}}
				/>
			) : (
				<p style={{ textAlign: "center" }}>
					{isDragActive
						? "Drop the image here..."
						: "Drag and drop an image here, or click to select one"}
				</p>
			)}
		</div>
	);
};

export default CustomDropzone;
