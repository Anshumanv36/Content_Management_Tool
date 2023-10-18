import React, { useState } from "react";
import {
	Template1,
	Template2,
	Template3,
	Template4,
	Template5,
} from "./TemplateComp";

const templates = [
	{ id: 1, component: <Template1 />, img: "img/1.jpg" },
	{ id: 2, component: <Template2 />, img: "img/7.jpg" },
	{ id: 3, component: <Template3 />, img: "img/8.webp" },
	{ id: 4, component: <Template4 />, img: "img/9.webp" },
	{ id: 5, component: <Template5 />, img: "img/10.png" },
];

export default function TemplatesArea({ onSelectTemplate, onSelectDelete }) {
	const [selectedTemplate, setSelectedTemplate] = useState(null);

	const handleTemplateClick = (template) => {
		setSelectedTemplate(template.id);
		onSelectTemplate(template);
	};

	return (
		<section className="sec-namespace">
			<header className="namespace-header">
				<h2>Templates</h2>
			</header>
			<ul className="namespace-list">
				{templates.map((template, index) => (
					<li
						key={index}
						style={{
							padding: "10px",
							margin: "5px",
							cursor: "pointer",
						}}
						onClick={() => handleTemplateClick(template)}
					>
						{template.img ? (
							<img
								src={template.img}
								alt={template.name}
								style={{
									maxWidth: "100%",
									maxHeight: "100%",
									display: "block",
									margin: "auto",
								}}
							/>
						) : (
							template.name
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
