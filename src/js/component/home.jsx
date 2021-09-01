import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { AudioPlayer } from "./AudioPlayer";

//create your first component
const Home = () => {
	return (
		<div className="text-center mt-2">
			<AudioPlayer></AudioPlayer>
		</div>
	);
};

export default Home;
