import React from "react";
import LetsTalk from "../Landing/LetsTalk";

const Contact = () => {
	return (
		<div className="py-[2rem] px-[1.5rem] max-[500px]:px-[10px] flex max-[890px]:flex-col gap-[2rem] items-center">
			<div className="flex-1/2 max-[890px]:hidden">
				<img src="./images/contact.png" alt="" />
			</div>
			<div className="flex-1/2 max-[890px]:w-full">
				<LetsTalk />
			</div>
		</div>
	);
};

export default Contact;
