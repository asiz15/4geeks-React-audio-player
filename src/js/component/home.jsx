import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { AudioPlayer } from "./AudioPlayer";
import { AudioPlaverV2 } from "./AudioPlaverV2";

//create your first component
const Home = () => {
	return (
		<div className="container-fluid p-0 m-0">
			<AudioPlaverV2></AudioPlaverV2>
		</div>
	);
};

export default Home;
