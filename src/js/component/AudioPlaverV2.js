import React, { useState, useEffect, useRef } from "react";
import Logo from "../../img/spotify_logo.png";
import axios from "axios";
import { Controls } from "./Controls";
import { Loading } from "./Loading";

export const AudioPlaverV2 = () => {
	const baseUrl = "https://assets.breatheco.de/apis/sound";
	const audioPlayer = useRef();
	const [songs, setSongs] = useState([]);
	const [mode, setMode] = useState("normal");
	const [loading, setLoading] = useState(false);
	const [current, setCurrent] = useState({
		song: null,
		index: null
	});
	const [status, setStatus] = useState("paused");
	const [duration, setDuration] = useState(0);

	const loadSongs = () => {
		setLoading(true);
		axios
			.get("https://assets.breatheco.de/apis/sound/songs")
			.then(res => {
				console.log(res);
				setTimeout(() => {
					setSongs(res.data);
					setLoading(false);
				}, 2000);
			})
			.catch(err => {
				console.log(err);
				setLoading(false);
			});
	};

	const playThis = (song, index) => {
		const newSrc = `${baseUrl}/${song.url}`;
		setStatus("playing");
		audioPlayer.current.src = newSrc;
		audioPlayer.current.play();
		setCurrent({ song, index });
	};

	const handleSongLoad = () => {
		console.log(audioPlayer.current.duration);
		setDuration(audioPlayer.current.duration);
	};
	const handleChangeDuration = () => {
		console.log("duration change!!");
	};
	useEffect(() => {
		loadSongs();
	}, []);

	return (
		<div
			className="w-100 audio-player m-0"
			style={{ background: "#1e1e1e" }}>
			<div className="audio-player--header w-100 d-flex justify-content-center align-items-center">
				<img src={Logo} width="150px"></img>
			</div>
			<div className="list-group audio-player--list w-100">
				<audio
					onLoadedData={handleSongLoad}
					ref={audioPlayer}
					preload="metadata"
					loop={mode === "loop"}
					durationchange={handleChangeDuration}></audio>
				{loading && <Loading></Loading>}
				{songs.map((song, index) => {
					return (
						<button
							key={index}
							className="list-group-item list-group-item-action song py-4 d-flex align-items-center"
							onClick={() => playThis(song, index)}>
							<small className="text-secondary mr-3">
								{index + 1}
							</small>
							<div className="col">
								<h6 className="p-0 m-0 font-weight-bold">
									{song.name}
								</h6>
								<div
									style={{ fontSize: ".8em" }}
									className="song-info">
									<span className="text-secondary mr-1">
										Category:
									</span>
									<span
										className="category"
										style={{ color: "" }}>
										{song.category}
									</span>
								</div>
							</div>
							<div>
								{audioPlayer &&
									current?.song?.id === song.id &&
									current?.index === index &&
									status === "playing" && (
										<span style={{ fontSize: ".7em" }}>
											Now Playing
										</span>
									)}
							</div>
						</button>
					);
				})}
			</div>
			<div className="audio-player--footer w-100 d-flex justify-content-center align-items-center">
				<Controls
					player={audioPlayer}
					status={status}
					setStatus={setStatus}
					songs={songs}
					setCurrent={setCurrent}
					current={current}
					mode={mode}
					setMode={setMode}
					duration={duration}></Controls>
			</div>
		</div>
	);
};
