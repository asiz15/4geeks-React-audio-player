import React from "react";

export const Loading = () => {
	return (
		<div className="d-flex justify-content-center align-items-center w-100 h-100 text-white font-weight-bold">
			<h3 className="animate__animated animate__pulse animate__infinite">
				Loading songs...
			</h3>
		</div>
	);
};
