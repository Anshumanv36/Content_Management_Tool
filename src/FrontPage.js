import React, { useState } from "react";

const FrontPage = ({ setLoggedIn }) => {
	function handleClick() {
		//Code to send request
		setLoggedIn(true);
	}
	return (
		<div className="front-container">
			<TempSection
				textColor="green"
				color="white"
				content="Already a User please Login ?"
				buttonContent="Login"
				secBackgroundColor="#9c9c9c"
				handleClick={handleClick}
			>
				<div className="login--first">
					<form className="login-form">
						<div className="#">
							<label for="Username">Username</label>
							<input
								id="Username"
								type="text"
								placeholder="Username"
								required
							/>
						</div>
						<div className="#">
							<label for="password">Password</label>
							<input
								id="password"
								type="text"
								placeholder="  * * * * * * * *"
								required
							/>
						</div>
						<button
							className="btn-form"
							onClick={(e) => {
								e.preventDefault();
								handleClick();
							}}
						>
							{" "}
							Login
						</button>
					</form>
				</div>
			</TempSection>
			<TempSection
				textColor="green"
				color="white"
				content="Wanna' become One !"
				buttonContent="SignUp"
				secBackgroundColor="#fff"
				handleClick
			>
				<div className="Signup--first">
					<form className="Signup-form">
						<div className="#">
							<label for="First Name">First Name</label>
							<input
								id="Username"
								type="text"
								placeholder="First Name"
								required
							/>
						</div>
						<div className="#">
							<label for="Last Name">Last Name</label>
							<input
								id="Username"
								type="text"
								placeholder="Last Name"
								required
							/>
						</div>
						<div className="#">
							<label for="Mobile No.">Mobile No.</label>
							<input
								id="Username"
								type="text"
								placeholder="Mobile No."
								required
							/>
						</div>
						<div className="#">
							<label for="Email ID">Email ID</label>
							<input
								id="Username"
								type="text"
								placeholder="me@gmail.com"
								required
							/>
						</div>
						<div className="#">
							<label for="password">Password</label>
							<input
								id="password"
								type="text"
								placeholder="  * * * * * * * *"
								required
							/>
						</div>
						<div className="#">
							<label for="Reenter">Re-Enter</label>
							<input
								id="Username"
								type="text"
								placeholder="Re-password"
								required
							/>
						</div>
						<button className="btn-form"> Create</button>
					</form>
				</div>
				{/* Html written here will reflect in the form */}
			</TempSection>
		</div>
	);
};

function TempSection({
	textColor,
	color,
	content,
	buttonContent,
	secBackgroundColor,
	handleClick,
	children,
}) {
	const [isClicked, setIsClicked] = useState(false);
	function handleOnClick() {
		setIsClicked(true);
	}
	return (
		<section className={`temp-section ${isClicked ? "scroll" : ""}`}>
			<Section
				textColor={textColor}
				color={color}
				content={content}
				buttonContent={buttonContent}
				secBackgroundColor={secBackgroundColor}
				handleClick={handleOnClick}
			/>
			<AuthSection>{children}</AuthSection>
		</section>
	);
}

function AuthSection({ children }) {
	return <section className="auth-section">{children}</section>;
}

function Section({
	textColor,
	color,
	content,
	buttonContent,
	secBackgroundColor,
	handleClick,
}) {
	return (
		<section
			className="log-sin-sec"
			style={{ backgroundColor: secBackgroundColor }}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<button
					className="front-btn"
					onClick={handleClick}
					style={{ backgroundColor: color, color: textColor }}
				>
					{buttonContent}
				</button>
				<p>{content}</p>
			</div>
		</section>
	);
}

export default FrontPage;
