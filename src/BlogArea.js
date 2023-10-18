import React, { useState } from "react";

export default function BlogArea({ selectedTemplates, onSelectDelete }) {
	const [textareaHeight, setTextareaHeight] = useState("auto");

	const handleTextareaChange = (event) => {
		// Reset the textarea's height to auto
		event.target.style.height = "auto";

		// Calculate the scroll height of the textarea
		const scrollHeight = event.target.scrollHeight;

		// Check if the scroll height exceeds a certain height (e.g., 50px) or a certain number of lines (e.g., 5 lines)
		if (scrollHeight > 50 || event.target.value.split("\n").length > 5) {
			// If it exceeds, set a fixed height and allow scrolling
			if (scrollHeight < 250) {
				event.target.style.height = `${scrollHeight}px`;
			} else {
				event.target.style.height = "250px";
				event.target.style.overflowY = "scroll";
			}
		} else {
			// If it doesn't exceed, let the height adjust according to content and hide scrolling
			event.target.style.overflowY = "hidden";
		}

		// Update the state to trigger a re-render
		setTextareaHeight(event.target.style.height);
	};

	return (
		<section className="sec-chat-area">
			<header className="chat-header">
				<h2>Edit Area</h2>
			</header>
			<div className="chat-room">
				{selectedTemplates.map((temp) =>
					React.cloneElement(temp.component, {
						onSelectDelete: onSelectDelete,
						id: temp.id,
					})
				)}
			</div>
		</section>
	);
}
