import React from 'react'
import { Spinner } from "flowbite-react";

const Loading = () => {
  return (
        <div className="flex flex-wrap gap-2 justify-center w-full h-svh items-center">
          <div className="text-center">
            <Spinner aria-label="Center-aligned spinner example" size='lg'/>
          </div>
        </div>
  )
}

export default Loading