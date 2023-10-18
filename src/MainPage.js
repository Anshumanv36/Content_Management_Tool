import { useState } from "react";
const MainPage = ({ blogs, setSelectedForEdit }) => {
  function handleSelect(id) {
    setSelectedForEdit(id);
  }
  return (
    <>
      <Header />
      <div className="main-page-body">
        {blogs.map((blog) => (
          <BlogCard blog={blog} handleSelect={handleSelect} />
        ))}
      </div>
    </>
  );
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function Header() {
  return (
    <div className="header">
      <h1>Templates</h1>
      <div className="search-users">
        <input type="text" placeholder="Search User"></input>
        <button> &#128269;</button>
      </div>
    </div>
  );
}

function BlogCard({ blog, handleSelect }) {
  const handleRandomize = () => {
    setGradient(generateRandomGradient());
  };
  const generateRandomGradient = () => {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `linear-gradient(to right, ${color1}, ${color2})`;
  };
  const [gradient, setGradient] = useState(() => generateRandomGradient());
  const boxShadowGradient = `0 0 6px ${getRandomColor()}, 0 0 10px ${getRandomColor()}`;
  return (
    <div
      className="blog-card"
      style={{
        boxShadow: boxShadowGradient,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        borderRadius: "9px",
      }}
      onClick={() => {
        handleSelect(blog.id);
      }}
    >
      <h1>{blog.heading}</h1>
      <p>Date: {blog.date}</p>
      <p>{blog.content}</p>
    </div>
  );
}

export default MainPage;
