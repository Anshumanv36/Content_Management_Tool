// TemplateComponents.js
import React, { useState } from "react";
import CustomDropzone from "./CustomDrop";

export const Template1 = ({ onSelectDelete, id }) => {
	const [template1Image, setTemplate1Image] = useState(null);

	const handleDrop = (imageData) => {
		setTemplate1Image(imageData);
	};

	return (
		<div className="head-template">
			<CustomDropzone width="100%" height="200px" setImageState={handleDrop} />
			<input
				type="text"
				className="text"
				placeholder="Enter text for template 1"
			/>
			<button
				className="template-cut"
				onClick={() => {
					onSelectDelete(id);
				}}
			>
				&#10060;
			</button>
		</div>
	);
};

export const Template2 = ({ onSelectDelete, id }) => {
	const [template2Image, setTemplate2Image] = useState(null);

	const handleDrop = (imageData) => {
		setTemplate2Image(imageData);
	};

	return (
		<div className="head-template">
			<div className="template2">
				<div className="template2-mt">
					<CustomDropzone
						width="100%"
						height="300px"
						setImageState={handleDrop}
					/>
					<input
						type="text"
						className="text"
						placeholder="Enter text for template 2"
					/>
				</div>
				<div className="template2-mt">
					<CustomDropzone
						width="100%"
						height="300px"
						setImageState={handleDrop}
					/>
					<input
						type="text"
						className="text"
						placeholder="Enter text for template 2"
					/>
				</div>
			</div>
			<button
				className="template-cut"
				onClick={() => {
					onSelectDelete(id);
				}}
			>
				&#10060;
			</button>
		</div>
	);
};

export const Template3 = ({ onSelectDelete, id }) => {
	const [template3Images, setTemplate3Images] = useState(Array(8).fill(null));

	const handleDrop = (imageData, index) => {
		const updatedImages = [...template3Images];
		updatedImages[index] = imageData;
		setTemplate3Images(updatedImages);
	};

	return (
		<div className="head-template">
			<div className="template3">
				{template3Images.map((_, index) => (
					<div key={index}>
						<CustomDropzone
							width="100%"
							height="200px"
							setImageState={(imageData) => handleDrop(imageData, index)}
						/>
						<input
							type="text"
							className="text"
							placeholder={`Enter text for template 3 - Image ${index + 1}`}
						/>
					</div>
				))}
			</div>
			<button
				className="template-cut"
				onClick={() => {
					onSelectDelete(id);
				}}
			>
				&#10060;
			</button>
		</div>
	);
};

export const Template4 = ({ onSelectDelete, id }) => {
	const [template4Images, setTemplate4Images] = useState(Array(3).fill(null));

	const handleDrop = (imageData, index) => {
		const updatedImages = [...template4Images];
		updatedImages[index] = imageData;
		setTemplate4Images(updatedImages);
	};

	return (
		<div className="head-template">
			<div className="template4">
				{template4Images.map((_, index) => (
					<div key={index}>
						<CustomDropzone
							width="100%"
							height={index === 0 ? "100px" : "300px"}
							setImageState={(imageData) => handleDrop(imageData, index)}
						/>
						{index !== 0 && (
							<input
								type="text"
								className="text"
								placeholder={`Enter text for template 4 - Image ${index}`}
							/>
						)}
					</div>
				))}
			</div>
			<button
				className="template-cut"
				onClick={() => {
					onSelectDelete(id);
				}}
			>
				&#10060;
			</button>
		</div>
	);
};

export const Template5 = ({ onSelectDelete, id }) => {
	const [template5Images, setTemplate5Images] = useState(Array(3).fill(null));

	const handleDrop = (imageData, index) => {
		const updatedImages = [...template5Images];
		updatedImages[index] = imageData;
		setTemplate5Images(updatedImages);
	};

	return (
		<div className="head-template">
			<div className="template5">
				{template5Images.map((_, index) => (
					<div key={index}>
						<CustomDropzone
							width="100%"
							height={index === 0 ? "100px" : "300px"}
							setImageState={(imageData) => handleDrop(imageData, index)}
						/>
						{index !== 0 && (
							<input
								type="text"
								className="text"
								placeholder={`Enter text for template 5 - Image ${index}`}
							/>
						)}
					</div>
				))}
			</div>
			<button
				className="template-cut"
				onClick={() => {
					onSelectDelete(id);
				}}
			>
				&#10060;
			</button>
		</div>
	);
};
