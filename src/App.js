import { useState } from "react";
import TemplatesArea from "./TemplatesArea";
import BlogArea from "./BlogArea";
import FrontPage from "./FrontPage";
import MainPage from "./MainPage";

function App() {
	const [selectedTemplates, setSelectedTemplates] = useState([]);
	const [selectedForEdit, setSelectedForEdit] = useState(-1);
	const [isLoggedIn, setLoggedIn] = useState(false);
	function handleSelectTemplate(template) {
		setSelectedTemplates([...selectedTemplates, template]);
	}

	function handleDeleteTemplate(id) {
		setSelectedTemplates(selectedTemplates.filter((temp) => temp.id !== id));
	}

	return !isLoggedIn ? (
		<FrontPage setLoggedIn={setLoggedIn} />
	) : selectedForEdit !== -1 ? (
		<div className="makeBlog">
			<div className="main-section">
				<>
					<TemplatesArea
						onSelectTemplate={handleSelectTemplate}
						onSelectDelete={handleDeleteTemplate}
					/>
					<BlogArea selectedTemplates={selectedTemplates} />
				</>
			</div>
		</div>
	) : (
		<MainPage
			blogs={[
				{
					heading: "Template",
					date: new Date().toLocaleDateString(),
					id: 1,
					content: `A template is a pre-designed format or structure used as a starting point for creating documents, websites, or other materials. It provides a consistent and convenient framework for various projects, saving time and effort.`,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 2,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 3,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 4,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 5,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 6,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 7,
				},
				{
					heading: "My first one",
					date: new Date().toLocaleDateString(),
					id: 8,
				},
			]}
			setSelectedForEdit={setSelectedForEdit}
		/>
	);
}

export default App;
