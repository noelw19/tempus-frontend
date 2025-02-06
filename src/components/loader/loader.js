import { helix, grid } from "ldrs";
import React from "react";

function Loader() {

      grid.register();
      return (
        <>
          {<div className="w-full h-full relative top-[0%] left-[0%] overflow-hidden flex flex-col gap-2 items-center justify-center bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 z-50 ">
              <l-grid size="200" speed="1" color="#FFFFFF"></l-grid>
              <p className="text-white">Loading</p>
          </div>}
        </>
      );
}


export default Loader