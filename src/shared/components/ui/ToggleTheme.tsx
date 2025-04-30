'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ToggleTheme() {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => setMounted(true), [])

	if (!mounted) return(<p>Loading</p>)
	
	return (<>
		<p>The current theme is: {theme}</p>
		<button className='p-2.5 bg-blue-400 m-1' onClick={() => setTheme('light')} >Светлый</button>
		<button className='p-2.5 bg-blue-400 m-1' onClick={() => setTheme('dark')} >Темный</button>
	</>
	)
}
