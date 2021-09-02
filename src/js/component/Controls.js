import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider, { Handle, SliderTooltip } from "rc-slider";
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
	const [durationSlider, setDurationSlider] = useState(0);
	const intervalId = useRef(null);
	const [showVolume, setShowVolume] = useState(false);

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
			intervalId.current = setInterval(
				() => setDurationSlider(durationSlider + 1),
				durationFactor()
			);
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
	const durationFactor = () => {
		return (duration / 100) * 1000;
	};
	const handleVolumeChange = data => {
		player.current.volume = data / 100;
	};
	const handleBarChange = data => {
		console.log(data);
		if (status === "playing") {
			setDurationSlider(data);
			player.current.currentTime = (duration * data) / 100;
		}
	};

	useEffect(() => {
		if (durationSlider < 100 && status === "playing") {
			intervalId.current = setInterval(
				() => setDurationSlider(durationSlider + 1),
				durationFactor()
			);
		}
		return () => {
			clearInterval(intervalId.current);
		};
	});
	useEffect(() => {
		clearInterval(intervalId.current);
		setDurationSlider(0);
	}, [current]);
	return (
		<div className="d-flex controls">
			<div className="w-100 song-slider px-2">
				<Slider
					min={0}
					max={100}
					value={durationSlider}
					railStyle={{ backgroundColor: "#1E1E1E", height: 9 }}
					trackStyle={{ backgroundColor: "#1AB26B", height: 9 }}
					handleStyle={{
						backgroundColor: "#00A64E"
					}}
					onChange={handleBarChange}
				/>
			</div>

			{current.song !== null && (
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
				<div style={{ width: "200px" }} className="d-flex">
					<Slider
						min={0}
						max={100}
						reverse
						defaultValue={95}
						style={{ width: 80, marginRight: 17, marginTop: 4 }}
						handle={handle}
						onChange={handleVolumeChange}
					/>
					<i
						style={{ fontSize: "1.2em" }}
						className="fas fa-volume-off"></i>
				</div>
			</div>
		</div>
	);
};

const handle = props => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<SliderTooltip
			prefixCls="rc-slider-tooltip"
			overlay={`${value} %`}
			visible={dragging}
			placement="top"
			key={index}>
			<Handle value={value} {...restProps} />
		</SliderTooltip>
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
