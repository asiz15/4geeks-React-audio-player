import React from "react";
import PropTypes from "prop-types";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export const Controls = ({
	player,
	status,
	setStatus,
	songs,
	setCurrent,
	current,
	mode,
	setMode,
	duration
}) => {
	const baseUrl = "https://assets.breatheco.de/apis/sound";
	const handleCentral = () => {
		if (status === "playing") {
			player.current.pause();
			setStatus("paused");
		} else {
			if (!player.current.src) {
				player.current.src = `${baseUrl}/${songs[0].url}`;
				setCurrent({ song: songs[0], index: 0 });
			}
			player.current.play();
			setStatus("playing");
		}
	};
	const handleNext = () => {
		if (mode === "loop") {
			return;
		}

		if (mode === "shuffle") {
			const ind = getRandomInt();
			player.current.src = `${baseUrl}/${songs[ind].url}`;
			setCurrent({
				song: songs[ind],
				index: ind
			});
			player.current.play();
			setStatus("playing");
		} else {
			player.current.src = `${baseUrl}/${songs[current.index + 1].url}`;
			setCurrent({
				song: songs[current.index + 1],
				index: current.index + 1
			});
			player.current.play();
			setStatus("playing");
		}
	};
	const handlePrev = () => {
		if (mode === "loop") {
			return;
		}

		if (mode === "shuffle") {
			const ind = getRandomInt();
			player.current.src = `${baseUrl}/${songs[ind].url}`;
			setCurrent({
				song: songs[ind],
				index: ind
			});
			player.current.play();
			setStatus("playing");
		} else {
			player.current.src = `${baseUrl}/${songs[current.index - 1].url}`;
			setCurrent({
				song: songs[current.index - 1],
				index: current.index - 1
			});
			player.current.play();
			setStatus("playing");
		}
	};

	const getRandomInt = () => {
		const min = Math.ceil(0);
		const max = Math.floor(songs.length - 1);
		let num = Math.floor(Math.random() * (max - min + 1)) + min;
		if (num === current.index) {
			return getRandomInt();
		}
		return num;
	};
	const handleLoop = () => {
		if (mode === "loop") {
			setMode("normal");
		} else {
			setMode("loop");
		}
	};
	const handleShuffle = () => {
		if (mode === "shuffle") {
			setMode("normal");
		} else {
			setMode("shuffle");
		}
	};

	const parseDuration = () => {
		return new Date(1000 * duration).toISOString().substr(11, 8);
	};
	return (
		<div className="d-flex controls">
			<div className="w-100">
				<Slider min={0} max={100} defaultValue={0} />
			</div>

			{status === "playing" && current.song !== null && (
				<div className="song-meta text-white pl-3">
					<span className="p-0 m-0">{current?.song?.name}</span>
					<small className="text-secondary p-0 m-0">
						{current?.song?.category}
					</small>

					<small className="text-secondary p-0 m-0">
						{parseDuration(duration)}
					</small>
				</div>
			)}
			<button
				className="btn-sec"
				disabled={!player?.current?.src || current.index === 0}
				onClick={handlePrev}>
				<i className="fas fa-backward text-white"></i>
			</button>
			<button
				className={`play-btn ${
					status === "playing" ? "play-btn--playing" : ""
				}`}
				onClick={handleCentral}>
				<i
					className={`fas ${
						status === "paused" ? "fa-play" : "fa-pause"
					}`}></i>
			</button>
			<button
				className="btn-sec"
				onClick={handleNext}
				disabled={
					!player?.current?.src || current.index === songs.length - 1
				}>
				<i className="fas fa-forward text-white"></i>
			</button>
			<div className="player-actions text-white pr-3">
				<button className="btn-trc" onClick={handleLoop}>
					<i
						className={`fas fa-infinity ${
							mode === "loop" ? "text-spotify" : "text-white"
						}`}></i>
				</button>
				<button className="btn-trc" onClick={handleShuffle}>
					<i
						className={`fas fa-random ${
							mode === "shuffle" ? "text-spotify" : "text-white"
						}`}></i>
				</button>
			</div>
		</div>
	);
};

Controls.propTypes = {
	player: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.elementType })
	]),
	status: PropTypes.string,
	setStatus: PropTypes.func,
	songs: PropTypes.array,
	setCurrent: PropTypes.func,
	current: PropTypes.object,
	mode: PropTypes.string,
	setMode: PropTypes.func,
	duration: PropTypes.number
};
