import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";

export const AudioPlayer = () => {
	const baseUrl = "https://assets.breatheco.de/apis/sound";
	const audioPlayer = useRef();
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const handleClick = () => {
		console.log(audioPlayer);
		audioPlayer.current.play();
	};
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

	const playThis = url => {
		const newSrc = `${baseUrl}/${url}`;
		console.log(newSrc);
		audioPlayer.current.src = newSrc;
		audioPlayer.current.play();
	};

	useEffect(() => {
		loadSongs();
	}, []);
	return (
		<div className="p-0">
			<h2 className="mt-2">Stopify</h2>
			{loading ? (
				<Loading></Loading>
			) : (
				<ul className="list-group songs mt-4 text-left">
					{songs.map((song, index) => {
						return (
							<li
								className="list-group-item song"
								key={index}
								onClick={() => playThis(song.url)}>
								{index}. {song.name}
							</li>
						);
					})}
				</ul>
			)}
			<div className="custom-controls w-100 d-flex justify-content-center align-items-center">
				<button className="prev-btn" onClick={handleClick}>
					Prev
				</button>
				<button className="play-btn" onClick={handleClick}>
					Play
				</button>
				<button className="next-btn" onClick={handleClick}>
					Next
				</button>
			</div>
			<audio
				ref={audioPlayer}
				preload="auto"
				src="https://assets.breatheco.de/apis/sound/files/mario/songs/castle.mp3"></audio>
		</div>
	);
};
